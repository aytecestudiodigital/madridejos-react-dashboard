/* eslint-disable @typescript-eslint/no-explicit-any */
import { Breadcrumb, Button, Label, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiHome, HiX } from "react-icons/hi";
import { LuDownload, LuPlus } from "react-icons/lu";
import { getAllProductsToDropdown } from "../../pages/tickets/tickets/data/TicketsProvider";
import { createXLs } from "../../utils/utils";
import SelectDateFilter from "./SelectDateFilter";
import SelectEnumsFilter from "./SelectEnumsFilter";
import SelectFilter from "./SelectFilter";

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
  columnsFourthDropdown?: string[];
  fourthDataDropdown?: any[];
  columnsFifthDropdown?: any[];
  fifthDataDropdown?: any[];
  data?: any[];
  onSearch: (
    searchTerm: string,
    orderBy: string,
    orderDir: string,
    filteredItems?: string[] | boolean[],
    secondFilteredItems?: string[],
    thirdFilteredItems?: any[],
    fourthFilteredItems?: any[],
    fifthFilteredItems?: any[],
  ) => void;
  onClearSearch: () => void;
  onAddButton: () => void;
  dataToExport?: any[];
  showButtonSave?: boolean;
  disableAddButton?: boolean;
  showOrder?: boolean;
  exportFileName?: string;
  showCleanFilter: boolean;
  //alertsMessage?: string;
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
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedProjectCategories, setSelectedProjectCategories] = useState<
    any[]
  >([]);
  const [selectedProject, setSelectedProject] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState<any[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string[]>([]);
  const [selectedTypesTickets, setSelectedTypesTickets] = useState<string[]>(
    [],
  );
  const [productsToDropdown, setProductsToDropdown] = useState<
    any[] | undefined
  >([]);
  const [selectedProduct, setSelectedProduct] = useState<string[]>([]);

  const [showDatesCustom, setShowDatesCustom] = useState<boolean>(false);

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

  const onFilteredDate = (selectedDates: string[]) => {
    setSelectedDates(selectedDates);
  };

  const handleProjectChange = (selectedProject: string[]) => {
    setSelectedProject(selectedProject);
  };

  const handleStateChange = (selectedState: string[]) => {
    setSelectedState(selectedState);
  };

  const handlePriorityChange = (selectedPriority: number[]) => {
    setSelectedPriority(selectedPriority);
  };

  useEffect(() => {
    props.onSearch(searchTerm, orderBy, orderDir, selectedEnable);
  }, [orderBy, orderDir, selectedEnable]);

  useEffect(() => {
    props.onSearch(searchTerm, orderBy, orderDir, selectedCategories);
  }, [orderBy, orderDir, selectedCategories]);

  useEffect(() => {
    props.onSearch(
      searchTerm,
      orderBy,
      orderDir,
      selectedProjectCategories,
      selectedProject,
      selectedState,
      selectedPriority,
    );
  }, [
    orderBy,
    orderDir,
    selectedProjectCategories,
    selectedProject,
    selectedState,
    selectedPriority,
  ]);

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

  const getDataToProductsDropdown = async () => {
    const products = await getAllProductsToDropdown(selectedEvent[0]);
    setProductsToDropdown(products);
  };

  useEffect(() => {
    props.onSearch(
      searchTerm,
      orderBy,
      orderDir,
      selectedDates,
      selectedEvent,
      selectedProduct,
      selectedState,
      selectedTypesTickets,
    );
  }, [
    orderBy,
    orderDir,
    searchTerm,
    selectedDates,
    selectedEvent,
    selectedProduct,
    selectedState,
    selectedTypesTickets,
  ]);

  useEffect(() => {
    selectedEvent.length != 0 && getDataToProductsDropdown();
  }, [selectedEvent]);

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

  const deleteFiltering = () => {
    setShowDatesCustom(true);
    onFilteredDate([]);
    setSelectedDates([]);
    setSelectedEvent([]);
    setSelectedProduct([]);
    setSelectedState([]);
    setSelectedTypesTickets([]);
    setTimeout(() => {
      setShowDatesCustom(false);
    }, 1000);
  };

  return (
    <>
      <div className="mb-4 overflow-auto">
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
          {/* PRIMER DROPDOWN Y SUS CASUISTICAS */}
          {props.columnsDropdown &&
          props.columnsDropdown.includes("content_category_id") ? (
            <div className="lg:pr-3 flex flex-col">
              <Label htmlFor="orderBy">Filtrar por</Label>
              <div className="mt-1">
                {props.columnsDropdown &&
                props.columnsSecondDropdown === undefined ? (
                  <div className="border-r-2 border-slate-300 pr-6 mr-3">
                    <SelectFilter
                      dataDropdown={
                        props.dataDropdown ? props.dataDropdown : []
                      }
                      onFilterChange={handleCategoryChange}
                      title={"CATEGORIES_TITLE"}
                    />
                  </div>
                ) : (
                  <SelectFilter
                    dataDropdown={props.dataDropdown ? props.dataDropdown : []}
                    onFilterChange={handleCategoryChange}
                    title={"CATEGORIES_TITLE"}
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
                    <SelectEnumsFilter
                      dataDropdown={
                        props.dataDropdown ? props.dataDropdown : []
                      }
                      onFilterChange={handleTypeChange}
                      title={
                        props.columnsDropdown.includes("type")
                          ? "TYPE"
                          : "PAYMENT_STATE"
                      }
                    />
                  </div>
                ) : (
                  <SelectEnumsFilter
                    dataDropdown={props.dataDropdown ? props.dataDropdown : []}
                    onFilterChange={handleTypeChange}
                    title={
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
                    <SelectEnumsFilter
                      dataDropdown={
                        props.dataDropdown ? props.dataDropdown : []
                      }
                      onFilterChange={handleEnabledChange}
                      title={"PAYMENT_STATE"}
                    />
                  </div>
                ) : (
                  <SelectEnumsFilter
                    dataDropdown={props.dataDropdown ? props.dataDropdown : []}
                    onFilterChange={handleEnabledChange}
                    title={"PAYMENT_STATE"}
                  />
                )}
              </div>
            </div>
          ) : props.columnsDropdown &&
            props.columnsDropdown.includes("category_title") ? (
            <div className="lg:pr-3 flex flex-col">
              <Label htmlFor="selectedEnable">Filtrar por</Label>
              <div className="mt-1">
                {props.columnsDropdown &&
                props.columnsSecondDropdown === undefined ? (
                  <div className="border-r-2 border-slate-300 pr-6 mr-3">
                    <SelectFilter
                      dataDropdown={
                        props.dataDropdown ? props.dataDropdown : []
                      }
                      onFilterChange={handleProjectCategoryChange}
                      title={"CATEGORIES_TITLE"}
                    />
                  </div>
                ) : (
                  <SelectFilter
                    dataDropdown={props.dataDropdown ? props.dataDropdown : []}
                    onFilterChange={handleProjectCategoryChange}
                    title={"CATEGORIES_TITLE"}
                  />
                )}
              </div>
            </div>
          ) : props.columnsDropdown &&
            props.columnsDropdown.includes("formalisation_date") ? (
            <div className="lg:pr-3 flex flex-col">
              <div className="flex">
                <Label htmlFor="selectedEnable">Filtrar por</Label>
                {props.showCleanFilter === true && (
                  <div className="flex justify-center">
                    {/*  <LuListX className="w-4 h-4 mr-1 mt-1 text-red-900 cursor-pointer" /> */}
                    <a
                      className="text-red-900 cursor-pointer text-sm font-medium dark:text-white ml-1"
                      onClick={deleteFiltering}
                    >
                      / Limpiar filtros
                    </a>
                  </div>
                )}
              </div>
              <div>
                {props.columnsDropdown &&
                props.columnsSecondDropdown === undefined ? (
                  <div className="border-r-2 border-slate-300 pr-6 mr-3">
                    <SelectDateFilter
                      dataDropdown={
                        props.dataDropdown ? props.dataDropdown : []
                      }
                      onFilterChange={onFilteredDate}
                      title={"FORMALISATION_DATE"}
                      showCustom={showDatesCustom}
                    />
                  </div>
                ) : (
                  <SelectDateFilter
                    dataDropdown={props.dataDropdown ? props.dataDropdown : []}
                    onFilterChange={onFilteredDate}
                    title={"FORMALISATION_DATE"}
                    showCustom={showDatesCustom}
                  />
                )}
              </div>
            </div>
          ) : null}

          {/* SEGUNDO DROPDOWN Y SUS CASUISTICAS */}
          {props.columnsSecondDropdown &&
          props.columnsSecondDropdown.includes("order_module") ? (
            <div className="lg:pr-3 flex flex-col">
              <div className="mt-6">
                {props.columnsSecondDropdown &&
                props.columnsThirdDropdown === undefined ? (
                  <div className="border-r-2 border-slate-300 pr-6 mr-3">
                    <SelectEnumsFilter
                      dataDropdown={
                        props.secondDataDropdown ? props.secondDataDropdown : []
                      }
                      onFilterChange={handleModuleChange}
                      title={t("MODULE")}
                    />
                  </div>
                ) : (
                  <SelectEnumsFilter
                    dataDropdown={
                      props.secondDataDropdown ? props.secondDataDropdown : []
                    }
                    onFilterChange={handleModuleChange}
                    title={t("MODULE")}
                  />
                )}
              </div>
            </div>
          ) : props.columnsSecondDropdown &&
            props.columnsSecondDropdown.includes("project_title") ? (
            <div className="lg:pr-3 flex flex-col">
              <div className="mt-6">
                {props.columnsSecondDropdown &&
                props.columnsThirdDropdown === undefined ? (
                  <div className="border-r-2 border-slate-300 pr-6 mr-3">
                    <SelectFilter
                      dataDropdown={
                        props.secondDataDropdown ? props.secondDataDropdown : []
                      }
                      onFilterChange={handleProjectChange}
                      title={"PROJECT_TITLE"}
                    />
                  </div>
                ) : (
                  <SelectFilter
                    dataDropdown={
                      props.secondDataDropdown ? props.secondDataDropdown : []
                    }
                    onFilterChange={handleProjectChange}
                    title={"PROJECT_TITLE"}
                  />
                )}
              </div>
            </div>
          ) : props.columnsSecondDropdown &&
            props.columnsSecondDropdown.includes("tickets_title") ? (
            <div className="lg:pr-3 flex flex-col">
              <div className="mt-6">
                {props.columnsSecondDropdown &&
                props.columnsThirdDropdown === undefined ? (
                  <div className="border-r-2 border-slate-300 pr-6 mr-3">
                    <Select
                      value={""}
                      onChange={(event) => setSelectedEvent([event.target.id])}
                    >
                      <option hidden disabled value="">
                        Eventos
                      </option>
                      {props.secondDataDropdown &&
                        props.secondDataDropdown.map((item: any) => (
                          <option key={item.id} value={item.id}>
                            {item.title}
                          </option>
                        ))}
                    </Select>
                  </div>
                ) : (
                  <>
                    <Select
                      value={""}
                      onChange={(event) =>
                        setSelectedEvent([event.target.value])
                      }
                    >
                      <option hidden disabled value="">
                        Eventos
                      </option>
                      {props.secondDataDropdown &&
                        props.secondDataDropdown.map((item: any) => (
                          <option key={item.id} value={item.id}>
                            {item.title}
                          </option>
                        ))}
                    </Select>
                  </>
                )}
              </div>
            </div>
          ) : null}

          {/* TERCERO DROPDOWN Y SUS CASUISTICAS */}
          {props.columnsThirdDropdown &&
          props.columnsThirdDropdown.includes("method_title") ? (
            <div className="lg:pr-3 flex flex-col">
              <div className="mt-6">
                <div className="border-r-2 border-slate-300 pr-6 mr-3">
                  <SelectFilter
                    dataDropdown={
                      props.thirdDataDropdown ? props.thirdDataDropdown : []
                    }
                    onFilterChange={handleMethodChange}
                    title={t("METHOD_TITLE")}
                  />
                </div>
              </div>
            </div>
          ) : props.columnsThirdDropdown &&
            props.columnsThirdDropdown.includes("state") ? (
            <div className="lg:pr-3 flex flex-col">
              {/* <Label htmlFor="orderBy">Filtrar por</Label> */}
              <div className="mt-6">
                {props.columnsThirdDropdown &&
                props.columnsFourthDropdown === undefined ? (
                  <div className="border-r-2 border-slate-300 pr-6 mr-3">
                    <SelectEnumsFilter
                      dataDropdown={
                        props.thirdDataDropdown ? props.thirdDataDropdown : []
                      }
                      onFilterChange={handleStateChange}
                      title={t("STATE")}
                    />
                  </div>
                ) : (
                  <SelectEnumsFilter
                    dataDropdown={
                      props.thirdDataDropdown ? props.thirdDataDropdown : []
                    }
                    onFilterChange={handleStateChange}
                    title={t("STATE")}
                  />
                )}
              </div>
            </div>
          ) : props.columnsThirdDropdown &&
            props.columnsThirdDropdown.includes("tickets_products") ? (
            <div>
              {selectedEvent.length > 0 && (
                <div className="lg:pr-3 flex flex-col">
                  <div className="mt-6">
                    {props.columnsThirdDropdown &&
                    props.columnsFourthDropdown === undefined ? (
                      <div className="border-r-2 border-slate-300 pr-6 mr-3">
                        <Select
                          value={""}
                          onChange={(event) =>
                            setSelectedProduct([event.target.value])
                          }
                        >
                          <option hidden disabled value="">
                            Productos
                          </option>
                          {productsToDropdown &&
                            productsToDropdown.map((item: any) => (
                              <option key={item.id} value={item.id}>
                                {item.title}
                              </option>
                            ))}
                        </Select>
                      </div>
                    ) : (
                      <Select
                        value={""}
                        onChange={(event) =>
                          setSelectedProduct([event.target.value])
                        }
                      >
                        <option hidden disabled value="">
                          Productos
                        </option>
                        {productsToDropdown &&
                          productsToDropdown.map((item: any) => (
                            <option key={item.id} value={item.id}>
                              {item.title}
                            </option>
                          ))}
                      </Select>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* CUARTO DROPDOWN Y SUS CASUISTICAS */}
          {props.columnsFourthDropdown &&
          props.columnsFourthDropdown.includes("priority") ? (
            <div className="lg:pr-3 flex flex-col">
              {/* <Label htmlFor="orderBy">Filtrar por</Label> */}
              <div className="mt-6">
                <div className="border-r-2 border-slate-300 pr-6 mr-3">
                  <SelectFilter
                    dataDropdown={
                      props.fourthDataDropdown ? props.fourthDataDropdown : []
                    }
                    onFilterChange={handlePriorityChange}
                    title={"PRIORITY"}
                  />
                </div>
              </div>
            </div>
          ) : props.columnsFourthDropdown &&
            props.columnsFourthDropdown.includes("state") ? (
            <div className="lg:pr-3 flex flex-col">
              {/* <Label htmlFor="orderBy">Filtrar por</Label> */}
              <div className="mt-6">
                {props.columnsFourthDropdown &&
                props.columnsFifthDropdown === undefined ? (
                  <div className="border-r-2 border-slate-300 pr-6 mr-3">
                    <SelectEnumsFilter
                      dataDropdown={
                        props.fourthDataDropdown ? props.fourthDataDropdown : []
                      }
                      onFilterChange={handleStateChange}
                      title={t("STATE")}
                    />
                  </div>
                ) : (
                  <SelectEnumsFilter
                    dataDropdown={
                      props.fourthDataDropdown ? props.fourthDataDropdown : []
                    }
                    onFilterChange={handleStateChange}
                    title={t("STATE")}
                  />
                )}
              </div>
            </div>
          ) : null}

          {/* QUINTO DROPDOWN Y SUS CASUISTICAS */}
          {props.columnsFifthDropdown &&
          props.columnsFifthDropdown.includes("type") ? (
            <div className="lg:pr-3 flex flex-col">
              {/* <Label htmlFor="orderBy">Filtrar por</Label> */}
              <div className="mt-6">
                <Select
                  value={""}
                  onChange={(event) =>
                    setSelectedTypesTickets([event.target.value])
                  }
                >
                  <option hidden disabled value="">
                    Tipo de producto
                  </option>
                  {props.fifthDataDropdown &&
                    props.fifthDataDropdown.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                </Select>
              </div>
            </div>
          ) : null}
        </div>

        {/* ORDER BY Y ORDER DIR */}
        {props.showOrder && (
          <>
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
          </>
        )}

        <div className="ml-auto flex space-x-1 sm:space-x-3">
         
          {props.showButtonSave !== undefined &&
          props.showButtonSave === false ? null : (
            <Button
              color="primary"
              onClick={props.onAddButton}
              disabled={props.disableAddButton}
            >
              <div className="flex items-center gap-x-1">
                <LuPlus className="text-xl" />
                {t("ADD_BTN")}
              </div>
            </Button>
            
          )}

          {props.dataToExport && props.dataToExport?.length > 0 && (
            <div className="flex">
              <Button
                color="success"
                onClick={() =>
                  createXLs(
                    props.dataToExport && props.dataToExport?.length > 0
                      ? props.dataToExport
                      : [],
                    props.exportFileName!,
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
