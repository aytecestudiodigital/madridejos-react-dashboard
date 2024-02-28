/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorMessage } from "@hookform/error-message";
import {
  Button,
  Label,
  Modal,
  Select,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface NewInputsProps {
  item?: any;
  openModal: boolean;
  closeModal: Function;
  inputs: any[];
  editedRowIndex?: number | undefined;
  setInputs: (data: any, editedRowIndex: number | undefined) => void;
}
export const NewInputFormModal = (props: NewInputsProps) => {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const [enable, setEnable] = useState(props.item ? props.item.enabled : true);
  const [required, setRequired] = useState(
    props.item ? props.item.required : false,
  );

  const { reset, handleSubmit, register, formState } = useForm<any>({
    values: props.item ?? undefined,
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "all",
  });

  const { errors } = formState;
  const { isValid } = formState;

  useEffect(() => {
    reset();
    setOpen(props.openModal);
  }, [props.openModal]);

  const close = () => {
    reset();
    setOpen(false);
    props.closeModal(true);
  };

  const onSubmit = (data: any) => {
    const newInputForm = {
      title: data.title,
      type: data.type,
      data_user: data.data_user,
      required: required,
      enabled: enable,
      deleteable: true,
      order: props.inputs.length,
    };
    props.setInputs(newInputForm, props.editedRowIndex!);
    close();
  };

  return (
    <>
      <Modal onClose={() => close()} show={isOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            Añadir/Editar campo
          </Modal.Header>
          <Modal.Body>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="pr-4">
                <Label htmlFor="title" color={errors.title && "failure"}>
                  Título *
                </Label>
                <div className="mt-1">
                  <TextInput
                    id="title"
                    placeholder={"Título del campo"}
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
                <Label htmlFor="placeholder">Descripción del campo</Label>
                <div className="mt-1">
                  <TextInput
                    id="placeholder"
                    placeholder={"Descripción del campo"}
                    {...register("placeholder")}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Label htmlFor="type">Valores</Label>
              <div className="mt-1">
                <TextInput
                  id="values"
                  placeholder={"Escribe los valores separados por comas"}
                  {...register("values")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="pr-4 pt-4">
                <Label htmlFor="type" color={errors.type && "failure"}>
                  Tipo *
                </Label>
                <div className="mt-1">
                  <Select
                    id="type"
                    {...register("type", {
                      required: t("FORM_ERROR_MSG_REQUIRED"),
                    })}
                  >
                    <option disabled className="font-bold">
                      {"Se autocompletará con los datos del usuario "}
                    </option>
                    <option value="NAME">{t("NAME")}</option>
                    <option value="SURNAME">{t("SURNAME")}</option>
                    <option value="EMAIL">{t("EMAIL")}</option>
                    <option value="PHONE">{t("PHONE")}</option>
                    <option value="LOCALITY">{t("LOCALITY")}</option>
                    <option value="PROVINCE">{t("PROVINCE")}</option>
                    <option value="ADDRESS">{t("ADDRESS")}</option>
                    <option value="POSTAL_CODE">{t("POSTAL_CODE")}</option>
                    <option value="DATE_BIRTH">{t("DATE_BIRTH")}</option>

                    <option disabled></option>
                    <option disabled className="font-bold">
                      {"No se autocompletará"}
                    </option>
                    <option value="STRING">{t("STRING")}</option>
                    <option value="INTEGER">{t("INTEGER")}</option>
                    <option value="FLOAT">{t("FLOAT")}</option>
                    <option value="DATE">{t("DATE")}</option>
                    <option value="LIST_SIMPLE">{t("LIST_SIMPLE")}</option>
                    <option value="LIST_MULTIPLE">{t("LIST_MULTIPLE")}</option>
                    <option value="BOOLEAN">{t("BOOLEAN")}</option>
                  </Select>
                </div>
                <ErrorMessage
                  errors={errors}
                  name="type"
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-end">
                <div className="pb-2">
                  <ToggleSwitch
                    id={"required"}
                    checked={required}
                    label={"Obligatorio"}
                    onChange={setRequired}
                  />
                </div>

                <div className="pb-2">
                  <ToggleSwitch
                    id={"enable"}
                    checked={enable}
                    label={"Habilitado"}
                    onChange={setEnable}
                  />
                </div>
              </div>

              {/*  <div className="pt-4">
                <Label htmlFor="data_user">Campo del usuario</Label>
                <div className="mt-1">
                  <div className="mt-1">
                    <Select id="data_user" {...register("data_user")}>
                      <option value="NINGUNO">NINGUNO</option>
                      <option value="NAME">NAME</option>
                      <option value="SURNAME">SURNAME</option>
                      <option value="EMAIL">EMAIL</option>
                      <option value="PHONE">PHONE</option>
                      <option value="ADDRESS">ADDRESS</option>
                      <option value="LOCALITY">LOCALITY</option>
                      <option value="POSTAL_CODE">POSTAL_CODE</option>
                      <option value="PROVINCE">PROVINCE</option>
                      <option value="DATE_BIRTH">DATE_BIRTH</option>
                      <option value="STRING">STRING</option>
                      <option value="LIST_SIMPLE">LIST_SIMPLE</option>
                      <option value="LIST_MULTIPLE">LIST_MULTIPLE</option>
                      <option value="BOOLEAN">BOOLEAN</option>
                      <option value="INTEGER">INTEGER</option>
                      <option value="FLOAT">FLOAT</option>
                      <option value="DATE">DATE</option>
                    </Select>
                  </div>
                </div>
              </div> */}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex flex-grow justify-end gap-4">
              <Button color="light" onClick={() => close()}>
                {t("CANCEL")}
              </Button>
              <Button type="submit" disabled={!isValid} color="primary">
                {t("SAVE")}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
