import { Button, Label, Modal, TextInput, ToggleSwitch } from "flowbite-react";
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
  const { register, handleSubmit, formState, reset, setValue } = useForm<any>({
    values: item ?? undefined,
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "all",
  });

  const { errors, isValid } = formState;

  const [totalAccess, setTotalAccess] = useState(false);
  const tableName = import.meta.env.VITE_TABLE_USER_GROUPS;

  useEffect(() => {
    if (item) {
      setTotalAccess(item?.access_all);
    }
  }, [item]);

  const changeTotalAccess = (value: any) => {
    setTotalAccess(value);
    setValue("access_all", value);
  };

  const closeAfterDelete = () => {
    reset();
    setOpen(false);
    closeModal(true);
  };

  const onSubmit: SubmitHandler<GroupUsers> = async (data) => {
    if (isValid) {
      setLoading(true);
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
            {item && item.id && (
              <div className="flex justify-end items-center text-gray-800">
                <DeleteGroupModal
                  item={item}
                  closeModal={closeAfterDelete}
                  onDeleteItem={onGroup}
                />
              </div>
            )}

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

              <div>
                <Label
                  htmlFor="access_all"
                  color={errors.access_all && "failure"}
                >
                  {t("ACCESS_ALL")}
                </Label>
                <div className="mt-1">
                  <ToggleSwitch
                    checked={totalAccess}
                    onChange={(e) => changeTotalAccess(e)}
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="flex place-content-end">
            <Button
              disabled={!isValid}
              color="primary"
              type="submit"
              isProcessing={loading}
            >
              {loading ? t("LOADING") : "Guardar grupo"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
