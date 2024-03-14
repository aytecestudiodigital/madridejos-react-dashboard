import { Checkbox, CustomFlowbiteTheme, Dropdown } from "flowbite-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
/**
 *
 * block w-full border disabled:cursor-not-allowed
 * disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900
 * focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600
 * dark:bg-gray-700 dark:text-white dark:placeholder-gray-400
 * dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg
 */
interface EnumsProps {
  dataDropdown: any[];
  onFilterChange: any;
  title: string;
}

//! Se usa cuando solo pasamos el title de los elementos a mostrar y hace falta setear el id (ejemplo: cuando son enums)

export default function SelectEnumsFilter(props: EnumsProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const { t } = useTranslation();

  const handleFiltersChange = (title: string, checked: boolean) => {
    if (checked) {
      // Agregar el título si está marcado
      setSelectedFilters((prevTypes) => {
        const prev = [...prevTypes, title];
        props.onFilterChange(prev);
        return prev;
      });
    } else {
      // Quitar el título si está desmarcado
      setSelectedFilters((prevFilters) => {
        const filtered = prevFilters.filter((prevTitle) => prevTitle !== title);
        props.onFilterChange(filtered);
        return filtered;
      });
    }
  };

  const filters: { title: string; id: number }[] = [];
  const idSet = new Set();
  let count: number = 0;

  props.dataDropdown.forEach((item) => {
    const title = item;
    let id: number | null = null;

    if (!idSet.has(id)) {
      id = count += 1;
      filters.push({ title: title, id: id });
      idSet.add(id);
    }
  });

  const clearFilters = () => {
    setSelectedFilters([]);
    props.onFilterChange([]);
  };

  const customTheme: CustomFlowbiteTheme["dropdown"] = {
    arrowIcon: "ml-2 h-4 w-4",
    content: "py-1 focus:outline-none",
    floating: {
      animation: "transition-opacity",
      arrow: {
        base: "absolute z-10 h-2 w-2 rotate-45",
        style: {
          dark: "bg-gray-900 dark:bg-gray-700",
          light: "bg-white",
          auto: "bg-white dark:bg-gray-700",
        },
        placement: "bottom",
      },
      base: "z-10 w-fit max-h-56 overflow-y-auto rounded divide-y divide-gray-100 shadow focus:outline-none",
      content: "py-1 text-sm text-gray-700 dark:text-gray-200",
      divider: "my-1 h-px bg-gray-100 dark:bg-gray-600",
      header: "block py-2 px-4 text-sm text-gray-700 dark:text-gray-200",
      hidden: "invisible opacity-0",
      item: {
        container: "",
        base: "flex items-center justify-start py-2 px-4 text-sm text-gray-700 cursor-pointer w-full hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white",
        icon: "mr-2 h-4 w-4",
      },
      style: {
        dark: "bg-gray-900 text-white dark:bg-gray-700",
        light: "border border-gray-200 bg-white text-gray-900",
        auto: "border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white",
      },
      target: "w-fit",
    },
    inlineWrapper: "flex items-center",
  };

  return (
    <Dropdown
      theme={customTheme}
      renderTrigger={({}) => (
        <button
          id="dropdownBgHoverButton"
          data-dropdown-toggle="dropdownBgHover"
          className="flex items-center justify-between w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg focus:outline-none focus-within:border-2 focus-within:border-cyan-500"
          type="button"
        >
          <span>{t(props.title)}</span>
          <svg
            className="ml-4 h-4 w-4 py-1 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 2 4 4 4-4"
            />
          </svg>
        </button>
      )}
      color="gray"
      label={t("TYPES")}
      dismissOnClick={false}
    >
      <Dropdown.Item onClick={() => clearFilters()}>
        Limpiar filtros
      </Dropdown.Item>
      <Dropdown.Divider />
      {filters.map((item, index) => (
        <Dropdown.Item key={index}>
          <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
            <Checkbox
              id={`checkbox-item-${index}`}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
              checked={selectedFilters.includes(item.title)}
              onChange={(e) =>
                handleFiltersChange(item.title, e.target.checked)
              }
            />
            <label
              htmlFor={`checkbox-item-${index}`}
              className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
            >
              {t(item.title)}
            </label>
          </div>
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
}
