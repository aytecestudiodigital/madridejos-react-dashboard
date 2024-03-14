import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListPageWithPagination from "../../../../components/ListPage/ListPageWithPagination";
import { AlertContext } from "../../../../context/AlertContext";
import { getAll } from "../../../../server/supabaseQueries";
import { EditPaymentMethodModal } from "../components/EditPaymentMethodModal";
import { getPaymentsOrdersAndRelatedData } from "../data/PaymentsMethodsProvider";
import { PaymentsMethod } from "../models/PaymentsMethods";

export default function PaymentsMethodsPage() {
  const navigate = useNavigate();
  /**
   * Configuración de la página
   */
  const entity_table = import.meta.env.VITE_TABLE_PAYMENTS_METHOD;
  const columns = ["title", "type", "enable", "created_at"];
  const columnsFilter = ["title", "enable", "created_at"];
  const columnsDropdown = ["type"];
  const page_title = "PAYMENTS_METHODS";
  const breadcrumb = [
    {
      title: "PAYMENTS_METHODS",
    },
  ];

  /**
   * Definición de datos
   */
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [method, setMethod] = useState<PaymentsMethod | null>(null);
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

  const [filteredSearchItems, setFilteredSearchItems] = useState<string[]>([]);

  const [totalTypes, setTotalTypes] = useState<any[]>([]);

  const user = JSON.parse(localStorage.getItem("userLogged")!);
  const userGroupId = localStorage.getItem("groupSelected")!;
  const { openAlert } = useContext(AlertContext);

  let showAll: boolean;
  let userGroup: string | null;
  let userCreatedBy: string;

  useEffect(() => {
    if (user) {
      if (!user.users_roles.rules.payments.method_payments.access_module) {
        openAlert("No tienes acceso a esta página", "error");
        navigate("/");
      } else {
        userCreatedBy = user.id;
        !user.users_roles.rules.payments.method_payments.read_all &&
        user.users_roles.rules.payments.method_payments.read_group
          ? (userGroup = userGroupId)
          : (userGroup = null);
        showAll = user.users_roles.rules.payments.method_payments.read_all;
      }
    }
  }, [user]);

  const getTotalTypes = async () => {
    const result = await getAll(entity_table);

    if (result.data) {
      const uniqueTypesSet = new Set<string>();
      result.data.forEach((element: PaymentsMethod) => {
        uniqueTypesSet.add(element.type);
      });

      const uniqueTypesArray = Array.from(uniqueTypesSet);

      setTotalTypes(uniqueTypesArray);
    }
  };

  useEffect(() => {
    getTotalTypes();
    setLoading(true);
    setInitRange((currentPage - 1) * pageSize + 1);
    setEndRange(currentPage * pageSize);

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
    searchTerm,
    currentPage,
    filteredSearchItems,
    pageSize,
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
    getPaymentsOrdersAndRelatedData(
      page,
      size,
      orderBy,
      orderDir,
      userCreatedBy,
      showAll,
      userGroup,
      "",
    ).then((result) => {
      const { totalItems, data } = result;
      setData(data ? data : []);
      setTotalItems(totalItems);
      setTotalPages(Math.ceil(totalItems / pageSize));
      setLoading(false);
    });
    setItemSearch(false);
  };

  const search = async (page: number) => {
    setInitRange((page - 1) * pageSize + 1);
    setEndRange(page * pageSize);
    const { totalItems, data } = await getPaymentsOrdersAndRelatedData(
      currentPage,
      pageSize,
      orderBy,
      orderDir,
      userCreatedBy,
      showAll,
      userGroup,
      searchTerm,
      filteredSearchItems,
    );

    setData(data ? data : []);
    setTotalItems(totalItems);
    setTotalPages(Math.ceil(totalItems / pageSize));
  };

  const clickOnItem = (e: any) => {
    setMethod(e);
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
    filteredItems?: string[],
  ) => {
    setCurrentPage(1);
    setFilteredSearchItems(filteredItems!);
    setSearchTerm(searchTerm);
    setItemSearch(searchTerm !== "" ? true : false);
    setOrderBy(orderBy);
    setOrderDir(orderDir);
  };

  const onClearSearch = () => {
    setCurrentPage(1);
    setSearchTerm("");
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
        columnsDropdown={columnsDropdown}
        dataDropdown={totalTypes}
        columnsFilter={columnsFilter}
        disableAddButton={
          !user.users_roles.rules.payments.method_payments.create
        }
        showCleanFilter={false}
      />
      {showEditModal ? (
        <EditPaymentMethodModal
          item={method}
          types={totalTypes}
          openModal={showEditModal}
          closeModal={() => {
            closeModal();
            refreshData();
          }}
        />
      ) : null}
      {showAddModal ? (
        <EditPaymentMethodModal
          item={null}
          types={totalTypes}
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
