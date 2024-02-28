/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pagination, Select } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { ContentTable } from "./ContentTable";
import { BreadcrumbItem, HeaderListPageComponent } from "./HeaderListPage";
import { useState } from "react";

interface ListPageProps {
  page_title: string;
  entity_table: string;
  columns: string[];
  columnsFilter?: string[];
  columnsDropdown?: string[];
  columnsSecondDropdown?: string[];
  columnsThirdDropdown?: any[];
  breadcrumb: BreadcrumbItem[];
  onSearch: (
    searchTerm: string,
    orderBy: string,
    orderDir: string,
  ) => Promise<void>;
  onClearSearch: () => void;
  newItem: () => void;
  data: any[];
  loading: boolean;
  clickOnItem: (item: any) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onChangeSize: (count: number) => void;
  totalItems: number;
  initRange: number;
  endRange: number;
  isOpen?: boolean | null;
  alertMsg?: string;
  action?: string;
  dataDropdown?: any[] | null;
  secondDataDropdown?: any[] | null;
  thirdDataDropdown?: any[] | null;
  showButtonSave?: boolean;
}
export default function ListPageWithPagination(props: ListPageProps) {
  const { t } = useTranslation();
  const [dataToExport, setDataToExport] = useState<any>([]);
  return (
    <>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <HeaderListPageComponent
            title={props.page_title}
            breadcrumb={props.breadcrumb}
            columns={props.columnsFilter ? props.columnsFilter : props.columns}
            onSearch={props.onSearch}
            onClearSearch={props.onClearSearch}
            onAddButton={props.newItem}
            columnsDropdown={props.columnsDropdown}
            dataDropdown={props.dataDropdown ? props.dataDropdown : []}
            columnsSecondDropdown={props.columnsSecondDropdown}
            secondDataDropdown={
              props.secondDataDropdown ? props.secondDataDropdown : []
            }
            columnsThirdDropdown={props.columnsThirdDropdown}
            thirdDataDropdown={
              props.thirdDataDropdown ? props.thirdDataDropdown : []
            }
            dataToExport={dataToExport}
            showButtonSave={
              props.showButtonSave != undefined ? props.showButtonSave : true
            }
          />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              {props.data.length == 0 && !props.loading ? (
                <span className=" dark:text-white justify-center flex my-4">
                  {t("SEARCH_NOT_FOUND")}
                </span>
              ) : (
                <ContentTable
                  data={props.data}
                  loading={props.loading}
                  columns={props.columns}
                  onItemClick={props.clickOnItem}
                  onDataToExport={(data) => setDataToExport(data)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex overflow-x-auto justify-between mt-2 mx-4 items-center">
        <div className="flex items-center">
          <Pagination
            currentPage={props.currentPage}
            totalPages={props.totalPages}
            onPageChange={props.onPageChange}
            showIcons
            previousLabel={t("PAGINATION_PREV_PAGE")}
            nextLabel={t("PAGINATION_NEXT_PAGE")}
            className="mb-6"
          />
          <Select
            className="ml-4 mb-4"
            id="pageSize"
            value={props.pageSize}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              props.onChangeSize(Number(event.target.value))
            }
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="1000">1000</option>
          </Select>
        </div>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-4 mb-6">
          {t("PAGINATION_SHOWING")}&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">
            {props.initRange}-{props.endRange}
          </span>
          &nbsp;{t("PAGINATION_OF")}&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">
            {props.totalItems}
          </span>
        </span>
      </div>
    </>
  );
}
