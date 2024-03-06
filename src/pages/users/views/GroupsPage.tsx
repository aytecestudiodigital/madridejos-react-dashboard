/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import ListPageWithPagination from "../../../components/ListPage/ListPageWithPagination";
import { getEntities } from "../../../server/supabaseQueries";
import { AddGroupModal } from "../components/componentsGroups/AddGroupModal";
import { EditGroupModal } from "../components/componentsGroups/EditGroupModal";
import { GroupUsers } from "../models/GroupUser";
import { AlertContext } from "../../../context/AlertContext";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";

export default function GroupsPage() {
  const navigate = useNavigate();
  /**
   * Configuración de la página
   */
  const entity_table = import.meta.env.VITE_TABLE_USER_GROUPS;
  const columns = ["title", "access_all", "created_at"];
  const page_title = "USERS_GROUPS_LIST_TITLE";
  const breadcrumb = [
    {
      title: "USERS",
      path: "/users",
    },
    {
      title: "USERS_GROUPS_LIST_TITLE",
    },
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

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [orderBy, setOrderBy] = useState<string>("created_at");
  const [orderDir, setOrderDir] = useState<string>("DESC");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [item, setItem] = useState<GroupUsers | null>(null);

  const [totalItems, setTotalItems] = useState<number>(0);

  const [initRange, setInitRange] = useState(1);
  const [endRange, setEndRange] = useState(pageSize);
  const [alertMsg] = useState("");
  const [actionAlert] = useState("");

  const user = JSON.parse(localStorage.getItem("userLogged")!);

  useEffect(() => {
    if (user) {
      if (!user.users_roles.rules.mod_users.groups.access_module) {
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
    setItem(item);
    setShowEditModal(true);
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
    setShowEditModal(false);
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
        disableAddButton={!user.users_roles.rules.mod_users.groups.create}
      />
      {showEditModal ? (
        <EditGroupModal
          onItem={(updatedGroup: GroupUsers | null | string) => {
            //Cuando borramos el elemento - actualizar la tabla
            if (updatedGroup === null) {
              getDataFromServer(orderBy, orderDir, currentPage, pageSize);
              openAlert(t("DELETE_GROUP_OK"), "delete");
            } else if (typeof updatedGroup === "string") {
              openAlert(updatedGroup, "error");
            } else {
              // Encuentra el índice del grupo existente en la lista
              const index = data.findIndex(
                (group) => group.id === (updatedGroup as GroupUsers)!.id,
              );

              if (index !== -1) {
                // Si se encuentra, actualiza la lista reemplazando el grupo existente con el actualizado
                setData((prevGroups) => {
                  const updatedGroups = [...prevGroups];
                  updatedGroups[index] = updatedGroup;
                  return updatedGroups;
                });
                openAlert(t("UPDATE_GROUP_OK"), "update");
              } else {
                setData((prevGroups) => [...prevGroups, updatedGroup]);
              }
            }
          }}
          item={item}
          openModal={showEditModal}
          closeModal={closeModal}
        />
      ) : null}
      {showAddModal ? (
        <AddGroupModal
          onItem={(group: GroupUsers | null | string) => {
            {
              const updatedData = [...data, group];
              updatedData.sort((a, b) => {
                const valueA = a[orderBy];
                const valueB = b[orderBy];

                if (typeof valueA === "string" && typeof valueB === "string") {
                  return valueA.localeCompare(valueB);
                } else if (
                  typeof valueA === "number" &&
                  typeof valueB === "number"
                ) {
                  return valueA - valueB;
                } else {
                  return 0;
                }
              });
              getDataFromServer(orderBy, orderDir, currentPage, pageSize);

              openAlert(t("INSERT_GROUP_OK"), "insert");
            }
          }}
          openModal={showAddModal}
          closeModal={closeModal}
        />
      ) : null}
    </>
  );
}
