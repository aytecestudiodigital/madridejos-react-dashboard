/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Label,
  Select,
  TextInput,
  Textarea,
  ToggleSwitch,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiTrash } from "react-icons/hi";
import ModalImage from "react-modal-image";
import { UploadArea } from "../../../../components/UploadFilesArea/UploadFilesArea";
import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import * as EmailValidator from "email-validator";
import { DeleteModal } from "../../../../components/DeleteModal";
import { deleteRow } from "../../../../server/supabaseQueries";
import { useNavigate } from "react-router-dom";

interface InscriptionDetailsProps {
  inscription: any;
  onValidForm: (valid: boolean) => void;
}
export const IncriptionDetailsCard = ({
  inscription,
  onValidForm,
}: InscriptionDetailsProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, formState, setValue } = useFormContext();
  const { errors } = formState;
  const [loading, setLoading] = useState(false);
  const [dateInit, setDateInit] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [enable, setEnable] = useState(false);
  const [userRegistered, setUserRegistered] = useState(false);
  const user = JSON.parse(localStorage.getItem("userLogged")!);
  const userGroupId = localStorage.getItem("groupSelected");
  const [emailChanged, setEmailChanged] = useState(
    inscription ? inscription.report_email : "",
  );

  const [images, setImages] = useState<any>("");

  useEffect(() => {
    setLoading(true);
    if (inscription) {
      inscription.date_init
        ? setDateInit(
            new Date(inscription.date_init).toISOString().split("T")[0] +
              "T" +
              new Date(inscription.date_init).toLocaleTimeString(),
          )
        : setDateInit("");
      inscription.date_end
        ? setDateEnd(
            new Date(inscription.date_end).toISOString().split("T")[0] +
              "T" +
              new Date(inscription.date_end).toLocaleTimeString(),
          )
        : setDateEnd("");
      inscription.image ? setImages(inscription.image) : setImages("");
      inscription.enable ? setEnable(true) : setEnable(false);
      inscription.report_email
        ? setEmailChanged(inscription.report_email)
        : setEmailChanged("");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [inscription]);

  useEffect(() => {
    setValue("enable", enable);
  }, [enable]);

  useEffect(() => {
    if (emailChanged !== "" && EmailValidator.validate(emailChanged)) {
      onValidForm(true);
    } else {
      onValidForm(false);
    }
  }, [emailChanged]);

  const onUploadFiles = (filesUrl: any[]) => {
    const newArray: string[] = [];
    filesUrl.forEach((image) => {
      newArray.push(image.url);
    });
    setImages(newArray[0]);
    setValue("image", newArray[0]);
  };

  const clearImages = () => {
    setImages("");
  };

  const changeDateInit = (value: any) => {
    setDateInit(value);
    setValue("date_init", new Date(value));
  };

  const changeDateEnd = (value: any) => {
    setDateEnd(value);
    setValue("date_end", new Date(value));
  };

  const deleteInscription = async (item: any) => {
    const deleteItem = await deleteRow(item.id, "inscriptions");
    navigate("/inscriptions/normal");
    return deleteItem;
  };

  return (
    <div className="max-w overflow-auto p-1">
      <h3 className="text-xl font-bold dark:text-white">
        Detalles de la nueva inscripción
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="pt-4 sm:col-span-2">
          <Label htmlFor="title" color={errors.title && "failure"}>
            Título *
          </Label>
          <div className="mt-1">
            <TextInput
              id="title"
              placeholder={"Título de la inscripción"}
              {...register("title", {
                required: t("FORM_ERROR_MSG_REQUIRED"),
              })}
              color={errors.title && "failure"}
            />
            <ErrorMessage
              errors={errors}
              name="inscription_type"
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
        <div className="grid-cols-1 gap-4 sm:grid-cols-2 flex justify-end items-end">
          <div className="pr-8 pt-4">
            <Label htmlFor="inscription_type" color={errors.type && "failure"}>
              Tipo de inscripción *
            </Label>
            <div className="mt-1">
              <Select
                id="inscription_type"
                {...register("inscription_type", {})}
              >
                <option value="NORMAL">Normal</option>
                <option value="FORMATIVE">Formativa</option>
              </Select>
            </div>
          </div>

          <div className="pb-3 pr-2">
            <ToggleSwitch
              checked={enable}
              label={t("ENABLE")}
              onChange={setEnable}
            />
          </div>
        </div>
      </div>
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

      <div className="pt-4">
        <Label htmlFor="description">{t(`DESCRIPTION`)}</Label>
        <div className="mt-1">
          <Textarea
            id="description"
            rows={6}
            placeholder={"Escribe más detalles sobre esta inscripción"}
            {...register("description", {})}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="pt-4 pr-4">
          <Label
            htmlFor="report_email"
            color={errors.report_email && "failure"}
          >
            Email de reporte *
          </Label>
          <div className="mt-1">
            <TextInput
              id="report_email"
              placeholder={"Email de reporte"}
              {...register("report_email", {
                required: t("FORM_ERROR_MSG_REQUIRED"),
                validate: (value) => {
                  if (value != "" && !EmailValidator.validate(value!))
                    return t("FORM_ERROR_MSG_FORMAT");
                },
              })}
              color={errors.report_email && "failure"}
              onChange={(e: any) => setEmailChanged(e.currentTarget.value)}
            />
          </div>
          <p className="text-xs mt-1  text-gray-500">
            Email donde se recibirán los avisos y reportes de esta inscripción
          </p>
          <ErrorMessage
            errors={errors}
            name="report_email"
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="pt-4 pr-4">
            <Label htmlFor="date_init">Fecha de inicio de la inscripción</Label>
            <div className="mt-1">
              <TextInput
                id="date_init"
                defaultValue={dateInit}
                onChange={
                  (e) =>
                    changeDateInit(
                      e.currentTarget.value,
                    ) /* setDateInit(e.currentTarget.value) */
                }
                type="datetime-local"
              />
            </div>
          </div>

          <div className="pt-4">
            <Label htmlFor="date_end">
              Fecha de finalización de la inscripción
            </Label>
            <div className="mt-1">
              <TextInput
                id="date_end"
                defaultValue={dateEnd}
                onChange={(e) => changeDateEnd(e.currentTarget.value)}
                type="datetime-local"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4 pt-4">
        <div className="flex flex-row justify-between items-center">
          <Label htmlFor="image">Imagen de fondo</Label>
          {images.length > 0 && (
            <Button size="xs" color="light" onClick={clearImages}>
              <div className="flex items-center gap-x-2 text-red-500">
                <HiTrash className="text-xs text-red-500" />
                {t("DELETE")}
              </div>
            </Button>
          )}
        </div>
        <div className="mt-4">
          <div className="">
            {images !== "" ? (
              <ModalImage
                small={images}
                large={images}
                className="h-64 rounded-lg"
              />
            ) : (
              <>
                <p className="text-center pb-4">
                  No hay ninguna imágen añadida
                </p>
                <div>
                  <UploadArea
                    onUpload={onUploadFiles}
                    height="320px"
                    maxFiles={1}
                    fileTypes={["image/*"]}
                    location={"inscriptions/normal"}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {/* ? TODO - ESTO NO ESTÁ EN LA BBDD */}
      <div className="flex justify-between items-center">
        <ToggleSwitch
          className="mt-1"
          checked={userRegistered}
          label={"Discriminar usuarios empadronados"}
          onChange={setUserRegistered}
        />
        <div>
          {inscription ? (
            <DeleteModal
              data={inscription}
              deleteFn={deleteInscription}
              onlyIcon={false}
              toastSuccessMsg={"Inscripción eliminada correctamente"}
              toastErrorMsg={"Error al eliminar la inscripción"}
              title="Eliminar inscripción"
              disableButton={
                (!user.users_roles.rules.inscriptions.inscriptions.delete_all &&
                  !user.users_roles.rules.inscriptions.inscriptions
                    .delete_group &&
                  !user.users_roles.rules.inscriptions.inscriptions
                    .delete_own) ||
                (!user.users_roles.rules.inscriptions.inscriptions.delete_all &&
                  user.users_roles.rules.inscriptions.inscriptions
                    .delete_group &&
                  userGroupId !== inscription.group_id) ||
                (!user.users_roles.rules.inscriptions.inscriptions.delete_all &&
                  !user.users_roles.rules.inscriptions.inscriptions
                    .delete_group &&
                  user.users_roles.rules.inscriptions.inscriptions.delete_own &&
                  user.id !== inscription.created_by)
              }
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};
