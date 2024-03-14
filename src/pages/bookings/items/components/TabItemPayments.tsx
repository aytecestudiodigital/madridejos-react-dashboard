/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label, Select, ToggleSwitch } from "flowbite-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ItemModel } from "../models/ItemModel";
import { PaymentMethod } from "../models/PaymentMethod";
import { PaymentAccount } from "../models/PaymentAcc";
import SelectPaymentsMethods from "./SelectPaymentsMethods";
import { getOneRow, getRowByColumn } from "../../../../server/supabaseQueries";
import { useFormContext } from "react-hook-form";

interface PaymentsProps {
  paymentsMethods: PaymentMethod[] | [];
  paymentsAcc: PaymentAccount[] | [];
  item: ItemModel | null;
  onChangeData: (data: any) => void;
}

export const TabItemPayments = (props: PaymentsProps) => {
  const { t } = useTranslation();

  const itemsMethodsTableName = import.meta.env
    .VITE_TABLE_BOOKINGS_ITEMS_PAYMENTS_METHOD;
  const paymentMethodsTableName = import.meta.env.VITE_TABLE_PAYMENTS_METHOD;
  const [free, setFree] = useState<boolean>(false);
  const [selectedMethods, setSelectedMethods] = useState<any[]>([]);
  const [selectedPaymentAcc, setSelectedPaymentAcc] = useState<string>("");
  const [applyCupon, setApplyCupon] = useState<boolean>(false);
  const { register, setValue } = useFormContext();

  useEffect(() => {
    setFree((props.item && props.item.free) ?? false);
    setSelectedPaymentAcc((props.item && props.item.payments_account_id) ?? "");
    setApplyCupon((props.item && props.item.apply_cupons) ?? false);

    const fetchData = async () => {
      if (props.item) {
        const methods = await getRowByColumn(
          "booking_item_id",
          props.item.id!,
          itemsMethodsTableName,
        );
        const methodsSelected: any[] = [];
        for await (const method of methods) {
          const row = await getOneRow(
            "id",
            method.payments_method_id,
            paymentMethodsTableName,
          );
          methodsSelected.push(row);
        }
        setSelectedMethods(methodsSelected);
      }
    };
    fetchData();
  }, [props.item]);

  useEffect(() => {
    setValue("payments_account_id", selectedPaymentAcc);
  }, [selectedPaymentAcc]);

  useEffect(() => {
    setValue("free", free);
  }, [free]);

  const setFreeValue = (value: any) => {
    setValue("free", value);
    setFree(value);
  };

  const applyCoupons = (event: any) => {
    setValue("apply_cupons", event);
    setApplyCupon(event);
  };

  const handleMethodChange = (sMethods: any[]) => {
    setSelectedMethods(sMethods);
    onChangeInputs();
  };

  const onChangeInputs = () => {
    const object = {
      free: free,
      payments_account_id: selectedPaymentAcc,
      apply_cupons: applyCupon,
      payments_methods: selectedMethods.length > 0 ? selectedMethods : [],
    };
    props.onChangeData(object);
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold dark:text-white pt-2">Pagos</h3>
      <div>
        <Label htmlFor="free">{t("FREE")}</Label>
        {/* <Select
          id="free"
          value={free ? "true" : "false"}
          {...register("free")}
          onChange={(e) => setFreeValue(e.currentTarget.value)}
          onBlur={() => onChangeInputs()}
        >
          <option value="true">{t("YES")}</option>
          <option value="false">{t("NO")}</option>
        </Select> */}
        <ToggleSwitch
          checked={free}
          onChange={(e) => setFreeValue(e)}
          className="mt-1"
        />
      </div>

      {!free ? (
        <>
          <div className="flex justify-between gap-4">
            <div className="flex-grow">
              <Label htmlFor="max_selected_time">{t("PAYMENTS_METHODS")}</Label>

              <SelectPaymentsMethods
                dataDropdown={
                  props.paymentsMethods ? props.paymentsMethods : []
                }
                onMethodChange={handleMethodChange}
                defaultSelectedMethods={selectedMethods}
              />
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <div className="flex-grow w-1/2">
              <Label htmlFor="payments_account_id">
                {t("PAYMENTS_ACCOUNTS")}
              </Label>
              <Select
                className="mt-1"
                id="payments_account_id"
                value={selectedPaymentAcc}
                {...register("payments_account_id")}
                onChange={(e) => setSelectedPaymentAcc(e.target.value)}
                onBlur={() => onChangeInputs()}
              >
                <option hidden value="" disabled>
                  {t("SELECT")}
                </option>
                {props.paymentsAcc.map((method, index) => (
                  <option key={index} value={method.id}>
                    {method.title}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex-grow w-1/2 ">
              <Label htmlFor="apply_cupons">{t("ACCEPTS_COUPONS")}</Label>
              {/* <Select
                id="apply_cupons"
                value={applyCupon ? "true" : "false"}
                {...register("apply_cupons")}
                onChange={(e) => applyCoupons(e.currentTarget.value)}
                onBlur={() => onChangeInputs()}
              >
                <option value={"true"}>{t("YES")}</option>
                <option value={"false"}>{t("NO")}</option>
              </Select> */}
              <ToggleSwitch
                checked={applyCupon}
                onChange={(e) => applyCoupons(e)}
                className="mt-3"
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
