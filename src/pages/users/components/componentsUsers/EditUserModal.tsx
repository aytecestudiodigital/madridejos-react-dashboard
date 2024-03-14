/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorMessage } from "@hookform/error-message";
import * as EmailValidator from "email-validator";
import {
  Banner,
  Button,
  Checkbox,
  Dropdown,
  Label,
  Modal,
  Select,
  TextInput,
} from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AlertContext } from "../../../../context/AlertContext";
import { ValidateSpanishID } from "../../../../helpers/validate-document";
import { supabase } from "../../../../server/supabase";
import { getAll, insertRow } from "../../../../server/supabaseQueries";
import {
  newUser,
  resetPasswordByEmail,
  updateUser,
  verificationEmail,
} from "../../data/UsersProvider";
import { AymoUser } from "../../models/AymoUser";
import { DeleteUserModal } from "./deleteUserModal";

interface EditUserModalProps {
  user: AymoUser | null;
  openModal: boolean;
  closeModal: Function;
  onUser: (user: AymoUser | null | string) => void;
  page: number;
  size: number;
  orderDir: string;
  orderBy: string;
  modalTitle?: string;
}

export function EditUserModal({
  user,
  openModal = false,
  closeModal,
  onUser: onUser,
  modalTitle: modalTitle,
}: EditUserModalProps) {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const [loadingPassword, setLoadingResetPassword] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [sendEmailPassword, setSendEmailPassword] = useState(true);
  const { register, handleSubmit, formState, reset, setValue } =
    useForm<AymoUser>({
      values: user ?? undefined,
      mode: "onBlur",
      reValidateMode: "onBlur",
      criteriaMode: "all",
    });

  const { errors, isValid } = formState;
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState(
    user && user.role ? user.role : "",
  );

  const mobileRegex = /^(\+34|0034|34)?[ -]*(6|7)[ -]*([0-9][ -]*){8}/;
  //const tableName = import.meta.env.VITE_TABLE_USERS;

  const userActive = JSON.parse(localStorage.getItem("userLogged")!);

  const [selectedGroups, setSelectedGroups] = useState<any[]>([]);
  const [groupsDefault, setGroupsDefault] = useState<any[]>([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const { openAlert } = useContext(AlertContext);

  useEffect(() => {
    const fetchData = async () => {
      const rolesDb = await getAll("users_roles");
      const groupsDb = await getAll("groups");
      if (rolesDb && rolesDb.data) {
        setRoles(rolesDb.data);
      }
      if (groupsDb && groupsDb.data) {
        setGroups(groupsDb.data);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      const userId = user.id;
      if (user.role) {
        setSelectedRole(user.role);
      } else {
        setSelectedRole("");
      }
      const fetchData = async () => {
        const groupsArray: any[] = [];
        const groupsDb = await supabase
          .from("users_groups")
          .select("*,groups(*)")
          .eq("user_id", userId!);
        if (groupsDb.data) {
          groupsDb.data.forEach((group) => {
            groupsArray.push(group.groups!.id);
          });
          setSelectedGroups(groupsArray);
          setGroupsDefault(groupsArray);
        }
      };
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (selectedRole === "") {
      setValue("role", null);
    } else {
      setValue("role", selectedRole);
    }
  }, [selectedRole]);

  const onSubmit: SubmitHandler<AymoUser> = async (data) => {
    if (isValid) {
      setLoading(true);
      const userUpdated = data.id
        ? ((await updateUser(data)) as AymoUser)
        : ((await newUser(data, selectedGroups)) as AymoUser);
      if (data.id) {
        if (groupsDefault.length > 0) {
          for await (const group of groupsDefault) {
            if (selectedGroups[selectedGroups.indexOf(group)] === undefined) {
              await supabase
                .from("users_groups")
                .delete()
                .eq("group_id", group)
                .eq("user_id", data.id);
            }
          }
        }
        if (selectedGroups.length > 0) {
          for await (const group of selectedGroups) {
            if (groupsDefault[groupsDefault.indexOf(group)] === undefined) {
              const newGroup = {
                group_id: group,
                user_id: data.id,
                created_by: userActive.id,
                updated_by: userActive.id,
              };
              await insertRow(newGroup, "users_groups");
            }
          }
        }
      }
      close(userUpdated);
      setLoading(false);
      onUser(userUpdated);
    }
  };

  const changeDocument = (value: string) => {
    setValue("password", value);
  };

  useEffect(() => {
    reset();
    setOpen(openModal);
  }, [openModal]);

  const close = (user: AymoUser | null) => {
    reset();
    setOpen(false);
    closeModal(user ? true : false);
  };

  useEffect(() => {
    if (showSuccessAlert) {
      openAlert("Correo enviado", "insert");
      setShowSuccessAlert(false);
    } else if (showErrorAlert) {
      openAlert("Error al enviar el correo", "error");
      setShowErrorAlert(false);
    }
  }, [showSuccessAlert, showErrorAlert]);

  const resetPassword = async () => {
    setLoadingResetPassword(true);
    if (user?.email) {
      await resetPasswordByEmail(user.email).then((sendPwdEmail: any) => {
        if (sendPwdEmail === 200 || sendPwdEmail === undefined) {
          setTimeout(() => {
            setLoadingResetPassword(false);
          }, 1000);
          setShowSuccessAlert(true);
        } else {
          setTimeout(() => {
            setLoadingResetPassword(false);
          }, 1000);
          setShowErrorAlert(true);
        }
      });
    }
  };

  const resendVerificationEmail = async () => {
    setLoadingEmail(true);
    if (user?.email) {
      await verificationEmail(user.email).then((sendEmail: any) => {
        if (sendEmail === 200 || sendEmail === undefined) {
          setTimeout(() => {
            setLoadingEmail(false);
          }, 1000);
          setShowSuccessAlert(true);
        } else {
          setTimeout(() => {
            setLoadingEmail(false);
          }, 1000);
          setShowErrorAlert(true);
        }
      });
    }
  };

  const closeAfterDelete = () => {
    reset();
    setOpen(false);
    closeModal(true);
  };

  const handleGroupChange = (value: any, checked: boolean) => {
    if (checked) {
      // Agregar el título si está marcado
      setSelectedGroups((prevTypes) => {
        const prev = [...prevTypes, value];
        return prev;
      });
    } else {
      // Quitar el título si está desmarcado
      setSelectedGroups((prevTypes) => {
        const filtered = prevTypes.filter((prevTitle) => prevTitle !== value);
        return filtered;
      });
    }
  };

  return (
    <>
      <Modal
        dismissible
        onClose={() => close(null)}
        show={isOpen}
        className="z-40"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>
              {modalTitle ? modalTitle : t("EDIT_USER_FORM_TITLE")}
            </strong>
          </Modal.Header>
          <Modal.Body className="max-h-[70vh]">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="name" color={errors.name && "failure"}>
                  {t("NAME")}
                </Label>
                <div className="mt-1">
                  <TextInput
                    id="name"
                    placeholder={t("EDIT_USER_FORM_NAME_PLACEHOLDER")}
                    {...register("name", {
                      required: t("FORM_ERROR_MSG_REQUIRED"),
                    })}
                    color={errors.name && "failure"}
                  />
                </div>
                <ErrorMessage
                  errors={errors}
                  name="name"
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
                <Label htmlFor="surname">
                  {t("SURNAME")} ({t("OPTIONAL")})
                </Label>
                <div className="mt-1">
                  <TextInput
                    id="surname"
                    placeholder={t("EDIT_USER_FORM_SURNAME_PLACEHOLDER")}
                    {...register("surname", { required: false })}
                  />
                </div>
              </div>
              <div>
                <Label color={errors.email && "failure"} htmlFor="email">
                  {t("EMAIL")}
                </Label>
                <div className="mt-1">
                  <TextInput
                    id="email"
                    placeholder={t("EDIT_USER_FORM_EMAIL_PLACEHOLDER")}
                    {...register("email", {
                      required: t("FORM_ERROR_MSG_REQUIRED"),
                      validate: (value) => {
                        if (value != "" && !EmailValidator.validate(value!))
                          return t("FORM_ERROR_MSG_FORMAT");
                      },
                    })}
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
              <div>
                <Label htmlFor="phone" color={errors.phone && "failure"}>
                  {t("EDIT_USER_FORM_PHONE_LABEL")}
                </Label>
                <div className="mt-1">
                  <TextInput
                    id="phone"
                    placeholder={t("EDIT_USER_FORM_PHONE_PLACEHOLDER")}
                    {...register("phone", {
                      required: t("FORM_ERROR_MSG_REQUIRED"),
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
                    color={errors.phone && "failure"}
                  />
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
              </div>
              <div>
                <Label htmlFor="document_type">
                  {t("EDIT_USER_FORM_DOCUMENT_TYPE_LABEL")}
                </Label>
                <div className="mt-1">
                  <Select
                    id="document_type"
                    {...register("document_type", {
                      required: t("FORM_ERROR_MSG_REQUIRED"),
                    })}
                  >
                    <option value={"DNI"}>
                      {t("EDIT_USER_FORM_DOCUMENT_TYPE_DNI")}
                    </option>
                    <option value={"NIE"}>
                      {t("EDIT_USER_FORM_DOCUMENT_TYPE_NIE")}
                    </option>
                    <option value={"CIF"}>
                      {t("EDIT_USER_FORM_DOCUMENT_TYPE_CIF")}
                    </option>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="document" color={errors.document && "failure"}>
                  {t("DOCUMENT")}
                </Label>
                <div className="mt-1">
                  <TextInput
                    id="document"
                    placeholder={t("EDIT_USER_FORM_DOCUMENT_PLACEHOLDER")}
                    {...register("document", {
                      required: t("FORM_ERROR_MSG_REQUIRED"),
                      validate: (value: any, formValues: any) => {
                        if (value != "") {
                          const validation = ValidateSpanishID(value!);
                          if (
                            validation.type?.toLocaleUpperCase() !==
                            formValues.document_type
                          )
                            return t(
                              "EDIT_USER_FORM_ERROR_MSG_DOCUMENT_FORMAT",
                            );
                          if (!validation.valid)
                            return t(
                              "EDIT_USER_FORM_ERROR_MSG_DOCUMENT_INVALID",
                            );
                        }
                        return true;
                      },
                    })}
                    color={errors.document && "failure"}
                    onChange={(event) =>
                      changeDocument(event.currentTarget.value)
                    }
                  />
                </div>
                <ErrorMessage
                  errors={errors}
                  name="document"
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
                <Label htmlFor="role">Perfil del usuario</Label>
                <div className="mt-1">
                  <Select
                    id="role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.currentTarget.value)}
                  >
                    <option value={""}>Ciudadano</option>
                    {roles.length > 0 &&
                      roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.title}
                        </option>
                      ))}
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="group">Grupo</Label>
                <div className="mt-1">
                  <Dropdown
                    renderTrigger={({}) => (
                      <button
                        id="dropdownBgHoverButton"
                        data-dropdown-toggle="dropdownBgHover"
                        className="flex items-center justify-between w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg focus:outline-none focus-within:border-2 focus-within:border-cyan-500"
                        type="button"
                      >
                        <span>Grupos</span>
                        <svg
                          className="ml-4 h-4 w-4 py-1 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 2 4 4 4-4"
                          />
                        </svg>
                      </button>
                    )}
                    color="gray"
                    label={t("TYPES")}
                    dismissOnClick={false}
                  >
                    <Dropdown.Divider />
                    {groups.map((item, index) => (
                      <Dropdown.Item key={index}>
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                          <Checkbox
                            id={`checkbox-item-${index}`}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            checked={selectedGroups.includes(item.id)}
                            onChange={(e) =>
                              handleGroupChange(item.id, e.target.checked)
                            }
                          />
                          <label
                            htmlFor={`checkbox-item-${index}`}
                            className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                          >
                            {t(item.title)}
                          </label>
                        </div>
                      </Dropdown.Item>
                    ))}
                  </Dropdown>
                </div>
              </div>
            </div>
            {!user ? (
              <>
                <Banner className="pt-4">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 w-full border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700 ">
                    <div className="mb-4 md:mb-0 md:mr-4">
                      <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
                        {t("EDIT_USER_FORM_PASSWORD_BANNER_TITLE")}
                      </h2>
                      <p className="flex items-center text-xs font-normal text-gray-500 dark:text-gray-400">
                        {t("EDIT_USER_FORM_PASSWORD_BANNER_DESCRIPTION")}
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="password">{t("PASSWORD")}</Label>
                      <div className="mt-1">
                        <TextInput
                          id="password"
                          placeholder={t("EDIT_USER_FORM_PASSWORD_PLACEHOLDER")}
                          {...register("password", {
                            required: t("FORM_ERROR_MSG_REQUIRED"),
                          })}
                        />
                        <div className="flex items-top gap-2 mt-3">
                          <Checkbox
                            id="sendEmailPassword"
                            defaultChecked={sendEmailPassword}
                            onChange={(event) =>
                              setSendEmailPassword(event.target.checked)
                            }
                          />
                          <Label
                            htmlFor="sendEmailPassword"
                            className="font-normal text-gray-500 dark:text-gray-400"
                          >
                            {t("EDIT_USER_FORM_PASSWORD_SEND_EMAIL")}
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </Banner>
              </>
            ) : (
              <>
                <Banner className="pt-4">
                  <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-2 w-full border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700 ">
                    <div className="mb-4 md:mb-0 md:mr-4">
                      <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
                        {t("EDIT_USER_FORM_PASSWORD_BANNER_TITLE")}
                      </h2>
                      <p className="flex items-center text-xs font-normal text-gray-500 dark:text-gray-400">
                        {t("EDIT_USER_FORM_PASSWORD_BANNER_DESCRIPTION_EDIT")}
                      </p>
                    </div>
                    <div>
                      <Button
                        color="light"
                        size="sm"
                        className="w-full"
                        disabled={loadingPassword}
                        isProcessing={loadingPassword}
                        onClick={resetPassword}
                      >
                        {t("EDIT_USER_FORM_PASSWORD_BTN_RECOVERY")}
                      </Button>
                    </div>
                  </div>

                  <div className=" w-full  bg-gray-50 p-4 dark:bg-gray-700 mt-2">
                    <div className="mb-4 md:mb-0 md:mr-4">
                      <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
                        Verificación de la cuenta
                      </h2>
                      <p className="flex items-center text-xs font-normal text-gray-500 dark:text-gray-400">
                        Si lo que se desea verificar es el número de teléfono,
                        mande un sms al usuario, si no, mande un correo de
                        verificación.
                      </p>
                    </div>
                    <div className="flex justify-center gap-8 mt-4">
                      <div>
                        <Button
                          color="light"
                          size="sm"
                          className="w-full"
                          /* disabled={loadingPassword}
                        isProcessing={loadingPassword}
                        onClick={resetPassword} */
                        >
                          Enviar SMS
                        </Button>
                      </div>
                      <div>
                        <Button
                          color="light"
                          size="sm"
                          className="w-full"
                          disabled={loadingEmail}
                          isProcessing={loadingEmail}
                          onClick={resendVerificationEmail}
                        >
                          Enviar correo de verificación
                        </Button>
                      </div>
                    </div>
                  </div>
                </Banner>
              </>
            )}
          </Modal.Body>

          {user && user.id ? (
            <Modal.Footer className="flex justify-between">
              <div>
                <DeleteUserModal
                  user={user}
                  closeModal={closeAfterDelete}
                  onUserDelete={onUser}
                />
              </div>
              <div>
                <Button
                  size={"sm"}
                  disabled={
                    !isValid ||
                    !userActive.users_roles.rules.mod_users.users.update ||
                    (selectedRole !== "" && selectedGroups.length === 0)
                  }
                  color="primary"
                  type="submit"
                  isProcessing={loading}
                >
                  {loading
                    ? t("LOADING")
                    : t("EDIT_USER_FORM_BUTTON_SAVE_LABEL")}
                </Button>
              </div>
            </Modal.Footer>
          ) : (
            <Modal.Footer className="flex place-content-end">
              <Button
                size={"sm"}
                disabled={
                  !isValid ||
                  !userActive.users_roles.rules.mod_users.users.create ||
                  (selectedRole !== "" && selectedGroups.length === 0)
                }
                color="primary"
                type="submit"
                isProcessing={loading}
              >
                {loading ? t("LOADING") : t("EDIT_USER_FORM_BUTTON_SAVE_LABEL")}
              </Button>
            </Modal.Footer>
          )}
        </form>
      </Modal>
    </>
  );
}
