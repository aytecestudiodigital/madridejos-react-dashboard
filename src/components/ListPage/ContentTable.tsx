/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TablePlaceholder } from "../TablePlaceholder";
import ContentTypeComponent from "./ContentTypeComponent";
import StateComponent from "./StatesComponent";
/* import { StatusSocketRenderComponent } from "./StatusSocketRenderComponent"; */
import { PriorityComponent } from "./PriorityComponent";
import { truncateContent } from "../../utils/utils";

interface ContentTableProps {
  data: any[];
  columns: string[];
  loading: boolean;
  onItemClick: (item: any) => void;
  onDataToExport: (data: any, fileName: string) => void;
}

export function ContentTable({
  data = [],
  columns = ["title", "created_at", "created_by"],
  loading = false,
  onItemClick,
  onDataToExport,
}: ContentTableProps) {
  const { t } = useTranslation();
  const [tableData, setData] = useState<any[]>([]);
  const [tableColumns, setColumns] = useState<string[]>(columns);
  const [tableLoading, setLoading] = useState<boolean>(loading);
  const [checkAll, setCheckAll] = useState<boolean>(false);

  useEffect(() => {
    const formattedData = data.map((item) => {
      if (item.created_at) {
        item.created_at = new Date(item.created_at);
      }
      if (item.order_created_at) {
        item.order_created_at = new Date(item.order_created_at);
      }
      if (item.order_concept) {
        item.checked = false;
      }
      if (item.formalisation_date) {
        item.checked = false;
      }
      return item;
    });
    setData(formattedData);
    setColumns(columns);
    setLoading(loading);
  }, [data, columns, loading]);

  const handleCheckAll = (check: boolean) => {
    const newData = [...tableData];
    newData.forEach((data) => {
      data.checked = check;
    });
    setData(newData);
    setCheckAll(check);
  };

  const handleCheck = (check: boolean, id: string) => {
    const newData = [...tableData];
    newData[newData.findIndex((element) => element.id === id)].checked = check;
    setData(newData);
  };

  useEffect(() => {
    const dataToSend: any[] = [];
    const newData = [...tableData];
    newData.forEach((data) => {
      if (data.checked === true) {
        dataToSend.push(data);
      }
    });
    if (tableColumns.includes("order_concept")) {
      if (dataToSend.length > 0) {
        const headers: string[] = [
          "Método",
          "Cantidad €",
          "Concepto",
          "Email",
          "Nombre",
          "Apellidos",
          "Teléfono",
          "Estado",
        ];
        let arr1: any[] = [];
        const arr2: any[] = [[...headers]];
        dataToSend.forEach((data) => {
          arr1 = [];
          arr1.push(
            data.method_title,
            data.order_amount,
            data.order_concept,
            data.order_user_email,
            data.order_user_name,
            data.order_user_surname,
            data.order_user_phone,
            t(data.order_state),
          );
          arr2.push(arr1);
        });
        onDataToExport(arr2, "Lista de operaciones");
      } else {
        onDataToExport([], "");
      }
    }

    if (tableColumns.includes("formalisation_date")) {
      if (dataToSend.length > 0) {
        const headers: string[] = [
          "Fecha límite",
          "Fecha de formalización",
          "Nombre",
          "Apellidos",
          "Documento",
          "Evento",
          "Entrada",
          "Estado",
          "Precio",
        ];
        let arr1: any[] = [];
        const arr2: any[] = [[...headers]];
        dataToSend.forEach((data) => {
          arr1 = [];
          arr1.push(
            data.limit_date_init
              ? new Date(data.limit_date_init).toLocaleString()
              : "No definido",
            new Date(data.formalisation_date).toLocaleString(),
            data.owner_name,
            data.owner_surname,
            data.owner_nif,
            data.tickets_title,
            data.tickets_products_title,
            t(data.state),
            data.price,
          );
          arr2.push(arr1);
        });
        onDataToExport(arr2, "Lista de entradas");
      } else {
        onDataToExport([], "");
      }
    }
  }, [tableData]);

  const formatDate = (timestamp: any) => {
    const date = new Date(timestamp);

    const day = date.getDate();
    const month = date.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Agrega un cero inicial si los minutos o segundos son menores que 10
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${day}/${month}/${year}, ${hours}:${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <>
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <Table.Head className="bg-gray-100 dark:bg-gray-700">
          {(tableColumns.includes("order_concept") ||
            tableColumns.includes("formalisation_date")) && (
            <Table.HeadCell>
              <Checkbox
                defaultChecked={checkAll}
                onClick={(e) => handleCheckAll(e.currentTarget.checked)}
              />
            </Table.HeadCell>
          )}
          {tableColumns.map((column, index) => (
            <Table.HeadCell key={index}>
              {t(`${column.toUpperCase()}`)}
            </Table.HeadCell>
          ))}
        </Table.Head>
        <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {tableLoading ? (
            <TablePlaceholder />
          ) : (
            tableData &&
            tableData.map((item) => (
              <Table.Row
                key={item.id ? item.id : item.payment_id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                {(tableColumns.includes("order_concept") ||
                  tableColumns.includes("formalisation_date")) && (
                  <Table.Cell>
                    <Checkbox
                      checked={item.checked}
                      onChange={(e) =>
                        handleCheck(e.currentTarget.checked, item.id)
                      }
                    />
                  </Table.Cell>
                )}
                {tableColumns.map((column, index) => (
                  <Table.Cell
                    key={`${item.id}_${column}_${index}`}
                    className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white "
                    onClick={() => onItemClick(item)}
                  >
                    {(typeof item[column] === "boolean" &&
                      column === "enabled") ||
                    column === "enable" ? (
                      item[column] ? (
                        <div className="container items-center flex flex-row max-w-max px-4 bg-blue-100 rounded-full">
                          <label className="font-medium text-blue-800">
                            {t("ENABLE")}
                          </label>
                        </div>
                      ) : (
                        <div className="container items-center flex flex-row max-w-max px-4 bg-pink-100  rounded-full">
                          <label className="font-medium text-pink-800">
                            {t("ENABLE_FALSE")}
                          </label>
                        </div>
                      )
                    ) : column === "status" ? (
                      {/* <StatusSocketRenderComponent item={item} /> */}
                    ) : column === "payment_state" ||
                      column === "order_state" ||
                      column === "state" ? (
                      <StateComponent state={item[column]} />
                    ) : column === "order_amount" ? (
                      <label>{t(item[column])} €</label>
                    ) : typeof item[column] === "boolean" ? (
                      item[column] ? (
                        t("YES")
                      ) : (
                        t("NO")
                      )
                    ) : item[column] instanceof Date ? (
                      item[column].toLocaleString("es")
                    ) : column === "formalisation_date" ||
                      column === "limit_date_init" ? (
                      item[column] != null ? (
                        formatDate(item[column])
                      ) : (
                        "No especificada"
                      )
                    ) : column === "limit_date_init" ? (
                      item[column] != null ? (
                        item[column].toLocaleString("es")
                      ) : (
                        "No especificada"
                      )
                    ) : column === "content_type" ? (
                      <ContentTypeComponent type={item[column]} />
                    ) : column === "priority" ? (
                      <PriorityComponent priority={item[column]} />
                    ) : column === "content" ? (
                      truncateContent(item[column], 50)
                    ) : (
                      t(item[column])
                    )}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
    </>
  );
}
