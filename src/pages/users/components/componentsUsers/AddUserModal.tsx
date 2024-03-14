import { Button } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { AymoUser } from "../../models/AymoUser";
import { EditUserModal } from "./EditUserModal";
import { LuPlus } from "react-icons/lu";

interface AddUserModalProps {
  onUser: (user: AymoUser | null | string) => void;
  page: number;
  size: number;
  orderDir: string;
  orderBy: string;
  openModal: boolean;
  closeModal: Function;
}
export function AddUserModal(props: AddUserModalProps) {
  const { t } = useTranslation();
  const openModalFunction = () => {
    props.openModal;
  };

  return (
    <>
      <Button color="primary" onClick={openModalFunction}>
        <div className="flex items-center gap-x-3">
          <LuPlus className="text-xl" />
          <div className="ml-1">{t("PAGE_USERS_ADD_USER_BTN")}</div>
        </div>
      </Button>
      <EditUserModal
        onUser={props.onUser}
        user={null}
        openModal={props.openModal}
        closeModal={props.closeModal}
        page={props.page}
        size={props.size}
        orderBy={props.orderBy}
        orderDir={props.orderDir}
        modalTitle={t("PAGE_USERS_ADD_USER_BTN")}
      />
    </>
  );
}
