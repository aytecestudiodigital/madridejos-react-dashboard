/* 
import { Dropdown, Pagination, Select, Table } from "flowbite-react";
import { t } from "i18next";
import { useContext, useEffect, useState } from "react";
import {
  LuArrowUpRightSquare,
  LuClipboardList,
  LuMoreVertical,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { HeaderListPageComponent } from "../../../../components/ListPage/HeaderListPage";
import { TablePlaceholder } from "../../../../components/TablePlaceholder";
import { getInscriptions } from "../data/NormalInscriptioProvider";
import { RootState } from "../../../../store/store";
import { useSelector } from "react-redux";
import { AlertContext } from "../../../../context/AlertContext";

export default function NormalInscriptionPage() {
  const navigate = useNavigate();
  const columns = ["title", "enable", "created_at"];
  const columnsDropdown = ["enable"];
  const page_title = "NORMAL_INSCRIPTIONS_LIST";
  const breadcrumb = [
    {
      title: "NORMAL_INSCRIPTIONS_LIST",
    },
  ];

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);


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

  const [filteredSearchItems, setFilteredSearchItems] = useState<string[]>([]);

  const user = useSelector((state: RootState) => state.auth.user);
  const { openAlert } = useContext(AlertContext);

  useEffect(() => {
    if (user) {
      if (!user.users_roles.rules.inscriptions.inscriptions.access_module) {
        openAlert("No tienes acceso a esta página", "error");
        navigate("/");
      }
    }
  }, [user]);

  useEffect(() => {
    setInitRange((currentPage - 1) * pageSize + 1);
    setEndRange(currentPage * pageSize);
    setLoading(true);
    if (itemSearch || filteredSearchItems.length > 0) {
      search(currentPage);
    } else {
      const fetchData = async () => {
        getDataFromServer(orderBy, orderDir, currentPage, pageSize);
      };

      fetchData();
    }
    setLoading(false);
  }, [
    orderBy,
    orderDir,
    itemSearch,
    currentPage,
    pageSize,
    filteredSearchItems,
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
    getInscriptions(page, size, orderBy, orderDir, "", undefined).then(
      async (result) => {
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
    setFilteredSearchItems(filteredSearchItems ? filteredSearchItems : []);
    const { totalItems, data } = await getInscriptions(
      currentPage,
      pageSize,
      orderBy,
      orderDir,
      searchTerm,
      filteredSearchItems,
    );

    setData(data ? data : []);
    setTotalItems(totalItems);
    setTotalPages(Math.ceil(totalItems / pageSize));
  };

  const clickOnItem = (item: any) => {
    navigate(`/inscriptions/normal/${item.id}`);
  };

  const newItem = () => {
    navigate("/inscriptions/normal/new");
  };

  const goToRecords = (item: any) => {
    navigate(`/inscriptions/normal/records/${item.id}`);
  };

  const onSearch = async (
    searchTerm: string,
    orderBy: string,
    orderDir: string,
    filteredSearchItems?: any[],
  ) => {
    setCurrentPage(1);
    setFilteredSearchItems(filteredSearchItems ? filteredSearchItems : []);
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
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <HeaderListPageComponent
            title={page_title}
            breadcrumb={breadcrumb}
            columns={columns}
            onSearch={onSearch}
            onClearSearch={onClearSearch}
            onAddButton={newItem}
            columnsDropdown={columnsDropdown}
            dataDropdown={["Habilitado", "Deshabilitado"]}
            columnsSecondDropdown={[]}
            secondDataDropdown={[]}
            columnsThirdDropdown={[]}
            thirdDataDropdown={[]}
            dataToExport={[]}
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
                <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <Table.Head className="bg-gray-100 dark:bg-gray-700">
                    {columns.map((column, index) => (
                      <Table.HeadCell key={index}>
                        {t(`${column.toUpperCase()}`)}
                      </Table.HeadCell>
                    ))}
                    <Table.HeadCell>Acciones</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                    {loading ? (
                      <TablePlaceholder />
                    ) : (
                      data.map((item) => (
                        <Table.Row
                          key={item.id}
                          className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <Table.Cell
                            onClick={() => clickOnItem(item)}
                            className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white "
                          >
                            {item.title}
                          </Table.Cell>
                          <Table.Cell onClick={() => clickOnItem(item)}>
                            {item.enable ? (
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
                            )}
                          </Table.Cell>
                          <Table.Cell
                            onClick={() => clickOnItem(item)}
                            className="max-w-md p-4 text-base font-medium text-gray-900 dark:text-white "
                          >
                            {new Date(item.created_at).toLocaleString("es")}
                          </Table.Cell>
                          <Table.Cell>
                            <Dropdown
                              label=""
                              dismissOnClick={false}
                              renderTrigger={() => (
                                <span className="cursor-pointer rounded-full hover:bg-gray-200">
                                  <LuMoreVertical size={24} />
                                </span>
                              )}
                            >
                              <Dropdown.Item>
                                <LuArrowUpRightSquare className="text-blue-500" />
                                <p className="ml-2 text-blue-500">
                                  Ir al trámite
                                </p>
                              </Dropdown.Item>
                              <Dropdown.Item>
                                <LuClipboardList className="text-yellow-500" />
                                <p
                                  className="ml-2 text-yellow-500"
                                  onClick={() => goToRecords(item)}
                                >
                                  Registros
                                </p>
                              </Dropdown.Item>
                            </Dropdown>
                          </Table.Cell>
                        </Table.Row>
                      ))
                    )}
                  </Table.Body>
                </Table>
              )}
            </div>
          </div>
        </div>
      </div>
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
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              changeSize(Number(event.target.value))
            }
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
 */