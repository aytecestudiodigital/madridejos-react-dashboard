import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListPageWithPagination from "../../../../components/ListPage/ListPageWithPagination";
import { CategoriesContext } from "../../context/contentContext";
import EditContentPage from "./EditContentPage";
import {
  getCategories,
  getContentWithCategories,
} from "../data/ContentProvider";
import { RootState } from "../../../../store/store";
import { useSelector } from "react-redux";
import { AlertContext } from "../../../../context/AlertContext";

export default function ContentPage() {
  const navigate = useNavigate();
  /**
   * Configuración de la página
   */
  const entity_table = import.meta.env.VITE_TABLE_CONTENT;
  const columns = ["title", "state", "category_title", "created_at"];
  const columnsFilter = ["title", "state", "created_at"];
  const columnsDropdown = ["content_category_id"];
  const page_title = "PAGE_CONTENT_LIST_TITLE";
  const breadcrumb = [
    {
      title: "CONTENT_TYPE",
      path: "/content",
    },
    {
      title: "PAGE_CONTENT_LIST_TITLE",
    },
  ];

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

  const [showEditPage] = useState(false);
  const [showAddPage, setshowAddPage] = useState(false);

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

  const [filteredSearchItems, setFilteredSearchItems] = useState<string[]>([]);

  const [totalCategories, setTotalCategories] = useState<any[]>([]);

  const { categories } = useContext(CategoriesContext);

  const user = useSelector((state: RootState) => state.auth.user);
  const { openAlert } = useContext(AlertContext);

  useEffect(() => {
    if (user) {
      if (!user.users_roles.rules.content.contents.access_module) {
        openAlert("No tienes acceso a esta página", "error");
        navigate("/");
      }
    }
  }, [user]);

  console.log({
    1: user,
    2: user.users_roles,
    3: user.users_roles.rules,
    4: user.users_roles.rules.content,
    5: user.users_roles.rules.content.contents,
    6: user.users_roles.rules.content.contents.access_module,
  });

  useEffect(() => {
    getCategories().then((result: any) => {
      setTotalCategories(result ? result : []);
    });
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
    categories,
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
    getContentWithCategories(page, size, orderBy, orderDir, "").then(
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
    const { totalItems, data } = await getContentWithCategories(
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
    navigate(`/content/${item.id}`);
  };

  const newItem = () => {
    navigate("/content/new");
    setshowAddPage(true);
  };

  const onSearch = async (
    searchTerm: string,
    orderBy: string,
    orderDir: string,
    filteredSearchItems?: string[],
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
        isOpen={undefined}
        alertMsg={alertMsg}
        action={actionAlert}
        columnsFilter={columnsFilter}
        columnsDropdown={columnsDropdown}
        dataDropdown={totalCategories}
      />
      {showEditPage ? <EditContentPage /> : null}
      {showAddPage ? <EditContentPage /> : null}
    </>
  );
}
