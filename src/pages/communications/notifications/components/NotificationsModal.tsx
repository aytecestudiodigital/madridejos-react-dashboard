/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  Label,
  Modal,
  Select,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import { useEffect, useState } from "react";
import {
  getAll,
  getOneRow,
  getRowByColumn,
  insertRow,
} from "../../../../server/supabaseQueries";
import ModalImage from "react-modal-image";
import { UploadArea } from "../../../../components/UploadFilesArea/UploadFilesArea";
import { ItemResponsiblesModal } from "../../../bookings/items/components/ItemResposiblesModal";
import { LuUserCog2, LuUserPlus2 } from "react-icons/lu";
import { t } from "i18next";
import { useForm } from "react-hook-form";
import { truncateContent } from "../../../../utils/utils";
import axios from "axios";

interface NotificationsModalProps {
  openModal: boolean;
  closeModal: () => void;
  item: any;
  onCreateNotification: () => void;
}

export const NotificationsModal = (props: NotificationsModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNavigable, setIsNavigable] = useState(false);
  const [contentCategories, setContentCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [content, setContent] = useState<any[]>([]);
  const [image, setImage] = useState("");
  const [admins, setAdmins] = useState<any[]>([]);
  const [isOpenModalAdmin, setIsOpenModalAdmin] = useState(false);
  const [enable, setEnable] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [notificationUser, setNotificationUser] = useState<any>(null);

  const { register, getValues } = useForm<any>({
    values: undefined,
    mode: "onChange",
    reValidateMode: "onBlur",
    criteriaMode: "all",
  });

  useEffect(() => {
    setIsOpen(props.openModal);
  }, [props.openModal]);

  useEffect(() => {
    if (props.item) {
      const fetchData = async () => {
        const userDb = await getOneRow("id", props.item.created_by, "users");
        if (userDb) {
          setNotificationUser(userDb);
        }
      };
      fetchData();
    }
  }, [props.item]);

  useEffect(() => {
    const fetchData = async () => {
      const categoriesDb = await getAll("content_categories");
      if (categoriesDb.data) {
        setContentCategories(categoriesDb.data);
      }
    };
    fetchData();
  });

  const onUploadImage = (imagesUrl: any[]) => {
    setImage(imagesUrl[0].url);
  };

  const deleteImage = () => {
    setImage("");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (selectedCategory !== "") {
        const categoryDb = await getOneRow(
          "id",
          selectedCategory,
          "content_categories",
        );
        setSelectedCategoryName(categoryDb.title);
        const contentDb = await getRowByColumn(
          "content_category_id",
          selectedCategory,
          "content",
        );
        if (contentDb) {
          setContent(contentDb);
        }
      }
    };
    fetchData();
  }, [selectedCategory]);

  const close = () => {
    setIsOpen(false);
    props.closeModal();
  };

  const openModalAdmin = () => {
    setIsOpenModalAdmin(true);
  };

  const onSave = async () => {
    const formValues = getValues();
    const newNotification = {
      title: formValues.title,
      content: formValues.content,
      image: image !== "" ? image : null,
      notify_all: admins.length === 0 ? true : false,
      users: admins.length > 0 ? admins : null,
      navigable: isNavigable,
      enable: enable,
      module: !isNavigable ? "ALERTS/WARNINGS" : selectedCategoryName,
      content_id: isNavigable ? formValues.content_id : null,
    };
    await insertRow(newNotification, "notifications");

    const dataNoti = {
      toppics: ["16a027fc-4807-4e17-b9e7-d828992352c6"],
      message: {
        title: formValues.title,
        body: formValues.content,
        appRoute: isNavigable ? `/content/${formValues.content_id}` : null,
        contentId: isNavigable ? formValues.content_id : null,
      },
    };

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://europe-west2-aymo-madridejos.cloudfunctions.net/notifications/send",
      headers: {
        "User-Token": localStorage.getItem("accessToken"),
        "Content-Type": "application/json",
      },
      data: JSON.stringify(dataNoti),
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
    props.onCreateNotification();
    close();
  };

  return (
    <Modal dismissible onClose={() => close()} show={isOpen}>
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        {!props.item ? "Nueva notificación" : "Detalles de notificación"}
      </Modal.Header>
      <Modal.Body className="max-h-[70vh]">
        {!props.item ? (
          <div>
            <div>
              <Label>Título</Label>
              <div className="mt-1">
                <TextInput {...register("title")} />
              </div>
            </div>
            <div className="mt-4">
              <Label>Contenido</Label>
              <div className="mt-1">
                <TextInput {...register("content")} />
              </div>
            </div>
            <div className="mt-4">
              <ToggleSwitch
                checked={isNavigable}
                onChange={(e) => setIsNavigable(e)}
                label="Navegable"
              />
            </div>
            {isNavigable ? (
              <div className="flex justify-between gap-4">
                <div className="mt-4 w-1/2">
                  <Label>Categoría</Label>
                  <div className="mt-1">
                    <Select
                      value={selectedCategory}
                      onChange={(e) =>
                        setSelectedCategory(e.currentTarget.value)
                      }
                    >
                      <option hidden value="">
                        Seleccionar
                      </option>
                      {contentCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.title}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="mt-4 w-1/2">
                  <Label>Artículo</Label>
                  <div className="mt-1">
                    <Select
                      disabled={!selectedCategory}
                      {...register("content_id")}
                    >
                      <option hidden value="">
                        Seleccionar
                      </option>
                      {content.map((content) => (
                        <option key={content.id} value={content.id}>
                          {truncateContent(content.title, 50)}
                        </option>
                      ))}
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Selecciona primero la categoría
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="mt-4">
              <Label>Imagen</Label>
              {image !== "" ? (
                <div className="flex gap-4 justify-center">
                  <div className="flex justify-center p-2">
                    <ModalImage
                      small={image}
                      large={image}
                      className="h-32 rounded-lg"
                    />
                  </div>
                  <div className="flex items-center">
                    <Button onClick={deleteImage} color="failure" size={"xs"}>
                      Eliminar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-1">
                  <UploadArea
                    onUpload={onUploadImage}
                    height="200px"
                    maxFiles={1}
                    fileTypes={["image/*"]}
                    location={"tickets/events"}
                  />
                </div>
              )}
            </div>
            <div className="mt-4">
              <Card>
                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="responsibles">Usuarios</Label>
                  <Button
                    size="sm"
                    color="light"
                    onClick={() => openModalAdmin()}
                  >
                    {admins.length === 0 ? (
                      <div className="flex items-center text-blue-900">
                        <LuUserPlus2 className="mr-1 text-lg text-blue-900" />
                        {t("ADD_BTN")}
                      </div>
                    ) : (
                      <div className="flex items-center text-blue-900">
                        <LuUserCog2 className=" mr-1 text-lg text-blue-900" />
                        {t("EDIT_BTN")}
                      </div>
                    )}
                  </Button>
                </div>

                <ItemResponsiblesModal
                  showModal={isOpenModalAdmin}
                  closeModal={() => setIsOpenModalAdmin(false)}
                  setTechnicians={setAdmins}
                  selectedTechnicians={admins}
                  type={"users"}
                />

                <div className="flex flex-col">
                  {admins.length > 0 ? (
                    <div>
                      <ul>
                        {admins.map((admin) => (
                          <li className="text-sm" key={admin.id}>
                            <div className="flex justify-between">
                              <div className="flex-grow w-1">
                                <p className="font-semibold">{`${admin.name} ${admin.surname}`}</p>
                              </div>
                              <div className="flex-grow w-1/2">
                                <p>{admin.email}</p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      Notificar a todos los usuarios
                    </p>
                  )}
                </div>
              </Card>
            </div>
            <div className="mt-8">
              <ToggleSwitch
                checked={enable}
                onChange={(e) => setEnable(e)}
                label="Habilitada"
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between mb-4">
              <div style={{ display: "flex", alignItems: "center" }}>
                <Label
                  htmlFor="order_created_at"
                  style={{ marginRight: "10px" }}
                >
                  Fecha de creación:
                </Label>
                <p className="flex flex-grow">
                  {new Date(props.item.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                {props.item.navigable ? (
                  <div className="bg-green-100 text-green-800 font-semibold rounded-full py-1 px-2">
                    Navegable
                  </div>
                ) : (
                  <div className="bg-red-100 text-red-800 font-semibold rounded-full py-1 px-2">
                    No navegable
                  </div>
                )}
              </div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700"></div>
            <div className="mt-4">
              <strong className="text-blue-800 font-semibold">
                DATOS DE LA NOTIFICACIÓN:
              </strong>
              <div
                className="px-4 pt-4"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Label style={{ marginRight: "10px" }}>Módulo:</Label>
                <p>{t(props.item.module)}</p>
              </div>

              <div
                className="px-4 pt-1"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Label style={{ marginRight: "10px" }}>Título:</Label>
                <p>{props.item.title}</p>
              </div>

              <div
                className="px-4 pt-1 mb-4"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Label style={{ marginRight: "10px" }}>Contenido:</Label>
                <p>{props.item.content}</p>
              </div>
            </div>
            {props.item.image ? (
              <div className="mt-4">
                <div className="flex justify-center mb-4">
                  <ModalImage
                    small={props.item.image}
                    large={props.item.image}
                    className="h-32 rounded-lg"
                  />
                </div>
              </div>
            ) : null}
            {notificationUser ? (
              <>
                <div className="border border-gray-200 dark:border-gray-700"></div>
                <div className="pt-4">
                  <strong className="text-blue-800 font-semibold">
                    DATOS DEL USUARIO:
                  </strong>

                  <div
                    className="px-4 pt-4"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Label style={{ marginRight: "10px" }}>Email:</Label>
                    <p>{notificationUser.email}</p>
                  </div>

                  <div
                    className="px-4 mt-1"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Label style={{ marginRight: "10px" }}>Documento:</Label>
                    <p>{notificationUser.document}</p>
                  </div>

                  <div
                    className="px-4 pb-4 mt-1"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Label style={{ marginRight: "10px" }}>Teléfono:</Label>
                    <p>{notificationUser.phone}</p>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}
      </Modal.Body>
      {!props.item ? (
        <Modal.Footer className="flex justify-end">
          <Button size={"sm"} onClick={onSave} color="primary">
            Guardar
          </Button>
        </Modal.Footer>
      ) : (
        <Modal.Footer></Modal.Footer>
      )}
    </Modal>
  );
};
