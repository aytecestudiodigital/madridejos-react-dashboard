/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  Checkbox,
  CustomFlowbiteTheme,
  Table,
} from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiTrash } from "react-icons/hi";
import { LuMoveVertical } from "react-icons/lu";
import { InscriptionFormContext } from "../../context/InscriptionFormContext";
import { InputForm } from "../../models/InputsForm";
import { NewInputFormModal } from "../modals/NewInputFormModal";

interface InscriptionFormInputsProps {
  formType?: "BASIC" | "COMPLETE";
  type: "MAIN" | "AUTH";
  inputsFormMain?: InputForm[];
  inputsFormAuth?: InputForm[];
}
export const InscriptionFormInputsTable = (
  props: InscriptionFormInputsProps,
) => {
  const { t } = useTranslation();
  const [draggedItem, setDraggedItem] = useState<string>("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [inputs, setInputs] = useState<InputForm[]>([]);
  const [newInputs, setNewInputs] = useState<InputForm[]>([]);
  const [updateInput, setUpdateInput] = useState<InputForm>();
  const [updatedMainInputs, setUpdatedMainInputs] = useState<any[]>([]);
  const [updatedAuthInputs, setUpdatedAuthInputs] = useState<any[]>([]);
  const [deletedInputs, setDeletedInputs] = useState<any[]>([]);
  const [deletedAuthInputs, setDeletedAuthInputs] = useState<any[]>([]);
  const [editedRowIndex, setEditedRowIndex] = useState<number | undefined>(
    undefined,
  );
  const contextMethods = useContext(InscriptionFormContext);

  const customTheme: CustomFlowbiteTheme["card"] = {
    root: {
      children: "flex h-full flex-col justify-start gap-4 p-6",
    },
  };

  useEffect(() => {
    if (props.type === "MAIN") {
      contextMethods.updateMainInputs(inputs);
      contextMethods.updateMainInputsToUpdate(inputs);
    } else {
      contextMethods.updateAuthInputs(inputs);
      contextMethods.updateAuthInputsToUpdate(inputs);
    }
  }, [inputs]);

  const closeModal = () => {
    setAddModalOpen(false);
    setEditModalOpen(false);
  };

  const handleDeleteRow = (index: number) => {
    const newInputs = [...inputs!];
    const mainInputsToDelete = [...deletedInputs];
    const authInputsToDelete = [...deletedAuthInputs];
    if (props.type === "MAIN") {
      mainInputsToDelete.push(newInputs[index]);
    } else {
      authInputsToDelete.push(newInputs[index]);
    }
    newInputs.splice(index, 1);
    setInputs(newInputs);
    setDeletedInputs(mainInputsToDelete);
    setDeletedAuthInputs(authInputsToDelete);
    if (props.type === "MAIN") {
      contextMethods.updateMainInputs(newInputs);
      contextMethods.updateMainInputsToDelete(mainInputsToDelete);
    } else {
      contextMethods.updateAuthInputs(newInputs);
      contextMethods.updateAuthInputsToDelete(authInputsToDelete);
    }
  };

  const handleOpenModal = () => {
    setAddModalOpen(true);
  };

  useEffect(() => {
    const basicInputs = [
      {
        deleteable: false,
        enabled: true,
        data_user: "NAME",
        required: true,
        title: "Nombre",
        type: "NAME",
        order: 0,
      },
      {
        deleteable: false,
        enabled: true,
        data_user: "SURNAME",
        required: true,
        title: "Apellidos",
        type: "SURNAME",
        order: 1,
      },
      {
        deleteable: false,
        enabled: true,
        data_user: "NIF",
        required: true,
        title: "NIF/NIE",
        type: "NIF",
        order: 2,
      },
      {
        deleteable: false,
        enabled: true,
        data_user: "EMAIL",
        required: true,
        title: "Email",
        type: "EMAIL",
        order: 3,
      },
      {
        deleteable: true,
        enabled: true,
        data_user: "PHONE",
        required: true,
        title: "Teléfono",
        type: "PHONE",
        order: 4,
      },
    ] as InputForm[];

    const completeInputs = [
      {
        deleteable: false,
        enabled: true,
        data_user: "NAME",
        required: true,
        title: "Nombre",
        type: "NAME",
        order: 0,
      },
      {
        deleteable: false,
        enabled: true,
        data_user: "SURNAME",
        required: true,
        title: "Apellidos",
        type: "SURNAME",
        order: 1,
      },
      {
        deleteable: false,
        enabled: true,
        data_user: "NIF",
        required: true,
        title: "NIF/NIE",
        type: "NIF",
        order: 2,
      },
      {
        deleteable: false,
        enabled: true,
        data_user: "EMAIL",
        required: true,
        title: "Email",
        type: "EMAIL",
        order: 3,
      },
      {
        deleteable: true,
        enabled: true,
        data_user: "PHONE",
        required: true,
        title: "Teléfono",
        type: "PHONE",
        order: 4,
      },
      {
        deleteable: true,
        enabled: true,
        data_user: "DATE_BIRTH",
        required: true,
        title: "F. Nacimiento",
        type: "NADATE_BIRTHME",
        order: 5,
      },
      {
        deleteable: true,
        enabled: true,
        data_user: "ADDRESS",
        required: true,
        title: "Dirección",
        type: "ADDRESS",
        order: 6,
      },
      {
        deleteable: true,
        enabled: true,
        data_user: "PROVINCE",
        required: true,
        title: "Provicia",
        type: "PROVINCE",
        order: 7,
      },
      {
        deleteable: true,
        enabled: true,
        data_user: "LOCALITY",
        required: true,
        title: "Población",
        type: "LOCALITY",
        order: 8,
      },
      {
        deleteable: true,
        enabled: true,
        data_user: "POSTAL_CODE",
        required: true,
        title: "Código Postal",
        type: "POSTAL_CODE",
        order: 9,
      },
    ] as InputForm[];

    props.formType
      ? props.formType === "BASIC"
        ? setInputs(basicInputs)
        : setInputs(completeInputs)
      : props.type === "MAIN"
        ? setInputs(props.inputsFormMain ? props.inputsFormMain : [])
        : setInputs(props.inputsFormAuth ? props.inputsFormAuth : []);
  }, [props.formType, props.type, props.inputsFormMain, props.inputsFormAuth]);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropItemId: string) => {
    e.preventDefault();
    const newOrder = [...inputs];

    const draggedIndex = inputs.findIndex(
      (item: any) => item.order === parseInt(draggedItem),
    );
    const dropIndex = inputs.findIndex(
      (item: any) => item.order === parseInt(dropItemId),
    );

    if (draggedIndex !== -1 && dropIndex !== -1 && draggedIndex !== dropIndex) {
      // Reorganizar el array localmente
      const [draggedItem] = newOrder.splice(draggedIndex, 1);
      newOrder.splice(dropIndex, 0, draggedItem);

      for (let i = 0; i < newOrder.length; i++) {
        const item = newOrder[i];
        item.order = i;
      }

      // Implementar lógica para actualizar el orden en la base de datos

      setInputs(newOrder);
    }

    setDraggedItem("");
  };

  const updateInputs = (data: any, index: number | undefined) => {
    if (index !== undefined) {
      const updatedInputs = [...inputs];
      const toUpdateMain = [...updatedMainInputs];
      const toUpdateAuth = [...updatedAuthInputs];
      updatedInputs[index] = { ...updatedInputs[index], ...data };
      if (props.type === "MAIN") {
        if (
          !toUpdateMain[
            toUpdateMain.findIndex((e) => e.id === updatedInputs[index].id)
          ]
        ) {
          toUpdateMain.push(updatedInputs[index]);
        } else {
          toUpdateMain[
            toUpdateMain.findIndex((e) => e.id === updatedInputs[index].id)
          ] = updatedInputs[index];
        }
        contextMethods.updateMainInputsToUpdate(toUpdateMain);
        contextMethods.updateMainInputs(updatedInputs);
      } else {
        if (
          !toUpdateAuth[
            toUpdateAuth.findIndex((e) => e.id === updatedInputs[index].id)
          ]
        ) {
          toUpdateAuth.push(updatedInputs[index]);
        }
        contextMethods.updateAuthInputsToUpdate(toUpdateAuth);
        contextMethods.updatedAuthInputs(updatedInputs);
      }
      setInputs(updatedInputs);
      setUpdatedMainInputs(toUpdateMain);
      setUpdatedAuthInputs(toUpdateAuth);
    } else {
      // Si el índice es nulo, agrega una nueva fila
      const prevInputs = [...inputs];
      const insertInputs = [...newInputs];
      insertInputs.push(data);
      prevInputs.push(data);
      setInputs(prevInputs);
      setNewInputs(insertInputs);
      if (props.type === "MAIN") {
        contextMethods.updateMainInputs(prevInputs);
      } else {
        contextMethods.updateAuthInputs(prevInputs);
      }
    }
  };

  const handleUpdatedModal = (data: any, index: number) => {
    setEditedRowIndex(index);
    setUpdateInput(data);
    setEditModalOpen(true);
  };

  return (
    <Card theme={customTheme}>
      <div className="flex items-center justify-between">
        <h1 className="font-bold dark:text-white">Campos del formulario</h1>
      </div>
      <div>
        {inputs && (
          <>
            <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <Table.Head className="bg-gray-100 dark:bg-gray-700">
                <Table.HeadCell>{t("TITLE")}</Table.HeadCell>
                <Table.HeadCell>Tipo</Table.HeadCell>
                {/* <Table.HeadCell>Dato del usuario</Table.HeadCell> */}
                <Table.HeadCell>Obligatorio</Table.HeadCell>
                <Table.HeadCell>Habilitado</Table.HeadCell>
                <Table.HeadCell></Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {inputs.map((item, index) => (
                  <Table.Row
                    key={index}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleUpdatedModal(item, index)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index.toString())}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index.toString())}
                  >
                    <Table.Cell className="flex items-center max-w-md p-4 text-base font-medium text-gray-900 dark:text-white ">
                      <LuMoveVertical className="mr-2" />
                      {item.title}
                    </Table.Cell>
                    <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white ">
                      {t(item.type!)}
                    </Table.Cell>
                    {/*  <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white ">
                      {item.data_user}
                    </Table.Cell> */}
                    <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white ">
                      <Checkbox
                        checked={item.required}
                        readOnly
                        className="cursor-pointer flex justify-center"
                      />
                    </Table.Cell>
                    <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white ">
                      <Checkbox
                        checked={item.enabled}
                        readOnly
                        className="cursor-pointer flex justify-center"
                      />
                    </Table.Cell>
                    {item.deleteable ? (
                      <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white ">
                        <HiTrash
                          className="text-xl  text-red-500"
                          onClick={(e: any) => {
                            e.stopPropagation();
                            handleDeleteRow(index);
                          }}
                        />
                      </Table.Cell>
                    ) : null}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <div className="mt-8 flex justify-center">
              <Button
                className="w-96 text-primary"
                size="xs"
                color="light"
                onClick={handleOpenModal}
              >
                Añadir campo
              </Button>
            </div>
            {addModalOpen ? (
              <NewInputFormModal
                openModal={addModalOpen}
                closeModal={closeModal}
                inputs={inputs}
                setInputs={(data) => updateInputs(data, undefined)}
              />
            ) : null}

            {editModalOpen ? (
              <NewInputFormModal
                item={updateInput}
                openModal={editModalOpen}
                closeModal={closeModal}
                inputs={inputs}
                editedRowIndex={editedRowIndex}
                setInputs={(data) => updateInputs(data, editedRowIndex)}
              />
            ) : null}
          </>
        )}
      </div>
    </Card>
  );
};
