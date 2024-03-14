/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import ListPageWithPagination from "../../../../components/ListPage/ListPageWithPagination";
import { getEntities } from "../../../../server/supabaseQueries";
import { AlertContext } from "../../../../context/AlertContext";
import { useNavigate } from "react-router-dom";
import { NotificationsModal } from "../components/NotificationsModal";

export const NotificationsListPage = () => {
  /**
   * Configuración de la página
   */
  const entity_table = "notifications";
  const columns = ["created_at", "title", "content", "module", "navigable"];
  const page_title = "NOTIFICATIONS_LIST_TITLE";
  const breadcrumb = [
    {
      title: "COMMUNICATIONS",
    },
    {
      title: "NOTIFICATIONS",
    },
  ];

  const navigate = useNavigate();
  const { openAlert } = useContext(AlertContext);
  /**
   * Definición de datos
   */
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

  const [totalItems, setTotalItems] = useState<number>(0);

  const [initRange, setInitRange] = useState(1);
  const [endRange, setEndRange] = useState(pageSize);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [itemSelected, setItemSelected] = useState<any>(null);

  const [alertMsg] = useState("");
  const [actionAlert] = useState("");

  const user = JSON.parse(localStorage.getItem("userLogged")!);
  let showAll: boolean;
  let userGroup: string | null;
  let userCreatedBy: string;

  useEffect(() => {
    if (user) {
      if (!user.users_roles.rules.communication.push.access_module) {
        openAlert("No tienes acceso a esta página", "error");
        navigate("/");
      } else {
        userCreatedBy = user.id;
        userGroup = null;
        showAll = user.users_roles.rules.communication.push.read;
      }
    }
  }, [user]);

  useEffect(() => {
    setInitRange((currentPage - 1) * pageSize + 1);
    setEndRange(currentPage * pageSize);
    setLoading(true);
    if (itemSearch) {
      search(currentPage);
    } else {
      const fetchData = async () => {
        getDataFromServer(orderBy, orderDir);
      };

      fetchData();
    }
    setLoading(false);
  }, [orderBy, orderDir, itemSearch, searchTerm, currentPage, pageSize]);

  const changeSize = (count: number) => {
    setCurrentPage(1);
    setPageSize(count);
  };

  const getDataFromServer = (orderBy: string, orderDir: string) => {
    setLoading(true);
    getEntities(
      entity_table,
      currentPage,
      pageSize,
      orderBy,
      orderDir,
      userCreatedBy,
      showAll,
      userGroup,
      "",
    ).then((result) => {
      const { data, totalItems } = result;
      setTotalItems(totalItems);
      setTotalPages(Math.ceil(totalItems / pageSize));

      setData(data ? data : []);
      setLoading(false);
    });
    setItemSearch(false);
  };

  const search = async (page: number) => {
    setInitRange((page - 1) * pageSize + 1);
    setEndRange(page * pageSize);
    const { data, totalItems } = await getEntities(
      entity_table,
      currentPage,
      pageSize,
      orderBy,
      orderDir,
      userCreatedBy,
      showAll,
      userGroup,
      searchTerm,
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
    setItemSelected(null);
    openModal();
  };

  const onSearch = async (
    searchTerm: string,
    orderBy: string,
    orderDir: string,
  ) => {
    setCurrentPage(1);
    setSearchTerm(searchTerm);
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

  const openModal = () => {
    setIsOpenModal(true);
  };

  return (
    <>
      <ListPageWithPagination
        page_title={page_title}
        entity_table={entity_table}
        columns={columns}
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
        disableAddButton={!user.users_roles.rules.bookings.installations.create}
        showCleanFilter={false}
      />
      {isOpenModal ? (
        <NotificationsModal
          openModal={isOpenModal}
          closeModal={() => setIsOpenModal(false)}
          item={itemSelected}
          onCreateNotification={() => getDataFromServer(orderBy, orderDir)}
        />
      ) : null}
    </>
  );
};
