/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Label,
  TextInput,
  Textarea,
  ToggleSwitch,
} from "flowbite-react";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import ModalImage from "react-modal-image";
import { UploadArea } from "../../../../components/UploadFilesArea/UploadFilesArea";
import { ErrorMessage } from "@hookform/error-message";
import { DeleteModal } from "../../../../components/DeleteModal";
import { deleteRow } from "../../../../server/supabaseQueries";
import { useNavigate } from "react-router-dom";
import { HiTrash } from "react-icons/hi";

interface TabEventDetailsProps {
  item: any;
}

export const TabEventDetails = (props: TabEventDetailsProps) => {
  const navigate = useNavigate();
  const { register, setValue, formState } = useFormContext();
  const [image, setImage] = useState("");
  const [enabled, setEnabled] = useState(false);
  const user = JSON.parse(localStorage.getItem("userLogged")!);
  const userGroupId = localStorage.getItem("groupSelected")!;

  const { errors } = formState;

  useEffect(() => {
    if (props.item) {
      if (props.item.image) {
        setImage(props.item.image);
      }
      setEnabled(props.item.enabled);
    }
  }, [props.item]);

  const onUploadImage = (imagesUrl: any[]) => {
    setImage(imagesUrl[0].url);
    setValue("image", imagesUrl[0].url);
  };

  const changeEnable = (value: any) => {
    setEnabled(value);
    setValue("enabled", value);
  };

  const deleteImage = () => {
    setImage("");
  };

  const deleteTask = async () => {
    await deleteRow(props.item.id, "tickets");
    navigate("/tickets/events");
  };

  return (
    <div className="p-2">
      <div className="flex justify-between gap-4 w-full">
        <div className="w-2/3">
          <Label color={errors.title && "failure"}>Título *</Label>
          <div className="mt-1">
            <TextInput
              placeholder="Inserta un título"
              {...register("title", {
                required: t("FORM_ERROR_MSG_REQUIRED"),
              })}
              color={errors.title && "failure"}
            />
            <ErrorMessage
              errors={errors}
              name="title"
              render={({ messages }) =>
                messages &&
                Object.entries(messages).map(([type, message]) => (
                  <p
                    className="mt-2 text-sm text-red-600 dark:text-red-500"
                    key={type}
                  >
                    {message}
                  </p>
                ))
              }
            />
          </div>
        </div>

        <div className="w-1-3">
          <Label htmlFor="order" color={errors.order && "failure"}>
            {t("CATEGORY_ORDER_REQUIRED")}
          </Label>
          <TextInput
            type="number"
            className="mt-1 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
            placeholder="Inserta un título"
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
              Object.entries(messages).map(([type, message]) => (
                <p
                  className="mt-2 text-sm text-red-600 dark:text-red-500"
                  key={type}
                >
                  {message}
                </p>
              ))
            }
          />
        </div>
      </div>

      <div className="mt-4">
        <Label>Descripción</Label>
        <div className="mt-1">
          <Textarea
            rows={6}
            placeholder="Inserta una descripción"
            {...register("description", {
              required: t("FORM_ERROR_MSG_REQUIRED"),
            })}
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex flex-row justify-between items-center">
          <Label>Imagen</Label>
          {image !== "" && (
            <Button size="xs" className="" color="light" onClick={deleteImage}>
              <div className="flex items-center gap-x-2 text-red-500">
                <HiTrash className="text-xs text-red-500" />
                Borrar imagen
              </div>
            </Button>
          )}
        </div>
        <div className="mt-4">
          <div>
            {image !== "" ? (
              <div className="flex gap-4 justify-center">
                <div className="flex justify-center p-2">
                  <ModalImage
                    small={image}
                    large={image}
                    className="h-32 rounded-lg"
                  />
                </div>
              </div>
            ) : (
              <>
                <p className="text-center py-4">
                  No hay ninguna imágen añadida
                </p>
                <div>
                  <UploadArea
                    onUpload={onUploadImage}
                    height="200px"
                    maxFiles={1}
                    fileTypes={["image/*"]}
                    location={"tickets/events"}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        {props.item ? (
          <div>
            <DeleteModal
              data={props.item}
              deleteFn={deleteTask}
              onlyIcon={false}
              toastSuccessMsg={"Incidencia eliminada correctamente"}
              toastErrorMsg={"Error al eliminar la incidencia"}
              title="Eliminar incidencia"
              disableButton={
                (!user.users_roles.rules.tickets.events.delete_all &&
                  !user.users_roles.rules.tickets.events.delete_group &&
                  !user.users_roles.rules.tickets.events.delete_own) ||
                (!user.users_roles.rules.tickets.events.delete_all &&
                  user.users_roles.rules.tickets.events.delete_group &&
                  userGroupId !== props.item.group_id) ||
                (!user.users_roles.rules.tickets.events.delete_all &&
                  !user.users_roles.rules.tickets.events.delete_group &&
                  user.users_roles.rules.tickets.events.delete_own &&
                  user.id !== props.item.created_by)
              }
            />
          </div>
        ) : null}
        <ToggleSwitch
          className="mt-1"
          checked={enabled}
          onChange={(e) => changeEnable(e)}
          label="Habilitado"
        />
      </div>
    </div>
  );
};
