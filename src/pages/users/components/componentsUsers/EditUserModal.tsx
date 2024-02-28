import { ErrorMessage } from "@hookform/error-message";
import * as EmailValidator from "email-validator";
import {
  Banner,
  Button,
  Checkbox,
  Label,
  Modal,
  Select,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ValidateSpanishID } from "../../../../helpers/validate-document";
import { getAll, updateRow } from "../../../../server/supabaseQueries";
import { newUser, resetPasswordByEmail } from "../../data/UsersProvider";
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
  const [selectedGroup, setSelectedGroup] = useState(
    user && user.group_id ? user.group_id : "",
  );

  const mobileRegex = /^(\+34|0034|34)?[ -]*(6|7)[ -]*([0-9][ -]*){8}/;
  const tableName = import.meta.env.VITE_TABLE_USERS;

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
      if (user.role) {
        setSelectedRole(user.role);
      } else {
        setSelectedRole("");
      }
      if (user.group_id) {
        setSelectedGroup(user.group_id);
      } else {
        setSelectedGroup("");
      }
    }
  }, [user]);

  useEffect(() => {
    if (selectedRole === "") {
      setValue("role", null);
    } else {
      setValue("role", selectedRole);
    }
  }, [selectedRole]);

  useEffect(() => {
    if (selectedGroup === "") {
      setValue("group_id", null);
    } else {
      setValue("group_id", selectedGroup);
    }
  }, [selectedGroup]);

  const onSubmit: SubmitHandler<AymoUser> = async (data) => {
    if (isValid) {
      setLoading(true);
      const userUpdated = data.id
        ? ((await updateRow(data, tableName)) as AymoUser)
        : ((await newUser(data)) as AymoUser);
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

  const resetPassword = async () => {
    setLoadingResetPassword(true);

    if (user?.email) await resetPasswordByEmail(user.email);
    setLoadingResetPassword(false);
  };

  const closeAfterDelete = () => {
    reset();
    setOpen(false);
    closeModal(true);
  };

  return (
    <>
      <Modal dismissible onClose={() => close(null)} show={isOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>
              {modalTitle ? modalTitle : t("EDIT_USER_FORM_TITLE")}
            </strong>
          </Modal.Header>
          <Modal.Body className="max-h-[70vh]">
            {user && user.id && (
              <div className="flex justify-end items-center text-gray-800">
                <DeleteUserModal
                  user={user}
                  closeModal={closeAfterDelete}
                  onUserDelete={onUser}
                />
              </div>
            )}
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
                  <Select
                    id="group"
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.currentTarget.value)}
                  >
                    <option value={""}>Ninguno</option>
                    {groups.length > 0 &&
                      groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.title}
                        </option>
                      ))}
                  </Select>
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
                </Banner>
              </>
            )}
          </Modal.Body>
          <Modal.Footer className="flex place-content-end">
            <Button
              disabled={!isValid}
              color="primary"
              type="submit"
              isProcessing={loading}
            >
              {loading ? t("LOADING") : t("EDIT_USER_FORM_BUTTON_SAVE_LABEL")}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
