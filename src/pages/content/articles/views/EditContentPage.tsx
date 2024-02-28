/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
/* eslint-disable no-cond-assign */
import { ErrorMessage } from "@hookform/error-message";
import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Label,
  Select,
  Tabs,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  HiHome,
  HiOutlineArrowLeft,
  HiOutlineClipboard,
  HiOutlinePaperClip,
} from "react-icons/hi";
import {
  LuCalendar,
  LuImage,
  LuMapPin,
  LuUser2,
  LuVideo,
} from "react-icons/lu";
import { Link, useNavigate, useParams } from "react-router-dom";
import Editor from "react-simple-wysiwyg";
import { BreadcrumbItem } from "../../../../components/ListPage/HeaderListPage";
import { UploadArea } from "../../../../components/UploadFilesArea/UploadFilesArea";
import {
  getAll,
  getOneRow,
  getRowByColumn,
  insertRow,
  updateRow,
} from "../../../../server/supabaseQueries";
import { ContentCategory } from "../../categories/models/ContentCategory";
import ContactTab from "../components/tabs/ContactTabComponent";
import DateTab from "../components/tabs/DateTabComponent";
import MapTab from "../components/tabs/MapTabComponent";
import VideoTab from "../components/tabs/VideosTabComponent";
import { Content } from "../models/Content";
import { DeleteContentModal } from "../components/DeleteContentModal";
import CustomModalImage from "../components/CustomModalImageComponent";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { supabase } from "../../../../server/supabase";
import { AlertContext } from "../../../../context/AlertContext";
import { RootState } from "../../../../store/store";
import { useSelector } from "react-redux";

//TODO - cuando metamos entidades, los campos no iran fijos en el form, dependerá de los campos de la entidad

