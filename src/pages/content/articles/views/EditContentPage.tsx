/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
/* eslint-disable no-cond-assign */
import { Breadcrumb, Button, Card } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HiHome, HiOutlineArrowLeft } from "react-icons/hi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BreadcrumbItem } from "../../../../components/ListPage/HeaderListPage";
import { AlertContext } from "../../../../context/AlertContext";
import { supabase } from "../../../../server/supabase";
import {
  getAll,
  getOneRow,
  insertRow,
  updateRow,
} from "../../../../server/supabaseQueries";
import { DeleteContentModal } from "../components/DeleteContentModal";
import { Content } from "../models/Content";
import EditContentPageTabs from "./EditContentPageTabs";

//TODO - cuando metamos entidades, los campos no iran fijos en el form, dependerá de los campos de la entidad

export default function EditContentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState<any>(null);

  const { t } = useTranslation();
  const [title, setTitle] = useState<string>("EDIT_CONTENT");
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([
    {
      title: "CONTENT_TYPE",
      path: "/content",
    },
    {
      title: "EDIT_CONTENT",
    },
  ]);
  const [latLng, setLatLng] = useState<any>({ lat: 39.471655 , lng: -3.533282  });
  const [contactValues, setContactValues] = useState({});
  const [newContactValues, setNewContactValues] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [dateInit, setDateInit] = useState<any>(null);
  const [dateEnd, setDateEnd] = useState<any>(null);
  const [dateEventInit, setDateEventInit] = useState<any>(null);
  const [dateEventEnd, setDateEventEnd] = useState<any>(null);

  const [images, setImages] = useState<any[]>(item?.images ?? []);
  const [deletedImages, setDeletedImages] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>(item?.documents ?? []);
  const { openAlert } = useContext(AlertContext);

  const [html, setHtml] = useState("");

  const methods = useForm<Content>({
    values: item ?? null,
    mode: "all",
    reValidateMode: "onSubmit",
    criteriaMode: "all",
  });

  const tableNameContent = import.meta.env.VITE_TABLE_CONTENT;

  const user = JSON.parse(localStorage.getItem("userLogged")!);
  const userGroupId = localStorage.getItem("groupSelected")!;

  useEffect(() => {
    if (user) {
      if (!user.users_roles.rules.content.contents.access_module) {
        openAlert("No tienes acceso a esta página", "error");
        navigate("/");
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      const totalArticlesDb = await getAll("content");
      if (!id) {
        methods.setValue("order", totalArticlesDb.totalItems + 1);
      }
    };
    fetchData();
  }, [id]);

  const onSubmit = async () => {
    let state: any = {};
    const data = methods.getValues();
    const content: any = {
      title: data.title,
      state: data.state,
      order: data.order,
      content: data.content,
      publish_date_init: data.publish_date_init
        ? new Date(data.publish_date_init)
        : null,
      publish_date_end: data.publish_date_end
        ? new Date(data.publish_date_end)
        : null,
      images: data.images && data.images.length > 0 ? data.images : null,
      event_date_init: data.event_date_init
        ? new Date(data.event_date_init)
        : null,
      event_date_end: data.event_date_end
        ? new Date(data.event_date_end)
        : null,
      external_url: data.external_url,
      videos: data.videos ? [{ video: data.videos }] : null,
      documents: data.documents ? [data.documents] : null,
      place_location:
        !data.position == null
          ? null
          : {
              address: data.address,
              latitude: data.position!.lat,
              longitude: data.position!.lng,
            },
      contact_info:
        newContactValues !== null ? { contact: newContactValues } : null,
      content_category_id: data.content_category_id,
      group_id: userGroupId,
    };
    if (data.id) {
      content.id = data.id;
      state = {
        update: t("UPDATE_CONTENT_OK"),
      };
    } else {
      state = {
        insert: t("CREATE_CONTENT_OK"),
      };
    }
    data.id
      ? updateRow(content, tableNameContent)
      : insertRow(content, tableNameContent);
    for await (const deleteImage of deletedImages) {
      await supabase.storage
        .from("organizations")
        .remove([
          `043ec7c2-572a-4199-9aa1-af6af822e76a/content/articles/${deleteImage.title}`,
        ]);
    }
    data.id
      ? openAlert(t("UPDATE_CONTENT_OK"), "update")
      : openAlert(t("CONTENT_SAVED_OK"), "insert");
    navigate("/content/", {
      state: state,
    });
  };

  const { isValid } = methods.formState;

  useEffect(() => {
    if (id) {
      getOneRow("id", id, import.meta.env.VITE_TABLE_CONTENT).then(
        (contentResult: any) => {
          setItem(contentResult);
          setHtml(contentResult.content);
          if (contentResult.place_location) {
            setLatLng({
              lat: contentResult.place_location.latitude,
              lng: contentResult.place_location.longitude,
            });
          }
          if (contentResult.contact_info) {
            setContactValues(contentResult.contact_info);
          }
          if (contentResult.videos) {
            setVideoData(contentResult.videos[0].video);
          }
          if (contentResult.images) {
            setImages(contentResult.images);
          }
          if (contentResult.documents) {
            setFiles(contentResult.documents);
          }
          if (contentResult.publish_date_init) {
            setDateInit(new Date(contentResult.publish_date_init));
          }
          if (contentResult.publish_date_end) {
            setDateEnd(new Date(contentResult.publish_date_end));
          }
          if (contentResult.event_date_init) {
            setDateEventInit(new Date(contentResult.event_date_init));
          }
          if (contentResult.event_date_end) {
            setDateEventEnd(new Date(contentResult.event_date_end));
          }
        },
      );
    } else {
      setTitle("ADD_CONTEN");
      setBreadcrumb([
        {
          title: "CONTENT_TYPE",
          path: "/content",
        },
        {
          title: "ADD_CONTEN",
        },
      ]);
    }
  }, [id]);

  return (
    <>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div>
            <Breadcrumb className="mb-4 mt-2">
              <Breadcrumb.Item href="/">
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <span className="dark:text-white">{t("HOME")}</span>
                </div>
              </Breadcrumb.Item>
              {breadcrumb.map((item, index) => (
                <Breadcrumb.Item key={index} href={item.path}>
                  {t(item.title.toUpperCase())}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
            <div className="items-center flex ">
              <Button
                size="xs"
                color="light"
                className="mr-4"
                as={Link}
                to="/content"
              >
                <HiOutlineArrowLeft className="mr-2" />
                {t("BACK")}
              </Button>

              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                {t(title.toUpperCase())}
              </h1>

              <div className="flex flex-grow justify-end gap-x-4">
                {item ? (
                  <Button
                    color="primary"
                    onClick={() => onSubmit()}
                    disabled={
                      !isValid ||
                      (!user.users_roles.rules.content.contents.update_all &&
                        !user.users_roles.rules.content.contents.update_group &&
                        !user.users_roles.rules.content.contents.update_own) ||
                      (!user.users_roles.rules.content.contents.update_all &&
                        user.users_roles.rules.content.contents.update_group &&
                        userGroupId !== item.group_id) ||
                      (!user.users_roles.rules.content.contents.update_all &&
                        !user.users_roles.rules.content.contents.update_group &&
                        user.users_roles.rules.content.contents.update_own &&
                        user.id !== item.created_by)
                    }
                    type="submit"
                  >
                    {t("SAVE")}
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    onClick={() => onSubmit()}
                    disabled={
                      !isValid ||
                      !user.users_roles.rules.content.contents.create
                    }
                    type="submit"
                  >
                    {t("SAVE")}
                  </Button>
                )}

                {item && (
                  <DeleteContentModal
                    content={item}
                    onContentDelete={() => navigate("/content/")}
                    closeModal={() => null}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Card className=" dark:bg-gray-900">
          <FormProvider {...methods}>
            <EditContentPageTabs
              item={item}
              contactValues={contactValues}
              onChangeContactValues={(newContactValues: any) =>
                setNewContactValues(newContactValues)
              }
              videoData={videoData}
              dateInit={dateInit}
              dateEnd={dateEnd}
              dateEventInit={dateEventInit}
              dateEventEnd={dateEventEnd}
              onChangeDeletedImages={(deletedImages: any) =>
                setDeletedImages(deletedImages)
              }
              onChangeDeletedFiles={() => null}
              latLng={latLng}
              files={files}
              images={images}
            />
          </FormProvider>
        </Card>
      </div>
    </>
  );
}
