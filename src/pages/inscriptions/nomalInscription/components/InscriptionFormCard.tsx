/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label, Select, TextInput, ToggleSwitch } from "flowbite-react";
import { useContext, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { InscriptionFormInputsTable } from "./tables/InscriptionFormInputsTable";
import { useForm } from "react-hook-form";
import { InscriptionFormContext } from "../context/InscriptionFormContext";
import { ErrorMessage } from "@hookform/error-message";
import { Forms } from "../models/Forms";
import { InputForm } from "../models/InputsForm";
import { getDataByColumn } from "../data/NormalInscriptioProvider";

interface FormsProps {
  mainForm?: Forms;
  authForm?: Forms;
  onValidTitle: (value: boolean) => void;
}

export const InscriptionFormCard = (props: FormsProps) => {
  const { t } = useTranslation();
  const [selectedBasicForm, setSelectedBasicForm] = useState<
    "BASIC" | "COMPLETE"
  >("BASIC");
  const [selectedCompleteForm, setSelectedCompleteForm] = useState<
    "BASIC" | "COMPLETE"
  >("BASIC");
  const contextMethods = useContext(InscriptionFormContext);
  const [switchEnableForm, setSwitchEnableForm] = useState<boolean>(
    props.authForm ? true : false,
  );
  const [mainTitle, setMainTitle] = useState("");
  const [mainFormType, setMainFormType] = useState("");
  const [authTitle, setAuthTitle] = useState("");
  const [authFormType, setAuthFormType] = useState("");

  const [authInputsForm, setAuthInputsForm] = useState<InputForm[]>([]);
  const [mainInputsForm, setMainInputsForm] = useState<InputForm[]>([]);

  /**
   * Configuro el formulario de gestión
   */
  const { formState, setError, clearErrors } = useForm<any>({
    values: undefined,
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "all",
  });

  const { errors } = formState;

  useEffect(() => {
    const selectInputsForm = async () => {
      const mainFormId = props.mainForm ? props.mainForm.id : undefined;
      const authFormId = props.authForm ? props.authForm.id : undefined;
      if (mainFormId) {
        const mains = (await getDataByColumn(
          "inscriptions_input",
          "form_id",
          mainFormId,
        )) as InputForm[];
        mains && mains.sort((a: any, b: any) => a.order - b.order);
        mains && setMainInputsForm(mains);
        props.mainForm &&
          setMainTitle(
            props.mainForm
              ? props.mainForm.title!
              : "Datos de la persona a inscribir",
          );
      }
      if (authFormId) {
        const auths = await getDataByColumn(
          "inscriptions_input",
          "form_id",
          authFormId,
        );
        auths && auths.sort((a: any, b: any) => a.order - b.order);
        auths && setAuthInputsForm(auths);
        auths && setSwitchEnableForm(true);
        props.authForm &&
          setAuthTitle(
            props.authForm
              ? props.authForm.title!
              : "Datos del padre/madre/tutor",
          );
      }
    };
    selectInputsForm();
  }, [props.mainForm, props.authForm]);

  useEffect(() => {
    setMainFormType(selectedBasicForm);
  }, [selectedBasicForm]);

  useEffect(() => {
    setAuthFormType(selectedCompleteForm);
  }, [selectedCompleteForm]);

  useEffect(() => {
    const data: any = {
      title: mainTitle,
      template_type: mainFormType,
      form_type: "MAIN",
    };
    if (props.mainForm) {
      data.id = props.mainForm.id;
    }
    contextMethods.updateMainFormValues(data);
  }, [mainTitle, mainFormType]);

  useEffect(() => {
    if (switchEnableForm) {
      const data: any = {
        title: authTitle,
        template_type: authFormType,
        form_type: "AUTH",
      };
      if (props.authForm) {
        data.id = props.authForm.id;
      }
      contextMethods.updateAuthFormValues(data);
    } else {
      contextMethods.updateAuthFormValues(null);
    }
  }, [authTitle, authFormType, switchEnableForm]);

  useEffect(() => {
    if (!switchEnableForm && mainTitle !== "") {
      props.onValidTitle(true);
    } else if (!switchEnableForm && mainTitle === "") {
      props.onValidTitle(false);
    } else if (switchEnableForm && mainTitle !== "" && authTitle !== "") {
      props.onValidTitle(true);
    } else {
      props.onValidTitle(false);
    }
  }, [mainTitle, authTitle, switchEnableForm]);

  const handleBasicFormType = (e: any) => {
    e === "BASIC"
      ? setSelectedBasicForm("BASIC")
      : setSelectedBasicForm("COMPLETE");
  };

  const handleCompleteFormType = (e: any) => {
    e === "BASIC"
      ? setSelectedCompleteForm("BASIC")
      : setSelectedCompleteForm("COMPLETE");
  };

  const changeMainTitle = (e: any) => {
    if (e === "") {
      setMainTitle(e);
      setError("title", {
        type: "custom",
        message: "Este campo es obligatorio",
        types: { required: "Este campo es obligatorio" },
      });
    } else {
      setMainTitle(e);
      clearErrors();
    }
  };

  const changeAuthTitle = (e: any) => {
    if (e === "") {
      setAuthTitle(e);
      setError("title2", {
        type: "custom",
        message: "Este campo es obligatorio",
        types: { required: "Este campo es obligatorio" },
      });
    } else {
      setAuthTitle(e);
      clearErrors();
    }
  };

  return (
    <div className="max-w overflow-auto p-1">
      <h3 className="text-xl font-bold dark:text-white">
        Formulario principal
      </h3>
      <p className=" text-gray-500 text-xs mt-1">
        Formulario para el titular de la inscripción
      </p>
      {props.mainForm ? (
        <>
          <div className="pt-4">
            <Label htmlFor="title" color={errors.title && "failure"}>
              Título del formulario *
            </Label>
            <div className="mt-1">
              <TextInput
                id="title"
                defaultValue={mainTitle}
                color={errors.title && "failure"}
                required
                onChange={(e) => changeMainTitle(e.currentTarget.value)}
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
          <div className="mt-4">
            <InscriptionFormInputsTable
              type="MAIN"
              inputsFormMain={mainInputsForm}
            />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="pt-4 pr-4">
              <Label htmlFor="title" color={errors.title && "failure"}>
                Título del formulario *
              </Label>
              <div className="mt-1">
                <TextInput
                  id="title"
                  defaultValue={mainTitle}
                  color={errors.title && "failure"}
                  /* {...register("title", {
                    required: t("FORM_ERROR_MSG_REQUIRED"),
                  })} */
                  onChange={(e) => changeMainTitle(e.currentTarget.value)}
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

            <div className="pt-4">
              <Label htmlFor="enable">Plantilla formulario inicial</Label>
              <div className="mt-1">
                <Select
                  id="enable"
                  /*  {...register("template_type")} */
                  onChange={(e) => handleBasicFormType(e.currentTarget.value)}
                >
                  <option value="BASIC">Formulario básico</option>
                  <option value="COMPLETE">Formulario completo</option>
                </Select>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <InscriptionFormInputsTable
              formType={selectedBasicForm}
              type="MAIN"
            />
          </div>
        </>
      )}

      <h3 className="text-xl font-bold dark:text-white mt-8">
        Formulario de autorización
      </h3>
      <div className="flex flex-grow justify-between">
        <p className="text-xs mt-1 text-gray-500">
          Hablitar el formulario para las inscripciones de menores
        </p>
        <ToggleSwitch
          checked={switchEnableForm}
          label={t("ENABLE")}
          onChange={setSwitchEnableForm}
          /* onBlur={() => onChangeInput()} */
        />
      </div>

      {switchEnableForm ? (
        props.authForm ? (
          <>
            <div className="pt-4 pr-4">
              <Label color={errors.title2 && "failure"} htmlFor="title2">
                Título del formulario *
              </Label>
              <div className="mt-1">
                <TextInput
                  id="title2"
                  defaultValue={authTitle}
                  color={errors.title2 && "failure"}
                  onChange={(e) => changeAuthTitle(e.currentTarget.value)}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="title2"
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
            <div className="mt-4">
              <InscriptionFormInputsTable
                type="AUTH"
                inputsFormAuth={authInputsForm}
              />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="pt-4 pr-4">
                <Label
                  color={errors.title2 && "failure"}
                  htmlFor="title2" /* color={errors.title && "failure"} */
                >
                  Título del formulario *
                </Label>
                <div className="mt-1">
                  <TextInput
                    id="title2"
                    defaultValue={authTitle}
                    color={errors.title2 && "failure"}
                    onChange={(e) => changeAuthTitle(e.currentTarget.value)}
                  />
                </div>
                <ErrorMessage
                  errors={errors}
                  name="title2"
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
              <div className="pt-4">
                <Label htmlFor="enable">Plantilla formulario inicial</Label>
                <div className="mt-1">
                  <Select
                    id="enable"
                    onChange={(e) =>
                      handleCompleteFormType(e.currentTarget.value)
                    }
                  >
                    <option value="BASIC">Formulario básico</option>
                    <option value="COMPLETE">Formulario completo</option>
                  </Select>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <InscriptionFormInputsTable
                formType={selectedCompleteForm}
                type="AUTH"
              />
            </div>
          </>
        )
      ) : null}
    </div>
  );
};
