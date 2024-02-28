import { ErrorMessage } from "@hookform/error-message";
import { Label, Select, TextInput } from "flowbite-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AccessControl } from "../models/AccessControl";

interface AkilesDetailsProps {
  item: AccessControl | null;
  setCheckProvider: Dispatch<SetStateAction<string>>;
  provider: string;
  setAkilesType: Dispatch<SetStateAction<string>>;
  onValidationChange: (isValid: boolean) => void;
  formData: AccessControl | null;
  setFormData: Dispatch<SetStateAction<AccessControl | null>>;
  akilesType: string;
}

export function AkilesData(props: AkilesDetailsProps) {
  const { t } = useTranslation();

  const { register, formState } = useForm<any>({
    values: props.item ?? undefined,
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "all",
  });

  const { errors } = formState;
  const { isValid } = formState;
  props.onValidationChange(isValid);

  const [modelName, setModelName] = useState<string>(
    props.item && props.item.model_name ? props.item.model_name : "",
  );

  const validateEnabled = (value: string) => {
    if (value === "") {
      return t("FORM_ERROR_MSG_REQUIRED");
    }
    return true;
  };

  const handleFormChange = (field: string, value: any) => {
    if (field === "provider") {
      props.setFormData(null);
    }
    // Actualiza el estado del formulario en el componente padre
    props.setFormData((prevFormData: any) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const onFieldChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      handleFormChange(field, e.currentTarget.value);
      if (field === "provider") {
        props.setCheckProvider(e.currentTarget.value);
      } else if (field === "type") {
        props.setAkilesType(e.currentTarget.value);
        e.currentTarget.value === "DOOR"
          ? (setModelName("CYLINDER"),
            handleFormChange("model_name", "CYLINDER"))
          : (setModelName("PINPAD"), handleFormChange("model_name", "PINPAD"));
      }
    };

  return (
    <>
      {/* DETALLES */}
      {props.item ? (
        <div className="border-b border-gray-200 !p-6 dark:border-gray-700"></div>
      ) : null}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-4">
        <div className="pr-4">
          <Label htmlFor="provider" color={errors.provider && "failure"}>
            {t("PROVIDER")} *
          </Label>
          <div className="mt-1">
            <Select
              id="provider"
              {...register("provider", {
                required: t("FORM_ERROR_MSG_REQUIRED"),
              })}
              defaultValue={props.provider}
              disabled={props.item !== null}
              color={errors.provider && "failure"}
              onChange={onFieldChange("provider")}
            >
              <option value="">{t("SELECT")}</option>
              <option value="RAIXER">RAIXER</option>
              <option value="SHELLY">SHELLY</option>
              <option value="AKILES">AKILES</option>
              <option value="IGLOOHOME">IGLOOHOME</option>
            </Select>
          </div>
          <ErrorMessage
            errors={errors}
            name="provider"
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

        <div className="pr-4">
          <Label htmlFor="title" color={errors.title && "failure"}>
            {t("TITLE")} *
          </Label>
          <div className="mt-1">
            <TextInput
              id="title"
              placeholder="Título del dispositivo"
              {...register("title", {
                required: t("FORM_ERROR_MSG_REQUIRED"),
              })}
              color={errors.title && "failure"}
              onChange={onFieldChange("title")}
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
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="pr-4 pt-4">
          <Label htmlFor="type" color={errors.type && "failure"}>
            {t("TYPE")} *
          </Label>
          <div className="mt-1">
            <Select
              id="type"
              {...register("type", {
                required: t("FORM_ERROR_MSG_REQUIRED"),
              })}
              defaultValue={props.item ? props.item.type : ""}
              color={errors.type && "failure"}
              onChange={onFieldChange("type")}
            >
              <option value="">{t("SELECT")}</option>
              <option value="DOOR">{t("DOOR")}</option>
              <option value="CODE">{t("CODE")}</option>
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

        <div className="pr-4 pt-4">
          <Label htmlFor="model_name">{t("MODEL_NAME")}</Label>
          <div className="mt-1">
            <TextInput
              id="model_name"
              placeholder={modelName ? modelName : t("MODEL_NAME_PLACEHOLDER")}
              disabled
            />
          </div>
        </div>
      </div>

      {/* CONFIGURACIÓN */}
      <div className="border-b border-gray-200 !p-6 dark:border-gray-700"></div>
      {props.akilesType === "CODE" ? (
        <>
          <div className="py-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="pr-4 pb-4">
              <Label htmlFor="device_id" color={errors.device_id && "failure"}>
                {t("DEVICE_ID")} *
              </Label>
              <div className="mt-1">
                <TextInput
                  id="device_id"
                  placeholder={t("DEVICE_ID")}
                  {...register("device_id", {
                    required: t("FORM_ERROR_MSG_REQUIRED"),
                  })}
                  color={errors.device_id && "failure"}
                  onChange={onFieldChange("device_id")}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="device_id"
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

            <div className="pr-4 pb-4">
              <Label htmlFor="enabled" color={errors.enabled && "failure"}>
                {t("ENABLE")} *
              </Label>
              <div className="mt-1">
                <Select
                  id="enabled"
                  {...register("enabled", {
                    validate: validateEnabled,
                  })}
                  defaultValue={
                    props.item ? (props.item.enabled ? "true" : "false") : ""
                  }
                  color={errors.enabled && "failure"}
                  onChange={onFieldChange("enabled")}
                >
                  <option value="">{t("SELECT")}</option>
                  <option value="true">{t("YES")}</option>
                  <option value="false">{t("NO")}</option>
                </Select>
              </div>
              <ErrorMessage
                errors={errors}
                name="enabled"
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
        </>
      ) : (
        <>
          <div className="py-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="pr-4">
              <Label htmlFor="device_id" color={errors.device_id && "failure"}>
                {t("DEVICE_ID")} *
              </Label>
              <div className="mt-1">
                <TextInput
                  id="device_id"
                  placeholder={t("DEVICE_ID")}
                  {...register("device_id", {
                    required: t("FORM_ERROR_MSG_REQUIRED"),
                  })}
                  disabled={props.item !== null}
                  color={errors.device_id && "failure"}
                  onChange={onFieldChange("device_id")}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="device_id"
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

            <div className="pr-4">
              <Label
                htmlFor="channel_id"
                color={errors.channel_id && "failure"}
              >
                {t("CHANNEL_ID")} *
              </Label>
              <div className="mt-1">
                <TextInput
                  id="channel_id"
                  placeholder={t("CHANNEL_ID")}
                  {...register("channel_id", {
                    required: t("FORM_ERROR_MSG_REQUIRED"),
                  })}
                  color={errors.channel_id && "failure"}
                  onChange={onFieldChange("channel_id")}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="channel_id"
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

            <div className="pr-4 pb-4">
              <Label htmlFor="enabled" color={errors.enabled && "failure"}>
                {t("ENABLE")} *
              </Label>
              <div className="mt-1">
                <Select
                  id="enabled"
                  {...register("enabled", {
                    required: t("FORM_ERROR_MSG_REQUIRED"),
                  })}
                  defaultValue={
                    props.item ? (props.item.enabled ? "true" : "false") : ""
                  }
                  color={errors.enabled && "failure"}
                  onChange={onFieldChange("enabled")}
                >
                  <option value="">{t("SELECT")}</option>
                  <option value="true">{t("YES")}</option>
                  <option value="false">{t("NO")}</option>
                </Select>
              </div>
              <ErrorMessage
                errors={errors}
                name="enabled"
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
        </>
      )}
    </>
  );
}
