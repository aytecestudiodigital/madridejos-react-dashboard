/* eslint-disable @typescript-eslint/no-explicit-any */
/* import { t } from "i18next";
import { useContext, useEffect, useState } from "react";
import ListPageWithPagination from "../../../components/ListPage/ListPageWithPagination";
import { AlertContext } from "../../../context/AlertContext";
import { getAll } from "../../../server/supabaseQueries";
import { EditDeviceModal } from "../components/EditDeviceModal";
import { getAccessControl } from "../data/AccessControlProvider";
import { AccessControl } from "../models/AccessControl";
import { RootState } from "../../../store/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AccessControlPage() {
  const navigate = useNavigate();
  const entity_table = import.meta.env.VITE_TABLE_ACCESS_CONTROL;
  const columns = [
    "title",
    "provider",
    "type",
    "status",
    "enabled",
    "created_at",
  ];
  const columnsFilter = ["title", "status", "provider", "created_at"];
  const columnsDropdown = ["type"];
  const page_title = "ACCESS_CONTROL";
  const breadcrumb = [
    {
      title: "ACCESS_CONTROL",
    },
  ];

  const { openAlert } = useContext(AlertContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [device, setDevice] = useState<AccessControl | null>(null);
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
  const [alertMsg] = useState("");
  const [actionAlert] = useState("");

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user) {
      if (!user.users_roles.rules.access_control.devices.access_module) {
        openAlert("No tienes acceso a esta página", "error");
        navigate("/");
      }
    }
  }, [user]);

  const getTotalTypes = async () => {
    const result = await getAll(entity_table);

    if (result.data) {
      const uniqueTypesSet = new Set<string>();
      result.data.forEach((element: AccessControl) => {
        uniqueTypesSet.add(element.type);
      });

      const uniqueTypesArray = Array.from(uniqueTypesSet);

      setTotalTypes(uniqueTypesArray);
    }
  };
  useEffect(() => {
    getTotalTypes();
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
    searchTerm,
    filteredSearchItems,
    currentPage,
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
    getAccessControl(page, size, orderBy, orderDir, "").then(async (result) => {
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
    setFilteredSearchItems(filteredSearchItems ? filteredSearchItems : []);
    const { totalItems, data } = await getAccessControl(
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

  const clickOnItem = (e: any) => {
    setDevice(e);
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
        isOpen={openAlert}
        alertMsg={alertMsg}
        action={actionAlert}
        columnsFilter={columnsFilter}
        columnsDropdown={columnsDropdown}
        dataDropdown={totalTypes}
      />
      {showEditModal ? (
        <EditDeviceModal
          item={device}
          openModal={showEditModal}
          closeModal={closeModal}
          onItem={(device: AccessControl | null | string) => {
            if (device === null) {
              getDataFromServer(orderBy, orderDir, currentPage, pageSize);
              openAlert(t("DEVICE_DELETE_OK"), "delete");
            } else if (typeof device === "string") {
              openAlert(device, "error");
            } else {
              const index = data.findIndex(
                (device) => device.id === (device as AccessControl)!.id,
              );

              if (index !== -1) {
                getDataFromServer(orderBy, orderDir, currentPage, pageSize);
                openAlert(t("DEVICE_EDIT_OK"), "update");
              } else {
                getDataFromServer(orderBy, orderDir, currentPage, pageSize);
              }
            }
          }}
        />
      ) : null}
      {showAddModal ? (
        <EditDeviceModal
          item={null}
          openModal={showAddModal}
          closeModal={closeModal}
          onItem={() => {
            {
              getDataFromServer(orderBy, orderDir, currentPage, pageSize);
              openAlert(t("DEVICE_INSERT_OK"), "insert");
            }
          }}
        />
      ) : null}
    </>
  );
} */
