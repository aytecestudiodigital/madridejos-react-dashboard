/* eslint-disable @typescript-eslint/no-explicit-any */
import { Breadcrumb, Button, Label, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiHome, HiPlus, HiX } from "react-icons/hi";
import SelectCategoryFilter from "../../pages/content/articles/components/SelectCategoryFilter";
import SelectTypeFilter from "./SelectTypeFilter";
import SelectMethodFilter from "../../pages/payments/paymentsList/components/SelectMethodsFilter";
import { createXLs } from "../../utils/utils";
import { LuDownload } from "react-icons/lu";

export interface BreadcrumbItem {
  title: string;
  path?: string;
}

interface HeaderListPageProps {
  title: string;
  breadcrumb: BreadcrumbItem[];
  columns: string[];
  columnsFilter?: string[];
  columnsDropdown?: string[];
  dataDropdown?: any[];
  columnsSecondDropdown?: string[];
  secondDataDropdown?: any[];
  columnsThirdDropdown?: string[];
  thirdDataDropdown?: any[];
  data?: any[];
  onSearch: (
    searchTerm: string,
    orderBy: string,
    orderDir: string,
    filteredItems?: string[] | boolean[],
    secondFilteredItems?: string[],
    thirdFilteredItems?: any[],
  ) => void;
  onClearSearch: () => void;
  onAddButton: () => void;
  dataToExport?: any[];
  showButtonSave?: boolean;
}

