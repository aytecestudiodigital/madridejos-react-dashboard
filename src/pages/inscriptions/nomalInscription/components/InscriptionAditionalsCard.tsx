import { ErrorMessage } from "@hookform/error-message";
import { Label, TextInput, Textarea } from "flowbite-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { InscriptionAditionalsProductsTable } from "./tables/InscriptionAditionalsProductsTable";
import { Product } from "../models/Products";

interface aditionalProductsProps {
  products: Product[];
}
export const InscriptionAditionalsCard = (props: aditionalProductsProps) => {
  const { t } = useTranslation();
  const [mandatoryTitle, setMandatoryTitle] = useState(false);
  const { register, formState } = useFormContext();

  const { errors } = formState;
  return (
    <div className="max-w overflow-auto p-1">
      <h3 className="text-xl font-bold dark:text-white">Adicionales</h3>

      <div className="pt-4 pr-4">
        {mandatoryTitle ? (
          <>
            <Label
              htmlFor="aditional_activity_title"
              color={errors.aditional_activity_title && "failure"}
            >
              Título de la sección *
            </Label>
            <div className="mt-1">
              <TextInput
                id="aditional_activity_title"
                defaultValue="Servicios adicionales"
                {...register("aditional_activity_title", {
                  required: t("FORM_ERROR_MSG_REQUIRED"),
                })}
                color={errors.aditional_activity_title && "failure"}
              />
              <p className="text-xs mt-1 text-gray-500">
                Indica el título que verán los usuarios en este paso de la
                inscripción
              </p>
            </div>
            <ErrorMessage
              errors={errors}
              name="aditional_activity_title"
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
          </>
        ) : (
          <>
            <Label htmlFor="aditional_activity_title">
              Título de la sección
            </Label>
            <div className="mt-1">
              <TextInput
                id="aditional_activity_title"
                defaultValue="Servicios adicionales"
                {...register("aditional_activity_title")}
              />
              <p className="text-xs mt-1 text-gray-500">
                Indica el título que verán los usuarios en este paso de la
                inscripción
              </p>
            </div>
          </>
        )}
      </div>

      <div className="pt-4">
        <Label htmlFor="aditional_activity_description">
          {t(`DESCRIPTION`)}
        </Label>
        <div className="mt-1">
          <Textarea
            id="aditional_activity_description"
            rows={6}
            placeholder={"Escribe más detalles sobre esta inscripción"}
            {...register("aditional_activity_description")}
          />
        </div>
      </div>

      <div className="mt-4">
        <InscriptionAditionalsProductsTable
          setMandatoryTitle={(e) => setMandatoryTitle(e)}
          products={props.products}
        />
      </div>
    </div>
  );
};
