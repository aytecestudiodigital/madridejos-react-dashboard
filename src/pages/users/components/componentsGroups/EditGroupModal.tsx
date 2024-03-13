import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { insertRow, updateRow } from "../../../../server/supabaseQueries";
import { GroupUsers } from "../../models/GroupUser";
import { DeleteGroupModal } from "./deleteGroupModal";

interface EditGroupModalProps {
  item: GroupUsers | null;
  openModal: boolean;
  closeModal: Function;
  onItem: (item: GroupUsers | null | string) => void;
}

export function EditGroupModal({
  item: item,
  openModal = false,
  closeModal,
  onItem: onGroup,
}: EditGroupModalProps) {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState, reset } = useForm<any>({
    values: item ?? undefined,
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "all",
  });

  const { errors, isValid } = formState;
  const tableName = import.meta.env.VITE_TABLE_USER_GROUPS;

  const user = JSON.parse(localStorage.getItem("userLogged")!);

  const closeAfterDelete = () => {
    reset();
    setOpen(false);
    closeModal(true);
  };

  const onSubmit: SubmitHandler<GroupUsers> = async (data) => {
    if (isValid) {
      setLoading(true);
      data.group_id = user.group_id;
      const groupUpdated = data.id
        ? ((await updateRow(data, tableName)) as GroupUsers)
        : ((await insertRow(data, tableName)) as GroupUsers);
      close(groupUpdated);
      setLoading(false);
      onGroup(groupUpdated);
    }
  };

  useEffect(() => {
    reset();
    setOpen(openModal);
  }, [openModal]);

  const close = (group: GroupUsers | null) => {
    reset();
    setOpen(false);
    closeModal(group ? true : false);
  };

  return (
    <>
      <Modal dismissible onClose={() => close(null)} show={isOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            {item ? (
              <strong>{t("EDIT_GROUP")}</strong>
            ) : (
              <strong>{t("ADD_GROUP")}</strong>
            )}
          </Modal.Header>
          <Modal.Body>
            <div>
              <div className="pb-4">
                <Label htmlFor="name" color={errors.title && "failure"}>
                  {t("TITLE")}
                </Label>
                <div className="mt-1">
                  <TextInput
                    id="name"
                    placeholder="Título del grupo"
                    {...register("title", {
                      required: t("FORM_ERROR_MSG_REQUIRED"),
                    })}
                    color={errors.title && "failure"}
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          {item && item.id ? (
            <Modal.Footer className="flex justify-between">
              <div>
                <DeleteGroupModal
                  item={item}
                  closeModal={closeAfterDelete}
                  onDeleteItem={onGroup}
                  disableButton={
                    (!user.users_roles.rules.mod_users.groups.delete_all &&
                      !user.users_roles.rules.mod_users.groups.delete_group &&
                      !user.users_roles.rules.mod_users.groups.delete_own) ||
                    (!user.users_roles.rules.mod_users.groups.delete_all &&
                      user.users_roles.rules.mod_users.groups.delete_group &&
                      user.group_id !== item.group_id) ||
                    (!user.users_roles.rules.mod_users.groups.delete_all &&
                      !user.users_roles.rules.mod_users.groups.delete_group &&
                      user.users_roles.rules.mod_users.groups.delete_own &&
                      user.id !== item.created_by)
                  }
                />
              </div>
              <div>
                <Button
                  disabled={
                    !isValid ||
                    (!user.users_roles.rules.mod_users.groups.update_all &&
                      !user.users_roles.rules.mod_users.groups.update_group &&
                      !user.users_roles.rules.mod_users.groups.update_own) ||
                    (!user.users_roles.rules.mod_users.groups.update_all &&
                      user.users_roles.rules.mod_users.groups.update_group &&
                      user.group_id !== item.group_id) ||
                    (!user.users_roles.rules.mod_users.groups.update_all &&
                      !user.users_roles.rules.mod_users.groups.update_group &&
                      user.users_roles.rules.mod_users.groups.update_own &&
                      user.id !== item.created_by)
                  }
                  color="primary"
                  type="submit"
                  isProcessing={loading}
                >
                  {loading ? t("LOADING") : "Guardar grupo"}
                </Button>
              </div>
            </Modal.Footer>
          ) : (
            <Modal.Footer className="flex place-content-end">
              <Button
                disabled={
                  !isValid || !user.users_roles.rules.mod_users.groups.create
                }
                color="primary"
                type="submit"
                isProcessing={loading}
              >
                {loading ? t("LOADING") : "Guardar grupoe"}
              </Button>
            </Modal.Footer>
          )}
        </form>
      </Modal>
    </>
  );
}
