/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListPageWithPagination from "../../../../components/ListPage/ListPageWithPagination";
import { AlertContext } from "../../../../context/AlertContext";
import { TicketModal } from "../components/TicketModal";
import {
  TicketProductsStates,
  getAllEventsToDropdown,
  getTicketsProductsAndRelatedData,
} from "../data/TicketsProvider";

export const TicketsListPage = () => {
  const navigate = useNavigate();
  const entity_table = "tickets";
  const columns = [
    "limit_date_init",
    "formalisation_date",
    "owner_name",
    "owner_surname",
    "owner_nif",
    "tickets_title",
    "tickets_products_title",
    "state",
  ];
  const columnsFilters = ["formalisation_date"];
  const page_title = "EVENTS_LIST";
  const breadcrumb = [
    {
      title: "EVENTS_LIST",
    },
  ];
  const columnsDropdown = ["formalisation_date"];
  const columnsDropdownData = [
    { id: "ALWAYS", title: "Siempre" },
    { id: "TODAY", title: "Hoy" },
    { id: "YESTERDAY", title: "Ayer" },
    { id: "CUSTOM", title: "Intervalo personalizado" },
  ];
  const secondDolumnsDropdown = ["tickets_title"];
  const thirdDolumnsDropdown = ["tickets_products"];
  const fourthDropdownData = [
    "CONFIRMED",
    "IN_PROGRESS",
    "CANCELED",
    "PENDING",
    "COMPLETED",
    "DENIED",
    "ERROR",
  ] as TicketProductsStates[];
  const fourthColumnsDropdown = ["state"];
  const fifthColumnsDropdown = ["type"];
  //const tickectsProductsTypes = ["TICKET", "SUBSCRIPTION"] as TicketProductsTypes[];
  const fifthDropdownData = [
    { id: "TICKET", title: "Entrada" },
    { id: "SUBSCRIPTION", title: "Abono" },
  ];
  /**
   * Definición de datos
   */
  const { openAlert } = useContext(AlertContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);

  /**
   * Buscador y ordenación
   */
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [itemSearch, setItemSearch] = useState(false);

  const [orderBy, setOrderBy] = useState<string>("created_at");
  const [orderDir, setOrderDir] = useState<string>("DESC");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [totalItems, setTotalItems] = useState<number>(0);

  const [initRange, setInitRange] = useState(1);
  const [endRange, setEndRange] = useState(pageSize);

  const [alertMsg] = useState("");
  const [actionAlert] = useState("");
  const [filteredDates, setFilteredDates] = useState<string[]>([]);
  const [filteredEvent, setFilteredEvent] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<string[]>([]);
  const [filteredState, setFilteredState] = useState<string[]>([]);
  const [filteredType, setFilteredType] = useState<string[]>([]);

  const [eventsToDropdown, setEventsToDropdown] = useState<any[] | undefined>(
    [],
  );
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [itemSelected, setItemSelected] = useState<any>(null);

  const [showCleanFilter, setShowClearFilters] = useState(false);

  const user = JSON.parse(localStorage.getItem("userLogged")!);

  let showAll: boolean;
  let userCreatedBy: string;

  const getDataToEventsDropdown = async () => {
    const events = await getAllEventsToDropdown();
    setEventsToDropdown(events);
  };

  useEffect(() => {
    if (user) {
      if (!user.users_roles.rules.tickets.events.access_module) {
        openAlert("No tienes acceso a esta página", "error");
        navigate("/");
      } else {
        userCreatedBy = user.id;
        showAll = user.users_roles.rules.tickets.events.read_all;
      }
    }
  }, [user]);

  console.log(
    itemSearch,
    filteredDates,
    filteredEvent,
    filteredProducts,
    filteredState,
    filteredType,
  );
  useEffect(() => {
    setInitRange((currentPage - 1) * pageSize + 1);
    setEndRange(currentPage * pageSize);
    setLoading(true);
    getDataToEventsDropdown();
    if (
      itemSearch ||
      filteredDates.length > 0 ||
      filteredEvent.length > 0 ||
      filteredProducts.length > 0 ||
      filteredState.length > 0 ||
      filteredType.length > 0
    ) {
      search(currentPage);
      setShowClearFilters(true);
    } else {
      const fetchData = async () => {
        getDataFromServer(orderBy, orderDir, currentPage, pageSize);
        setShowClearFilters(false);
      };
      fetchData();
    }
    setLoading(false);
  }, [
    orderBy,
    orderDir,
    itemSearch,
    searchTerm,
    currentPage,
    pageSize,
    filteredDates,
    filteredEvent,
    filteredProducts,
    filteredState,
    filteredType,
  ]);

  const changeSize = (count: number) => {
    setCurrentPage(1);
    setPageSize(count);
  };

  const getDataFromServer = (
    orderBy: string,
    orderDir: string,
    page: number,
    size: number,
  ) => {
    setLoading(true);

    getTicketsProductsAndRelatedData(
      page,
      size,
      orderBy,
      orderDir,
      userCreatedBy,
      showAll,
    ).then((result) => {
      const { totalItems, data } = result;
      setData(data ? data : []);
      setTotalItems(totalItems);
      setTotalPages(Math.ceil(totalItems / pageSize));
      if (currentPage == totalPages) setEndRange(totalItems);
      setLoading(false);
    });
    setItemSearch(false);
  };

  const search = async (page: number) => {
    setInitRange((page - 1) * pageSize + 1);
    setEndRange(page * pageSize);

    const { totalItems, data } = await getTicketsProductsAndRelatedData(
      page,
      pageSize,
      orderBy,
      orderDir,
      userCreatedBy,
      showAll,
      searchTerm,
      filteredDates,
      filteredState,
      filteredEvent,
      filteredProducts,
      filteredType,
    );

    setData(data ? data : []);
    setTotalItems(totalItems);
    setTotalPages(Math.ceil(totalItems / pageSize));
  };

  const clickOnItem = (item: any) => {
    setItemSelected(item);
    setIsOpenModal(true);
  };

  const newItem = () => {
    navigate(`/tickets/events/new`);
  };

  const onSearch = async (
    searchTerm: string,
    orderBy: string,
    orderDir: string,
    filteredDates?: string[],
    filteredEven?: string[],
    filteredProduct?: string[],
    filteredState?: string[],
    filteredType?: string[],
  ) => {
    setCurrentPage(1);
    setSearchTerm(searchTerm);
    setFilteredDates(filteredDates ? filteredDates : []);
    setFilteredEvent(filteredEven ? filteredEven : []);
    setFilteredProducts(filteredProduct ? filteredProduct : []);
    setFilteredState(filteredState ? filteredState : []);
    setFilteredType(filteredType ? filteredType : []);
    setItemSearch(searchTerm !== "" ? true : false);
    setOrderBy(orderBy);
    setOrderDir(orderDir);
  };

  const onClearSearch = () => {
    setCurrentPage(1);
    setSearchTerm("");
    setItemSearch(false);
    setInitRange((currentPage - 1) * pageSize + 1);
    setEndRange(currentPage * pageSize);
  };

  return (
    <>
      <ListPageWithPagination
        page_title={page_title}
        entity_table={entity_table}
        columns={columns}
        columnsFilter={columnsFilters}
        breadcrumb={breadcrumb}
        onSearch={onSearch}
        onClearSearch={onClearSearch}
        newItem={newItem}
        data={data}
        loading={loading}
        clickOnItem={clickOnItem}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page: number) => setCurrentPage(page)}
        pageSize={pageSize}
        onChangeSize={changeSize}
        totalItems={totalItems}
        initRange={initRange}
        endRange={endRange}
        isOpen={openAlert}
        alertMsg={alertMsg}
        action={actionAlert}
        showButtonSave={false}
        disableAddButton={!user.users_roles.rules.tickets.events.create}
        showOrder={false}
        columnsDropdown={columnsDropdown}
        dataDropdown={columnsDropdownData}
        columnsSecondDropdown={secondDolumnsDropdown}
        secondDataDropdown={eventsToDropdown}
        columnsThirdDropdown={thirdDolumnsDropdown}
        thirdDataDropdown={[]}
        columnsFourthDropdown={fourthColumnsDropdown}
        fourthDataDropdown={fourthDropdownData}
        columnsFifthDropdown={fifthColumnsDropdown}
        fifthDataDropdown={fifthDropdownData}
        showCleanFilter={showCleanFilter}
      />
      {isOpenModal ? (
        <TicketModal
          openModal={isOpenModal}
          closeModal={() => setIsOpenModal(false)}
          item={itemSelected}
          onUpdateTicket={() =>
            getDataFromServer(orderBy, orderDir, currentPage, pageSize)
          }
        />
      ) : null}
    </>
  );
};
