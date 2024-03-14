import { Button, Checkbox, Label, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

interface TabEventDatesProps {
  item: any;
}

export const TabEventDates = (props: TabEventDatesProps) => {
  const { register, getValues, setValue } = useFormContext();
  const [selectedType, setSelectedType] = useState("SINGLE");
  const [dateSellInit, setDateSellInit] = useState("");
  const [dateSellEnd, setDateSellEnd] = useState("");
  const [eventDateInit, setEventDateInit] = useState("");
  const [eventDateEnd, setEventDateEnd] = useState("");

  useEffect(() => {
    if (props.item) {
      const formValues = getValues();
      if (formValues.sell_date_init) {
        if (
          new Date(formValues.sell_date_init)
            .toLocaleTimeString("es")
            .split(":")[0] === "0"
        ) {
          setDateSellInit(
            new Date(formValues.sell_date_init).toISOString().split("T")[0] +
              "T" +
              "0" +
              new Date(formValues.sell_date_init).toLocaleTimeString("es"),
          );
        } else {
          setDateSellInit(
            new Date(formValues.sell_date_init).toISOString().split("T")[0] +
              "T" +
              new Date(formValues.sell_date_init).toLocaleTimeString("es"),
          );
        }
      }
      if (formValues.sell_date_end) {
        if (
          new Date(formValues.sell_date_end)
            .toLocaleTimeString("es")
            .split(":")[0] === "0"
        ) {
          setDateSellEnd(
            new Date(formValues.sell_date_end).toISOString().split("T")[0] +
              "T" +
              "0" +
              new Date(formValues.sell_date_end).toLocaleTimeString("es"),
          );
        } else {
          setDateSellEnd(
            new Date(formValues.sell_date_end).toISOString().split("T")[0] +
              "T" +
              new Date(formValues.sell_date_end).toLocaleTimeString("es"),
          );
        }
      }
      if (formValues.event_date_init) {
        if (
          new Date(formValues.event_date_init)
            .toLocaleTimeString("es")
            .split(":")[0] === "0"
        ) {
          setEventDateInit(
            new Date(formValues.event_date_init).toISOString().split("T")[0] +
              "T" +
              "0" +
              new Date(formValues.event_date_init).toLocaleTimeString("es"),
          );
        } else {
          setEventDateInit(
            new Date(formValues.event_date_init).toISOString().split("T")[0] +
              "T" +
              new Date(formValues.event_date_init).toLocaleTimeString("es"),
          );
        }
      }
      if (formValues.event_date_end) {
        if (
          new Date(formValues.event_date_init)
            .toLocaleTimeString("es")
            .split(":")[0] === "0"
        ) {
          setEventDateEnd(
            new Date(formValues.event_date_end).toISOString().split("T")[0] +
              "T" +
              "0" +
              new Date(formValues.event_date_end).toLocaleTimeString("es"),
          );
        } else {
          setEventDateEnd(
            new Date(formValues.event_date_end).toISOString().split("T")[0] +
              "T" +
              new Date(formValues.event_date_end).toLocaleTimeString("es"),
          );
        }
      }
    }
  }, [props.item]);

  const onChangeDates = (value: any, date: string) => {
    if (date === "dateSellInit") {
      setDateSellInit(value);
    } else if (date === "dateSellEnd") {
      setDateSellEnd(value);
    } else if (date === "eventDateInit") {
      setEventDateInit(value);
    } else if (date === "eventDateEnd") {
      setEventDateEnd(value);
    }
  };

  useEffect(() => {
    if (dateSellInit !== "") {
      setValue("sell_date_init", new Date(dateSellInit));
    }
  }, [dateSellInit]);

  useEffect(() => {
    if (dateSellEnd !== "") {
      setValue("sell_date_end", new Date(dateSellEnd));
    }
  }, [dateSellEnd]);

  useEffect(() => {
    if (eventDateInit !== "") {
      setValue("event_date_init", new Date(eventDateInit));
    }
  }, [eventDateInit]);

  useEffect(() => {
    if (eventDateEnd !== "") {
      setValue("event_date_end", new Date(eventDateEnd));
    }
  }, [eventDateEnd]);

  return (
    <div className="p-2">
      <div className="flex gap-4 w-full">
        <div className="w-full">
          <Label>Inicio de venta</Label>
          <div className="mt-1">
            <TextInput
              defaultValue={dateSellInit}
              onChange={(e) =>
                onChangeDates(e.currentTarget.value, "dateSellInit")
              }
              type="datetime-local"
            />
          </div>
        </div>
        <div className="w-full">
          <Label>Fin de venta</Label>
          <div className="mt-1">
            <TextInput
              defaultValue={dateSellEnd}
              onChange={(e) =>
                onChangeDates(e.currentTarget.value, "dateSellEnd")
              }
              type="datetime-local"
            />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Label>Tipo</Label>
        <div className="mt-1">
          <Select
            {...register("event_type")}
            onChange={(e) => setSelectedType(e.currentTarget.value)}
          >
            <option value="SINGLE">Individual</option>
            {/* <option value="RECURRENT">Recurrente</option> */}
          </Select>
        </div>
      </div>
      {selectedType === "SINGLE" ? (
        <div className="flex gap-4 w-full mt-4">
          <div className="w-full">
            <Label>Inicio del evento</Label>
            <div className="mt-1">
              <TextInput
                defaultValue={eventDateInit}
                onChange={(e) =>
                  onChangeDates(e.currentTarget.value, "eventDateInit")
                }
                type="datetime-local"
              />
            </div>
          </div>
          <div className="w-full">
            <Label>Fin del evento</Label>
            <div className="mt-1">
              <TextInput
                defaultValue={eventDateEnd}
                onChange={(e) =>
                  onChangeDates(e.currentTarget.value, "eventDateEnd")
                }
                type="datetime-local"
              />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex gap-4 w-full mt-4">
            <div className="w-full">
              <Label>Cantidad de dias</Label>
              <div className="mt-1">
                <TextInput type="number" />
              </div>
            </div>
            <div className="w-full">
              <Label>Turnos</Label>
              <Select onChange={() => null}>
                <option value="YES">Si</option>
                <option value="NO">No</option>
              </Select>
            </div>
          </div>
          <div className="flex gap-4 w-full mt-4">
            <div className="w-full">
              <Label>Inicio del evento</Label>
              <div className="mt-1">
                <TextInput type="date" />
              </div>
            </div>
            <div className="w-full">
              <Label>Fin del evento</Label>
              <div className="mt-1">
                <TextInput type="date" />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between border-b pb-2">
              <h1>Horarios y turnos</h1>
              <Button size={"xs"}>Añadir horario</Button>
            </div>
            <div className="mt-2 p-2">
              <h1>Configuración 1</h1>
              <div className="flex gap-8 mt-2">
                <div className="">
                  <Checkbox />
                  <Label className="ml-2">Lunes</Label>
                </div>
                <div className="">
                  <Checkbox />
                  <Label className="ml-2">Martes</Label>
                </div>
                <div className="">
                  <Checkbox />
                  <Label className="ml-2">Miércoles</Label>
                </div>
                <div className="">
                  <Checkbox />
                  <Label className="ml-2">Jueves</Label>
                </div>
                <div className="">
                  <Checkbox />
                  <Label className="ml-2">Viernes</Label>
                </div>
                <div className="">
                  <Checkbox />
                  <Label className="ml-2">Sábado</Label>
                </div>
                <div className="">
                  <Checkbox />
                  <Label className="ml-2">Domingo</Label>
                </div>
              </div>
              <div className="flex gap-4 w-full mt-2">
                <div className="w-full">
                  <Label>Hora de inicio</Label>
                  <div className="mt-1">
                    <TextInput type="time" />
                  </div>
                </div>
                <div className="w-full">
                  <Label>Hora de fin</Label>
                  <div className="mt-1">
                    <TextInput type="time" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
