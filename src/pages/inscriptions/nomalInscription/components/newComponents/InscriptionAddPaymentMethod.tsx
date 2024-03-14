/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, Label, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiTrash } from "react-icons/hi";
import { getAll } from "../../../../../server/supabaseQueries";

interface addPaymentMethodProps {
  onDelete: (id: number) => void;
  onUpdate: (data: any, index: any) => void;
  index: number;
  item: any;
}

export const InscriptionAddPaymentMethod = (props: addPaymentMethodProps) => {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [title, setTitle] = useState(props.item.title ? props.item.title : "");
  const [paymentMethod, setPaymentMethod] = useState(
    props.item.payment_method_id ? props.item.payment_method_id : "",
  );
  const [enabled, setEnabled] = useState(
    props.item.enabled ? props.item.enabled : false,
  );
  const [forTechnicians, setForTechnicians] = useState(
    props.item.for_technicians ? props.item.for_technicians : false,
  );

  useEffect(() => {
    const fetchData = async () => {
      const paymentMethodsBd = await getAll("payments_methods");
      if (paymentMethodsBd.data) {
        setPaymentMethods(paymentMethodsBd.data);
      } else {
        setPaymentMethods([]);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    props.item.title = title;
    props.item.payment_method_id = paymentMethod;
    props.item.enabled = enabled;
    props.item.for_technician = forTechnicians;
    props.onUpdate(props.item, props.index);
  }, [title, paymentMethod, enabled, forTechnicians]);

  return (
    <>
      <div className="flex gap-8 p-1">
        <div className="flex flex-grow mt-4 justify-between gap-4">
          <div className="w-2/3">
            <Label>Título del método de pago</Label>
            <div className="mt-1">
              <TextInput
                defaultValue={title}
                onBlur={(e) => setTitle(e.currentTarget.value)}
              />
            </div>
          </div>
          <div className="w-1/3">
            <Label>Método habilitado</Label>
            <div className="mt-1">
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.currentTarget.value)}
              >
                <option hidden value="">
                  Seleccionar
                </option>
                {paymentMethods.map((method, index) => (
                  <option key={index} value={method.id}>
                    {method.title}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex mt-8 border-b-2 border-gray-200 dark:border-gray-700 pb-6">
        <div className="flex flex-grow items-center">
          <Checkbox
            id={`checkbox-enabled-${props.item.id}`}
            className="w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            defaultChecked={forTechnicians}
            onChange={(e) => setForTechnicians(e.currentTarget.checked)}
          />
          <Label>Solo para técnicos</Label>
        </div>

        <div className="flex flex-grow items-center">
          <Checkbox
            id={`checkbox-required-${props.item.id}`}
            className="w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            defaultChecked={enabled}
            onChange={(e) => setEnabled(e.currentTarget.checked)}
          />
          <Label>Habilitado</Label>
        </div>

        <div className="flex justify-end">
          <HiTrash
            className="text-xl  text-red-500"
            onClick={() => props.onDelete(props.index)}
          />
        </div>
      </div>
    </>
  );
};