export function HeaderListPageComponent(props: HeaderListPageProps) {
  const { t } = useTranslation();

  let searchInput: HTMLInputElement;

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [orderBy, setOrderBy] = useState<string>("created_at");
  const [orderDir, setOrderDir] = useState<string>("DESC");

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]); //Se usa tanto para tipos como para filtrar el estado de los pagos
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [selectedMethods, setSelectedMethods] = useState<number[]>([]);
  const [selectedEnable, setSelectedEnable] = useState<string[]>([]);
  const [selectedProjectCategories, setSelectedProjectCategories] = useState<
    any[]
  >([]);

  const handleCategoryChange = (selectedCategories: string[]) => {
    setSelectedCategories(selectedCategories);
  };

  const handleTypeChange = (selectedTypes: string[]) => {
    setSelectedTypes(selectedTypes);
  };

  const handleModuleChange = (selectedModules: string[]) => {
    setSelectedModules(selectedModules);
  };

  const handleMethodChange = (selectedMethods: number[]) => {
    setSelectedMethods(selectedMethods);
  };

  const handleEnabledChange = async (filterTerm: string[]) => {
    setSelectedEnable(filterTerm);
  };

  const handleProjectCategoryChange = (selectedCategories: string[]) => {
    setSelectedProjectCategories(selectedCategories);
  };

  useEffect(() => {
    props.onSearch(searchTerm, orderBy, orderDir, selectedEnable);
  }, [orderBy, orderDir, selectedEnable]);

  useEffect(() => {
    props.onSearch(
      searchTerm,
      orderBy,
      orderDir,
      selectedCategories,
      selectedProjectCategories,
    );
  }, [orderBy, orderDir, selectedCategories]);

  useEffect(() => {
    props.onSearch(searchTerm, orderBy, orderDir, selectedProjectCategories);
  }, [orderBy, orderDir, selectedProjectCategories]);

  useEffect(() => {
    props.onSearch(
      searchTerm,
      orderBy,
      orderDir,
      selectedTypes,
      selectedModules,
      selectedMethods,
    );
  }, [orderBy, orderDir, selectedTypes, selectedModules, selectedMethods]);

  useEffect(() => {}, [props.dataDropdown]);

  const onPressEnter = (key: string, value: string) => {
    if (key === "Enter") {
      setSearchTerm(value);
      if (value !== "" && selectedTypes.length > 0) {
        searchWithTypes(value);
      } else if (value !== "" && selectedCategories.length > 0) {
        searchCategoryContent(value);
      } else if (
        value !== "" &&
        (selectedTypes.length > 0 ||
          selectedMethods.length > 0 ||
          selectedModules.length > 0)
      ) {
        searchPaymentensOrders(value);
      } else if (value !== "" && selectedEnable.length > 0) {
        searchWithEnabled(value);
      } else if (value !== "") {
        search(value);
      } else {
        clearSearch();
      }
    }
  };
  const searchWithTypes = async (searchTerm: string) => {
    props.onSearch(searchTerm, orderBy, orderDir, selectedTypes);
  };

  const searchCategoryContent = async (searchTerm: string) => {
    props.onSearch(searchTerm, orderBy, orderDir, selectedCategories);
  };

  const searchWithEnabled = async (searchTerm: string) => {
    props.onSearch(searchTerm, orderBy, orderDir, selectedEnable);
  };

  const searchPaymentensOrders = async (searchTerm: string) => {
    props.onSearch(
      searchTerm,
      orderBy,
      orderDir,
      selectedTypes,
      selectedModules,
      selectedMethods,
    );
  };

  const search = async (searchTerm: string) => {
    props.onSearch(searchTerm, orderBy, orderDir);
  };

  const clearSearch = () => {
    searchInput.value = "";
    setSearchTerm("");
    props.onClearSearch();
  };

  return (
    <>
      <div className="mb-4">
        <Breadcrumb className="mb-4 mt-2">
          <Breadcrumb.Item href="/">
            <div className="flex items-center gap-x-3">
              <HiHome className="text-xl" />
              <span className="dark:text-white">{t("HOME")}</span>
            </div>
          </Breadcrumb.Item>
          {props.breadcrumb.map((item, index) => (
            <Breadcrumb.Item key={index} href={item.path}>
              {t(item.title.toUpperCase())}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
          {t(props.title.toUpperCase())}
        </h1>
      </div>
      <div className="flex items-end">
        {/* BUSCADOR */}
        <div className="mb-3 hidden items-center sm:mb-0 sm:flex ">
          <div className="lg:pr-3 flex flex-col">
            <Label htmlFor="search">
              {t("SEARCH")}
              <span className="text-xs text-slate-400 pt-2 pl-2">
                {t("SEARCH_DESCRIPTION")}
              </span>
            </Label>

            <div className="border-r-2 border-slate-300 pr-6 mr-3">
              <div className="relative mt-1 lg:w-64 xl:w-72 flex flex-col">
                <div className="grow">
                  <TextInput
                    ref={(input) => {
                      searchInput = input!;
                    }}
                    id="users-search"
                    name="search"
                    placeholder={t("SEARCH_PLACEHOLDER")}
                    onKeyUp={(event) =>
                      onPressEnter(event.key, event.currentTarget.value)
                    }
                  />
                  <a
                    onClick={clearSearch}
                    className="cursor-pointer absolute inset-y-0 right-0 "
                  >
                    <HiX className="h-4 w-4 mt-3 mr-2 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* FILTRAR POR */}
          {props.columnsDropdown &&
          props.columnsDropdown.includes("content_category_id") ? (
            <div className="lg:pr-3 flex flex-col">
              <Label htmlFor="orderBy">Filtrar por</Label>
              <div className="mt-1">
                {props.columnsDropdown &&
                props.columnsSecondDropdown === undefined ? (
                  <div className="border-r-2 border-slate-300 pr-6 mr-3">
                    <SelectCategoryFilter
                      dataDropdown={
                        props.dataDropdown ? props.dataDropdown : []
                      }
                      onCategoryChange={handleCategoryChange}
                    />
                  </div>
                ) : (
                  <SelectCategoryFilter
                    dataDropdown={props.dataDropdown ? props.dataDropdown : []}
                    onCategoryChange={handleCategoryChange}
                  />
                )}
              </div>
            </div>
          ) : props.columnsDropdown &&
            (props.columnsDropdown.includes("type") ||
              props.columnsDropdown.includes("order_state")) ? (
            <div className="lg:pr-3 flex flex-col">
              <Label htmlFor="orderBy">Filtrar por</Label>
              <div className="mt-1">
                {props.columnsDropdown &&
                props.columnsSecondDropdown === undefined ? (
                  <div className="border-r-2 border-slate-300 pr-6 mr-3">
                    <SelectTypeFilter
                      dataDropdown={
                        props.dataDropdown ? props.dataDropdown : []
                      }
                      onTypeChange={handleTypeChange}
                      selectTitle={
                        props.columnsDropdown.includes("type")
                          ? "TYPE"
                          : "PAYMENT_STATE"
                      }
                    />
                  </div>
                ) : (
                  <SelectTypeFilter
                    dataDropdown={props.dataDropdown ? props.dataDropdown : []}
                    onTypeChange={handleTypeChange}
                    selectTitle={
                      props.columnsDropdown.includes("type")
                        ? "TYPE"
                        : "PAYMENT_STATE"
                    }
                  />
                )}
              </div>
            </div>
          ) : props.columnsDropdown &&
            props.columnsDropdown.includes("enable") ? (
            <div className="lg:pr-3 flex flex-col">
              <Label htmlFor="selectedEnable">Filtrar por</Label>
              <div className="mt-1">
                {props.columnsDropdown &&
                props.columnsSecondDropdown === undefined ? (
                  <div className="border-r-2 border-slate-300 pr-6 mr-3">
                    <SelectTypeFilter
                      dataDropdown={
                        props.dataDropdown ? props.dataDropdown : []
                      }
                      onTypeChange={handleEnabledChange}
                      selectTitle={"PAYMENT_STATE"}
                    />
                  </div>
                ) : (
                  <SelectTypeFilter
                    dataDropdown={props.dataDropdown ? props.dataDropdown : []}
                    onTypeChange={handleEnabledChange}
                    selectTitle={"PAYMENT_STATE"}
                  />
                )}
              </div>
            </div>
          ) : props.columnsDropdown &&
            props.columnsDropdown.includes("tasks_category_id") ? (
            <div className="lg:pr-3 flex flex-col">
              <Label htmlFor="selectedEnable">Filtrar por</Label>
              <div className="mt-1">
                {props.columnsDropdown &&
                props.columnsSecondDropdown === undefined ? (
                  <div className="border-r-2 border-slate-300 pr-6 mr-3">
                    <SelectCategoryFilter
                      dataDropdown={
                        props.dataDropdown ? props.dataDropdown : []
                      }
                      onCategoryChange={handleProjectCategoryChange}
                    />
                  </div>
                ) : (
                  <SelectCategoryFilter
                    dataDropdown={props.dataDropdown ? props.dataDropdown : []}
                    onCategoryChange={handleProjectCategoryChange}
                  />
                )}
              </div>
            </div>
          ) : null}

          {props.columnsSecondDropdown &&
          props.columnsSecondDropdown.includes("order_module") ? (
            <div className="lg:pr-3 flex flex-col">
              <div className="mt-6">
                {props.columnsSecondDropdown &&
                props.columnsThirdDropdown === undefined ? (
                  <div className="border-r-2 border-slate-300 pr-6 mr-3">
                    <SelectTypeFilter
                      dataDropdown={
                        props.secondDataDropdown ? props.secondDataDropdown : []
                      }
                      onTypeChange={handleModuleChange}
                      selectTitle={t("MODULE")}
                    />
                  </div>
                ) : (
                  <SelectTypeFilter
                    dataDropdown={
                      props.secondDataDropdown ? props.secondDataDropdown : []
                    }
                    onTypeChange={handleModuleChange}
                    selectTitle={t("MODULE")}
                  />
                )}
              </div>
            </div>
          ) : null}

          {props.columnsThirdDropdown &&
          props.columnsThirdDropdown.includes("method_title") ? (
            <div className="lg:pr-3 flex flex-col">
              {/* <Label htmlFor="orderBy">Filtrar por</Label> */}
              <div className="mt-6">
                <div className="border-r-2 border-slate-300 pr-6 mr-3">
                  <SelectMethodFilter
                    dataDropdown={
                      props.thirdDataDropdown ? props.thirdDataDropdown : []
                    }
                    onMethodChange={handleMethodChange}
                    selectTitle={t("METHOD_TITLE")}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* ORDER BY Y ORDER DIR */}
        <div className="lg:pr-3 flex flex-col">
          <Label htmlFor="orderBy">{t("ORDER_BY_LABEL")}</Label>
          <div className="mt-1">
            <Select
              id="orderBy"
              value={orderBy}
              onChange={(event) => setOrderBy(event.target.value)}
            >
              {props.columns.map((column, index) => (
                <option key={index} value={column}>
                  {t(`${column.toUpperCase()}`)}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="lg:pr-3 flex flex-col">
          <Label htmlFor="orderDir">{t("ORDER_DIR_LABEL")}</Label>
          <div className="mt-1">
            <Select
              id="orderDir"
              value={orderDir}
              onChange={(event) => setOrderDir(event.target.value)}
            >
              <option value="ASC">{t("ORDER_DIR_ASC")}</option>
              <option value="DESC">{t("ORDER_DIR_DESC")}</option>
            </Select>
          </div>
        </div>

        <div className="ml-auto flex items-center space-x-1 sm:space-x-3">
        {props.showButtonSave !== undefined  && props.showButtonSave === false ? null
        : <Button color="primary" onClick={props.onAddButton}>
          <div className="flex items-center gap-x-1">
            <HiPlus className="text-xl" />
            {t("ADD_BTN")}
          </div>
        </Button>
      }
          
          {props.dataToExport && props.dataToExport?.length > 0 && (
            <div className="flex">
              <Button
                color="success"
                onClick={() =>
                  createXLs(
                    props.dataToExport && props.dataToExport?.length > 0
                      ? props.dataToExport
                      : [],
                    "lista_operaciones",
                  )
                }
              >
                <LuDownload className="mr-2" />
                {t("EXPORT")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
