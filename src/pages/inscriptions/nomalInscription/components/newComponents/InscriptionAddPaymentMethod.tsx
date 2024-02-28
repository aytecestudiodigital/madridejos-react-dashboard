/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Checkbox, Label, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
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

  /* const handleAditionalDeadline = () => {
        const newDeadline = {
            payment_percentaje: 0,
            payment_date_type: "INSCRIPTION_MOMENT",
            payment_date: null,
            uuid: crypto.randomUUID()
        }
        setAditionalDeadLines([...aditionalDeadLines, newDeadline])
    }

    const updateAditionalDeadline = (index:any, property:any, data:any) => {
        const defaultAditionalDeadlines = [...aditionalDeadLines]
        defaultAditionalDeadlines[index][property] = data
        setAditionalDeadLines(defaultAditionalDeadlines)
    }

    const deleteAditionalDeadline = (index: number) => {
        const deadlines = [...aditionalDeadLines]
        deadlines.splice(index, 1)
        setAditionalDeadLines(deadlines)
    } */

  useEffect(() => {
    props.item.title = title;
    props.item.payment_method_id = paymentMethod;
    props.item.enabled = enabled;
    props.item.for_technician = forTechnicians;
    props.onUpdate(props.item, props.index);
  }, [title, paymentMethod, enabled, forTechnicians]);

  return (
    <>
      <div className="flex gap-8">
        <div className="w-full">
          <div>
            <Label>Título del método de pago</Label>
            <div className="mt-1">
              <TextInput
                defaultValue={title}
                onBlur={(e) => setTitle(e.currentTarget.value)}
              />
            </div>
          </div>
          <div>
            <Label>Método habilitado</Label>
            <div className="mt-1">
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.currentTarget.value)}
              >
                <option value="">Seleccionar</option>
                {paymentMethods.map((method, index) => (
                  <option key={index} value={method.id}>
                    {method.title}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
        {/* <div className="w-1/2">
                    <div className="flex justify-between">
                        <p>Plazos</p>
                        <Button onClick={handleAditionalDeadline}>Añadir plazo</Button>
                    </div>
                    <div className="flex gap-8 mt-2 max-h-96 overflow-auto">
                        <div className="w-full">
                            <Label>Porcentaje del pago</Label>
                            <div className="mt-1">
                                <TextInput
                                    defaultValue={paymentPercentaje}
                                    onBlur={(e) => setPaymentPercentaje(e.currentTarget.value)}
                                    type="number"
                                />
                            </div>
                        </div>
                        <div className="w-full">
                            <Label>Fecha del pago</Label>
                            <div className="mt-1">
                                <Select defaultValue={paymentDateType} onChange={(e) => setPaymentDateType(e.currentTarget.value)}>
                                    <option value="INSCRIPTION_MOMENT">En el momento de la inscripción</option>
                                    <option value="SPECIFIC_DATE">En una fecha concreta</option>
                                    <option value="NO_DATE">No especificar</option>
                                </Select>
                            </div>
                        </div>
                        {
                            paymentDateType === "SPECIFIC_DATE" ? (
                                <div>
                                    <Label>Fecha del pago</Label>
                                    <div className="mt-1">
                                        <TextInput type="date" defaultValue={paymentDate} onBlur={(e) => setPaymentDate(e.currentTarget.value)} />
                                    </div>
                                </div>
                            ) : null
                        }
                    </div>
                    <div className="max-h-[50vh] overflow-auto">
                        {
                            aditionalDeadLines.map((deadline, index) => (
                                <div key={deadline.uuid} className="flex gap-8 mt-2">
                                    <div className="w-full">
                                        <Label>Porcentaje del pago</Label>
                                        <div className="mt-1">
                                            <TextInput
                                                defaultValue={deadline.payment_percentaje}
                                                onBlur={(e) => updateAditionalDeadline(index, 'payment_percentaje', e.currentTarget.value)}
                                                type="number"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <Label>Fecha del pago</Label>
                                        <div className="mt-1">
                                            <Select defaultValue={deadline.payment_date_type} onChange={(e) => updateAditionalDeadline(index, 'payment_percentaje', e.currentTarget.value)}>
                                                <option value="INSCRIPTION_MOMENT">En el momento de la inscripción</option>
                                                <option value="SPECIFIC_DATE">En una fecha concreta</option>
                                                <option value="NO_DATE">No especificar</option>
                                            </Select>
                                        </div>
                                    </div>
                                    {
                                        deadline.payment_date_type === "SPECIFIC_DATE" ? (
                                            <div>
                                                <Label>Fecha del pago</Label>
                                                <div className="mt-1">
                                                    <TextInput type="date" defaultValue={deadline.payment_date} onBlur={(e) => updateAditionalDeadline(index, 'payment_date', e.currentTarget.value)} />
                                                </div>
                                            </div>
                                        ) : null
                                    }
                                    <div className="flex items-center mt-6">
                                        <Button onClick={() => deleteAditionalDeadline(index)} color="failure"><HiTrash /></Button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                </div> */}
      </div>
      <div className="flex justify-start gap-20 mt-4">
        <div className="flex">
          <Checkbox
            defaultChecked={enabled}
            onChange={(e) => setEnabled(e.currentTarget.checked)}
          />
          <Label className="ml-2">Habilitado</Label>
        </div>
        <div className="flex">
          <Checkbox
            defaultChecked={forTechnicians}
            onChange={(e) => setForTechnicians(e.currentTarget.checked)}
          />
          <Label className="ml-2">Sólo para técnicos</Label>
        </div>
      </div>
      <div className="flex justify-start mt-4">
        <Button onClick={() => props.onDelete(props.index)} color="failure">
          Borrar método
        </Button>
      </div>
    </>
  );
};
