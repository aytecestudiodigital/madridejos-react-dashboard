/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { EditRolesModal } from "./EditRoleModal";

interface AddRolesModalProps {
  onRole: (role: any) => void;
  openModal: boolean;
  closeModal: Function;
}

export function AddRoleModal({
  onRole: onRole,
  openModal,
  closeModal,
}: AddRolesModalProps) {
  return (
    <>
      <EditRolesModal
        onRole={onRole}
        roles={null}
        openModal={openModal}
        closeModal={closeModal}
      />
    </>
  );
}
