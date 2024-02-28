/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TablePlaceholder } from "../TablePlaceholder";
import ContentTypeComponent from "./ContentTypeComponent";
import StateComponent from "./StatesComponent";
import { StatusSocketRenderComponent } from "./StatusSocketRenderComponent";
import { PriorityComponent } from "./PriorityComponent";

interface ContentTableProps {
  data: any[];
  columns: string[];
  loading: boolean;
  onItemClick: (item: any) => void;
  onDataToExport: (data: any) => void;
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
        onDataToExport(arr2);
      } else {
        onDataToExport([]);
      }
    }
  }, [tableData]);

  return (
    <>
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <Table.Head className="bg-gray-100 dark:bg-gray-700">
          {tableColumns.includes("order_concept") && (
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
                {tableColumns.includes("order_concept") && (
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
                      <StatusSocketRenderComponent item={item} />
                    ) : column === "payment_state" ||
                      column === "order_state" ? (
                      item[column] === "PENDING" ||
                      item[column] === "IN_PROGRESS" ? (
                        <div className="container items-center flex flex-row max-w-max px-4 bg-yellow-100 rounded-full">
                          <label className="font-medium text-yellow-800">
                            {t(item[column])}
                          </label>
                        </div>
                      ) : item[column] === "CONFIRMED" ||
                        item[column] === "COMPLETED" ? (
                        <div className="container items-center flex flex-row max-w-max px-4 bg-green-100 rounded-full">
                          <label className="font-medium text-green-800">
                            {t(item[column])}
                          </label>
                        </div>
                      ) : item[column] === "DENIED" ||
                        item[column] === "CANCELED" ||
                        item[column] === "ERROR" ? (
                        <div className="container items-center flex flex-row max-w-max px-4 bg-red-100 rounded-full">
                          <label className="font-medium text-red-800">
                            {t(item[column])}
                          </label>
                        </div>
                      ) : null
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
                    ) : column === "state" ? (
                      <StateComponent state={item[column]} />
                    ) : column === "content_type" ? (
                      <ContentTypeComponent type={item[column]} />
                    ) : column === "priority" ? (
                      <PriorityComponent priority={item[column]} />
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
