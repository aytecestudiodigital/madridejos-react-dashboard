/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Checkbox,
  Dropdown,
  Label,
  Select,
  ToggleSwitch,
} from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getAll, getRowByColumn } from "../../../../server/supabaseQueries";
import { EventContext } from "../context/EventContext";

interface TabEventPaymentsProps {
  item: any;
}

export const TabEventPayments = (props: TabEventPaymentsProps) => {
  const { t } = useTranslation();

  const paymentMethodsTableName = import.meta.env.VITE_TABLE_PAYMENTS_METHOD;
  const [free, setFree] = useState<boolean>(false);
  const [selectedMethods, setSelectedMethods] = useState<any[]>([]);
  const [selectedMethodsTechnicians, setSelectedMethodsTechnicians] = useState<
    any[]
  >([]);
  const [selectedPaymentAcc, setSelectedPaymentAcc] = useState<string>("");
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [paymentsAccounts, setPaymentsAccounts] = useState<any[]>([]);
  const [applyCupon, setApplyCupon] = useState<boolean>(false);
  const { register, setValue } = useFormContext();
  const contextMethods = useContext(EventContext);

  useEffect(() => {
    const fetchData = async () => {
      const methodsDb = await getAll(paymentMethodsTableName);
      if (methodsDb.data) {
        setPaymentMethods(methodsDb.data);
      }
      const accountsDb = await getAll("payments_accounts");
      if (accountsDb.data) {
        setPaymentsAccounts(accountsDb.data);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    contextMethods.updateNormalPaymentMethods(selectedMethods);
  }, [selectedMethods]);

  useEffect(() => {
    contextMethods.updateTechniciansPaymentMethods(selectedMethodsTechnicians);
  }, [selectedMethodsTechnicians]);

  useEffect(() => {
    if (props.item) {
      if (props.item.is_free) {
        setFree(props.item.is_free);
      }
      if (props.item.payments_account_id) {
        setSelectedPaymentAcc(props.item.payments_account_id);
      }
      if (props.item.apply_coupons) {
        setApplyCupon(props.item.apply_coupons);
      }
      const fetchData = async () => {
        const techMethods: any[] = [];
        const normalMethods: any[] = [];
        const itemPaymentMethods = await getRowByColumn(
          "ticket_id",
          props.item.id,
          "tickets_payments_methods",
        );
        if (itemPaymentMethods) {
          itemPaymentMethods.forEach((method: any) => {
            if (method.for_technician) {
              techMethods.push(method.payment_method);
            } else {
              normalMethods.push(method.payment_method);
            }
          });
          setSelectedMethods(normalMethods);
          setSelectedMethodsTechnicians(techMethods);
        }
      };
      fetchData();
    }
  }, [props.item]);

  useEffect(() => {
    setValue("is_free", free);
  }, [free]);

  const changeFree = (value: any) => {
    setFree(value);
    setValue("is_free", value);
  };

  const handlePaymentmethods = (filter: string, checked: boolean) => {
    if (checked) {
      const selected = [...selectedMethods];
      selected.push(filter);
      setSelectedMethods(selected);
    } else {
      const selected = selectedMethods.filter((s) => s != filter);
      setSelectedMethods(selected);
    }
  };

  const handlePaymentmethodsTechnicians = (
    filter: string,
    checked: boolean,
  ) => {
    if (checked) {
      const selected = [...selectedMethodsTechnicians];
      selected.push(filter);
      setSelectedMethodsTechnicians(selected);
    } else {
      const selected = selectedMethodsTechnicians.filter((s) => s != filter);
      setSelectedMethodsTechnicians(selected);
    }
  };

  const changePaymentAccount = (value: any) => {
    setSelectedPaymentAcc(value);
    setValue("payments_account_id", value);
  };

  const changeApplyCoupon = (value: any) => {
    setApplyCupon(value);
    setValue("apply_coupons", value);
  };

  return (
    <div className="flex flex-col gap-4 p-2">
      <div>
        <Label htmlFor="free">{t("FREE")}</Label>
        <ToggleSwitch
          checked={free}
          onChange={(e) => changeFree(e)}
          className="mt-1"
        />
      </div>

      {!free ? (
        <>
          <div className="flex justify-between gap-4">
            <div className="w-full">
              <Label htmlFor="max_selected_time">{t("PAYMENTS_METHODS")}</Label>

              <Dropdown
                renderTrigger={({}) => (
                  <button
                    id="dropdownBgHoverButton"
                    data-dropdown-toggle="dropdownBgHover"
                    className="mt-1 flex items-center justify-between w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg focus:outline-none focus-within:border-2 focus-within:border-cyan-500"
                    type="button"
                  >
                    <span>Métodos de pago (Ciudadanos/as)</span>
                    <svg
                      className="ml-4 h-4 w-4 py-1 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 2 4 4 4-4"
                      />
                    </svg>
                  </button>
                )}
                color="gray"
                label="Métodos de pago"
                dismissOnClick={false}
              >
                <Dropdown.Divider />
                {paymentMethods.map((item) => (
                  <Dropdown.Item key={item.id}>
                    <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                      <Checkbox
                        id={`checkbox-item-${item.id}`}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        checked={selectedMethods.includes(item.id)}
                        onChange={(e) =>
                          handlePaymentmethods(item.id, e.currentTarget.checked)
                        }
                      />
                      <label
                        htmlFor={`checkbox-item-${item.id}`}
                        className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                      >
                        {item.title}
                      </label>
                    </div>
                  </Dropdown.Item>
                ))}
              </Dropdown>
            </div>

            <div className="w-full mt-7">
              <Dropdown
                renderTrigger={({}) => (
                  <button
                    id="dropdownBgHoverButton"
                    data-dropdown-toggle="dropdownBgHover"
                    className="flex items-center justify-between w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg focus:outline-none focus-within:border-2 focus-within:border-cyan-500"
                    type="button"
                  >
                    <span>Métodos de pago (Técnicos/Administradores)</span>
                    <svg
                      className="ml-4 h-4 w-4 py-1 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 2 4 4 4-4"
                      />
                    </svg>
                  </button>
                )}
                color="gray"
                label="Métodos de pago"
                dismissOnClick={false}
              >
                <Dropdown.Divider />
                {paymentMethods.map((item) => (
                  <Dropdown.Item key={item.id}>
                    <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                      <Checkbox
                        id={`checkbox-item-${item.id}`}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        checked={selectedMethodsTechnicians.includes(item.id)}
                        onChange={(e) =>
                          handlePaymentmethodsTechnicians(
                            item.id,
                            e.currentTarget.checked,
                          )
                        }
                      />
                      <label
                        htmlFor={`checkbox-item-${item.id}`}
                        className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                      >
                        {item.title}
                      </label>
                    </div>
                  </Dropdown.Item>
                ))}
              </Dropdown>
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <div className="w-1/2">
              <Label htmlFor="payments_account_id">
                {t("PAYMENTS_ACCOUNTS")}
              </Label>
              <Select
                className="mt-1"
                id="payments_account_id"
                value={selectedPaymentAcc}
                {...register("payments_account_id")}
                onChange={(e) => changePaymentAccount(e.target.value)}
                onBlur={() => null}
              >
                <option hidden value="" disabled>
                  {t("SELECT")}
                </option>
                {paymentsAccounts.map((account, index) => (
                  <option key={index} value={account.id}>
                    {account.title}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex items-center justify-end gap-4">
              <ToggleSwitch
                checked={applyCupon}
                onChange={(e) => changeApplyCoupon(e)}
                className="mt-4"
              />
              <div className="mt-3">
                <Label htmlFor="apply_cupons">{t("ACCEPTS_COUPONS")}</Label>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
