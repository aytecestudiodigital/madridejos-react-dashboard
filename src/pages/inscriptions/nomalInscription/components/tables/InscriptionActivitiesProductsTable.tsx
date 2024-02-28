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
import { InscriptionActivitiesProductsModal } from "../modals/InscriptionActivitiesProductsModal";
import { Product } from "../../models/Products";
import { InscriptionFormContext } from "../../context/InscriptionFormContext";

interface productsTableProps {
  products: Product[];
  maxProductsSelected: any;
}
export const InscriptionActivitiesProductsTable = (
  props: productsTableProps,
) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [updateProduct, setUpdateProduct] = useState<any>();
  const [editedRowIndex, setEditedRowIndex] = useState<number | undefined>(
    undefined,
  );
  const [newProducts, setNewProducts] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>(props.products);
  const [productsToDelete, setProductsToDelete] = useState<any[]>([]);
  const [productsToUpdate, setProductsToUpdate] = useState<any[]>([]);
  const contextMethods = useContext(InscriptionFormContext);

  const customTheme: CustomFlowbiteTheme["card"] = {
    root: {
      children: "flex h-full flex-col justify-start gap-4 p-6",
    },
  };

  useEffect(() => {
    props.products.sort((a: any, b: any) => a.order - b.order);
    setProducts(props.products);
  }, [props.products]);

  const handleDeleteRow = (index: number) => {
    const newProducts = [...products!];
    const toDelete = [...productsToDelete];
    toDelete.push(newProducts[index]);
    newProducts.splice(index, 1);
    setProducts(newProducts);
    setProductsToDelete(toDelete);
    contextMethods.updateMainActivities(newProducts);
    contextMethods.updateMainActivitiesToDelete(toDelete);
  };

  const handleOpenModal = () => {
    setAddModalOpen(true);
  };

  const handleUpdatedModal = (data: any, index: number) => {
    setEditedRowIndex(index);
    setUpdateProduct(data);
    setEditModalOpen(true);
  };

  const updateProducts = (data: any, index: number | undefined) => {
    if (index !== undefined) {
      const updatedInputs = [...products];
      const toUpdate = [...productsToUpdate];
      updatedInputs[index] = { ...updatedInputs[index], ...data };
      if (
        !toUpdate[toUpdate.findIndex((e) => e.id === updatedInputs[index].id)]
      ) {
        toUpdate.push(updatedInputs[index]);
      } else {
        toUpdate[toUpdate.findIndex((e) => e.id === updatedInputs[index].id)] =
          updatedInputs[index];
      }
      setProducts(updatedInputs);
      setProductsToUpdate(toUpdate);
      contextMethods.updateMainActivities(updatedInputs);
      contextMethods.updateMainActivitiesToUpdate(toUpdate);
    } else {
      // Si el índice es nulo, agrega una nueva fila
      const prevInputs = [...products];
      const insertInputs = [...newProducts];
      insertInputs.push(data);
      prevInputs.push(data);
      setProducts(prevInputs);
      setNewProducts(insertInputs);
      contextMethods.updateMainActivities(prevInputs);
    }
  };

  return (
    <Card theme={customTheme}>
      <div className="flex items-center justify-between">
        <h1 className="font-bold dark:text-white">Listado de productos</h1>
      </div>
      <div>
        {products && (
          <>
            <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <Table.Head className="bg-gray-100 dark:bg-gray-700">
                <Table.HeadCell>Nombre de la actividad</Table.HeadCell>
                <Table.HeadCell>Plazas</Table.HeadCell>
                <Table.HeadCell>Precio</Table.HeadCell>
                <Table.HeadCell>Obligatorio</Table.HeadCell>
                <Table.HeadCell>Habilitado</Table.HeadCell>
                <Table.HeadCell></Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {products.map((item, index) => (
                  <Table.Row
                    key={index}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleUpdatedModal(item, index)}
                  >
                    <Table.Cell className="flex items-center max-w-md text-base font-medium text-gray-900 dark:text-white ">
                      {item.title}
                    </Table.Cell>
                    <Table.Cell className="max-w-md text-base font-medium text-gray-900 dark:text-white ">
                      {item.places}
                    </Table.Cell>
                    <Table.Cell className="max-w-md text-base font-medium text-gray-900 dark:text-white ">
                      {item.price !== null
                        ? item.price + " €"
                        : "Pago recurrente"}
                    </Table.Cell>
                    <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white ">
                      <Checkbox
                        checked={item.required}
                        readOnly
                        className="cursor-pointer flex justify-center"
                      />
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
                disabled={props.maxProductsSelected === products.length}
                onClick={handleOpenModal}
              >
                Añadir producto
              </Button>
            </div>
            {addModalOpen ? (
              <InscriptionActivitiesProductsModal
                openModal={addModalOpen}
                onCloseModal={() => setAddModalOpen(false)}
                setInputs={(data) => updateProducts(data, undefined)}
                item={null}
                activitiesLength={products.length}
              />
            ) : null}
            {editModalOpen ? (
              <InscriptionActivitiesProductsModal
                item={updateProduct}
                openModal={editModalOpen}
                onCloseModal={() => setEditModalOpen(false)}
                editedRowIndex={editedRowIndex}
                setInputs={(data) => updateProducts(data, editedRowIndex)}
                activitiesLength={products.length}
              />
            ) : null}
          </>
        )}
      </div>
    </Card>
  );
};
