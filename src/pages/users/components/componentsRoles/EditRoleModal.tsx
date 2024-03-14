/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { UserRol } from "../../models/UserRol";
import { insertRow } from "../../../../server/supabaseQueries";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { ErrorMessage } from "@hookform/error-message";

interface EditRolesModalProps {
  roles: any | null;
  openModal: boolean;
  closeModal: Function;
  onRole: (role: any) => void;
}

export function EditRolesModal({
  roles,
  openModal = false,
  closeModal,
  onRole: onRole,
}: EditRolesModalProps) {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState, reset } = useForm({
    values: roles ?? undefined,
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "all",
  });

  const { errors, isValid } = formState;
  const tableName = import.meta.env.VITE_TABLE_USER_ROLES;
  const userGroupId = localStorage.getItem("groupSelected")!;

  const onSubmit: SubmitHandler<object> = async (data) => {
    if (isValid) {
      const dataToInsert: any = { ...data, rules: { ...UserRol } };
      setLoading(true);
      dataToInsert.group_id = userGroupId;
      const roleSaved = await insertRow(dataToInsert, tableName);
      close(dataToInsert);
      setLoading(false);
      onRole(roleSaved);
    }
  };

  useEffect(() => {
    reset();
    setOpen(openModal);
  }, [openModal, reset]);

  const close = (role: any | null) => {
    reset();
    setOpen(false);
    closeModal(role ? true : false);
  };

  return (
    <>
      <Modal dismissible onClose={() => close(null)} show={isOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            {t("ADD_ROLE")}
          </Modal.Header>
          <Modal.Body>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="name" color={errors.title && "failure"}>
                  {t("TITLE")}
                </Label>
                <div className="mt-1">
                  <TextInput
                    id="name"
                    placeholder="Título del rol"
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
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              size={"sm"}
              disabled={!isValid}
              color="primary"
              type="submit"
              isProcessing={loading}
            >
              {loading ? t("LOADING") : t("SAVE_ROLE")}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
