import { ErrorMessage } from "@hookform/error-message";
import {
  Button,
  Checkbox,
  Label,
  Modal,
  Select,
  Tabs,
  TextInput,
  Textarea,
  ToggleSwitch,
} from "flowbite-react";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiTrash } from "react-icons/hi";
import { LuPlus } from "react-icons/lu";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ModalEventProductsProps {
  openModal: boolean;
  closeModal: () => void;
  item: any;
  index: any;
  onCreateTicket: (ticket: any) => void;
  onUpdateTicket: (ticket: any, index: any) => void;
  onDeleteTicket: (ticket: any, index: any) => void;
}

export const ModalEventProducts = (props: ModalEventProductsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [enable, setEnable] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState("");
  const [selectedTicketLimit, setSelectedTicketLimit] = useState("DAY");
  const [enableAditionalFields, setEnableAditionalFields] = useState(false);
  const [aditionalFields, setAditionalFields] = useState<any[]>([]);
  const [limitDateInit, setLimitDateInit] = useState("");
  const [limitDateEnd, setLimitDateEnd] = useState("");
  const userGroupId = localStorage.getItem("groupSelected");

  const { register, formState, getValues } = useForm<any>({
    values: props.item ?? undefined,
    mode: "all",
    reValidateMode: "onSubmit",
    criteriaMode: "all",
  });

  const { errors, isValid } = formState;

  useEffect(() => {
    if (props.item) {
      if (props.item.aditional_form && props.item.aditional_form.length > 0) {
        props.item.aditional_form.forEach((field: any) => {
          if (!field.uuid) {
            field.uuid = crypto.randomUUID();
          }
        });
        setEnableAditionalFields(true);
        setAditionalFields(props.item.aditional_form);
      }
      if (props.item.limit_type) {
        setSelectedTicketLimit(props.item.limit_type);
      }
      if (props.item.limit_date_init) {
        if (
          new Date(props.item.limit_date_init)
            .toLocaleTimeString()
            .split(":")[0] === "0"
        ) {
          setLimitDateInit(
            new Date(props.item.limit_date_init).toISOString().split("T")[0] +
              "T" +
              "0" +
              new Date(props.item.limit_date_init).toLocaleTimeString("es"),
          );
        } else {
          setLimitDateInit(
            new Date(props.item.limit_date_init).toISOString().split("T")[0] +
              "T" +
              new Date(props.item.limit_date_init).toLocaleTimeString("es"),
          );
        }
      }
      if (props.item.limit_date_end) {
        if (
          new Date(props.item.limit_date_end)
            .toLocaleTimeString()
            .split(":")[0] === "0"
        ) {
          setLimitDateEnd(
            new Date(props.item.limit_date_end).toISOString().split("T")[0] +
              "T" +
              "0" +
              new Date(props.item.limit_date_end).toLocaleTimeString("es"),
          );
        } else {
          setLimitDateEnd(
            new Date(props.item.limit_date_end).toISOString().split("T")[0] +
              "T" +
              new Date(props.item.limit_date_end).toLocaleTimeString("es"),
          );
        }
      }
      setSelectedTicketType(props.item.type);
      setIsFree(props.item.is_free);
      setEnable(props.item.enabled);
    }
  }, [props.item]);

  useEffect(() => {
    setIsOpen(props.openModal);
  }, [props.openModal]);

  const close = () => {
    setIsOpen(false);
    props.closeModal();
  };

  const handleAditionalFields = () => {
    const defaultFields = [...aditionalFields];
    const newField = {
      title: "",
      type: "TEXT",
      required: true,
      uuid: crypto.randomUUID(),
    };
    defaultFields.push(newField);
    setAditionalFields(defaultFields);
  };

  const editAditionalField = (index: any, property: any, data: any) => {
    const defaultFields = [...aditionalFields];
    defaultFields[index][property] = data;
    setAditionalFields(defaultFields);
  };

  const deleteAditionalFields = (index: any) => {
    const defaultFields = [...aditionalFields];
    defaultFields.splice(index, 1);
    setAditionalFields(defaultFields);
  };

  const onSave = () => {
    const data = getValues();
    const ticketData: any = {
      title: data.title,
      description: data.description,
      capacity: data.capacity,
      type: data.type,
      price: !isFree ? data.price : 0,
      amount_min: data.amount_min,
      amount_max: data.amount_max,
      is_free: isFree,
      enabled: enable,
      aditional_form: aditionalFields.length > 0 ? aditionalFields : null,
      limit_type:
        selectedTicketType === "SUBSCRIPTION" ? selectedTicketLimit : null,
      group_id: userGroupId,
      limit_date_init:
        selectedTicketType === "SUBSCRIPTION" && selectedTicketLimit === "DATE"
          ? new Date(limitDateInit)
          : null,
      limit_date_end:
        selectedTicketType === "SUBSCRIPTION" && selectedTicketLimit === "DATE"
          ? new Date(limitDateEnd)
          : null,
    };
    if (!props.item) {
      props.onCreateTicket(ticketData);
      close();
    } else {
      if (props.item.id) {
        ticketData.id = props.item.id;
      }
      props.onUpdateTicket(ticketData, props.index);
      close();
    }
  };

  const deleteTicket = () => {
    props.onDeleteTicket(props.item, props.index);
    close();
  };

  return (
    <Modal dismissible onClose={() => close()} show={isOpen}>
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        Crear / Editar entrada
      </Modal.Header>
      <Modal.Body className="max-h-[70vh]">
        <Tabs.Group>
          <Tabs.Item title="Detalles">
            <div>
              <Label color={errors.title && "failure"}>Título *</Label>
              <div className="mt-1">
                <TextInput
                  {...register("title", {
                    required: t("FORM_ERROR_MSG_REQUIRED"),
                  })}
                  color={errors.title && "failure"}
                />
                <ErrorMessage
                  errors={errors}
                  name="title"
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
            </div>
            <div className="mt-4">
              <Label>Descripción</Label>
              <div className="mt-1">
                <Textarea {...register("description")} />
              </div>
            </div>

            <div className="flex gap-4 w-full mt-4">
              <div className="w-full">
                <Label color={errors.capacity && "failure"}>
                  Cantidad a la venta *
                </Label>
                <div className="mt-1">
                  <TextInput
                    type="number"
                    min={0}
                    {...register("capacity", {
                      required: t("FORM_ERROR_MSG_REQUIRED"),
                    })}
                    color={errors.capacity && "failure"}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="capacity"
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
              </div>

              <div className="w-full">
                <Label>Tipo</Label>
                <div className="mt-1">
                  <Select
                    {...register("type")}
                    onChange={(e) =>
                      setSelectedTicketType(e.currentTarget.value)
                    }
                  >
                    <option value="SUBSCRIPTION">Abono</option>
                    <option value="TICKET">Entrada</option>
                  </Select>
                </div>
              </div>
            </div>

            {selectedTicketType === "SUBSCRIPTION" ? (
              <div className="mt-4">
                <Label>Tipo de límite</Label>
                <div className="mt-1">
                  <Select
                    value={selectedTicketLimit}
                    onChange={(e) =>
                      setSelectedTicketLimit(e.currentTarget.value)
                    }
                  >
                    <option value="DAY">Usos por dia</option>
                    <option value="UNITY">Unitario</option>
                    <option value="DATE">Fecha</option>
                  </Select>
                </div>
              </div>
            ) : null}
            {selectedTicketType === "SUBSCRIPTION" &&
            (selectedTicketLimit === "UNITY" ||
              selectedTicketLimit === "DAY") ? (
              <div className="mt-4">
                <Label>Limite de usos del abono</Label>
                <div className="mt-1">
                  <TextInput type="number" />
                </div>
              </div>
            ) : null}
            {selectedTicketType === "SUBSCRIPTION" &&
            selectedTicketLimit === "DATE" ? (
              <div className="flex gap-4 mt-4">
                <div className="w-full">
                  <Label>Utilizable desde</Label>
                  <div className="mt-1">
                    <TextInput
                      type="datetime-local"
                      defaultValue={limitDateInit}
                      onChange={(e) => setLimitDateInit(e.currentTarget.value)}
                    />
                  </div>
                </div>
                <div className="w-full">
                  <Label>Hasta</Label>
                  <div className="mt-1">
                    <TextInput
                      type="datetime-local"
                      defaultValue={limitDateEnd}
                      onChange={(e) => setLimitDateEnd(e.currentTarget.value)}
                    />
                  </div>
                </div>
              </div>
            ) : null}
            <div className="flex gap-4 w-full mt-4">
              <div className="w-full">
                <Label color={errors.amount_min && "failure"}>
                  Compra mínima
                </Label>
                <div className="mt-1 w-full">
                  <TextInput
                    color={errors.amount_min && "failure"}
                    {...register("amount_min", {
                      required: t("FORM_ERROR_MSG_REQUIRED"),
                    })}
                    type="number"
                  />
                  <ErrorMessage
                    errors={errors}
                    name="amount_min"
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
              </div>
              <div className="w-full">
                <Label color={errors.amount_min && "failure"}>
                  Compra máxima
                </Label>
                <div className="mt-1 w-full">
                  <TextInput
                    color={errors.amount_min && "failure"}
                    {...register("amount_max", {
                      required: t("FORM_ERROR_MSG_REQUIRED"),
                    })}
                    type="number"
                  />
                  <ErrorMessage
                    errors={errors}
                    name="amount_max"
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
              </div>
            </div>

            <div className="mt-6">
              <ToggleSwitch
                checked={isFree}
                onChange={(e) => setIsFree(e)}
                label="Gratuito"
              />
            </div>
            {!isFree ? (
              <div className="mt-4">
                <Label>Precio de la entrada/abono</Label>
                <div className="mt-1">
                  <TextInput type="number" min="0" {...register("price")} />
                </div>
              </div>
            ) : null}
            <div className="mt-6">
              <ToggleSwitch
                checked={enable}
                onChange={(e) => setEnable(e)}
                label="Habilitado"
              />
            </div>
          </Tabs.Item>
          <Tabs.Item title="Formulario">
            <div className="flex justify-between gap-4 pb-6">
              <div>
                <ToggleSwitch
                  checked={enableAditionalFields}
                  onChange={(e) => setEnableAditionalFields(e)}
                  label="Habilitar campos adicionales"
                />
              </div>
              {enableAditionalFields && (
                <div className="flex justify-end">
                  <div>
                    <div className="flex">
                      <LuPlus className="mt-1.5 mr-1 text-blue-700 font-bold" />
                      <a
                        className="text-blue-700 cursor-pointer"
                        onClick={handleAditionalFields}
                      >
                        Añadir campo
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {enableAditionalFields ? (
              <>
                {/*  <div className="flex justify-end">
                  <div>
                  <div className="flex">
                  <LuPlus className="mt-1.5 mr-1 text-blue-700 font-bold" />
                  <a
                    className="text-blue-700 cursor-pointer"
                    onClick={handleAditionalFields}
                  >
                    Añadir campo
                  </a>
                </div>
                  </div>
                </div> */}
                {aditionalFields.length > 0 ? (
                  <>
                    <div className="flex gap-4 mt-2">
                      <div className="w-1/3">Título del campo</div>
                      <div className="w-1/3">Tipo</div>
                      <div className="w-1/3">Obligatorio</div>
                    </div>
                    {aditionalFields.map((field, index) => (
                      <div key={field.uuid} className="flex gap-4 mt-4">
                        <div className="w-1/3">
                          <TextInput
                            defaultValue={field.title}
                            onChange={(e) =>
                              editAditionalField(
                                index,
                                "title",
                                e.currentTarget.value,
                              )
                            }
                          />
                        </div>
                        <div className="w-1/3">
                          <Select
                            value={field.type}
                            onChange={(e) =>
                              editAditionalField(
                                index,
                                "type",
                                e.currentTarget.value,
                              )
                            }
                          >
                            <option value="TEXT">Texto</option>
                            <option value="IMAGE">Imagen</option>
                          </Select>
                        </div>
                        <div className="w-1/3 flex justify-center items-center gap-4">
                          <Checkbox
                            checked={field.required}
                            onChange={(e) =>
                              editAditionalField(
                                index,
                                "required",
                                e.currentTarget.checked,
                              )
                            }
                          />
                          <Button
                            onClick={() => deleteAditionalFields(index)}
                            className="ml-12"
                            color="failure"
                            size={"xs"}
                          >
                            <HiTrash />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </>
                ) : null}
              </>
            ) : null}
          </Tabs.Item>
        </Tabs.Group>
      </Modal.Body>
      <Modal.Footer className="flex justify-between">
        {props.item ? (
          <div>
            <Button size={"sm"} onClick={deleteTicket} color="light">
              <div className="flex items-center gap-x-2 text-red-500">
                <HiTrash className="text-sm text-red-500" />
                Eliminar
              </div>
            </Button>
          </div>
        ) : null}
        <div className="flex justify-end">
          <Button
            size={"sm"}
            onClick={onSave}
            disabled={!isValid}
            color="primary"
          >
            Guardar
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
