/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorMessage } from "@hookform/error-message";
import { Label, TextInput, Textarea } from "flowbite-react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { InscriptionAuthorizationsComponents } from "./newComponents/InscriptionAuthorizationsComponents";

interface InscriptionAuthorizationsCardProps {
  authorizations: any[];
}

export const InscriptionAuthorizationsCard = (
  props: InscriptionAuthorizationsCardProps,
) => {
  const { t } = useTranslation();
  const { register, formState } = useFormContext();

  const { errors } = formState;

  return (
    <div className="max-w overflow-auto p-1">
      <h3 className="text-xl font-bold dark:text-white">Autorizaciones</h3>

      <div className="pt-4 pr-4">
        <Label htmlFor="title" color={errors.title && "failure"}>
          Título de la sección *
        </Label>
        <div className="mt-1">
          <TextInput
            id="title"
            defaultValue="Autorizaciones"
            {...register("authorizations_title", {
              required: t("FORM_ERROR_MSG_REQUIRED"),
            })}
            color={errors.title && "failure"}
          />
          <p className="text-xs mt-1 text-gray-500">
            Indica el título que verán los usuarios en este paso de la
            inscripción
          </p>
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

      <div className="pt-4">
        <Label htmlFor="description">{t(`DESCRIPTION`)}</Label>
        <div className="mt-1">
          <Textarea
            id="description"
            rows={6}
            placeholder={"Descripción de la sección"}
            {...register("authorizations_description")}
          />
        </div>
      </div>

      <div className="mt-4">
        <InscriptionAuthorizationsComponents
          authorizations={props.authorizations}
        />
      </div>
    </div>
  );
};
