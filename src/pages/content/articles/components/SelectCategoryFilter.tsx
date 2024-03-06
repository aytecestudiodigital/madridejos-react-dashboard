import { Checkbox, Dropdown } from "flowbite-react";
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
interface CategoryProps {
  dataDropdown: any[];
  onCategoryChange: (selectedCategories: any[]) => void;
  title: string;
}

export default function SelectCategoryFilter(props: CategoryProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { t } = useTranslation();

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      const selected = [...selectedCategories, category];
      setSelectedCategories(selected);
      props.onCategoryChange(selected);
      return selected;
    } else {
      const selected = selectedCategories.filter((s) => s != category);
      setSelectedCategories(selected);
      props.onCategoryChange(selected);
      return selected;
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    props.onCategoryChange([]);
  };

  return (
    <Dropdown
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
      label={t(props.title)}
      dismissOnClick={false}
    >
      <Dropdown.Item onClick={() => clearFilters()}>
        Limpiar filtros
      </Dropdown.Item>
      <Dropdown.Divider />
      {props.dataDropdown.map((item) => (
        <Dropdown.Item key={item.id}>
          <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
            <Checkbox
              id={`checkbox-item-${item.id}`}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
              checked={selectedCategories.includes(item.id)}
              onChange={(e) => handleCategoryChange(item.id, e.target.checked)}
            />
            <label
              htmlFor={`checkbox-item-${item.id}`}
              className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
            >
              {item.title}
            </label>
          </div>
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
}
