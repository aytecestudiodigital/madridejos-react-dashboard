/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pagination, Select } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ContentTable } from "../../../components/ListPage/ContentTable";
import { HeaderListPageComponent } from "../../../components/ListPage/HeaderListPage";
import { AlertContext } from "../../../context/AlertContext";
import { getEntities } from "../../../server/supabaseQueries";
import { EntityPageModal } from "./EntityModal";

export default function EntitiesListPage() {
  const navigate = useNavigate();
  /**
   * Configuración de la página
   */
  const entity_table = import.meta.env.VITE_TABLE_CONTENT_ENTITIES;
  const columns = ["title", "description", "enabled"];
  const page_title = "PAGE_CONTENT_ENTITIES_LIST_TITLE";
  const breadcrumb = [
    {
      title: "CONTENT_TYPE",
      path: "#",
    },
    {
      title: "PAGE_CONTENT_ENTITIES_LIST_TITLE",
      path: "#",
    },
  ];

  const { t } = useTranslation();

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

  const [showModal, setShowModal] = useState(false);

  const [orderBy, setOrderBy] = useState<string>("created_at");
  const [orderDir, setOrderDir] = useState<string>("DESC");

  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [initRange, setInitRange] = useState(1);
  const [endRange, setEndRange] = useState(pageSize);
  const [totalPages] = useState<number>(0);

  const user = JSON.parse(localStorage.getItem("userLogged")!);
  const { openAlert } = useContext(AlertContext);

  let showAll: boolean;
  let userGroup: string | null;
  let userCreatedBy: string;

  useEffect(() => {
    if (user) {
      if (!user.users_roles.rules.content.entities.access_module) {
        openAlert("No tienes acceso a esta página", "error");
        navigate("/");
      } else {
        userCreatedBy = user.id;
        user.users_roles.rules.content.entities.read_group === true
          ? (userGroup = "aa15110f-1afd-4408-865a-bd7b6d347719")
          : (userGroup = null);
        showAll = user.users_roles.rules.content.entities.read_all;
      }
    }
  }, [user]);

  useEffect(() => {
    setInitRange((currentPage - 1) * pageSize + 1);
    setEndRange(currentPage * pageSize);
    setLoading(true);
    if (itemSearch) {
      search();
    } else {
      const fetchData = async () => {
        getDataFromServer(orderBy, orderDir);
      };
      fetchData();
    }
    setLoading(false);
  }, [orderBy, orderDir, itemSearch, searchTerm, pageSize, currentPage]);

  const changeSize = (count: number) => {
    setCurrentPage(1);
    setPageSize(count);
  };

  const getDataFromServer = (orderBy: string, orderDir: string) => {
    setLoading(true);
    setInitRange((currentPage - 1) * pageSize + 1);
    setEndRange(currentPage * pageSize);
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

      setData(data ? data : []);
      setTotalItems(totalItems);
      setLoading(false);
    });
    setItemSearch(false);
  };

  const search = async () => {
    setInitRange((currentPage - 1) * pageSize + 1);
    setEndRange(currentPage * pageSize);
    const { data } = await getEntities(
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
  };

  const clickOnItem = () => {
    setShowModal(true);
  };

  const newItem = () => {
    setShowModal(true);
  };

  const onSearch = async (
    searchTerm: string,
    orderBy: string,
    orderDir: string,
  ) => {
    setSearchTerm(searchTerm);
    setItemSearch(searchTerm !== "" ? true : false);
    setOrderBy(orderBy);
    setOrderDir(orderDir);
  };

  const onClearSearch = () => {
    setSearchTerm("");
    setItemSearch(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <HeaderListPageComponent
            title={page_title}
            breadcrumb={breadcrumb}
            columns={columns}
            onSearch={onSearch}
            onClearSearch={onClearSearch}
            onAddButton={newItem}
            showCleanFilter={false}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              {data.length == 0 && !loading ? (
                <span className=" dark:text-white justify-center flex my-4">
                  {t("SEARCH_NOT_FOUND")}
                </span>
              ) : (
                <ContentTable
                  data={data}
                  loading={loading}
                  columns={columns}
                  onItemClick={clickOnItem}
                  onDataToExport={() => null}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <EntityPageModal showModal={showModal} closeModal={closeModal} />
      <div className="flex overflow-x-auto justify-between mt-2 mx-4 items-center">
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
            onChange={(event) => changeSize(parseInt(event.target.value))}
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
            {totalItems}
          </span>
        </span>
      </div>
    </>
  );
}
