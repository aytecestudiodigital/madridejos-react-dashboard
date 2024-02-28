/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label, Select, TextInput, Textarea } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { InscriptionPaymentMethodComponent } from "./newComponents/InscriptionPaymentMethodComponent";
import { useFormContext } from "react-hook-form";
import { getAll } from "../../../../server/supabaseQueries";
import { InscriptionFormContext } from "../context/InscriptionFormContext";
import { t } from "i18next";

interface InscriptionPaymentMethodsCardProps {
  paymentMethods: any[];
}

export const InscriptionPaymentMethodsCard = (
  props: InscriptionPaymentMethodsCardProps,
) => {
  const [paymentAccounts, setPaymentsAccounts] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [activityNotFree, setActivityNotFree] = useState(false);
  const { register } = useFormContext();
  const contextMethods = useContext(InscriptionFormContext);

  useEffect(() => {
    const fetchData = async () => {
      const paymentAccountsBd = await getAll("payments_accounts");
      if (paymentAccountsBd.data) {
        setPaymentsAccounts(paymentAccountsBd.data);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const activitiesUpdated = contextMethods.getMainActivities();
    setActivities(activitiesUpdated);
  }, [contextMethods]);

  useEffect(() => {
    activities.forEach((activity) => {
      if (parseInt(activity.price) > 0) {
        setActivityNotFree(true);
      }
    });
  }, [activities]);

  return (
    <div className="p-1">
      <p className="text-xl font-bold">Métodos de pago</p>
      {!activityNotFree ? (
        <>
          <div className="mt-4">
            <Label>Título del método de pago</Label>
            <div className="mt-1">
              <TextInput {...register("payment_title")} />
            </div>
          </div>
          <div className="mt-1">
            <Label>Descripción de la sección</Label>
            <div className="mt-1 w-full">
              <Textarea {...register("payment_description")} rows={4} />
            </div>
          </div>
          <div className="mt-1">
            <Label>Cuenta de pago</Label>
            <div className="mt-1">
              <Select {...register("payments_account_id")}>
                <option value="">Seleccionar</option>
                {paymentAccounts.map((account: any, index: any) => (
                  <option key={index} value={account.id}>
                    {account.title}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mt-4">
            <Label>Título del método de pago *</Label>
            <div className="mt-1">
              <TextInput
                {...register("payment_title", {
                  required: t("FORM_ERROR_MSG_REQUIRED"),
                })}
              />
            </div>
          </div>
          <div className="mt-1">
            <Label>Descripción de la sección *</Label>
            <div className="mt-1 w-full">
              <Textarea
                {...register("payment_description", {
                  required: t("FORM_ERROR_MSG_REQUIRED"),
                })}
                rows={4}
              />
            </div>
          </div>
          <div className="mt-1">
            <Label>Cuenta de pago *</Label>
            <div className="mt-1">
              <Select
                {...register("payments_account_id", {
                  required: t("FORM_ERROR_MSG_REQUIRED"),
                })}
              >
                <option value="">Seleccionar</option>
                {paymentAccounts.map((account: any, index: any) => (
                  <option key={index} value={account.id}>
                    {account.title}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </>
      )}

      <div className="mt-4">
        <InscriptionPaymentMethodComponent
          paymentMethods={props.paymentMethods}
        />
      </div>
    </div>
  );
};
