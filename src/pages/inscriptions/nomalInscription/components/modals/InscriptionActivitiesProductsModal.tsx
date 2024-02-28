/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorMessage } from "@hookform/error-message";
import {
  Button,
  Checkbox,
  Label,
  Modal,
  Select,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HiTrash, HiXCircle } from "react-icons/hi";

interface InscriptionActivitiesProductsModalProps {
  item?: any;
  openModal: boolean;
  onCloseModal: (data: any) => void;
  editedRowIndex?: number | undefined;
  setInputs: (data: any, editedRowIndex: number | undefined) => void;
  activitiesLength?: number;
}

export const InscriptionActivitiesProductsModal = (
  props: InscriptionActivitiesProductsModalProps,
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState(
    props.item ? props.item.advanced : false,
  );
  const [enable, setEnable] = useState(props.item ? props.item.enabled : true);
  const [required, setRequired] = useState(
    props.item ? props.item.required : false,
  );
  const [waitingList, setWaitingList] = useState(
    props.item ? props.item.waiting_list : false,
  );
  const [discounts, setDiscounts] = useState(
    props.item ? props.item.applicable_discounts : false,
  );
  const [yearsTags, setYearsTags] = useState<number[]>(
    props.item && props.item.years ? props.item.years : [],
  );
  const [tagInput, setTagInput] = useState<string>();

  const [selectedDays, setSelectedDays] = useState<string[]>(
    props.item && props.item.days ? props.item.days : [],
  );

  const [timeInit, setTimeInit] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [activityOrder, setActivityOrder] = useState(
    props.item ? props.item.order : props.activitiesLength,
  );

  const [paymentType, setPaymentType] = useState(
    props.item && props.item.payment_type ? props.item.payment_type : "UNIQUE",
  );
  const [aditionalPaymentDeadlines, setAditionalPaymentDeadlines] = useState<
    any[]
  >(
    props.item && props.item.aditional_deadlines
      ? JSON.parse(props.item.aditional_deadlines)
      : [],
  );
  const [selectedPaymentDateType, setSelectedPaymentDateType] = useState(
    props.item && props.item.first_payment_date_type
      ? props.item.first_payment_date_type
      : "INSCRIPTION_MOMENT",
  );
  const [firstPaymentDate, setFirstpaymentDate] = useState<any>("");

  const { t } = useTranslation();

  const { handleSubmit, register, formState, reset, setValue } = useForm<any>({
    values: props.item ?? undefined,
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "all",
  });

  const { errors } = formState;
  const { isValid } = formState;

  useEffect(() => {
    reset();
    setIsOpen(props.openModal);
  }, [props.openModal]);

  useEffect(() => {
    if (props.item) {
      props.item.time_init
        ? setTimeInit(props.item.time_init.split("+")[0])
        : null;
      props.item.time_end
        ? setTimeEnd(props.item.time_end.split("+")[0])
        : null;
      props.item.first_payment_date
        ? setFirstpaymentDate(
            new Date(props.item.first_payment_date)
              .toISOString()
              .split("T")[0] +
              "T" +
              new Date(props.item.first_payment_date).toLocaleTimeString(),
          )
        : null;
    }
  }, [props.item]);

  useEffect(() => {
    if (!props.item) {
      if (paymentType === "FREE") {
        setValue("price", 0);
      } else {
        setValue("price", null);
      }
    }
  }, [paymentType]);

  const close = () => {
    reset();
    setIsOpen(false);
    props.onCloseModal(true);
  };

  const onSubmit = (data: any) => {
    const newProductForm = {
      title: data.title,
      places: data.places,
      price: paymentType !== "RECURRENT" ? data.price : null,
      required: required,
      enabled: enable,
      advanced: advancedOptions,
      applicable_discounts: discounts,
      days: selectedDays && selectedDays.length > 0 ? selectedDays : null,
      is_additional: false,
      observations: data.observations ? data.observations : null,
      order: activityOrder,
      place: data.place ? data.place : null,
      teacher: data.teacher ? data.teacher : null,
      time_end: data.time_end ? data.time_end : null,
      time_init: data.time_init ? data.time_init : null,
      waiting_list: waitingList,
      years: yearsTags && yearsTags.length > 0 ? yearsTags : null,
      unique: false,
      payment_period:
        paymentType === "RECURRENT" ? data.payment_period : "NULL",
      first_payment_date_type:
        paymentType === "RECURRENT" ? selectedPaymentDateType : "NULL",
      first_payment_date:
        firstPaymentDate !== "" ? new Date(firstPaymentDate) : null,
      first_payment_amount: data.first_payment_amount
        ? data.first_payment_amount
        : null,
      aditional_deadlines:
        aditionalPaymentDeadlines.length > 0
          ? JSON.stringify(aditionalPaymentDeadlines)
          : null,
      payment_type: paymentType,
    };
    props.setInputs(newProductForm, props.editedRowIndex!);
    close();
  };

  const handleTagInputBlur = () => {
    if (tagInput !== undefined && tagInput.trim() !== "") {
      setYearsTags([...yearsTags, parseInt(tagInput)]);
      setTagInput("");
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      if (tagInput !== undefined && tagInput.trim() !== "") {
        setYearsTags([...yearsTags, parseInt(tagInput.trim())]);
        setTagInput("");
      }
    }
  };

  const handleDayCheckboxChange = (day: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedDays([...selectedDays, day]);
    } else {
      setSelectedDays(
        selectedDays.filter((selectedDay) => selectedDay !== day),
      );
    }
  };

  const changeTimeInit = (value: any) => {
    setTimeInit(value);
    setValue("time_init", value);
  };

  const changeTimeEnd = (value: any) => {
    setTimeEnd(value);
    setValue("time_end", value);
  };

  const changeOrder = (value: any) => {
    setActivityOrder(parseInt(value));
    setValue("order", value);
  };

  const handleAditionalDeadline = () => {
    const newDeadline = {
      amount: 0,
      payment_date: null,
      uuid: crypto.randomUUID(),
    };
    setAditionalPaymentDeadlines([...aditionalPaymentDeadlines, newDeadline]);
  };

  const updateAditionalDeadline = (index: any, property: any, data: any) => {
    const defaultAditionalDeadlines = [...aditionalPaymentDeadlines];
    defaultAditionalDeadlines[index][property] = data;
    setAditionalPaymentDeadlines(defaultAditionalDeadlines);
  };

  const deleteAditionalDeadline = (index: number) => {
    const deadlines = [...aditionalPaymentDeadlines];
    deadlines.splice(index, 1);
    setAditionalPaymentDeadlines(deadlines);
  };

  return (
    <Modal dismissible onClose={() => close()} show={isOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          {t("ADD_EDIT_INSCRIPTION_PRODUCT")}
        </Modal.Header>
        <Modal.Body className="max-h-[70vh] overflow-auto">
          {/* SIN OPCIONES AVANZADAS */}
          {!advancedOptions ? (
            <>
              <div className="flex flex-grow gap-6 justify-start mb-2">
                <div>
                  <ToggleSwitch
                    id={"required"}
                    checked={required}
                    label={t("MANDATORY")}
                    onChange={setRequired}
                  />
                </div>

                <div>
                  <ToggleSwitch
                    id={"enable"}
                    checked={enable}
                    label={t("ENABLE")}
                    onChange={setEnable}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2 mr-4">
                  <Label htmlFor="title" color={errors.title && "failure"}>
                    {t("INSCRIPTION_PRODUCT_NAME")} *{" "}
                  </Label>
                  <div className="mt-1">
                    <TextInput
                      id="title"
                      placeholder={t("INSCRIPTION_PRODUCT_NAME")}
                      {...register("title", {
                        required: t("FORM_ERROR_MSG_REQUIRED"),
                      })}
                      color={errors.title && "failure"}
                    />
                  </div>
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

                <div>
                  <Label htmlFor="price" color={errors.price && "failure"}>
                    {t("INSCRIPTION_PRODUCT_PAYMENT_TYPE")} *
                  </Label>
                  <div className="mt-1">
                    <Select
                      value={paymentType}
                      onChange={(e) => setPaymentType(e.currentTarget.value)}
                    >
                      <option value="FREE">
                        {t("INSCRIPTION_PRODUCT_PAYMENT_FREE")}
                      </option>
                      <option value="UNIQUE">
                        {t("INSCRIPTION_PRODUCT_PAYMENT_UNIQUE")}
                      </option>
                      <option value="RECURRENT">
                        {t("INSCRIPTION_PRODUCT_PAYMENT_RECURRENT")}
                      </option>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex">
                <div className="w-full">
                  <Label htmlFor="places" color={errors.places && "failure"}>
                    {t("INSCRIPTION_PRODUCT_PLACES")} *
                  </Label>
                  <div className="mt-1">
                    <Select
                      id="places"
                      {...register("places", {
                        required: t("FORM_ERROR_MSG_REQUIRED"),
                      })}
                      color={errors.places && "failure"}
                    >
                      {[...Array(200).keys()].map((item) => (
                        <option key={item} value={item + 1}>
                          {item + 1}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="places"
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

              <div className="mt-1">
                {paymentType === "UNIQUE" ? (
                  <div>
                    <Label htmlFor="price" color={errors.price && "failure"}>
                      {t("INSCRIPTION_PRODUCT_PRICE")} *
                    </Label>
                    <div className="mt-1">
                      <TextInput
                        id="price"
                        placeholder={t("INSCRIPTION_PRODUCT_PRICE_PLACEHOLDER")}
                        type="number"
                        {...register("price", {
                          required: t("FORM_ERROR_MSG_REQUIRED"),
                        })}
                        color={errors.price && "failure"}
                      />
                    </div>
                    <ErrorMessage
                      errors={errors}
                      name="price"
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
                ) : paymentType === "RECURRENT" ? (
                  <>
                    <div className="w-full">
                      <Label>{t("INSCRIPTION_PRODUCT_PAYMENT_PERIOD")}</Label>
                      <div className="mt-1">
                        <Select
                          {...register("payment_period", {
                            required: t("FORM_ERROR_MSG_REQUIRED"),
                          })}
                        >
                          <option value="SEMESTRAL">Semestral</option>
                          <option value="TRIMESTRAL">Trimestral</option>
                          <option value="CUATRIMESTRAL">Cuatrimestral</option>
                        </Select>
                      </div>
                    </div>
                    <div className="mt-2 border-b-2 pb-2">
                      <h1 className="border-b-2 pb-2">1º pago</h1>
                      <div className="flex gap-4">
                        <div className="mt-2 w-full">
                          <Label>
                            Selecciona cuando se hará el primer pago
                          </Label>
                          <div className="mt-1">
                            <Select
                              value={selectedPaymentDateType}
                              onChange={(e) =>
                                setSelectedPaymentDateType(
                                  e.currentTarget.value,
                                )
                              }
                            >
                              <option value="INSCRIPTION_MOMENT">
                                En la fecha de la inscripción
                              </option>
                              <option value="MANUAL">Fecha manual</option>
                            </Select>
                          </div>
                        </div>
                        <div className="mt-2 w-full">
                          <Label
                            htmlFor="price"
                            color={errors.price && "failure"}
                          >
                            Cantidad € *
                          </Label>
                          <div className="mt-1 w-full">
                            <TextInput
                              id="price"
                              placeholder={"Cantidad €"}
                              type="number"
                              {...register("first_payment_amount", {
                                required: t("FORM_ERROR_MSG_REQUIRED"),
                              })}
                              color={errors.price && "failure"}
                            />
                          </div>
                        </div>
                      </div>
                      {selectedPaymentDateType === "MANUAL" ? (
                        <div className="mt-1">
                          <Label>Selecciona la fecha del pago</Label>
                          <div className="mt-1">
                            <TextInput
                              defaultValue={firstPaymentDate}
                              onChange={(e) =>
                                setFirstpaymentDate(e.currentTarget.value)
                              }
                              type="datetime-local"
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                    {aditionalPaymentDeadlines.length > 0
                      ? aditionalPaymentDeadlines.map((deadline, index) => (
                          <React.Fragment key={deadline.uuid}>
                            <div className="border-b-2 py-4">
                              <h1>{index + 2}º pago</h1>
                              <div className="flex gap-4">
                                <div className="w-2/3">
                                  <Label>Selecciona la fecha del pago</Label>
                                  <div className="mt-1">
                                    <TextInput
                                      type="datetime-local"
                                      defaultValue={deadline.payment_date}
                                      onChange={(e) =>
                                        updateAditionalDeadline(
                                          index,
                                          "payment_date",
                                          e.currentTarget.value,
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="w-1/3 flex gap-2">
                                  <div>
                                    <Label>Cantidad a pagar</Label>
                                    <div className="mt-1">
                                      <TextInput
                                        type="number"
                                        defaultValue={deadline.amount}
                                        onChange={(e) =>
                                          updateAditionalDeadline(
                                            index,
                                            "amount",
                                            e.currentTarget.value,
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                  {index ===
                                  aditionalPaymentDeadlines.length - 1 ? (
                                    <div className="flex items-center">
                                      <div className="mt-6">
                                        <Button
                                          onClick={() =>
                                            deleteAditionalDeadline(index)
                                          }
                                          color="failure"
                                        >
                                          <HiTrash />
                                        </Button>
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </React.Fragment>
                        ))
                      : null}
                    <div className="mt-4 flex justify-center">
                      <Button onClick={handleAditionalDeadline}>
                        Añadir pago
                      </Button>
                    </div>
                  </>
                ) : null}
              </div>
            </>
          ) : (
            /* CON OPCIONES AVANZADAS */
            <div>
              <div className="flex justify-start gap-8">
                <div>
                  <ToggleSwitch
                    id={"required"}
                    checked={required}
                    label={t("MANDATORY")}
                    onChange={setRequired}
                  />
                </div>

                <div>
                  <ToggleSwitch
                    id={"enable"}
                    checked={enable}
                    label={t("ENABLE")}
                    onChange={setEnable}
                  />
                </div>
              </div>
              <div className="mt-2">
                <Label htmlFor="title" color={errors.title && "failure"}>
                  {t("INSCRIPTION_PRODUCT_NAME")} *
                </Label>
                <div className="mt-1">
                  <TextInput
                    id="title"
                    placeholder={t("INSCRIPTION_PRODUCT_NAME")}
                    {...register("title", {
                      required: t("FORM_ERROR_MSG_REQUIRED"),
                    })}
                    color={errors.title && "failure"}
                  />
                </div>
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                <div>
                  <Label htmlFor="price" color={errors.price && "failure"}>
                    {t("INSCRIPTION_PRODUCT_PAYMENT_TYPE")} *
                  </Label>
                  <div className="mt-1">
                    <Select
                      value={paymentType}
                      onChange={(e) => setPaymentType(e.currentTarget.value)}
                    >
                      <option value="FREE">
                        {t("INSCRIPTION_PRODUCT_PAYMENT_FREE")}
                      </option>
                      <option value="UNIQUE">
                        {t("INSCRIPTION_PRODUCT_PAYMENT_UNIQUE")}
                      </option>
                      <option value="RECURRENT">
                        {t("INSCRIPTION_PRODUCT_PAYMENT_RECURRENT")}
                      </option>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="places" color={errors.places && "failure"}>
                    {t("INSCRIPTION_PRODUCT_PLACES")} *
                  </Label>
                  <div className="mt-1">
                    <Select
                      id="places"
                      {...register("places", {
                        required: t("FORM_ERROR_MSG_REQUIRED"),
                      })}
                      color={errors.places && "failure"}
                    >
                      {[...Array(200).keys()].map((item) => (
                        <option key={item} value={item + 1}>
                          {item + 1}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="places"
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

              <div className="mt-1">
                {paymentType === "UNIQUE" ? (
                  <div>
                    <Label htmlFor="price" color={errors.price && "failure"}>
                      {t("INSCRIPTION_PRODUCT_PRICE")} *
                    </Label>
                    <div className="mt-1">
                      <TextInput
                        id="price"
                        placeholder={t("INSCRIPTION_PRODUCT_PRICE_PLACEHOLDER")}
                        type="number"
                        {...register("price", {
                          required: t("FORM_ERROR_MSG_REQUIRED"),
                        })}
                        color={errors.price && "failure"}
                      />
                    </div>
                    <ErrorMessage
                      errors={errors}
                      name="price"
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
                ) : paymentType === "RECURRENT" ? (
                  <>
                    <div className="w-full">
                      <Label>{t("INSCRIPTION_PRODUCT_PAYMENT_PERIOD")}</Label>
                      <div className="mt-1">
                        <Select
                          {...register("payment_period", {
                            required: t("FORM_ERROR_MSG_REQUIRED"),
                          })}
                        >
                          <option value="SEMESTRAL">Semestral</option>
                          <option value="TRIMESTRAL">Trimestral</option>
                          <option value="CUATRIMESTRAL">Cuatrimestral</option>
                        </Select>
                      </div>
                    </div>
                    <div className="mt-2 border-b-2 pb-2">
                      <h1 className="border-b-2 pb-2">1º pago</h1>
                      <div className="flex gap-4">
                        <div className="mt-2 w-full">
                          <Label>
                            Selecciona cuando se hará el primer pago
                          </Label>
                          <div className="mt-1">
                            <Select
                              value={selectedPaymentDateType}
                              onChange={(e) =>
                                setSelectedPaymentDateType(
                                  e.currentTarget.value,
                                )
                              }
                            >
                              <option value="INSCRIPTION_MOMENT">
                                En la fecha de la inscripción
                              </option>
                              <option value="MANUAL">Fecha manual</option>
                            </Select>
                          </div>
                        </div>
                        <div className="mt-2 w-full">
                          <Label
                            htmlFor="price"
                            color={errors.price && "failure"}
                          >
                            Cantidad € *
                          </Label>
                          <div className="mt-1 w-full">
                            <TextInput
                              id="price"
                              placeholder={"Cantidad €"}
                              type="number"
                              {...register("first_payment_amount", {
                                required: t("FORM_ERROR_MSG_REQUIRED"),
                              })}
                              color={errors.price && "failure"}
                            />
                          </div>
                        </div>
                      </div>
                      {selectedPaymentDateType === "MANUAL" ? (
                        <div className="mt-1">
                          <Label>Selecciona la fecha del pago</Label>
                          <div className="mt-1">
                            <TextInput
                              defaultValue={firstPaymentDate}
                              onChange={(e) =>
                                setFirstpaymentDate(e.currentTarget.value)
                              }
                              type="datetime-local"
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                    {aditionalPaymentDeadlines.length > 0
                      ? aditionalPaymentDeadlines.map((deadline, index) => (
                          <React.Fragment key={deadline.uuid}>
                            <div className="border-b-2 py-4">
                              <h1>{index + 2}º pago</h1>
                              <div className="flex gap-4">
                                <div className="w-2/3">
                                  <Label>Selecciona la fecha del pago</Label>
                                  <div className="mt-1">
                                    <TextInput
                                      type="datetime-local"
                                      defaultValue={deadline.payment_date}
                                      onChange={(e) =>
                                        updateAditionalDeadline(
                                          index,
                                          "payment_date",
                                          e.currentTarget.value,
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="w-1/3 flex gap-2">
                                  <div>
                                    <Label>Cantidad a pagar</Label>
                                    <div className="mt-1">
                                      <TextInput
                                        type="number"
                                        defaultValue={deadline.amount}
                                        onChange={(e) =>
                                          updateAditionalDeadline(
                                            index,
                                            "amount",
                                            e.currentTarget.value,
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                  {index ===
                                  aditionalPaymentDeadlines.length - 1 ? (
                                    <div className="flex items-center">
                                      <div className="mt-6">
                                        <Button
                                          onClick={() =>
                                            deleteAditionalDeadline(index)
                                          }
                                          color="failure"
                                        >
                                          <HiTrash />
                                        </Button>
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </React.Fragment>
                        ))
                      : null}
                    <div className="mt-4 flex justify-center">
                      <Button onClick={handleAditionalDeadline}>
                        Añadir pago
                      </Button>
                    </div>
                  </>
                ) : null}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 justify-between items-start mt-8">
                <div className="sm:col-span-2 mr-4">
                  <ToggleSwitch
                    id={"applicable_discounts"}
                    checked={discounts}
                    label={t("INSCRIPTION_PRODUCT_APPLICABLE_DISCOUNTS")}
                    onChange={setDiscounts}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {t("INSCRIPTION_PRODUCT_APPLICABLE_DISCOUNTS_MESSAGE")}
                  </p>
                </div>

                <div>
                  <ToggleSwitch
                    id={"waiting_list"}
                    checked={waitingList}
                    label={t("INSCRIPTION_PRODUCT_WAITING_LIST")}
                    onChange={setWaitingList}
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label>{t("INSCRIPTION_PRODUCT_YEARS_BORN")}</Label>
                <div className="mt-1">
                  <div className="flex flex-wrap gap-2 pb-2">
                    {yearsTags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-100 rounded-full px-2 py-1"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setYearsTags(
                              yearsTags.filter((_, i) => i !== index),
                            )
                          }
                          className="ml-1 text-gray-500"
                        >
                          <HiXCircle />
                        </button>
                      </div>
                    ))}
                  </div>
                  <TextInput
                    id="tagInput"
                    type="number"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    onBlur={handleTagInputBlur}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t("INSCRIPTION_PRODUCT_YEARS_BORN_MESSAGE")}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-lg">
                  <span className="font-bold">
                    {t("INSCRIPTION_PRODUCT_CALENDAR")}
                  </span>
                  <span className="mt-1 text-xs text-gray-500">
                    {t("INSCRIPTION_PRODUCT_CALENDAR_MESSAGE")}
                  </span>
                </p>
                <div className="flex gap-4 mt-4">
                  <div className="w-1/3 mt-1">
                    <div>
                      <Checkbox
                        defaultChecked={
                          props.item && props.item.days
                            ? props.item.days.includes("MONDAY")
                            : false
                        }
                        onChange={(e) =>
                          handleDayCheckboxChange("MONDAY", e.target.checked)
                        }
                      />
                      <Label className="ml-2">{t("MONDAY")}</Label>
                    </div>
                    <div className="mt-1">
                      <Checkbox
                        defaultChecked={
                          props.item && props.item.days
                            ? props.item.days.includes("TUESDAY")
                            : false
                        }
                        onChange={(e) =>
                          handleDayCheckboxChange("TUESDAY", e.target.checked)
                        }
                      />
                      <Label className="ml-2">{t("TUESDAY")}</Label>
                    </div>
                    <div className="mt-1">
                      <Checkbox
                        defaultChecked={
                          props.item && props.item.days
                            ? props.item.days.includes("WEDNESDAY")
                            : false
                        }
                        onChange={(e) =>
                          handleDayCheckboxChange("WEDNESDAY", e.target.checked)
                        }
                      />
                      <Label className="ml-2">{t("WEDNESDAY")}</Label>
                    </div>
                    <div className="mt-1">
                      <Checkbox
                        defaultChecked={
                          props.item && props.item.days
                            ? props.item.days.includes("THURSDAY")
                            : false
                        }
                        onChange={(e) =>
                          handleDayCheckboxChange("THURSDAY", e.target.checked)
                        }
                      />
                      <Label className="ml-2">{t("THURSDAY")}</Label>
                    </div>
                    <div className="mt-1">
                      <Checkbox
                        defaultChecked={
                          props.item && props.item.days
                            ? props.item.days.includes("FRIDAY")
                            : false
                        }
                        onChange={(e) =>
                          handleDayCheckboxChange("FRIDAY", e.target.checked)
                        }
                      />
                      <Label className="ml-2">{t("FRIDAY")}</Label>
                    </div>
                    <div className="mt-1">
                      <Checkbox
                        defaultChecked={
                          props.item && props.item.days
                            ? props.item.days.includes("SATURDAY")
                            : false
                        }
                        onChange={(e) =>
                          handleDayCheckboxChange("SATURDAY", e.target.checked)
                        }
                      />
                      <Label className="ml-2">{t("SATURDAY")}</Label>
                    </div>
                    <div className="mt-1">
                      <Checkbox
                        defaultChecked={
                          props.item && props.item.days
                            ? props.item.days.includes("SUNDAY")
                            : false
                        }
                        onChange={(e) =>
                          handleDayCheckboxChange("SUNDAY", e.target.checked)
                        }
                      />
                      <Label className="ml-2">{t("SUNDAY")}</Label>
                    </div>
                  </div>
                  <div className="w-2/3">
                    <div>
                      <Label htmlFor="time_init">
                        {t("INSCRIPTION_PRODUCT_HOUR_INIT")}
                      </Label>
                      <div className="mt-1">
                        <TextInput
                          id="time_init"
                          type="time"
                          defaultValue={timeInit}
                          onChange={(e) =>
                            changeTimeInit(e.currentTarget.value)
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="time_end">
                        {t("INSCRIPTION_PRODUCT_HOUR_END")}
                      </Label>
                      <div className="mt-1">
                        <TextInput
                          id="time_end"
                          type="time"
                          defaultValue={timeEnd}
                          onChange={(e) => changeTimeEnd(e.currentTarget.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 justify-between mt-8">
                <div className="mr-4">
                  <Label htmlFor="place">
                    {t("INSCRIPTION_PRODUCT_PLACE")}
                  </Label>
                  <div className="mt-1">
                    <TextInput
                      id="place"
                      placeholder={t("INSCRIPTION_PRODUCT_PLACE")}
                      {...register("place")}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="teacher">
                    {t("INSCRIPTION_PRODUCT_TEACHER")}
                  </Label>
                  <div className="mt-1">
                    <TextInput
                      id="teacher"
                      placeholder={t("INSCRIPTION_PRODUCT_TEACHER")}
                      {...register("teacher")}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div>
                  <Label htmlFor="observations">
                    {t("INSCRIPTION_PRODUCT_OBSERVATIONS")}
                  </Label>
                  <div className="mt-1">
                    <TextInput
                      id="observations"
                      placeholder={t("INSCRIPTION_PRODUCT_OBSERVATIONS")}
                      {...register("observations")}
                    />
                  </div>
                </div>
              </div>

              <div className="flex w-full">
                <div className="mt-4 w-full">
                  <Label htmlFor="order">
                    {t("INSCRIPTION_PRODUCT_ORDER")}
                  </Label>
                  <div className="mt-1">
                    <TextInput
                      id="order"
                      placeholder={t("INSCRIPTION_PRODUCT_ORDER")}
                      type="number"
                      defaultValue={activityOrder}
                      onChange={(e) => changeOrder(e.currentTarget.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex flex-grow justify-between items-center">
            <div>
              <ToggleSwitch
                id="advanced"
                checked={advancedOptions}
                onChange={(e) => setAdvancedOptions(e)}
                label={t("INSCRIPTION_PRODUCT_ADVANCED_OPTIONS")}
              />
            </div>
            <div className="flex gap-4">
              <Button onClick={() => close()} color="light">
                {t("CANCEL")}
              </Button>
              <Button disabled={!isValid} type="submit" color="primary">
                {t("SAVE")}
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
