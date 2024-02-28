/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorMessage } from "@hookform/error-message";
import { Label, Select, TextInput } from "flowbite-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AccessControl } from "../models/AccessControl";
import { getRowByColumn } from "../../../server/supabaseQueries";

interface ShellyDetailsProps {
  item: AccessControl | null;
  setCheckProvider: Dispatch<SetStateAction<string>>;
  provider: string;
  autoOff: boolean;
  hourEvent: any;
  setHourEvent: Dispatch<any>;
  autoOffEnabled: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  channel: string;
  asignedChannels: any[];
  setChannel: Dispatch<SetStateAction<string>>;
  onValidationChange: (isValid: boolean) => void;
  formData: AccessControl | null;
  setFormData: Dispatch<SetStateAction<AccessControl | null>>;
}

export function ShellyData(props: ShellyDetailsProps) {
  const { t } = useTranslation();

  const [deviceType, setDeviceType] = useState<string>(
    props.item ? props.item.type : "",
  );
  const [forbiddenChannels, setForbiddenChannels] = useState<any>([]);

  const { register, formState, getValues } = useForm<any>({
    values: props.item ?? undefined,
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "all",
  });

  const { errors } = formState;
  const { isValid } = formState;
  props.onValidationChange(isValid);

  const [channel, setChannel] = useState<string>("");
  useEffect(() => {
    if (props.item) {
      props.item.model_name === "DOOR 2"
        ? setChannel("DOOR")
        : props.item.model_name === "PRO 2 PM"
          ? setChannel("2PM")
          : props.item.model_name === "PRO 4 PM"
            ? setChannel("4PM")
            : null;
    } else {
      setChannel(props.channel);
    }
  });

  const validateEnabled = (value: string) => {
    if (value === "") {
      return t("FORM_ERROR_MSG_REQUIRED");
    }
    return true;
  };

  const handleFormChange = (field: string, value: any) => {
    if (field === "provider") {
      props.setFormData(null);
    } else if (field === "auto_off") {
      value === "" ? (value = false) : value;
    }
    // Actualiza el estado del formulario en el componente padre
    props.setFormData((prevFormData: any) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const onFieldChange =
    (field: string) =>
    async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      handleFormChange(field, e.currentTarget.value);
      if (field === "provider") {
        props.setCheckProvider(e.currentTarget.value);
      } else if (field === "model_name") {
        e.currentTarget.value === "DOOR 2"
          ? props.setChannel("DOOR")
          : e.currentTarget.value === "PRO 2 PM"
            ? props.setChannel("2PM")
            : e.currentTarget.value === "PRO 4 PM"
              ? props.setChannel("4PM")
              : null;
      } else if (field === "time_off") {
        props.setHourEvent(e.currentTarget.value);
      } else if (field === "type") {
        setDeviceType(e.currentTarget.value);
      }
    };

  const handleDeviceIdChange = async (id: string) => {
    const formValues = getValues();
    if (formValues.provider === "SHELLY") {
      const channels = await getRowByColumn("device_id", id, "access_control");
      setForbiddenChannels(channels.map((element: any) => element.channel_id));
    }
  };

  return (
    <>
      {/* DETALLES */}
      {props.item ? (
        <div className="border-b border-gray-200 !p-6 dark:border-gray-700"></div>
      ) : null}
      <div className="pt-4 pb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        <div className="pr-4">
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
              <option value="LIGHT">{t("LIGHT")}</option>
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

        <div className="pr-4">
          <Label htmlFor="model_name">{t("MODEL_NAME")}</Label>
          <div className="mt-1">
            <Select
              id="model_name"
              {...register("model_name")}
              defaultValue={
                props.item && props.item.model_name ? props.item.model_name : ""
              }
              disabled={props.item !== null}
              onChange={onFieldChange("model_name")}
            >
              <option value="">{t("SELECT")}</option>
              <option value="DOOR 2">DOOR 2</option>
              <option value="PRO 2 PM">PRO 2 PM</option>
              <option value="PRO 4 PM">PRO 4 PM</option>
            </Select>
          </div>
        </div>
      </div>

      {/* CONFIGURACIÓN */}
      <div className="border-b border-gray-200 !p-6 dark:border-gray-700"></div>
      {deviceType === "LIGHT" ? (
        <>
          <div className="pb-4 grid grid-cols-1 gap-4 sm:grid-cols-3 pt-4">
            <div className="pr-4">
              <Label htmlFor="device_id" color={errors.device_id && "failure"}>
                {t("DEVICE_ID")} *
              </Label>
              <div className="mt-1">
                <TextInput
                  id="device_id"
                  placeholder={t("DEVICE_ID")}
                  disabled={props.item !== null}
                  {...register("device_id", {
                    required: t("FORM_ERROR_MSG_REQUIRED"),
                  })}
                  color={errors.device_id && "failure"}
                  onChange={onFieldChange("device_id")}
                  onBlur={(e) => handleDeviceIdChange(e.currentTarget.value)}
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
                {channel ? (
                  <Select
                    id="channel_id"
                    {...register("channel_id", {
                      required: t("FORM_ERROR_MSG_REQUIRED"),
                    })}
                    defaultValue={props.item ? props.item.channel_id : ""}
                    color={errors.channel_id && "failure"}
                    onChange={onFieldChange("channel_id")}
                  >
                    {channel === "2PM" ? (
                      <>
                        <option value="">{t("SELECT")}</option>
                        <option
                          disabled={
                            props.asignedChannels.includes("0") ||
                            forbiddenChannels.includes("0")
                          }
                          value="0"
                        >
                          0
                        </option>
                        <option
                          disabled={
                            props.asignedChannels.includes("1") ||
                            forbiddenChannels.includes("1")
                          }
                          value="1"
                        >
                          1
                        </option>
                      </>
                    ) : channel === "4PM" ? (
                      <>
                        <option value="">{t("SELECT")}</option>
                        <option
                          disabled={
                            props.asignedChannels.includes("0") ||
                            forbiddenChannels.includes("0")
                          }
                          value="0"
                        >
                          0
                        </option>
                        <option
                          disabled={
                            props.asignedChannels.includes("1") ||
                            forbiddenChannels.includes("1")
                          }
                          value="1"
                        >
                          1
                        </option>
                        <option
                          disabled={
                            props.asignedChannels.includes("2") ||
                            forbiddenChannels.includes("2")
                          }
                          value="2"
                        >
                          2
                        </option>
                        <option
                          disabled={
                            props.asignedChannels.includes("3") ||
                            forbiddenChannels.includes("3")
                          }
                          value="3"
                        >
                          3
                        </option>
                      </>
                    ) : (
                      <>
                        <option value="">{t("SELECT")}</option>
                        <option value="0">0</option>
                      </>
                    )}
                  </Select>
                ) : (
                  <TextInput
                    id="channel_id"
                    placeholder="Id del canal"
                    {...register("channel_id", {
                      required: t("FORM_ERROR_MSG_REQUIRED"),
                    })}
                    color={errors.channel_id && "failure"}
                  />
                )}
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

            <div className="pr-4">
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="pr-4 pb-4">
              <Label htmlFor="auto_off">{t("AUTO_OFF")}</Label>
              <div className="mt-1">
                <Select
                  id="auto_off"
                  {...register("auto_off")}
                  defaultValue={
                    props.item ? (props.item.auto_off ? "true" : "false") : ""
                  }
                  onBlur={onFieldChange("auto_off")}
                  onChange={props.autoOffEnabled}
                >
                  <option value="">{t("SELECT")}</option>
                  <option value="true">{t("YES")}</option>
                  <option value="false">{t("NO")}</option>
                </Select>
              </div>
            </div>

            <div className="pr-4 pb-4">
              <Label htmlFor="time_off">{t("TIME_OFF")}</Label>
              <TextInput
                disabled={props.autoOff === false}
                className="mt-1"
                id="time_off"
                defaultValue={props.hourEvent}
                onChange={onFieldChange("time_off")}
                type="time"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t("TIME_OFF_DESCRIPTION")}
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="pb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 pt-4">
            <div className="pr-4">
              <Label htmlFor="device_id" color={errors.device_id && "failure"}>
                {t("DEVICE_ID")} *
              </Label>
              <div className="mt-1">
                <TextInput
                  id="device_id"
                  placeholder={t("DEVICE_ID")}
                  disabled={props.item !== null}
                  {...register("device_id", {
                    required: t("FORM_ERROR_MSG_REQUIRED"),
                  })}
                  color={errors.device_id && "failure"}
                  onChange={onFieldChange("device_id")}
                  onBlur={(e) => handleDeviceIdChange(e.currentTarget.value)}
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
                {channel ? (
                  <Select
                    id="channel_id"
                    {...register("channel_id", {
                      required: t("FORM_ERROR_MSG_REQUIRED"),
                    })}
                    defaultValue={props.item ? props.item.channel_id : ""}
                    color={errors.channel_id && "failure"}
                    onChange={onFieldChange("channel_id")}
                  >
                    {channel === "2PM" ? (
                      <>
                        <option value="">{t("SELECT")}</option>
                        <option
                          disabled={
                            props.asignedChannels.includes("0") ||
                            forbiddenChannels.includes("0")
                          }
                          value="0"
                        >
                          0
                        </option>
                        <option
                          disabled={
                            props.asignedChannels.includes("1") ||
                            forbiddenChannels.includes("1")
                          }
                          value="1"
                        >
                          1
                        </option>
                      </>
                    ) : channel === "4PM" ? (
                      <>
                        <option value="">{t("SELECT")}</option>
                        <option
                          disabled={
                            props.asignedChannels.includes("0") ||
                            forbiddenChannels.includes("0")
                          }
                          value="0"
                        >
                          0
                        </option>
                        <option
                          disabled={
                            props.asignedChannels.includes("1") ||
                            forbiddenChannels.includes("1")
                          }
                          value="1"
                        >
                          1
                        </option>
                        <option
                          disabled={
                            props.asignedChannels.includes("2") ||
                            forbiddenChannels.includes("2")
                          }
                          value="2"
                        >
                          2
                        </option>
                        <option
                          disabled={
                            props.asignedChannels.includes("3") ||
                            forbiddenChannels.includes("3")
                          }
                          value="3"
                        >
                          3
                        </option>
                      </>
                    ) : (
                      <>
                        <option value="">{t("SELECT")}</option>
                        <option value="0">0</option>
                      </>
                    )}
                  </Select>
                ) : (
                  <TextInput
                    id="channel_id"
                    placeholder="Id del canal"
                    {...register("channel_id", {
                      required: t("FORM_ERROR_MSG_REQUIRED"),
                    })}
                    color={errors.channel_id && "failure"}
                  />
                )}
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
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

            <div className="pr-4 pb-4">
              <Label
                htmlFor="toggle_after"
                color={errors.toggle_after && "failure"}
              >
                {t("TOGGLE_AFTER")} *
              </Label>
              <div className="mt-1">
                <TextInput
                  id="toggle_after"
                  placeholder={t("TOGGLE_AFTER_PLACEHOLDER")}
                  {...register("toggle_after", {
                    required: t("FORM_ERROR_MSG_REQUIRED"),
                  })}
                  onChange={onFieldChange("toggle_after")}
                  color={errors.toggle_after && "failure"}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t("TOGGLE_AFTER_DESCRIPTION")}
                </p>
              </div>
              <ErrorMessage
                errors={errors}
                name="toggle_after"
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
