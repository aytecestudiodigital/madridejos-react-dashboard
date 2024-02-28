/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, CustomFlowbiteTheme } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { InscriptionAddPaymentMethod } from "./InscriptionAddPaymentMethod";
import { InscriptionFormContext } from "../../context/InscriptionFormContext";

interface InscriptionPaymentMethodComponentProps {
  paymentMethods: any[];
}

export const InscriptionPaymentMethodComponent = (
  props: InscriptionPaymentMethodComponentProps,
) => {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [paymentMethodsToUpdate, setPaymentMethodsToUpdate] = useState<any[]>(
    [],
  );
  const [paymentMethodsToDelete, setPaymentMethodsToDelete] = useState<any[]>(
    [],
  );
  const contextMethods = useContext(InscriptionFormContext);

  const customTheme: CustomFlowbiteTheme["card"] = {
    root: {
      children: "flex h-full flex-col justify-start gap-4 p-6",
    },
  };

  useEffect(() => {
    if (props.paymentMethods.length > 0) {
      setPaymentMethods(props.paymentMethods);
    } else {
      setPaymentMethods([]);
    }
  }, [props.paymentMethods]);

  const handlePaymentMethod = () => {
    const newPaymentMethod = {
      title: "",
      payment_method_id: "",
      enabled: true,
      for_technician: false,
      payment_percentaje: 0,
      payment_date_type: "INSCRIPTION_MOMENT",
      payment_date: null,
      aditional_deadline_payments: [],
      uuid: crypto.randomUUID(),
    };
    setPaymentMethods([...paymentMethods, newPaymentMethod]);
  };

  const updatePaymentMethod = (data: any, index: number) => {
    const defaultPaymentMethods = [...paymentMethods];
    const toUpdate = [...paymentMethodsToUpdate];
    defaultPaymentMethods[index] = { ...defaultPaymentMethods[index], ...data };
    if (
      !toUpdate[
        toUpdate.findIndex((e) => e.id === defaultPaymentMethods[index].id)
      ]
    ) {
      toUpdate.push(defaultPaymentMethods[index]);
    } else {
      toUpdate[
        toUpdate.findIndex((e) => e.id === defaultPaymentMethods[index].id)
      ] = defaultPaymentMethods[index];
    }
    setPaymentMethods(defaultPaymentMethods);
    setPaymentMethodsToUpdate(toUpdate);
    contextMethods.updatePaymentMethods(defaultPaymentMethods);
    contextMethods.updatePaymentMethodsToUpdate(toUpdate);
  };

  const deletePaymentMethod = (index: number) => {
    const newPaymentMethods = [...paymentMethods];
    const toDelete = [...paymentMethodsToDelete];
    toDelete.push(newPaymentMethods[index]);
    newPaymentMethods.splice(index, 1);
    setPaymentMethods(newPaymentMethods);
    setPaymentMethodsToDelete(toDelete);
    contextMethods.updatePaymentMethods(newPaymentMethods);
    contextMethods.updatePaymentMethodsToDelete(toDelete);
  };

  return (
    <Card theme={customTheme}>
      <div className="flex items-center justify-between">
        <h1 className="font-bold dark:text-white">Métodos de pago</h1>
      </div>
      <div>
        {paymentMethods.map((method, index) => (
          <InscriptionAddPaymentMethod
            key={method.uuid}
            item={method}
            index={index}
            onDelete={(index) => deletePaymentMethod(index)}
            onUpdate={(data, index) => updatePaymentMethod(data, index)}
          />
        ))}
        <div className="mt-8 flex justify-center">
          <Button
            className="w-96 text-primary"
            size="xs"
            color="light"
            onClick={handlePaymentMethod}
          >
            Añadir método de pago
          </Button>
        </div>
      </div>
    </Card>
  );
};
