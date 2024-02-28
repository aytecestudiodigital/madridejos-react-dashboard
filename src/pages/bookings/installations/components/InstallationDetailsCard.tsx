/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Label,
  Select,
  TextInput,
  Textarea,
  ToggleSwitch,
} from "flowbite-react";

import { ErrorMessage } from "@hookform/error-message";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HiCalendar, HiTrash } from "react-icons/hi";
import ModalImage from "react-modal-image";
import { useNavigate } from "react-router-dom";
import { DeleteModal } from "../../../../components/DeleteModal";
import { UploadArea } from "../../../../components/UploadFilesArea/UploadFilesArea";
import { deleteRow } from "../../../../server/supabaseQueries";
import { InstallationModel } from "../models/InstallationModel";

interface InstallationDetailsCardProps {
  installation: InstallationModel | null;
  form: UseFormReturn;
}

export const InstallationDetailsCard = ({
  installation,
  form,
}: InstallationDetailsCardProps) => {
  const { t } = useTranslation();

  /**
   * Configuro el formulario de gestión
   */

  const [images, setImages] = useState<any[]>(installation?.images ?? []);

  const [enabledInstallation, setEnabledInstallation] = useState(false);

  const { register, formState, setValue, getValues } = form;

  const { errors } = formState;

  useEffect(() => {
    register("images");
    setValue("images", installation?.images);
    const formValues = getValues();
    setEnabledInstallation(formValues.enable);
  }, [installation]);

  useEffect(() => {
    setValue("enable", enabledInstallation);
  }, [enabledInstallation]);

  const onUploadFiles = (filesUrl: any[]) => {
    const newArray: string[] = [];
    filesUrl.forEach((image) => {
      newArray.push(image.url);
    });
    setImages(newArray);
    setValue("images", newArray);
  };

  const clearImages = () => {
    setImages([]);
    setValue("images", []);
  };

  const navigate = useNavigate();
  const tableName = import.meta.env.VITE_TABLE_BOOKINGS_INSTALLATIONS;

  const deleteInstallation = async () => {
    try {
      await deleteRow(installation!.id!, tableName);
      navigate(-1);
    } catch (error) {}
  };

  const [createdAtString, setCreatedAtString] = useState<string>(
    new Date().toISOString(),
  );
  const [updatedAtString, setUpdatedAtString] = useState<string>(
    new Date().toISOString(),
  );

  useEffect(() => {
    if (installation) {
      if (typeof installation.created_at === "object") {
        setCreatedAtString(installation.created_at.toISOString());
      } else {
        setCreatedAtString(installation.created_at!);
      }

      if (typeof installation.updated_at === "object") {
        setUpdatedAtString(installation.updated_at.toISOString());
      } else {
        setUpdatedAtString(installation.updated_at!);
      }
    }
  }, [installation]);

  return (
    <div className="max-w overflow-auto p-1">
      <h3 className="text-xl font-bold dark:text-white">
        {t("INSTALLATION_PAGE_CARD_DETAILS")}
      </h3>

      <div className="flex flex-grow items-between">
        <div className="mt-4 flex flex-grow gap-10">
          <div className="mt-4 w-2/3 ">
            <Label htmlFor="title" color={errors.title && "failure"}>
              {t(`EDIT_INSTALLATION_FORM_TITLE_LABEL`)} *
            </Label>
            <div className="mt-1">
              <TextInput
                id="title"
                placeholder={t(`EDIT_INSTALLATION_FORM_TITLE_PLACEHOLDER`)}
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

          <div className="mt-4 w-1/3 flex flex-grow">
            <div className="w-1/2">
              <Label htmlFor="type" color={errors.type && "failure"}>
                {t(`EDIT_INSTALLATION_FORM_TYPE_LABEL`)} *
              </Label>
              <div className="mt-1">
                <Select id="type" {...register("type", {})}>
                  <option value="INSTALLATION">{t("TYPE_INSTALLATION")}</option>
                  <option value="SERVICE">{t("SERVICE")}</option>
                </Select>
              </div>
            </div>

            <div className="ml-10">
              <Label htmlFor="enable" color={errors.enable && "failure"}>
                {t(`ENABLE`)} *
              </Label>
              <div className="mt-3">
                <ToggleSwitch
                  checked={enabledInstallation}
                  onChange={(e) => setEnabledInstallation(e)}
                  className="ml-1 mb-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="description" color={errors.description && "failure"}>
          {t(`DESCRIPTION`)}
        </Label>
        <div className="mt-1">
          <Textarea
            id="description"
            rows={6}
            placeholder={t(`EDIT_INSTALLATION_FORM_DESCRIPTION_PLACEHOLDER`)}
            {...register("description", {})}
            color={errors.description && "failure"}
          />
        </div>
        <ErrorMessage
          errors={errors}
          name="description"
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

      <div className="mb-4 pt-4">
        <div className="flex flex-row justify-between items-center">
          <Label className="">{t(`EDIT_INSTALLATION_FORM_IMAGE_LABEL`)}</Label>
          {images.length > 0 && (
            <Button size="xs" className="" color="light" onClick={clearImages}>
              <div className="flex items-center gap-x-2 text-red-500">
                <HiTrash className="text-xs text-red-500" />
                Borrar imagen
              </div>
            </Button>
          )}
        </div>
        <div className="mt-4">
          <div className="">
            {images.length > 0 ? (
              images.map((image, index) => (
                <div key={index} className="flex justify-center p-2">
                  <ModalImage
                    key={index}
                    small={image}
                    large={image}
                    className="h-64 rounded-lg"
                  />
                </div>
              ))
            ) : (
              <>
                <p className="text-center py-4">
                  No hay ninguna imágen añadida
                </p>
                <div>
                  <UploadArea
                    onUpload={onUploadFiles}
                    height="320px"
                    maxFiles={1}
                    fileTypes={["image/*"]}
                    location={"bookings/installations"}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div>
        {installation ? (
          <>
            <h3 className=" pt-4 text-xl font-bold dark:text-white">
              {t("INSTALLATION_PAGE_INFO_CARD_TITLE")}
            </h3>
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                <HiCalendar className="mr-1 text-sm" />
                {t("CREATED_AT_WITH_ICON")}:{" "}
                {format(
                  parseISO(createdAtString!),
                  "eeee dd MMMM 'de' yyyy, HH:mm",
                  {
                    locale: es,
                  },
                )}
              </div>
              <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                <HiCalendar className="mr-1 text-sm" />
                {t("UPDATED_AT_WITH_ICON")}:{" "}
                {format(
                  parseISO(updatedAtString!),
                  "eeee dd MMMM 'de' yyyy, HH:mm",
                  {
                    locale: es,
                  },
                )}
              </div>
            </div>
            <div className="py-3">
              <DeleteModal
                data={installation}
                deleteFn={deleteInstallation}
                onlyIcon={false}
                toastSuccessMsg={t("INSTALLATION_DELETE_OK")}
                toastErrorMsg={t("INSTALLATION_DELETE_KO")}
                title={t("DELETE_INSTALLATION")}
              />
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
