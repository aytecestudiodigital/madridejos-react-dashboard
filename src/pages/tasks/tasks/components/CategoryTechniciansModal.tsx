import { Button, Checkbox, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface CategoryTechniciansModalProps {
  openModal: boolean;
  closeModal: () => void;
  technicians: any[];
  onTechniciansSelected: (data: any) => void;
}

export const CategoryTechniciansModal = (
  props: CategoryTechniciansModalProps,
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [technicians, setTechnicians] = useState<any[]>([]);

  useEffect(() => {
    setIsOpen(props.openModal);
  }, [props.openModal]);

  useEffect(() => {
    if (props.technicians.length > 0) {
      props.technicians.forEach((tech) => {
        tech.checked = false;
      });
      setTechnicians(props.technicians);
    }
  }, [props.technicians]);

  const close = () => {
    setIsOpen(false);
    props.closeModal();
  };

  const handleCheck = (check: boolean, id: string) => {
    const newData = [...technicians];
    newData[newData.findIndex((element) => element.users.id === id)].checked =
      check;
    setTechnicians(newData);
  };

  const handleCheckAll = (check: boolean) => {
    const newData = [...technicians];
    newData.forEach((data) => {
      data.checked = check;
    });
    setTechnicians(newData);
  };

  const assignTechs = () => {
    const assigned: any[] = [];
    const techs: any[] = [...technicians];
    techs.forEach((tech) => {
      if (tech.checked) {
        assigned.push(tech);
      }
    });
    props.onTechniciansSelected(assigned);
    close();
  };

  return (
    <Modal dismissible onClose={() => close()} show={isOpen} size={"2xl"}>
      <Modal.Header>Técnicos de la categoría</Modal.Header>
      <Modal.Body>
        <div className="flex gap-4">
          <Button
            onClick={() => handleCheckAll(true)}
            className="text-blue-500"
            color="light"
          >
            Seleccionar todos
          </Button>
          <Button
            onClick={() => handleCheckAll(false)}
            className="text-black-500"
            color="light"
          >
            Deseleccionar
          </Button>
        </div>
        <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600 mt-4">
          <Table.Head className="bg-gray-100 dark:bg-gray-700">
            <Table.HeadCell></Table.HeadCell>
            <Table.HeadCell>Nombre</Table.HeadCell>
            <Table.HeadCell>Apellidos</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {technicians.length > 0 ? (
              technicians.map((tech: any) => (
                <Table.Row
                  key={tech.users.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                    <Checkbox
                      checked={tech.checked}
                      onChange={(e) =>
                        handleCheck(e.currentTarget.checked, tech.users.id)
                      }
                    />
                  </Table.Cell>
                  <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                    {tech.users.name}
                  </Table.Cell>
                  <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                    {tech.users.surname}
                  </Table.Cell>
                  <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                    {tech.users.email}
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                <Table.Cell
                  className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white "
                  colSpan={4}
                >
                  No hay técnicos asignados a esta categoría
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        {technicians.length > 0 ? (
          <Button size={"sm"} onClick={assignTechs} color="primary">
            Asignar
          </Button>
        ) : null}
      </Modal.Footer>
    </Modal>
  );
};
