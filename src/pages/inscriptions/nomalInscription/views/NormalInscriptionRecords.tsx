/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  CustomFlowbiteTheme,
  Dropdown,
  Label,
  Pagination,
  Select,
  Table,
  Tabs,
  TextInput,
} from "flowbite-react";
import { t } from "i18next";
import { useContext, useEffect, useState } from "react";
import { HiHome, HiOutlineArrowLeft } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import { TablePlaceholder } from "../../../../components/TablePlaceholder";
import { AlertContext } from "../../../../context/AlertContext";
import { supabase } from "../../../../server/supabase";
import { NormalInscriptionRecordsActivitiesModal } from "../components/modals/NormalInscriptionRecordsActivitiesModal";
import { NormalInscriptionRecordsModal } from "../components/modals/NormalInscriptionRecordsModal";
import { getInscriptionsRecords } from "../data/NormalInscriptioProvider";
import { getOneRow } from "../../../../server/supabaseQueries";

export default function NormalInscriptionRecords() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inscription, setInscription] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [initRange, setInitRange] = useState(1);
  const [endRange, setEndRange] = useState(pageSize);

  const [totalItemsRecords, setTotalItemsRecords] = useState(0);

  const [inscriptionActivities, setInscriptionActivities] = useState<any[]>([]);
  const [isOpenActivitiesModal, setIsOpenActivitiesModal] = useState(false);
  const [activitySelected, setActivitySelected] = useState<any>(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [dataToExport, setDataToExport] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenRecordsModal, setIsOpenRecordsModal] = useState(false);
  const [recordSelected, setRecordSelected] = useState<any>(null);
  const registerStates = [
    "CONFIRMED",
    "COMPLETED",
    "IN_PROGRESS",
    "DENIED",
    "CANCELED",
    "PENDING",
    "ERROR",
  ];
  const [filteredDate, setFilteredDate] = useState("");
  const [dateInitFiltered, setDateInitFiltered] = useState("");
  const [dateEndFiltered, setDateEndFiltered] = useState("");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [singleDateToFilter, setSingleDateToFilter] = useState("");
  //const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const user = JSON.parse(localStorage.getItem("userLogged")!);
  const { openAlert } = useContext(AlertContext);

  let showAll: boolean;
  let userCreatedBy: string;

  useEffect(() => {
    if (user) {
      if (!user.users_roles.rules.inscriptions.records.access_module) {
        openAlert("No tienes acceso a esta página", "error");
        navigate("/");
      } else {
        userCreatedBy = user.id;
        showAll = user.users_roles.rules.inscriptions.records.read;
      }
    }
  }, [user]);

  useEffect(() => {
    if (id) {
      setInitRange((currentPage - 1) * pageSize + 1);
      setEndRange(currentPage * pageSize);
      if (user.users_roles.rules.inscriptions.records.read) {
        getDataFromServer();
      }
    }
  }, [
    id,
    currentPage,
    pageSize,
    selectedStates,
    dateInitFiltered,
    dateEndFiltered,
    singleDateToFilter,
  ]);

  useEffect(() => {
    if (filteredDate === "TODAY" || filteredDate === "YESTERDAY") {
      setDateInitFiltered("");
      setDateEndFiltered("");
    }
  }, [filteredDate]);

  const handleStateChange = (state: string, checked: boolean) => {
    if (checked) {
      const selected = [...selectedStates, state];
      setSelectedStates(selected);
    } else {
      const selected = selectedStates.filter((s) => s != state);
      setSelectedStates(selected);
    }
  };

  const changeSize = (count: number) => {
    setCurrentPage(1);
    setPageSize(count);
  };

  const openActivitiesModal = (activity: any) => {
    setActivitySelected(activity);
    setIsOpenActivitiesModal(true);
  };

  const afterCloseModal = (value: boolean) => {
    if (value) {
      getDataFromServer();
    }
    setIsOpenActivitiesModal(false);
    setIsOpenRecordsModal(false);
  };

  const getDataFromServer = async () => {
    if (id) {
      setIsLoading(true);
      const inscriptionDb = await getOneRow("id", id, "inscriptions");
      if (inscriptionDb) {
        setInscription(inscriptionDb);
      }
      const customFilterDates: string[] = [];
      if (filteredDate !== "CUSTOM") {
        if (singleDateToFilter !== "") {
          customFilterDates.push(singleDateToFilter);
        }
      } else {
        if (dateInitFiltered !== "" && dateEndFiltered !== "") {
          customFilterDates.push(dateInitFiltered, dateEndFiltered);
        }
      }
      const recordsDb = await getInscriptionsRecords(
        currentPage,
        pageSize,
        id,
        userCreatedBy,
        showAll,
        customFilterDates,
        selectedStates,
      );
      if (recordsDb.data && recordsDb.data?.length > 0) {
        setRecords(recordsDb.data);
        setDataToExport(recordsDb.data);
        setTotalItemsRecords(recordsDb.totalItems ? recordsDb.totalItems : 0);
        setTotalPages(Math.ceil(recordsDb.totalItems! / pageSize));
        const recordsProductsDb: any[] = [];
        for await (const record of recordsDb.data) {
          const recordProduct = await supabase
            .from("inscriptions_record_products")
            .select("*, inscriptions_products(title, places)")
            .eq("record_id", record.id);
          if (recordProduct.data) {
            recordProduct.data.forEach((recordData) => {
              recordsProductsDb.push(recordData);
            });
          }
        }
        const activitiesDb = await supabase
          .from("inscriptions_products")
          .select("*")
          .eq("inscription_id", id)
          .order("order", { ascending: true });
        if (activitiesDb.data) {
          activitiesDb.data.forEach((activity: any) => {
            activity.confirmed = 0;
            activity.pending = 0;
            activity.waiting = 0;
          });
          activitiesDb.data.forEach((activity: any) => {
            recordsProductsDb.forEach((recordData) => {
              if (recordData.product_id === activity.id) {
                if (
                  recordData.state === "CONFIRMED" ||
                  recordData.state === "COMPLETED"
                ) {
                  activity.confirmed = activity.confirmed + 1;
                } else if (recordData.state === "PENDING") {
                  activity.pending = activity.pending + 1;
                } else if (recordData.state === "IN_PROGRESS") {
                  activity.waiting = activity.waiting + 1;
                }
              }
            });
          });
          setInscriptionActivities(activitiesDb.data);
        }
      } else {
        setRecords([]);
        setTotalItemsRecords(0);
        const activitiesDb = await supabase
          .from("inscriptions_products")
          .select("*")
          .eq("inscription_id", id)
          .order("order", { ascending: true });
        if (activitiesDb.data) {
          activitiesDb.data.forEach((activity: any) => {
            activity.confirmed = 0;
            activity.pending = 0;
            activity.waiting = 0;
          });
          setInscriptionActivities(activitiesDb.data);
        }
      }
      setIsLoading(false);
    }
  };

  const openRecordsModal = (record: any) => {
    setRecordSelected(record);
    setIsOpenRecordsModal(true);
  };

  const deleteFiltering = () => {
    setFilteredDate("");
    setDateInitFiltered("");
    setDateEndFiltered("");
    setSelectedStates([]);
  };

  const onFilteredDate = (value: any) => {
    if (value === "ALWAYS") {
      setSingleDateToFilter("");
      setFilteredDate("");
    } else if (value === "TODAY") {
      setFilteredDate("TODAY");
      setSingleDateToFilter(new Date().toLocaleDateString());
    } else if (value === "YESTERDAY") {
      setFilteredDate("YESTERDAY");
      const today = new Date();
      const dayInMilliseconds = 24 * 60 * 60 * 1000;
      const yesterday = new Date(
        today.getTime() - dayInMilliseconds,
      ).toLocaleDateString();
      setSingleDateToFilter(yesterday);
    } else if (value === "CUSTOM") {
      setFilteredDate("CUSTOM");
    }
  };

  const customTheme: CustomFlowbiteTheme["dropdown"] = {
    arrowIcon: "ml-2 h-4 w-4",
    content: "py-1 focus:outline-none",
    floating: {
      animation: "transition-opacity",
      arrow: {
        base: "absolute z-10 h-2 w-2 rotate-45",
        style: {
          dark: "bg-gray-900 dark:bg-gray-700",
          light: "bg-white",
          auto: "bg-white dark:bg-gray-700",
        },
        placement: "bottom",
      },
      base: "z-10 w-fit max-h-48 overflow-y-auto rounded divide-y divide-gray-100 shadow focus:outline-none",
      content: "py-1 text-sm text-gray-700 dark:text-gray-200",
      divider: "my-1 h-px bg-gray-100 dark:bg-gray-600",
      header: "block py-2 px-4 text-sm text-gray-700 dark:text-gray-200",
      hidden: "invisible opacity-0",
      item: {
        container: "",
        base: "flex items-center justify-start py-2 px-4 text-sm text-gray-700 cursor-pointer w-full hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white",
        icon: "mr-2 h-4 w-4",
      },
      style: {
        dark: "bg-gray-900 text-white dark:bg-gray-700",
        light: "border border-gray-200 bg-white text-gray-900",
        auto: "border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white",
      },
      target: "w-fit",
    },
    inlineWrapper: "flex items-center",
  };

  return (
    <>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-4 grow">
          <Breadcrumb className="mb-4 mt-2">
            <Breadcrumb.Item href="/">
              <div className="flex items-center gap-x-3">
                <HiHome className="text-xl" />
                <span className="dark:text-white">{t("HOME")}</span>
              </div>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Records</Breadcrumb.Item>
          </Breadcrumb>
          <div className="flex grow gap-4 justify-between">
            <div className="flex items-center">
              <Button
                size="xs"
                color="light"
                className="mr-4"
                onClick={() => history.back()}
              >
                <HiOutlineArrowLeft className="mr-2" />
                {t("BACK")}
              </Button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl mt-1">
                {inscription ? inscription.title : ""}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <Card>
          <Tabs.Group onActiveTabChange={(e) => setActiveTabIndex(e)}>
            <Tabs.Item title="Registros">
              {records.length > 0 ||
              selectedStates.length > 0 ||
              singleDateToFilter !== "" ||
              dateInitFiltered !== "" ? (
                <>
                  <div className="flex gap-4 items-center mb-4">
                    <div>
                      <Label>Fecha de registro:</Label>
                      <Select
                        value={filteredDate}
                        onChange={(e) => onFilteredDate(e.currentTarget.value)}
                        className="mt-1 w-32"
                      >
                        <option value="ALWAYS">Siempre</option>
                        <option value="TODAY">Hoy</option>
                        <option value="YESTERDAY">Ayer</option>
                        <option value="CUSTOM">Intervalo personalizado</option>
                      </Select>
                    </div>
                    {filteredDate === "CUSTOM" && (
                      <>
                        <div>
                          <Label>Fecha inicio:</Label>
                          <div className="mt-1">
                            <TextInput
                              id="initDateInput"
                              defaultValue={dateInitFiltered}
                              onBlur={(e) =>
                                setDateInitFiltered(e.currentTarget.value)
                              }
                              type="date"
                              onChange={(e) => {
                                const startDate = new Date(
                                  e.currentTarget.value,
                                );
                                const endDateInput = document.getElementById(
                                  "endDateInput",
                                ) as HTMLInputElement;
                                if (endDateInput) {
                                  endDateInput.min = startDate
                                    .toISOString()
                                    .split("T")[0];
                                  if (startDate > new Date(dateEndFiltered)) {
                                    setDateEndFiltered(
                                      startDate.toISOString().split("T")[0],
                                    );
                                  }
                                  endDateInput.max = new Date()
                                    .toISOString()
                                    .split("T")[0];
                                  if (new Date() > new Date(dateEndFiltered)) {
                                    setDateEndFiltered(
                                      startDate.toISOString().split("T")[0],
                                    );
                                  }
                                }
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Fecha fin:</Label>
                          <div className="mt-1">
                            <TextInput
                              id="endDateInput"
                              defaultValue={dateEndFiltered}
                              onChange={(e) => {
                                const endDate = new Date(e.currentTarget.value);
                                const startDateInput = document.getElementById(
                                  "initDateInput",
                                ) as HTMLInputElement;
                                if (startDateInput) {
                                  startDateInput.max = endDate
                                    .toISOString()
                                    .split("T")[0];
                                  if (endDate < new Date(dateInitFiltered)) {
                                    setDateInitFiltered(
                                      endDate.toISOString().split("T")[0],
                                    );
                                  }
                                }
                                setDateEndFiltered(e.currentTarget.value);
                              }}
                              type="date"
                            />
                          </div>
                        </div>
                      </>
                    )}
                    <div>
                      <Label>Estado:</Label>
                      <div className="mt-1">
                        <Dropdown
                          theme={customTheme}
                          renderTrigger={({}) => (
                            <button
                              id="dropdownBgHoverButton"
                              data-dropdown-toggle="dropdownBgHover"
                              className="flex items-center justify-between w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg focus:outline-none focus-within:border-2 focus-within:border-cyan-500"
                              type="button"
                            >
                              <span>Estado</span>
                              <svg
                                className="ml-4 h-4 w-4 py-1 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="m1 2 4 4 4-4"
                                />
                              </svg>
                            </button>
                          )}
                          color="gray"
                          label="Estados"
                          dismissOnClick={false}
                        >
                          <Dropdown.Item onClick={deleteFiltering}>
                            Limpiar filtros
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          {registerStates && registerStates.length > 0
                            ? registerStates.map((register, index) => (
                                <Dropdown.Item key={register}>
                                  <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                    <Checkbox
                                      id={`checkbox-item-${index}`}
                                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                      checked={selectedStates.includes(
                                        register,
                                      )}
                                      onChange={(e) =>
                                        handleStateChange(
                                          register,
                                          e.target.checked,
                                        )
                                      }
                                    />
                                    <label className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                                      {t(register)}
                                    </label>
                                  </div>
                                </Dropdown.Item>
                              ))
                            : null}
                        </Dropdown>
                      </div>
                    </div>
                  </div>
                  <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <Table.Head className="bg-gray-100 dark:bg-gray-700">
                      <Table.HeadCell>Estado</Table.HeadCell>
                      <Table.HeadCell>Registro</Table.HeadCell>
                      <Table.HeadCell>Nombre</Table.HeadCell>
                      <Table.HeadCell>Apellidos</Table.HeadCell>
                      <Table.HeadCell>NIF/NIE</Table.HeadCell>
                      <Table.HeadCell>Email</Table.HeadCell>
                      <Table.HeadCell>Teléfono</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                      {!isLoading ? (
                        <>
                          {records.length > 0 &&
                            records.map((record) => (
                              <Table.Row
                                key={record.id}
                                onClick={() => openRecordsModal(record)}
                                className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                              >
                                <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                                  {record.state === "CONFIRMED" ? (
                                    <div className="container items-center flex flex-row max-w-max px-4 bg-green-100 text-green-800  rounded-full font-semibold">
                                      Confirmado
                                    </div>
                                  ) : record.state === "PENDING" ? (
                                    <div className="container items-center flex flex-row max-w-max px-4 bg-yellow-100 text-yellow-800 rounded-full font-semibold">
                                      Pendiente
                                    </div>
                                  ) : record.state === "IN_PROGRESS" ? (
                                    <div className="container items-center flex flex-row max-w-max px-4 bg-orange-100 text-orange-800 rounded-full font-semibold">
                                      En proceso
                                    </div>
                                  ) : record.state === "CANCELED" ? (
                                    <div className="container items-center flex flex-row max-w-max px-4 bg-red-100 text-red-800 rounded-full font-semibold">
                                      Cancelado
                                    </div>
                                  ) : record.state === "COMPLETED" ? (
                                    <div className="container items-center flex flex-row max-w-max px-4 bg-green-100 text-green-800 rounded-full font-semibold">
                                      Completado
                                    </div>
                                  ) : record.state === "DENIED" ? (
                                    <div className="container items-center flex flex-row max-w-max px-4 bg-gray-100 text-gray-800 rounded-full font-semibold">
                                      Denegado
                                    </div>
                                  ) : record.state === "ERROR" ? (
                                    <div className="container items-center flex flex-row max-w-max px-4 bg-red-100 text-red-800 rounded-full font-semibold">
                                      Error
                                    </div>
                                  ) : null}
                                </Table.Cell>
                                <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900  dark:text-white">
                                  {new Date(record.created_at).toLocaleString(
                                    "es",
                                  )}
                                </Table.Cell>
                                <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                                  {record.name}
                                </Table.Cell>
                                <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                                  {record.surname}
                                </Table.Cell>
                                <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                                  {record.document}
                                </Table.Cell>
                                <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                                  {record.email}
                                </Table.Cell>
                                <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                                  {record.phone}
                                </Table.Cell>
                              </Table.Row>
                            ))}
                        </>
                      ) : (
                        <TablePlaceholder />
                      )}
                    </Table.Body>
                  </Table>
                  <div className="flex overflow-x-auto justify-between pt-8 mx-4 items-center">
                    <div className="flex items-center">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page: number) => setCurrentPage(page)}
                        showIcons
                        previousLabel={t("PAGINATION_PREV_PAGE")}
                        nextLabel={t("PAGINATION_NEXT_PAGE")}
                        className="mb-2"
                      />
                      <Select
                        className="ml-4"
                        id="pageSize"
                        value={pageSize}
                        onChange={(
                          event: React.ChangeEvent<HTMLSelectElement>,
                        ) => changeSize(Number(event.target.value))}
                      >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="1000">1000</option>
                      </Select>
                    </div>
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-4">
                      {t("PAGINATION_SHOWING")}&nbsp;
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {initRange}-{endRange}
                      </span>
                      &nbsp;{t("PAGINATION_OF")}&nbsp;
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {totalItemsRecords}
                      </span>
                    </span>
                  </div>
                </>
              ) : (
                <span className=" dark:text-white justify-center flex my-4">
                  No hay registros
                </span>
              )}
            </Tabs.Item>
            <Tabs.Item title="Actividades">
              <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <Table.Head className="bg-gray-100 dark:bg-gray-700">
                  <Table.HeadCell>Título</Table.HeadCell>
                  <Table.HeadCell>Plazas</Table.HeadCell>
                  <Table.HeadCell>Confirmados</Table.HeadCell>
                  <Table.HeadCell>Pendientes</Table.HeadCell>
                  <Table.HeadCell>Lista de espera</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                  {inscriptionActivities.length > 0 ? (
                    inscriptionActivities.map((activity) => (
                      <Table.Row
                        key={activity.id}
                        onClick={() => openActivitiesModal(activity)}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                          {activity.title}
                        </Table.Cell>
                        <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                          {activity.places}
                        </Table.Cell>
                        <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                          {activity.confirmed}
                        </Table.Cell>
                        <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                          {activity.pending}
                        </Table.Cell>
                        <Table.Cell className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white">
                          {activity.waiting_list
                            ? activity.waiting
                            : "Sin lista de espera"}
                        </Table.Cell>
                      </Table.Row>
                    ))
                  ) : (
                    <Table.Row>
                      <Table.Cell
                        colSpan={5}
                        className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white text-center"
                      >
                        No hay actividades
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
              {isOpenActivitiesModal ? (
                <NormalInscriptionRecordsActivitiesModal
                  item={activitySelected}
                  openModal={isOpenActivitiesModal}
                  onCloseModal={(value) => afterCloseModal(value)}
                  activityName={activitySelected.title}
                />
              ) : null}
              {isOpenRecordsModal ? (
                <NormalInscriptionRecordsModal
                  openModal={isOpenRecordsModal}
                  onCloseModal={(value) => afterCloseModal(value)}
                  item={recordSelected}
                />
              ) : null}
            </Tabs.Item>
          </Tabs.Group>
        </Card>
      </div>
    </>
  );
}
