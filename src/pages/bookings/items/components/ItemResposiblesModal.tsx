import { Button, Checkbox, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Users } from "../../../users/models/Users";
import { getUsersJoinRoles } from "../data/ItemsProvider";
import { getAll } from "../../../../server/supabaseQueries";

interface EditEntityModalProps {
  showModal: boolean;
  closeModal: Function;
  onUser?: (data: any) => void;
  setTechnicians: Function;
  selectedTechnicians: Users[];
  type: string;
}

export function ItemResponsiblesModal(props: EditEntityModalProps) {
  const [openModal, setOpenModal] = useState(false);
  const [responsibles, setResponsibles] = useState<any[] | []>([]);
  const [selectedResponsibles, setSelectedResponsibles] = useState<any[] | []>(
    [],
  );

  const { t } = useTranslation();

  const usersTableName = import.meta.env.VITE_TABLE_USERS;
  const userRolesTableName = import.meta.env.VITE_TABLE_USER_ROLES;

  useEffect(() => {
    setOpenModal(props.showModal);

    const fetchData = async () => {
      if (props.type === "roles") {
        const usersWithRole = await getUsersJoinRoles(
          usersTableName,
          userRolesTableName,
        );

        if (usersWithRole.data != null) {
          // Inicializa selectedResponsibles con los técnicos seleccionados
          setSelectedResponsibles(props.selectedTechnicians);

          const initialResponsibles = usersWithRole.data.map((user) => ({
            ...user,
            selected: props.selectedTechnicians.some(
              (selected) => selected.id === user.id,
            ),
          }));
          setResponsibles(initialResponsibles);
        }
      } else {
        const allUsers = await getAll("users");
        if (allUsers.data) {
          setSelectedResponsibles(props.selectedTechnicians);
          const initialResponsibles = allUsers.data.map((user) => ({
            ...user,
            selected: props.selectedTechnicians.some(
              (selected) => selected.id === user.id,
            ),
          }));
          setResponsibles(initialResponsibles);
        }
      }
    };

    fetchData();
  }, [props.showModal, props.selectedTechnicians]);

  // Este efecto se ejecutará cada vez que las props cambien
  useEffect(() => {
    // Actualiza selectedResponsibles con los técnicos seleccionados
    setSelectedResponsibles(props.selectedTechnicians);
  }, [props.selectedTechnicians]);

  const close = () => {
    setOpenModal(false);
    setSelectedResponsibles(props.selectedTechnicians);
    props.closeModal();
  };

  const handleCheckboxChange = (index: number) => {
    const updatedResponsibles = [...responsibles];
    const user = updatedResponsibles[index];

    if (user && user.selected !== undefined) {
      user.selected = !user.selected;
      setResponsibles(updatedResponsibles);

      // Actualizar responsables seleccionados
      const selected = updatedResponsibles.filter((user) => user.selected);
      setSelectedResponsibles(selected);
    }
  };

  const handleSelectAll = () => {
    const allSelected = responsibles.every((user) => user.selected);

    const updatedResponsibles = responsibles.map((user) => ({
      ...user,
      selected: !allSelected,
    }));

    setResponsibles(updatedResponsibles);

    // Actualizar responsables seleccionados
    const selected = !allSelected ? updatedResponsibles : [];
    setSelectedResponsibles(selected);
  };

  const handleAddResponsibles = () => {
    props.setTechnicians(
      selectedResponsibles.map((responsible) => ({
        id: responsible.id,
        name: responsible.name,
        surname: responsible.surname,
        email: responsible.email,
      })),
    );

    // Cerrar el modal
    setOpenModal(false);
    props.closeModal();
  };

  const isAllSelected =
    responsibles.length > 0 && responsibles.every((user) => user.selected);
  return (
    <Modal dismissible show={openModal} onClose={() => close()}>
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        <strong>{t("REPONSIBLES")}</strong>
      </Modal.Header>

      <Modal.Body className="max-h-[65vh]">
        <div className="overflow-hidden">
          <Table>
            <Table.Head>
              <Table.HeadCell>
                <Checkbox
                  checked={isAllSelected}
                  onChange={() => handleSelectAll()}
                />
              </Table.HeadCell>
              <Table.HeadCell>{t("NAME")}</Table.HeadCell>
              <Table.HeadCell>{t("SURNAME")}</Table.HeadCell>
              <Table.HeadCell>{t("EMAIL")}</Table.HeadCell>
              <Table.HeadCell>{t("PROFILE")}</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {responsibles.map((user, index) => (
                <Table.Row
                  key={user.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="">
                    <Checkbox
                      checked={user.selected}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                    {user.name}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                    {user.surname}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                    {user.email}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                    {responsibles[index].role &&
                    responsibles[index].role.title === "Administrador" ? (
                      <div className="container items-center flex flex-row max-w-max px-4 bg-pink-100  rounded-full">
                        <label className="font-medium text-pink-800">
                          {responsibles[index].role.title}
                        </label>
                      </div>
                    ) : responsibles[index].role &&
                      responsibles[index].role.title === "Técnico" ? (
                      <div className="container items-center flex flex-row max-w-max px-4 bg-blue-100 rounded-full">
                        <label className="font-medium text-blue-800">
                          {responsibles[index].role.title}
                        </label>
                      </div>
                    ) : (
                      <div className="container items-center flex flex-row max-w-max px-4 bg-blue-100 rounded-full">
                        <label className="font-medium text-blue-800">
                          Ciudadano
                        </label>
                      </div>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex place-content-end">
        {props.selectedTechnicians.length === 0 ? (
          <Button
            size={"sm"}
            className="bg-primary"
            onClick={handleAddResponsibles}
          >
            {t("ADD_BTN")}
          </Button>
        ) : (
          <Button
            size={"sm"}
            className="bg-primary"
            onClick={handleAddResponsibles}
          >
            {t("EDIT_BTN")}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
