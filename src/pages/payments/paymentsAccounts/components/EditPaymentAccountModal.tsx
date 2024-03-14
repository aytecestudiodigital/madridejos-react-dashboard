import { Button, Label, Modal, TextInput, ToggleSwitch } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { DeleteModal } from "../../../../components/DeleteModal";
import {
  deleteRow,
  insertRow,
  updateRow,
} from "../../../../server/supabaseQueries";
import { AlertContext } from "../../../../context/AlertContext";
import { PaymentsAccount } from "../models/PaymentsAccounts";

interface EditAccountProps {
  item: PaymentsAccount | null;
  openModal: boolean;
  closeModal: Function;
}

export function EditPaymentAccountModal({
  item: item,
  openModal = false,
  closeModal,
}: EditAccountProps) {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [switchEnable, setSwitchEnable] = useState(false);
  const orgId = import.meta.env.VITE_ORG_ID;
  const { openAlert } = useContext(AlertContext);

  const userGroupId = localStorage.getItem("groupSelected")!;
  const user = JSON.parse(localStorage.getItem("userLogged")!);

  const { handleSubmit, register, formState, reset } = useForm<PaymentsAccount>(
    {
      values: item ?? undefined,
      mode: "onBlur",
      reValidateMode: "onBlur",
      criteriaMode: "all",
    },
  );

  const { isValid } = formState;

  const deletePaymentAccount = async () => {
    try {
      await deleteRow(item!.id!, "payments_accounts");
      closeModal(true);
    } catch (error) {}
  };

  useEffect(() => {
    reset({
      title: item ? item.title : "",
      enable: item ? item.enable : false,
      id: item ? item.id : undefined,
    });
    setSwitchEnable(item ? item.enable! : false);
    setOpen(openModal);
  }, [openModal]);

  const close = (item: PaymentsAccount | null) => {
    reset();
    setOpen(false);
    closeModal(item ? true : false);
  };

  const onSubmit: SubmitHandler<PaymentsAccount> = async (data) => {
    if (isValid) {
      setLoading(true);
      const itemUpdated = item?.id
        ? ((await updateRow(
            {
              ...data,
              org_id: orgId,
              enable: switchEnable,
              group_id: userGroupId,
            },
            "payments_accounts",
          )) as PaymentsAccount)
        : ((await insertRow(
            {
              ...data,
              org_id: orgId,
              enable: switchEnable,
              group_id: userGroupId,
            },
            "payments_accounts",
          )) as PaymentsAccount);
      if (itemUpdated) {
        if (item?.id) {
          openAlert(t("PAYMENT_ACCOUNT_UPDATE_OK"), "update");
        } else {
          openAlert(t("PAYMENT_ACCOUNT_INSERT_OK"), "insert");
        }
      } else {
        openAlert(t("PAYMENT_ACCOUNT_OPERATION_KO", "error"));
      }
      close(itemUpdated);
      setLoading(false);
    }
  };

  return (
    <>
      <Modal dismissible onClose={() => close(null)} show={isOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            {item ? (
              <strong>{t("EDIT_ACCOUNT")}</strong>
            ) : (
              <strong>{t("ADD_ACCOUNT")}</strong>
            )}
          </Modal.Header>
          <Modal.Body>
            <div className="flex justify-between">
              <div className="pb-4 w-2/3">
                <Label htmlFor="title">{t("TITLE")}</Label>
                <div className="mt-1">
                  <TextInput
                    id="title"
                    placeholder={t("TITLE")}
                    {...register("title")}
                  />
                </div>
              </div>

              <div className="flex justify-end w-1/3 mr-4">
                <div>
                  <Label htmlFor="enable">{t("ENABLE")}</Label>
                  <ToggleSwitch
                    className="mt-3"
                    checked={switchEnable}
                    onChange={setSwitchEnable}
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          {item && item.id ? (
            <Modal.Footer className="flex justify-between">
              <div>
                <DeleteModal
                  data={item}
                  deleteFn={deletePaymentAccount}
                  onlyIcon={false}
                  toastSuccessMsg={t("ACCOUNT_DELETE_OK")}
                  toastErrorMsg={t("ACCOUNT_DELETE_KO")}
                  title={t("DELETE_ACCOUNT")}
                  disableButton={
                    (!user.users_roles.rules.payments.payments_accounts
                      .delete_all &&
                      !user.users_roles.rules.payments.payments_accounts
                        .delete_group &&
                      !user.users_roles.rules.payments.payments_accounts
                        .delete_own) ||
                    (!user.users_roles.rules.payments.payments_accounts
                      .delete_all &&
                      user.users_roles.rules.payments.payments_accounts
                        .delete_group &&
                      userGroupId !== item.group_id) ||
                    (!user.users_roles.rules.payments.payments_accounts
                      .delete_all &&
                      !user.users_roles.rules.payments.payments_accounts
                        .delete_group &&
                      user.users_roles.rules.payments.payments_accounts
                        .delete_own &&
                      user.id !== item.created_by)
                  }
                />
              </div>
              <div>
                <Button
                  disabled={
                    !isValid ||
                    (!user.users_roles.rules.payments.payments_accounts
                      .update_all &&
                      !user.users_roles.rules.payments.payments_accounts
                        .update_group &&
                      !user.users_roles.rules.payments.payments_accounts
                        .update_own) ||
                    (!user.users_roles.rules.payments.payments_accounts
                      .update_all &&
                      user.users_roles.rules.payments.payments_accounts
                        .update_group &&
                      userGroupId !== item.group_id) ||
                    (!user.users_roles.rules.payments.payments_accounts
                      .update_all &&
                      !user.users_roles.rules.payments.payments_accounts
                        .update_group &&
                      user.users_roles.rules.payments.payments_accounts
                        .update_own &&
                      user.id !== item.created_by)
                  }
                  color="primary"
                  type="submit"
                  isProcessing={loading}
                >
                  {loading ? t("LOADING") : t("SAVE_ACCOUNT")}
                </Button>
              </div>
            </Modal.Footer>
          ) : (
            <Modal.Footer className="flex place-content-end">
              <Button
                size={"sm"}
                disabled={
                  !isValid ||
                  !user.users_roles.rules.payments.payments_accounts.create
                }
                color="primary"
                type="submit"
                isProcessing={loading}
              >
                {loading ? t("LOADING") : t("SAVE_ACCOUNT")}
              </Button>
            </Modal.Footer>
          )}
        </form>
      </Modal>
    </>
  );
}
