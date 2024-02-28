/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  Checkbox,
  CustomFlowbiteTheme,
  Table,
} from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { HiTrash } from "react-icons/hi";
import { InscriptionDiscountsModal } from "../modals/InscriptionDiscountsModal";
import { useTranslation } from "react-i18next";
import { Discount } from "../../models/Discounts";
import { InscriptionFormContext } from "../../context/InscriptionFormContext";

interface discountsProps {
  discounts: Discount[];
}

export const InscriptionDiscountsTable = (props: discountsProps) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [updateProduct, setUpdateProduct] = useState<any>();
  const [editedRowIndex, setEditedRowIndex] = useState<number | undefined>(
    undefined,
  );
  const [newDiscounts, setNewDiscounts] = useState<Discount[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>(props.discounts);
  const [discountsToUpdate, setDiscountsToUpdate] = useState<any[]>([]);
  const [discountsToDelete, setDiscountsToDelete] = useState<any[]>([]);
  const contextMethods = useContext(InscriptionFormContext);

  const { t } = useTranslation();

  const customTheme: CustomFlowbiteTheme["card"] = {
    root: {
      children: "flex h-full flex-col justify-start gap-4 p-6",
    },
  };

  useEffect(() => {
    setDiscounts(props.discounts);
  }, [props.discounts]);

  const handleDeleteRow = (index: number) => {
    const newProducts = [...discounts!];
    const toDelete = [...discountsToDelete];
    toDelete.push(newProducts[index]);
    newProducts.splice(index, 1);
    setDiscounts(newProducts);
    setDiscountsToDelete(toDelete);
    contextMethods.updateDiscounts(newProducts);
    contextMethods.updateDiscountsToDelete(toDelete);
  };

  const handleOpenModal = () => {
    setAddModalOpen(true);
  };

  const handleUpdatedModal = (data: any, index: number) => {
    setEditedRowIndex(index);
    setUpdateProduct(data);
    setEditModalOpen(true);
  };

  const updateProducts = (data: Discount, index: number | undefined) => {
    if (index !== undefined) {
      const updatedInputs = [...discounts];
      const toUpdate = [...discountsToUpdate];
      updatedInputs[index] = { ...updatedInputs[index], ...data };
      if (
        !toUpdate[toUpdate.findIndex((e) => e.id === updatedInputs[index].id)]
      ) {
        toUpdate.push(updatedInputs[index]);
      } else {
        toUpdate[toUpdate.findIndex((e) => e.id === updatedInputs[index].id)] =
          updatedInputs[index];
      }
      setDiscounts(updatedInputs);
      setDiscountsToUpdate(toUpdate);
      contextMethods.updateDiscounts(updatedInputs);
      contextMethods.updateDiscountsToUpdate(toUpdate);
    } else {
      // Si el índice es nulo, agrega una nueva fila
      const prevInputs = [...discounts];
      const insertInputs = [...newDiscounts];
      insertInputs.push(data);
      prevInputs.push(data);
      setDiscounts(prevInputs);
      setNewDiscounts(insertInputs);
      contextMethods.updateDiscounts(prevInputs);
    }
  };

  return (
    <Card theme={customTheme}>
      <div className="flex items-center justify-between">
        <h1 className="font-bold dark:text-white">
          Listado de productos adicionales
        </h1>
      </div>
      <div>
        {discounts && (
          <>
            <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <Table.Head className="bg-gray-100 dark:bg-gray-700">
                <Table.HeadCell>Nombre</Table.HeadCell>
                <Table.HeadCell>Cantidad</Table.HeadCell>
                <Table.HeadCell>Método</Table.HeadCell>
                <Table.HeadCell>Habilitado</Table.HeadCell>
                <Table.HeadCell></Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {discounts.map((item, index) => (
                  <Table.Row
                    key={index}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleUpdatedModal(item, index)}
                  >
                    <Table.Cell className="flex items-center max-w-md text-base font-medium text-gray-900 dark:text-white ">
                      {item.title}
                    </Table.Cell>
                    <Table.Cell className="max-w-md text-base font-medium text-gray-900 dark:text-white ">
                      {item.amount}
                    </Table.Cell>
                    <Table.Cell className="max-w-md text-base font-medium text-gray-900 dark:text-white ">
                      {t(item.discount_type!)}
                    </Table.Cell>
                    <Table.Cell className="max-w-md text-base font-medium text-gray-900 dark:text-white ">
                      <Checkbox
                        checked={item.enabled}
                        readOnly
                        className="cursor-pointer flex justify-center"
                      />
                    </Table.Cell>
                    <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white ">
                      <HiTrash
                        className="text-xl  text-red-500"
                        onClick={(e: any) => {
                          e.stopPropagation();
                          handleDeleteRow(index);
                        }}
                      />
                    </Table.Cell>
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
                Nuevo descuento o incremento
              </Button>
            </div>
            {addModalOpen ? (
              <InscriptionDiscountsModal
                openModal={addModalOpen}
                onCloseModal={() => setAddModalOpen(false)}
                setInputs={(data) => updateProducts(data, undefined)}
              />
            ) : null}
            {editModalOpen ? (
              <InscriptionDiscountsModal
                item={updateProduct}
                openModal={editModalOpen}
                onCloseModal={() => setEditModalOpen(false)}
                editedRowIndex={editedRowIndex}
                setInputs={(data) => updateProducts(data, editedRowIndex)}
              />
            ) : null}
          </>
        )}
      </div>
    </Card>
  );
};
