/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import ListPageWithPagination from "../../../../components/ListPage/ListPageWithPagination";
import { getEntities } from "../../../../server/supabaseQueries";
import { AlertContext } from "../../../../context/AlertContext";
import { useNavigate } from "react-router-dom";
import { EmailModal } from "../components/EmailModal";

export const EmailsListPage = () => {
  /**
   * Configuración de la página
   */
  const entity_table = "emails";
  const columns = ["created_at", "subject", "content", "state"];
  const page_title = "EMAILS_LIST_TITLE";
  const breadcrumb = [
    {
      title: "COMMUNICATIONS",
    },
    {
      title: "EMAILS",
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

  const [alertMsg] = useState("");
  const [actionAlert] = useState("");

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [emailSelected, setEmailSelected] = useState<any>(null);

  const user = JSON.parse(localStorage.getItem("userLogged")!);
  const userGroupId = localStorage.getItem("groupSelected")!;
  let showAll: boolean;
  let userGroup: string | null;
  let userCreatedBy: string;

  useEffect(() => {
    if (user) {
      if (!user.users_roles.rules.communication.emails.access_module) {
        openAlert("No tienes acceso a esta página", "error");
        navigate("/");
      } else {
        userCreatedBy = user.id;
        !user.users_roles.rules.communication.emails.read_all &&
        user.users_roles.rules.communication.emails.read_group
          ? (userGroup = userGroupId)
          : null;
        showAll = user.users_roles.rules.communication.emails.read_all;
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
    setEmailSelected(item);
    setIsOpenModal(true);
  };

  const newItem = () => {
    setEmailSelected(null);
    setIsOpenModal(true);
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
        disableAddButton={!user.users_roles.rules.communication.warnings.create}
        showCleanFilter={false}
      />
      {isOpenModal ? (
        <EmailModal
          openModal={isOpenModal}
          closeModal={() => setIsOpenModal(false)}
          item={emailSelected}
          onEmail={() => getDataFromServer(orderBy, orderDir)}
          onDeleteEmail={() => getDataFromServer(orderBy, orderDir)}
        />
      ) : null}
    </>
  );
};
