/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { InscriptionActivitiesProductsTable } from "./tables/InscriptionActivitiesProductsTable";
import { ErrorMessage } from "@hookform/error-message";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Product } from "../models/Products";
import React from "react";

interface normalProductsProps {
  products: Product[];
  inscription: any;
}
export const InscriptionActivitiesCard = (props: normalProductsProps) => {
  const { t } = useTranslation();
  const [maxProducts /* setMaxProducts */] = useState<any[]>([
    99999, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20,
  ]);
  const [minProducts /* setMinProducts */] = useState<any[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ]);
  const [maxProductSelected, setMaxProductsSelected] = useState(
    props.inscription ? props.inscription.activity_max_products : 1,
  );

  const [activityOrderDir, setActivityOrderDir] = useState("true");

  const { register, formState, setValue } = useFormContext();

  const { errors } = formState;

  useEffect(() => {
    if (activityOrderDir === "true") {
      setValue("activity_order_asc", true);
    } else {
      setValue("activity_order_asc", false);
    }
  }, [activityOrderDir]);

  useEffect(() => {
    if (props.inscription) {
      setMaxProductsSelected(props.inscription.activity_max_products);
    }
  }, [props.inscription]);

  return (
    <div className="max-w overflow-auto p-1">
      <h3 className="text-xl font-bold dark:text-white">Actividades</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="pt-4 pr-4">
          <Label
            htmlFor="activity_title"
            color={errors.activity_title && "failure"}
          >
            Título de la sección *
          </Label>
          <div className="mt-1">
            <TextInput
              id="activity_title"
              {...register("activity_title", {
                required: t("FORM_ERROR_MSG_REQUIRED"),
              })}
              color={errors.activity_title && "failure"}
            />
            <p className="text-xs mt-1 text-gray-500">
              Indica el título que verán los usuarios en este paso de la
              inscripción
            </p>
          </div>

          <ErrorMessage
            errors={errors}
            name="activity_title"
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
          <div className="pt-4 mr-4">
            <Label htmlFor="activity_max_products">
              Cantidad máxima de productos
            </Label>
            <div className="mt-1">
              <Select
                id="activity_max_products"
                {...register("activity_max_products")}
                onChange={(e) =>
                  setMaxProductsSelected(parseInt(e.currentTarget.value))
                }
              >
                {maxProducts.map((value) => (
                  <React.Fragment key={value}>
                    {value === 99999 ? (
                      <option value={value}>Ilimitado</option>
                    ) : (
                      <option value={value}>{value}</option>
                    )}
                  </React.Fragment>
                ))}
              </Select>
              <p className="text-xs mt-1 text-gray-500">
                Indica el número máximo de productos que el usuario podrá
                seleccionar
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Label htmlFor="activity_min_products">
              Cantidad mínima de productos
            </Label>
            <div className="mt-1">
              <Select
                id="activity_min_products"
                {...register("activity_min_products")}
              >
                {minProducts.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Select>
              <p className="text-xs mt-1 text-gray-500">
                Indica el número mínimo de productos que el usuario podrá
                seleccionar
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="pt-4 pr-4">
          <Label
            htmlFor="activity_type"
            color={errors.activity_type && "failure"}
          >
            Típo de producto *
          </Label>
          <div className="mt-1">
            <TextInput
              id="activity_type"
              placeholder="Datos de la persona a inscribir"
              {...register("activity_type", {
                required: t("FORM_ERROR_MSG_REQUIRED"),
              })}
              color={errors.activity_type && "failure"}
            />
            <p className="text-xs mt-1 text-gray-500">
              Actividades, entradas, torneos, etc.
            </p>
          </div>
          <ErrorMessage
            errors={errors}
            name="activity_type"
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
            <Label
              htmlFor="activity_order_by" /* color={errors.title && "failure"} */
            >
              Orden de los productos
            </Label>
            <div className="mt-1">
              <Select id="activity_order_by" {...register("activity_order_by")}>
                <option value={"ALPHABETICAL"}>Alfabético</option>
                <option value={"MANUAL"}>Manual</option>
              </Select>
            </div>
          </div>

          <div className="pt-4">
            <Label
              htmlFor="activity_order_asc" /* color={errors.enable && "failure"} */
            >
              Dirección del orden de los productos
            </Label>
            <div className="mt-1">
              <Select
                value={activityOrderDir}
                id="activity_order_asc"
                onChange={(e) => setActivityOrderDir(e.currentTarget.value)}
              >
                <option value={"false"}>Descendente</option>
                <option value={"true"}>Ascendente</option>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <InscriptionActivitiesProductsTable
          products={props.products ? props.products : []}
          maxProductsSelected={maxProductSelected}
        />
      </div>
    </div>
  );
};
