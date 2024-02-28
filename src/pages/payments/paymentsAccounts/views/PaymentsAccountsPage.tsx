import { useContext, useEffect, useState } from "react";
import ListPageWithPagination from "../../../../components/ListPage/ListPageWithPagination";
import { getEntities } from "../../../../server/supabaseQueries";
import { EditPaymentAccountModal } from "../components/EditPaymentAccountModal";
import { PaymentsAccount } from "../models/PaymentsAccounts";
import { RootState } from "../../../../store/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../../../../context/AlertContext";

export default function PaymentsAccountPage() {
  const navigate = useNavigate();
  /**
   * Configuración de la página
   */
  const entity_table = import.meta.env.VITE_TABLE_PAYMENTS_ACC;
  const columns = ["title", "enable", "created_at"];
  const page_title = "PAYMENTS_ACCOUNTS";
  const breadcrumb = [
    {
      title: "PAYMENTS_ACCOUNTS",
    },
  ];

  /**
   * Definición de datos
   */
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [account, setAccount] = useState<PaymentsAccount | null>(null);
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

  const [totalItems, setTotalItems] = useState<number>(0);

  const [initRange, setInitRange] = useState(1);
  const [endRange, setEndRange] = useState(pageSize);
  const [alertMsg] = useState("");
  const [actionAlert] = useState("");

  const user = useSelector((state: RootState) => state.auth.user);
  const { openAlert } = useContext(AlertContext);

  useEffect(() => {
    if (user) {
      if (!user.users_roles.rules.payments.payments_accounts.access_module) {
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
  }, [orderBy, orderDir, itemSearch, currentPage, pageSize]);

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

  const clickOnItem = (e: any) => {
    setAccount(e);
    setShowEditModal(true);
  };

  const newItem = () => {
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowEditModal(false);
    setShowAddModal(false);
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
  const refreshData = async () => {
    getDataFromServer(orderBy, orderDir, currentPage, pageSize);
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
        isOpen={null}
        alertMsg={alertMsg}
        action={actionAlert}
      />
      {showEditModal ? (
        <EditPaymentAccountModal
          item={account}
          openModal={showEditModal}
          closeModal={() => {
            closeModal();
            refreshData();
          }}
        />
      ) : null}
      {showAddModal ? (
        <EditPaymentAccountModal
          item={null}
          openModal={showAddModal}
          closeModal={() => {
            closeModal();
            refreshData();
          }}
        />
      ) : null}
    </>
  );
}
