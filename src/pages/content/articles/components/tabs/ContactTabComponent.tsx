/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as EmailValidator from "email-validator";
import { ErrorMessage } from "@hookform/error-message";

interface ContactTabProps {
  onContact: (contact: any) => void;
  values: any;
}

export default function ContactTab({
  onContact: onContact,
  values,
}: ContactTabProps) {
  const { t } = useTranslation();

  const { register, getValues, formState } = useForm<any>({
    values: values.contact ?? undefined,
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "all",
  });

  const { errors } = formState;

  const mobileRegex = /^(\+34|0034|34)?[ -]*(6|7)[ -]*([0-9][ -]*){8}/;
  const phoneRegex = /^[9|6|7][0-9]{8}$/;

  return (
    <div className="px-4">
      <div className="grid grid-cols-12 divide-x">
        <div className="col-span-8 divide-y mr-8">
          <div className="mb-4">
            <Label className="text-lg">{t("CONTACT_INFORMATION")}</Label>
            <p>
              <span className="text-gray-500 text-sm">
                {t("CONTACT_INFORMATION_PLACE")}
              </span>
            </p>
          </div>
          <div className="flex justify-between items-center py-4">
            <div>
              <Label
                color={errors.email && "failure"}
                htmlFor="email"
                value={t("EMAIL")}
              />
            </div>
            <div>
              <div className="mr-4">
                <TextInput
                  className="w-96"
                  id="email"
                  placeholder={t("EDIT_USER_FORM_EMAIL_PLACEHOLDER")}
                  {...register("email", {
                    validate: (value) => {
                      if (value != "" && !EmailValidator.validate(value!))
                        return t("FORM_ERROR_MSG_FORMAT");
                    },
                    required: false,
                  })}
                  onChange={() => onContact(getValues())}
                  color={errors.email && "failure"}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="email"
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
          <div className="flex justify-between items-center py-4">
            <div>
              <Label htmlFor="title" value={t("WEB")} />
            </div>
            <div className="mr-4">
              <TextInput
                className="w-96"
                id="title"
                type="text"
                {...register("web")}
                onBlur={() => onContact(getValues())}
              />
            </div>
          </div>
          <div className="flex justify-between items-center py-4">
            <div>
              <Label
                htmlFor="title"
                value={t("PHONES")}
                color={(errors.mobile || errors.phone) && "failure"}
              />
            </div>
            <div>
              <div className="mr-4">
                <div className="flex justify-between gap-4">
                  <div>
                    <TextInput
                      id="mobile"
                      type="number"
                      placeholder={t("MOVILE_PHONE")}
                      {...register("mobile", {
                        required: false,
                        pattern: {
                          value: mobileRegex,
                          message: t("FORM_ERROR_MSG_FORMAT"),
                        },
                        minLength: {
                          value: 9,
                          message: t("EDIT_USER_FORM_ERROR_MSG_LENGTH"),
                        },
                        maxLength: {
                          value: 9,
                          message: t("EDIT_USER_FORM_ERROR_MSG_LENGTH"),
                        },
                      })}
                      onChange={() => onContact(getValues())}
                      color={errors.mobile && "failure"}
                    />
                  </div>
                  <div>
                    <TextInput
                      className=""
                      id="title"
                      type="number"
                      placeholder={t("LAND_PHONE")}
                      {...register("phone", {
                        required: false,
                        pattern: {
                          value: phoneRegex,
                          message: t("FORM_ERROR_MSG_FORMAT"),
                        },
                        minLength: {
                          value: 9,
                          message: t("EDIT_USER_FORM_ERROR_MSG_LENGTH"),
                        },
                        maxLength: {
                          value: 9,
                          message: t("EDIT_USER_FORM_ERROR_MSG_LENGTH"),
                        },
                      })}
                      onChange={() => onContact(getValues())}
                      color={errors.phone && "failure"}
                    />
                  </div>
                </div>
              </div>
              <ErrorMessage
                errors={errors}
                name="phone"
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
              <ErrorMessage
                errors={errors}
                name="mobile"
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

          <div className="flex justify-between items-center py-4">
            <div>
              <Label htmlFor="title" value={t("ORDER_DIR_LABEL")} />
            </div>
            <div className="mr-4">
              <TextInput
                className="w-96"
                id="title"
                type="text"
                {...register("address")}
                onBlur={() => onContact(getValues())}
              />
            </div>
          </div>
          <div className="flex justify-between items-center py-4">
            <div>
              <Label htmlFor="title" value={t("POPULATION")} />
            </div>
            <div className="mr-4">
              <TextInput
                className="w-96"
                id="title"
                type="text"
                {...register("poblation")}
                onBlur={() => onContact(getValues())}
              />
            </div>
          </div>
          <div className="flex justify-between items-center py-4">
            <div>
              <Label
                htmlFor="title"
                value={t("PROVINCE") + " " + t("AND") + " " + t("POSTAL_CODE")}
              />
            </div>
            <div className="mr-4">
              <div className="flex justify-between gap-4">
                <div>
                  <TextInput
                    id="title"
                    type="text"
                    placeholder={t("PROVINCE")}
                    {...register("province")}
                    onBlur={() => onContact(getValues())}
                  />
                </div>
                <div>
                  <TextInput
                    id="title"
                    type="number"
                    placeholder={t("POSTAL_CODE")}
                    {...register("title")}
                    onBlur={() => onContact(getValues())}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-4">
          <div className="ml-4 divide-y">
            <div className="mb-4">
              <Label className="text-lg">{t("SOCIAL_PROFILES")}</Label>
              <p>
                <span className="text-gray-500 text-sm">
                  {t("SOCIAL_PROFILES_DESCRIPTION")}
                </span>
              </p>
            </div>
            <div className="flex justify-between items-center py-4">
              <div>
                <Label htmlFor="title" value={t("FACEBOOK")} />
              </div>
              <div>
                <TextInput
                  id="title"
                  type="text"
                  {...register("facebook")}
                  onBlur={() => onContact(getValues())}
                />
              </div>
            </div>
            <div className="flex justify-between items-center py-4">
              <div>
                <Label htmlFor="title" value={t("TWITTER")} />
              </div>
              <div>
                <TextInput
                  id="title"
                  type="text"
                  {...register("twitter")}
                  onBlur={() => onContact(getValues())}
                />
              </div>
            </div>
            <div className="flex justify-between items-center py-4">
              <div>
                <Label htmlFor="title" value={t("INSTAGRAM")} />
              </div>
              <div className="">
                <TextInput
                  id="title"
                  type="text"
                  {...register("instagram")}
                  onBlur={() => onContact(getValues())}
                />
              </div>
            </div>
            <div className="flex justify-between items-center py-4">
              <div>
                <Label htmlFor="title" value={t("YOUTUBE")} />
              </div>
              <div className="">
                <TextInput
                  className=""
                  id="title"
                  type="text"
                  {...register("youtube")}
                  onBlur={() => onContact(getValues())}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
