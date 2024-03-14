import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListPageWithPagination from "../../../../components/ListPage/ListPageWithPagination";
import { AlertContext } from "../../../../context/AlertContext";
import { getAll } from "../../../../server/supabaseQueries";
import { PaymentsMethod } from "../../paymentsMethods/models/PaymentsMethods";
import { PaymentListModal } from "../components/PaymentListModal";
import {
  getOrdersAndRelatedData,
  getPaymentsAndRelatedData,
} from "../data/PaymentsProvider";
import { Payments } from "../models/Payments";
import { PaymentsOrders } from "../models/PaymentsOrders";

export default function PaymentsListPage() {
  const navigate = useNavigate();
  /**
   * Configuración de la página
   */
  const paymentsTableName = import.meta.env.VITE_TABLE_PAYMENTS;
  const paymentsOrdersTableName = import.meta.env.VITE_TABLE_PAYMENTS_ORDERS;
  const paymentsMethodsTableName = import.meta.env.VITE_TABLE_PAYMENTS_METHOD;

  const columns = [
    "order_created_at",
    "order_user_name",
    "order_user_surname",
    "user_document",
    "order_module",
    "order_concept",
    "method_title",
    "order_amount",
    "order_state",
  ];
  const columnsFilter = [
    "order_created_at",
    "order_user_name",
    "order_user_surname",
    "user_document",
  ];
  const columnsDropdown = ["order_state"];
  const columnsSecondDropdown = ["order_module"];
  const columnsThridDropdown = ["method_title"];
  const page_title = "PAYMENTS_LIST";
  const breadcrumb = [
    {
      title: "PAYMENTS_LIST",
    },
  ];

  /**
   * Definición de datos
   */
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [payment, setPayment] = useState<any | null>(null);
  /**
   * Buscador y ordenación
   */
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [itemSearch, setItemSearch] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

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

  const [filteredStatus, setFilteredStatus] = useState<string[]>([]);
  const [filteredModules, setFilteredModules] = useState<string[]>([]);
  const [filteredMethods, setFilteredMethods] = useState<string[]>([]);

  const [totalStates, setTotalStates] = useState<any[]>([]);
  const [totalModules, setTotalModules] = useState<any[]>([]);
  const [totalMethods, setTotalMethods] = useState<any[]>([]);
  const [subItems, setSubItems] = useState<any[]>([]);

  const user = JSON.parse(localStorage.getItem("userLogged")!);
  const { openAlert } = useContext(AlertContext);

  let showAll: boolean;
  let userGroup: string | null = null;
  let userCreatedBy: string = user.id;

  useEffect(() => {
    if (user) {
      if (!user.users_roles.rules.payments.payments.access_module) {
        openAlert("No tienes acceso a esta página", "error");
        navigate("/");
      } else {
        userCreatedBy = user.id;
        userGroup = null;
        showAll = user.users_roles.rules.payments.payments.read;
      }
    }
  }, [user]);

  const getTotalStates = async () => {
    const result = await getAll(paymentsOrdersTableName);

    if (result.data) {
      const uniqueTypesSet = new Set<string>();
      result.data.forEach((element: Payments) => {
        uniqueTypesSet.add(element.state);
      });

      const uniqueTypesArray = Array.from(uniqueTypesSet);

      setTotalStates(uniqueTypesArray);
    }
  };

  const getTotalModules = async () => {
    const result = await getAll(paymentsOrdersTableName);

    if (result.data) {
      const uniqueModulesSet = new Set<string>();
      result.data.forEach((element: PaymentsOrders) => {
        uniqueModulesSet.add(element.module);
      });

      const uniqueTypesArray = Array.from(uniqueModulesSet);

      setTotalModules(uniqueTypesArray);
    }
  };

  const getTotalMethodPayments = async () => {
    const result = await getAll(paymentsMethodsTableName);
    let allMethods: { id: number; title: string }[] = [];
    if (result.data) {
      result.data.forEach((element: PaymentsMethod) => {
        allMethods.push({ id: element.id!, title: element.title });
      });

      setTotalMethods(allMethods);
    }
  };

  useEffect(() => {
    getTotalStates();
    getTotalModules();
    getTotalMethodPayments();
    setInitRange((currentPage - 1) * pageSize + 1);
    setEndRange(currentPage * pageSize);
    setLoading(true);
    if (
      itemSearch ||
      filteredStatus.length > 0 ||
      filteredModules.length > 0 ||
      filteredMethods.length > 0
    ) {
      if (user.users_roles.rules.payments.payments.read) {
        search(currentPage);
      }
    } else {
      const fetchData = async () => {
        if (user.users_roles.rules.payments.payments.read) {
          getDataFromServer(orderBy, orderDir, currentPage, pageSize);
        }
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
    filteredStatus,
    filteredModules,
    filteredMethods,
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
    getOrdersAndRelatedData(
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

  const getSubItems = (orderId: string) => {
    getPaymentsAndRelatedData(orderId).then((result) => {
      const { data } = result;
      setSubItems(data ? data : []);
    });
  };

  const search = async (page: number) => {
    setInitRange((page - 1) * pageSize + 1);
    setEndRange(page * pageSize);
    const { totalItems, data } = await getOrdersAndRelatedData(
      currentPage,
      pageSize,
      orderBy,
      orderDir,
      userCreatedBy,
      showAll,
      userGroup,
      searchTerm,
      filteredStatus,
      filteredModules,
      filteredMethods,
    );

    setData(data ? data : []);
    setTotalItems(totalItems);
    setTotalPages(Math.ceil(totalItems / pageSize));
  };

  const clickOnItem = (e: any) => {
    setPayment(e);
    getSubItems(e.id);
    setShowEditModal(true);
  };

  const closeModal = () => {
    setShowEditModal(false);
  };

  const onSearch = async (
    searchTerm: string,
    orderBy: string,
    orderDir: string,
    filteredStatus?: string[],
    filteredModules?: string[],
    filteredMethods?: string[],
  ) => {
    setCurrentPage(1);
    setFilteredStatus(filteredStatus ? filteredStatus : []);
    setFilteredModules(filteredModules ? filteredModules : []);
    setFilteredMethods(filteredMethods ? filteredMethods : []);
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
        entity_table={paymentsTableName}
        columns={columns}
        breadcrumb={breadcrumb}
        onSearch={onSearch}
        onClearSearch={onClearSearch}
        newItem={() => {}}
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
        columnsDropdown={columnsDropdown}
        dataDropdown={totalStates}
        columnsFilter={columnsFilter}
        columnsSecondDropdown={columnsSecondDropdown}
        secondDataDropdown={totalModules}
        columnsThirdDropdown={columnsThridDropdown}
        thirdDataDropdown={totalMethods}
        showButtonSave={false}
        disableAddButton={!user.users_roles.rules.payments.payments.create}
        showCleanFilter={false}
      />
      {showEditModal ? (
        <PaymentListModal
          item={payment}
          openModal={showEditModal}
          closeModal={closeModal}
          subItems={subItems}
        />
      ) : null}
    </>
  );
}
