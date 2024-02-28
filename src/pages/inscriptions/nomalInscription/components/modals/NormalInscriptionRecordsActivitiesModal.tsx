/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Dropdown, Modal, Table, Tabs } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { supabase } from "../../../../../server/supabase";
import {
  LuClipboardCheck,
  LuClipboardList,
  LuDownload,
  LuFileClock,
  LuMoreVertical,
} from "react-icons/lu";
import { getOneRow, updateRow } from "../../../../../server/supabaseQueries";
import { AlertContext } from "../../../../../context/AlertContext";
import { TablePlaceholder } from "../../../../../components/TablePlaceholder";
import { createXLs } from "../../../../../utils/utils";

interface NormalInscriptionRecordsActivitiesModalProps {
  item?: any;
  openModal: boolean;
  onCloseModal: (data: any) => void;
  activityName: string;
}
export const NormalInscriptionRecordsActivitiesModal = (
  props: NormalInscriptionRecordsActivitiesModalProps,
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activitiesConfirmed, setActivitiesConfirmed] = useState<any[]>([]);
  const [activitiesPending, setActivitiesPending] = useState<any[]>([]);
  const [activitiesWaiting, setActivitiesWaiting] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataToExport, setDataToExport] = useState<any[]>([]);
  const { openAlert } = useContext(AlertContext);

  useEffect(() => {
    setIsOpen(props.openModal);
  }, [props.openModal]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const confirmed: any[] = [];
      const pending: any[] = [];
      const waiting: any[] = [];
      const recordProductsDb = await supabase
        .from("inscriptions_record_products")
        .select("*")
        .eq("product_id", props.item.id);
      if (recordProductsDb.data) {
        for await (const recordproduct of recordProductsDb.data) {
          const recordDb = await supabase
            .from("inscriptions_records")
            .select(
              "*, users!inscriptions_records_user_id_fkey(name, surname, document, email, phone)",
            )
            .eq("id", recordproduct.record_id);
          if (recordDb.data) {
            recordDb.data.forEach((data: any) => {
              data.record_product_id = recordproduct.id;
              if (
                recordproduct.state === "CONFIRMED" ||
                recordproduct.state === "COMPLETED"
              ) {
                confirmed.push(data);
              } else if (recordproduct.state === "PENDING") {
                pending.push(data);
              } else if (recordproduct.state === "IN_PROGRESS") {
                waiting.push(data);
              }
            });
          }
        }
      }
      setActivitiesConfirmed(confirmed);
      setActivitiesPending(pending);
      setActivitiesWaiting(waiting);
      const exportData = confirmed;
      exportData.forEach((data) => {
        data.state = "Confirmado";
      });
      setDataToExport(exportData);
      setIsLoading(false);
    };
    fetchData();
  }, [props.item]);

  const close = () => {
    setIsOpen(false);
    props.onCloseModal(true);
  };

  const changeState = async (activityId: string, state: string) => {
    const activityDb = await getOneRow(
      "id",
      activityId,
      "inscriptions_record_products",
    );
    if (activityDb) {
      activityDb.state = state;
      const activityUpdated = await updateRow(
        activityDb,
        "inscriptions_record_products",
      );
      if (activityUpdated) {
        openAlert("Registro actualizado correctamente", "update");
      } else {
        openAlert("Ha ocurrido un error actualizando el registro", "error");
      }
    }
    refreshData();
  };

  const refreshData = async () => {
    setIsLoading(true);
    const confirmed: any[] = [];
    const pending: any[] = [];
    const waiting: any[] = [];
    const recordProductsDb = await supabase
      .from("inscriptions_record_products")
      .select("*")
      .eq("product_id", props.item.id);
    if (recordProductsDb.data) {
      for await (const recordproduct of recordProductsDb.data) {
        const recordDb = await supabase
          .from("inscriptions_records")
          .select(
            "*, users!inscriptions_records_user_id_fkey(name, surname, document, email, phone)",
          )
          .eq("id", recordproduct.record_id);
        if (recordDb.data) {
          recordDb.data.forEach((data: any) => {
            data.record_product_id = recordproduct.id;
            if (
              recordproduct.state === "CONFIRMED" ||
              recordproduct.state === "COMPLETED"
            ) {
              confirmed.push(data);
            } else if (recordproduct.state === "PENDING") {
              pending.push(data);
            } else if (recordproduct.state === "IN_PROGRESS") {
              waiting.push(data);
            }
          });
        }
      }
    }
    setActivitiesConfirmed(confirmed);
    setActivitiesPending(pending);
    setActivitiesWaiting(waiting);
    const exportData = confirmed;
    exportData.forEach((data) => {
      data.state = "Confirmado";
    });
    setDataToExport(exportData);
    setIsLoading(false);
  };

  const onChangeTab = (tabIndex: number) => {
    if (tabIndex === 0) {
      const exportData = [...activitiesConfirmed];
      exportData.forEach((data) => {
        data.state = "Confirmado";
      });
      setDataToExport(exportData);
    } else if (tabIndex === 1) {
      const exportData = [...activitiesPending];
      exportData.forEach((data) => {
        data.state = "Pendiente";
      });
      setDataToExport(exportData);
    } else if (tabIndex === 2) {
      const exportData = [...activitiesWaiting];
      exportData.forEach((data) => {
        data.state = "Lista de espera";
      });
      setDataToExport(exportData);
    }
  };

  const exportData = () => {
    const headers: string[] = [
      "Registro",
      "Nombre",
      "Apellidos",
      "NIF/NIE",
      "Email",
      "Teléfono",
      "Estado",
    ];
    let arr1: any[] = [];
    const arr2: any[] = [[...headers]];
    dataToExport.forEach((data) => {
      arr1 = [];
      arr1.push(
        new Date(data.created_at).toLocaleString("es"),
        data.users.name,
        data.users.surname,
        data.users.document,
        data.users.email,
        data.users.phone,
        data.state,
      );
      arr2.push(arr1);
    });
    createXLs(
      arr2.length > 0 ? arr2 : [],
      `Registros actividades ${props.activityName}`,
    );
  };

  return (
    <Modal
      dismissible
      onClose={() => close()}
      show={isOpen}
      size={"6xl"}
      className="z-40"
    >
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        {props.activityName}
      </Modal.Header>
      <Modal.Body className="max-h-[70vh] overflow-auto">
        {dataToExport.length > 0 ? (
          <div className="flex justify-end">
            <Button onClick={exportData} color="success">
              <LuDownload className="mr-2" />
              Exportar listado
            </Button>
          </div>
        ) : null}
        <Tabs.Group onActiveTabChange={(e) => onChangeTab(e)}>
          <Tabs.Item title="Confirmados">
            <Table>
              <Table.Head className="bg-gray-100 dark:bg-gray-700">
                <Table.HeadCell>Registro</Table.HeadCell>
                <Table.HeadCell>Nombre</Table.HeadCell>
                <Table.HeadCell>Apellidos</Table.HeadCell>
                <Table.HeadCell>NIF/NIE</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Teléfono</Table.HeadCell>
                <Table.HeadCell>Acciones</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {!isLoading ? (
                  <>
                    {activitiesConfirmed && activitiesConfirmed.length > 0 ? (
                      activitiesConfirmed.map((activity) => (
                        <Table.Row
                          key={activity.id}
                          className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                            {new Date(activity.created_at).toLocaleString("es")}
                          </Table.Cell>
                          <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                            {activity.users.name}
                          </Table.Cell>
                          <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                            {activity.users.surname}
                          </Table.Cell>
                          <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                            {activity.users.document}
                          </Table.Cell>
                          <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                            {activity.users.email}
                          </Table.Cell>
                          <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                            {activity.users.phone}
                          </Table.Cell>
                          <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                            <Dropdown
                              label=""
                              dismissOnClick={false}
                              renderTrigger={() => (
                                <span className="cursor-pointer rounded-full hover:bg-gray-200">
                                  <LuMoreVertical size={24} />
                                </span>
                              )}
                            >
                              {props.item.waiting_list ? (
                                <Dropdown.Item
                                  onClick={() =>
                                    changeState(
                                      activity.record_product_id,
                                      "IN_PROGRESS",
                                    )
                                  }
                                >
                                  <LuClipboardList className="text-blue-500" />
                                  <p className="ml-2 text-blue-500">
                                    Cambiar a lista de espera
                                  </p>
                                </Dropdown.Item>
                              ) : null}
                              <Dropdown.Item
                                onClick={() =>
                                  changeState(
                                    activity.record_product_id,
                                    "PENDING",
                                  )
                                }
                              >
                                <LuFileClock className="text-yellow-500" />
                                <p className="ml-2 text-yellow-500">
                                  Cambiar a pendiente
                                </p>
                              </Dropdown.Item>
                            </Dropdown>
                          </Table.Cell>
                        </Table.Row>
                      ))
                    ) : (
                      <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        <Table.Cell
                          className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white text-center"
                          colSpan={7}
                        >
                          No hay registros
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </>
                ) : (
                  <TablePlaceholder />
                )}
              </Table.Body>
            </Table>
          </Tabs.Item>
          <Tabs.Item title="Pendientes">
            <Table>
              <Table.Head className="bg-gray-100 dark:bg-gray-700">
                <Table.HeadCell>Registro</Table.HeadCell>
                <Table.HeadCell>Nombre</Table.HeadCell>
                <Table.HeadCell>Apellidos</Table.HeadCell>
                <Table.HeadCell>NIF/NIE</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Teléfono</Table.HeadCell>
                <Table.HeadCell>Acciones</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {!isLoading ? (
                  <>
                    {activitiesPending && activitiesPending.length > 0 ? (
                      activitiesPending.map((activity) => (
                        <Table.Row
                          key={activity.id}
                          className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                            {new Date(activity.created_at).toLocaleString("es")}
                          </Table.Cell>
                          <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                            {activity.users.name}
                          </Table.Cell>
                          <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                            {activity.users.surname}
                          </Table.Cell>
                          <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                            {activity.users.document}
                          </Table.Cell>
                          <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                            {activity.users.email}
                          </Table.Cell>
                          <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                            {activity.users.phone}
                          </Table.Cell>
                          <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                            <Dropdown
                              label=""
                              dismissOnClick={false}
                              renderTrigger={() => (
                                <span className="cursor-pointer rounded-full hover:bg-gray-200">
                                  <LuMoreVertical size={24} />
                                </span>
                              )}
                            >
                              {props.item.waiting_list ? (
                                <Dropdown.Item
                                  onClick={() =>
                                    changeState(
                                      activity.record_product_id,
                                      "IN_PROGRESS",
                                    )
                                  }
                                >
                                  <LuClipboardList className="text-blue-500" />
                                  <p className="ml-2 text-blue-500">
                                    Cambiar a lista de espera
                                  </p>
                                </Dropdown.Item>
                              ) : null}
                              <Dropdown.Item
                                onClick={() =>
                                  changeState(
                                    activity.record_product_id,
                                    "CONFIRMED",
                                  )
                                }
                              >
                                <LuClipboardCheck className="text-yellow-500" />
                                <p className="ml-2 text-yellow-500">
                                  Confirmar registro
                                </p>
                              </Dropdown.Item>
                            </Dropdown>
                          </Table.Cell>
                        </Table.Row>
                      ))
                    ) : (
                      <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        <Table.Cell
                          className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white text-center"
                          colSpan={7}
                        >
                          No hay registros
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </>
                ) : (
                  <TablePlaceholder />
                )}
              </Table.Body>
            </Table>
          </Tabs.Item>
          {props.item.waiting_list ? (
            <Tabs.Item title="Lista de espera">
              <Table>
                <Table.Head className="bg-gray-100 dark:bg-gray-700">
                  <Table.HeadCell>Registro</Table.HeadCell>
                  <Table.HeadCell>Nombre</Table.HeadCell>
                  <Table.HeadCell>Apellidos</Table.HeadCell>
                  <Table.HeadCell>NIF/NIE</Table.HeadCell>
                  <Table.HeadCell>Email</Table.HeadCell>
                  <Table.HeadCell>Teléfono</Table.HeadCell>
                  <Table.HeadCell>Acciones</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                  {!isLoading ? (
                    <>
                      {activitiesWaiting && activitiesWaiting.length > 0 ? (
                        activitiesWaiting.map((activity) => (
                          <Table.Row
                            key={activity.id}
                            className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                              {new Date(activity.created_at).toLocaleString(
                                "es",
                              )}
                            </Table.Cell>
                            <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                              {activity.users.name}
                            </Table.Cell>
                            <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                              {activity.users.surname}
                            </Table.Cell>
                            <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                              {activity.users.document}
                            </Table.Cell>
                            <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                              {activity.users.email}
                            </Table.Cell>
                            <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                              {activity.users.phone}
                            </Table.Cell>
                            <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                              <Dropdown
                                label=""
                                dismissOnClick={false}
                                renderTrigger={() => (
                                  <span className="cursor-pointer rounded-full hover:bg-gray-200">
                                    <LuMoreVertical size={24} />
                                  </span>
                                )}
                              >
                                <Dropdown.Item
                                  onClick={() =>
                                    changeState(
                                      activity.record_product_id,
                                      "PENDING",
                                    )
                                  }
                                >
                                  <LuFileClock className="text-yellow-500" />
                                  <p className="ml-2 text-yellow-500">
                                    Cambiar a pendiente
                                  </p>
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() =>
                                    changeState(
                                      activity.record_product_id,
                                      "CONFIRMED",
                                    )
                                  }
                                >
                                  <LuClipboardCheck className="text-blue-500" />
                                  <p className="ml-2 text-blue-500">
                                    Confirmar registro
                                  </p>
                                </Dropdown.Item>
                              </Dropdown>
                            </Table.Cell>
                          </Table.Row>
                        ))
                      ) : (
                        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                          <Table.Cell
                            className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white text-center"
                            colSpan={7}
                          >
                            No hay registros
                          </Table.Cell>
                        </Table.Row>
                      )}
                    </>
                  ) : (
                    <TablePlaceholder />
                  )}
                </Table.Body>
              </Table>
            </Tabs.Item>
          ) : null}
        </Tabs.Group>
      </Modal.Body>
    </Modal>
  );
};
