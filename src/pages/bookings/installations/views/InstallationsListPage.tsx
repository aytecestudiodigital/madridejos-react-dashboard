/* eslint-disable @typescript-eslint/no-explicit-any */
/* import { FC, useContext, useEffect, useState } from "react";
import { getEntities } from "../../../../server/supabaseQueries";
import { InstallationModel } from "../models/InstallationModel";
import { useNavigate } from "react-router-dom";
import ListPageWithPagination from "../../../../components/ListPage/ListPageWithPagination";
import { AlertContext } from "../../../../context/AlertContext";
import { RootState } from "../../../../store/store";
import { useSelector } from "react-redux";

export const InstallationsListPage: FC = () => {
  const entity_table = import.meta.env.VITE_TABLE_BOOKINGS_INSTALLATIONS;
  const columns = ["title", "description", "type", "enable", "created_at"];
  const page_title = "PAGE_BOOKINGS_INSTALLATIONS_LIST_TITLE";
  const breadcrumb = [
    {
      title: "BOOKINGS",
      path: "/bookings",
    },
    {
      title: "INSTALLATIONS",
    },
  ];

  const navigate = useNavigate();
  const { openAlert } = useContext(AlertContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);

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

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user) {
      if (!user.users_roles.rules.bookings.installations.access_module) {
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
      searchTerm,
    );
    setData(data ? data : []);
    setTotalItems(totalItems);
    setTotalPages(Math.ceil(totalItems / pageSize));
  };

  const clickOnItem = (item: InstallationModel) => {
    navigate(`/bookings/installations/${item.id}`, { state: item });
  };

  const newItem = () => {
    navigate(`/bookings/installations/new`, { state: null });
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
      />
    </>
  );
}; */