export default function EditContentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("EDIT_CONTENT");
  const [latLng, setLatLng] = useState<any>({ lat: 39.1577, lng: -3.02081 });
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([
    {
      title: "CONTENT_TYPE",
      path: "/content",
    },
    {
      title: "EDIT_CONTENT",
    },
  ]);

  const [item, setItem] = useState<any>(null);
  const categoriesTable = import.meta.env.VITE_TABLE_CONTENT_CATEGORIES;

  const { t } = useTranslation();
  const [html, setHtml] = useState("");
  const [totalCategories, setTotalCategories] = useState<any[]>([]);
  const [totalCategoriesTags, setTotalCategoriesTags] = useState<any[]>([]);
  const [category, setCategory] = useState<string>("");
  const [categoryTitle, setCategoryTitle] = useState("");

  const [switchNotifiable, setSwitchNotifiable] = useState(false);
  const [contactValues, setContactValues] = useState({});
  const [newContactValues, setNewContactValues] = useState(null);
  const [newMapPosition, setNewMapPosition] = useState<any>(null);
  const [videoData, setVideoData] = useState(null);
  const [newVideoData, setNewVideoData] = useState();
  const [newAddress, setNewAddress] = useState(null);
  const [newDateInit, setNewDateInit] = useState<any>(null);
  const [newDateEnd, setNewDateEnd] = useState<any>(null);
  const [dateInit, setDateInit] = useState<any>(null);
  const [dateEnd, setDateEnd] = useState<any>(null);
  const [newDateEventInit, setNewDateEventInit] = useState<any>(null);
  const [newDateEventEnd, setNewDateEventEnd] = useState<any>(null);
  const [dateEventInit, setDateEventInit] = useState<any>(null);
  const [dateEventEnd, setDateEventEnd] = useState<any>(null);

  const [images, setImages] = useState<any[]>(item?.images ?? []);
  const [deletedImages, setDeletedImages] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>(item?.documents ?? []);
  const [deletedFiles, setDeletedFiles] = useState<any[]>([]);
  const { openAlert } = useContext(AlertContext);

  const { register, formState, getValues } = useForm<Content>({
    values: item ?? undefined,
    mode: "all",
    reValidateMode: "onSubmit",
    criteriaMode: "all",
  });

  const tableNameContent = import.meta.env.VITE_TABLE_CONTENT;
  const tableNameContentCategoryTags = import.meta.env
    .VITE_TABLE_CONTENT_CATEGORIES_TAGS;

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user) {
      if (!user.users_roles.rules.content.contents.access_module) {
        openAlert("No tienes acceso a esta página", "error");
        navigate("/");
      }
    }
  }, [user]);

  const onSubmit = async () => {
    let state: any = {};
    const data = getValues()
    const content: any = {
      title: data.title,
      state: data.state,
      order: data.order,
      content: html,
      publish_date_init: newDateInit !== null ? new Date(newDateInit) : null,
      publish_date_end: newDateEnd != null ? new Date(newDateEnd) : null,
      images: images,
      documents: files,
      event_date_init:
        newDateEventInit !== null ? new Date(newDateEventInit) : null,
      event_date_end:
        newDateEventEnd !== null ? new Date(newDateEventEnd) : null,
      external_url: data.external_url,
      videos: [{ video: newVideoData }],
      place_location:
        newAddress == null
          ? null
          : {
            address: newAddress,
            latitude: newMapPosition!.lat,
            longitude: newMapPosition!.lng,
          },
      contact_info:
        newContactValues !== null ? { contact: newContactValues } : null,
      content_category_id: data.content_category_id,
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

  const { errors, isValid } = formState;
  useEffect(() => {
    if (id) {
      getOneRow("id", id, import.meta.env.VITE_TABLE_CONTENT).then(
        (contentResult) => {
          setItem(contentResult);
          setHtml(contentResult.content);
          getOneRow(
            "id",
            contentResult.content_category_id,
            import.meta.env.VITE_TABLE_CONTENT_CATEGORIES,
          ).then((categoryResult) => {
            setSwitchNotifiable(categoryResult.notifiable);
            setCategory(contentResult.content_category_id);
            setCategoryTitle(categoryResult.title);
          });
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

  useEffect(() => {
    const fetchData = async () => {
      setCategory("");
      getTotalCategories();
    };

    fetchData();
  }, [true]);

  const getTotalCategories = () => {
    getAll(categoriesTable).then((result) => {
      const { data } = result;
      setTotalCategories(data ? data : []);
    });
  };

  function onChange(e: any) {
    setHtml(e.target.value);
  }

  function notifiable(e: any) {
    getOneRow("id", e.target.value, categoriesTable).then(
      (result: ContentCategory) => {
        setSwitchNotifiable(result.notifiable!);
        setCategoryTitle(result.title);
      },
    );
  }

  const onUploadImages = (imagesUrl: any[]) => {
    const newArray = [...images];
    imagesUrl.forEach((image) => {
      const newImage = {
        url: image.url,
        title: image.name,
        state: true,
        order: images.length,
      };
      newArray.push(newImage);
    });
    setImages(newArray);
  };

  const deleteImage = (index: number) => {
    const newImages = [...images];
    setDeletedImages([...deletedImages, images[index]]);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const changeImageName = (index: number, title: string) => {
    images[index].title = title;
  };

  const changeImageState = (index: number, state: boolean) => {
    images[index].state = state;
  };

  const onUploadFiles = (filesUrl: any[]) => {
    const newArray = [...files];
    filesUrl.forEach((file) => {
      const newFile = {
        url: file.url,
        title: file.name,
        state: true,
      };
      newArray.push(newFile);
    });
    setFiles(newArray);
  };

  const deleteFile = (index: number) => {
    const newFiles = [...files];
    setDeletedFiles([...deletedFiles, files[index]]);
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const changeFileName = (index: number, title: string) => {
    files[index].title = title;
  };

  const changeFileState = (index: number, state: boolean) => {
    files[index].state = state;
  };

  const handleSortImages = (param: any) => {
    const { source, destination } = param;
    const _images = [...images];
    const draggedItemContent = _images.splice(source.index, 1)[0];
    _images.splice(destination.index, 0, draggedItemContent);
    setImages(_images);
  };

  const handleSortFiles = (param: any) => {
    const { source, destination } = param;
    const _files = [...files];
    const dragItem = _files.splice(source.index, 1)[0];
    _files.splice(destination.index, 0, dragItem);
    setFiles(_files);
  };

  function getTags(e: any) {
    getRowByColumn(
      "content_category_id",
      e.target.value,
      tableNameContentCategoryTags,
    ).then((result) => {
      setTotalCategoriesTags(result);
    });
  }
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
                <Button color="primary" onClick={onSubmit} disabled={!isValid} type="submit">
                  {t("SAVE")}
                </Button>
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

      <form>
        <div className="p-4 dark:bg-gray-900">
          <div className="xl:col-auto order-last xl:order-first">
            <Card>
              <Tabs.Group>
                <Tabs.Item title={t("CONTENT_TYPE")} icon={HiOutlineClipboard}>
                  <div className="mb-5 px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2 sm:pr-4 sm:border-r sm:border-gray-200">
                        <div>
                          <Label
                            htmlFor="name"
                            color={errors.title && "failure"}
                          >
                            {t("TITLE")} *
                          </Label>
                          <div className="mt-1">
                            <TextInput
                              id="title"
                              placeholder={t("CONTENT_TITLE")}
                              {...register("title", {
                                required: t("FORM_ERROR_MSG_REQUIRED"),
                              })}
                              color={errors.title && "failure"}
                            />
                          </div>
                          <ErrorMessage
                            errors={errors}
                            name="title"
                            render={({ messages }) =>
                              messages &&
                              Object.entries(messages).map(
                                ([type, message]) => (
                                  <p
                                    className="mt-2 text-sm text-red-600 dark:text-red-500"
                                    key={type}
                                  >
                                    {message}
                                  </p>
                                ),
                              )
                            }
                          />
                        </div>

                        <div className="py-8">
                          <Label htmlFor="content">{t("CONTENT_TYPE")}</Label>
                          <div className="mt-1">
                            <Editor
                              containerProps={{ style: { height: "400px" } }}
                              value={html}
                              onChange={onChange}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="external_url">
                            {t("EXTERNAL_URL")}
                          </Label>
                          <div className="mt-1">
                            <TextInput
                              id="external_url"
                              placeholder={t("EXTERNAL_URL_DESCRIPTION")}
                              {...register("external_url")}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="sm:col-span-1">
                        <ToggleSwitch
                          className="mt-8"
                          checked={switchNotifiable}
                          label="Enviar notificación"
                          onChange={setSwitchNotifiable}
                        />
                        <div className="mt-8">
                          <Label
                            htmlFor="category"
                            color={errors.content_category_id && "failure"}
                          >
                            {t("CONTENT_CATEGORY_ID")} *
                          </Label>
                          <div className="mt-1">
                            <div className="max-w-md">
                              <div>
                                <Label htmlFor="content_category_id" />
                              </div>
                              <Select
                                id="content_category_id"
                                {...register("content_category_id", {
                                  required: t("FORM_ERROR_MSG_REQUIRED"),
                                })}
                                defaultValue={category ? category : ""}
                                onChange={(e) => {
                                  notifiable(e);
                                  setCategory(e.target.value);
                                  getTags(e);
                                }}
                              >
                                <option disabled value="">
                                  {t("SELECT")}
                                </option>
                                {totalCategories &&
                                  totalCategories.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.title}
                                    </option>
                                  ))}
                              </Select>
                            </div>
                          </div>
                          <ErrorMessage
                            errors={errors}
                            name="content_category_id"
                            render={({ messages }) =>
                              messages &&
                              Object.entries(messages).map(
                                ([type, message]) => (
                                  <p
                                    className="mt-2 text-sm text-red-600 dark:text-red-500"
                                    key={type}
                                  >
                                    {message}
                                  </p>
                                ),
                              )
                            }
                          />
                        </div>

                        <div className="mt-8">
                          <Label
                            htmlFor="status"
                            color={errors.state && "failure"}
                          >
                            {t("CATEGORY_STATE_REQUIRED")}
                          </Label>
                          <div className="mt-1">
                            <div className="max-w-md">
                              <Select
                                id="state"
                                {...register("state", {
                                  required: t("FORM_ERROR_MSG_REQUIRED"),
                                })}
                              >
                                {/* Opciones mapeadas para el estado de publicación */}
                                <option value="PUBLISH">{t("PUBLISH")}</option>
                                <option value="UNPUBLISH">
                                  {t("UNPUBLISH")}
                                </option>
                              </Select>
                            </div>
                            <ErrorMessage
                              errors={errors}
                              name="status"
                              render={({ messages }) =>
                                messages &&
                                Object.entries(messages).map(
                                  ([type, message]) => (
                                    <p
                                      className="mt-2 text-sm text-red-600 dark:text-red-500"
                                      key={type}
                                    >
                                      {message}
                                    </p>
                                  ),
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="mt-8">
                          <Label
                            htmlFor="order"
                            color={errors.order && "failure"}
                          >
                            {t("CATEGORY_ORDER_REQUIRED")}
                          </Label>
                          <input
                            type="number"
                            aria-describedby="helper-text-explanation"
                            className="max-w-md bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder={item ? item.order : 0}
                            min="0"
                            {...register("order", {
                              required: t("FORM_ERROR_MSG_REQUIRED"),
                            })}
                            required
                          />
                          <ErrorMessage
                            errors={errors}
                            name="order"
                            render={({ messages }) =>
                              messages &&
                              Object.entries(messages).map(
                                ([type, message]) => (
                                  <p
                                    className="mt-2 text-sm text-red-600 dark:text-red-500"
                                    key={type}
                                  >
                                    {message}
                                  </p>
                                ),
                              )
                            }
                          />
                        </div>

                        {totalCategoriesTags.length > 0 ? (
                          <div className="mt-8">
                            <Label htmlFor="tags">Temas</Label>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              {totalCategoriesTags.map((item, index) => (
                                <div key={index} className="flex items-center">
                                  <Checkbox
                                    id={`checkbox-item-${index}`}
                                    className="mt-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                  />
                                  <label
                                    htmlFor={`checkbox-item-${index}`}
                                    className="mt-2 w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                                  >
                                    {item.title}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Tabs.Item>
                <Tabs.Item title={t("DATES")} icon={LuCalendar}>
                  <DateTab
                    defaultDateEnd={dateEnd}
                    defaultDateInit={dateInit}
                    categoryId={category}
                    onDateInitChange={(dates) => setNewDateInit(dates)}
                    onDateEndChange={(dates) => setNewDateEnd(dates)}
                    onDateEventInit={(date) => setNewDateEventInit(date)}
                    onDateEventEnd={(date) => setNewDateEventEnd(date)}
                    defaultDateEventInit={dateEventInit}
                    defaultDateEventEnd={dateEventEnd}
                  />
                </Tabs.Item>
                <Tabs.Item title={t("IMAGES")} icon={LuImage}>
                  <div className="px-4">
                    <div className="mt-4">
                      <div className="grid grid-cols-12 gap-4 divide-x">
                        <div className="col-span-7 overflow-auto">
                          <>
                            <DragDropContext onDragEnd={handleSortImages}>
                              <Droppable droppableId="images">
                                {(provided: any) => (
                                  <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                  >
                                    {images.length > 0 ? (
                                      images.map((image, index) => (
                                        <Draggable
                                          key={index}
                                          draggableId={`image-${index}`}
                                          index={index}
                                        >
                                          {(provided: any) => (
                                            <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                            >
                                              <CustomModalImage
                                                state={image.state}
                                                key={index}
                                                type={"image"}
                                                index={index}
                                                url={image.url}
                                                imageName={image.title}
                                                onImageDelete={(index) =>
                                                  deleteImage(index)
                                                }
                                                onChangeName={(index, title) =>
                                                  changeImageName(index, title)
                                                }
                                                onFileDelete={() => null}
                                                onFileChangeName={() => null}
                                                onStateChange={(index, state) =>
                                                  changeImageState(index, state)
                                                }
                                              />
                                            </div>
                                          )}
                                        </Draggable>
                                      ))
                                    ) : (
                                      <p className="text-center mt-20">
                                        {t("IMAGE_NOT_FOUND")}
                                      </p>
                                    )}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </DragDropContext>
                          </>
                        </div>
                        <div className="col-span-5 pl-4">
                          <UploadArea
                            onUpload={onUploadImages}
                            height="320px"
                            maxFiles={10}
                            fileTypes={["image/*"]}
                            location={"content/articles"}
                          />
                          <div className="p-4">
                            <p className="text-sm">
                              {t("CONTENT_IMAGE_STEP_1")}
                            </p>
                            <p className="text-sm">
                              {t("CONTENT_IMAGE_STEP_2")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tabs.Item>
                <Tabs.Item title={t("VIDEOS")} icon={LuVideo}>
                  <VideoTab
                    video={videoData}
                    onVideo={(videoData) => setNewVideoData(videoData)}
                  />
                </Tabs.Item>
                <Tabs.Item title={t("ATTACHMENTS")} icon={HiOutlinePaperClip}>
                  <div className="px-4">
                    <div className="mt-4">
                      <div className="grid grid-cols-12 gap-4 divide-x">
                        <div className="col-span-7 h-96 overflow-auto">
                          <>
                            <DragDropContext onDragEnd={handleSortFiles}>
                              <Droppable droppableId="images">
                                {(provided: any) => (
                                  <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                  >
                                    {files.length > 0 ? (
                                      files.map((file, index) => (
                                        <Draggable
                                          key={index}
                                          draggableId={`image-${index}`}
                                          index={index}
                                        >
                                          {(provided: any) => (
                                            <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                            >
                                              <CustomModalImage
                                                key={index}
                                                type={"file"}
                                                state={file.state}
                                                index={index}
                                                url={file.url}
                                                imageName={file.title}
                                                onImageDelete={() => null}
                                                onChangeName={() => null}
                                                onFileDelete={(index) =>
                                                  deleteFile(index)
                                                }
                                                onFileChangeName={(
                                                  index,
                                                  fileName,
                                                ) =>
                                                  changeFileName(
                                                    index,
                                                    fileName,
                                                  )
                                                }
                                                onStateChange={(index, state) =>
                                                  changeFileState(index, state)
                                                }
                                              />
                                            </div>
                                          )}
                                        </Draggable>
                                      ))
                                    ) : (
                                      <p className="text-center mt-20">
                                        {t("FILE_NOT_FOUND")}
                                      </p>
                                    )}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </DragDropContext>
                          </>
                        </div>
                        <div className="col-span-5 pl-4">
                          <UploadArea
                            onUpload={onUploadFiles}
                            height="320px"
                            fileTypes={["text/*", "application/*"]}
                            location={"content/articles"}
                          />
                          <div className="p-4">
                            <p className="text-sm">
                              {t("CONTENT_FILE_STEP_1")}
                            </p>
                            <p className="text-sm">
                              {t("CONTENT_FILE_STEP_2")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tabs.Item>
                <Tabs.Item title={t("MAP")} icon={LuMapPin}>
                  <MapTab
                    position={latLng}
                    onPosition={(position) => setNewMapPosition(position)}
                    onAddress={(address) => setNewAddress(address)}
                  />
                </Tabs.Item>
                {categoryTitle === "Turismo" ? (
                  <Tabs.Item title={t("CONTACT")} icon={LuUser2}>
                    <ContactTab
                      values={contactValues}
                      onContact={(values) => setNewContactValues(values)}
                    />
                  </Tabs.Item>
                ) : (
                  <></>
                )}
              </Tabs.Group>
            </Card>
          </div>
        </div>
      </form>
    </>
  );
}
