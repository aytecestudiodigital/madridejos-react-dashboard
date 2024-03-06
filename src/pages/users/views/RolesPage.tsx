/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListPageWithPagination from "../../../components/ListPage/ListPageWithPagination";
import { getEntities } from "../../../server/supabaseQueries";
import { AddRoleModal } from "../components/componentsRoles/AddRoleModal";
import { t } from "i18next";
import { AlertContext } from "../../../context/AlertContext";

export default function RolePage() {
  const navigate = useNavigate();

  const entity_table = import.meta.env.VITE_TABLE_USER_ROLES;
  const columns = ["title", "created_at"];
  const page_title = "USERS_ROLES_LIST_TITLE";
  const breadcrumb = [
    {
      title: "USERS",
      path: "/users",
    },
    {
      title: "USERS_ROLES",
    },
  ];

  /**
   * Definición de datos
   */
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);

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
  const { openAlert } = useContext(AlertContext);
  const user = JSON.parse(localStorage.getItem("userLogged")!);

  useEffect(() => {
    if (user) {
      if (!user.users_roles.rules.mod_users.roles.access_module) {
        openAlert("No tienes acceso a esta página", "error");
        navigate("/");
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
        getDataFromServer(orderBy, orderDir, currentPage, pageSize);
      };

      fetchData();
    }
    setLoading(false);
  }, [orderBy, orderDir, itemSearch, searchTerm, currentPage, pageSize]);

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
    getEntities(entity_table, page, size, orderBy, orderDir, "").then(
      (result) => {
        const { totalItems, data } = result;
        setData(data ? data : []);
        setTotalItems(totalItems);
        setTotalPages(Math.ceil(totalItems / pageSize));
        setLoading(false);
      },
    );
    setItemSearch(false);
  };

  const search = async (page: number) => {
    setInitRange((page - 1) * pageSize + 1);
    setEndRange(page * pageSize);
    const { totalItems, data } = await getEntities(
      entity_table,
      currentPage,
      pageSize,
      orderBy,
      orderDir,
      searchTerm,
    );
    setData(data ? data : []);
    setTotalItems(totalItems);
    setTotalPages(Math.ceil(totalItems / pageSize));
  };

  const clickOnItem = (item: any) => {
    navigate(`/users/roles/permissions/${item.id}`);
  };

  const newItem = () => {
    setShowAddModal(true);
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

  const closeModal = () => {
    setShowAddModal(false);
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
        disableAddButton={!user.users_roles.rules.mod_users.roles.create}
      />
      {showAddModal ? (
        <AddRoleModal
          onRole={(role: any) => {
            {
              setData((prevRole) => [...prevRole, role]);
              openAlert(t("ADD_USER_ROLE_OK"), "insert");
            }
          }}
          openModal={showAddModal}
          closeModal={closeModal}
        />
      ) : null}
    </>
  );
}
