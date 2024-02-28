import { GroupUsers } from "../../models/GroupUser";
import { EditGroupModal } from "./EditGroupModal";

interface AddGroupModalProps {
  onItem: (item: GroupUsers | null | string) => void;
  openModal: boolean;
  closeModal: Function;
}

export function AddGroupModal({
  onItem: onGroup,
  openModal,
  closeModal,
}: AddGroupModalProps) {
  return (
    <>
      <EditGroupModal
        onItem={onGroup}
        item={null}
        openModal={openModal}
        closeModal={closeModal}
      />
    </>
  );
}
