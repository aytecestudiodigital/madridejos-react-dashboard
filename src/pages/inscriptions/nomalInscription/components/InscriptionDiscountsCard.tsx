import { Label, Textarea, ToggleSwitch } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { InscriptionDiscountsTable } from "./tables/InscriptionDiscountsTable";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Discount } from "../models/Discounts";

interface discountsProps {
  discounts: Discount[];
}

export const InscriptionDiscountsCard = (props: discountsProps) => {
  const { t } = useTranslation();
  const [accumulateDiscounts, setAccumulateDiscounts] = useState(false);
  const { register, setValue } = useFormContext();

  useEffect(() => {
    setValue("acumulated_discounts", accumulateDiscounts);
  }, [accumulateDiscounts]);

  return (
    <div className="max-w overflow-auto p-1">
      <h3 className="text-xl font-bold dark:text-white">Descuentos</h3>
      <div className="pt-4">
        <Label htmlFor="description">{t(`DESCRIPTION`)}</Label>
        <div className="mt-1">
          <Textarea
            id="description"
            rows={6}
            placeholder={"Descripción de la sección"}
            {...register("discounts_description")}
          />
        </div>
      </div>

      <div className="mt-4">
        <InscriptionDiscountsTable discounts={props.discounts} />
      </div>

      <div className="mt-8">
        <ToggleSwitch
          checked={accumulateDiscounts}
          onChange={setAccumulateDiscounts}
          label="Acumular descuentos seleccionables"
        />
        <p className="mt-1 text-xs text-gray-500">
          Habilitando la acumulación de descuentos el usuario podrá seleccionar
          varios descuentos
        </p>
      </div>
    </div>
  );
};
