import { Checkbox, Dropdown } from "flowbite-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getOneRow } from "../../../../server/supabaseQueries";
import { PaymentMethod } from "../../../bookings/items/models/PaymentMethod";
/**
 *
 * block w-full border disabled:cursor-not-allowed
 * disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900
 * focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600
 * dark:bg-gray-700 dark:text-white dark:placeholder-gray-400
 * dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg
 */
interface MethodsProps {
  dataDropdown: any[];
  onMethodChange: (selectedTypes: number[]) => void;
  selectTitle: string;
}

export default function SelectMethodFilter(props: MethodsProps) {
  const [selectedMethods, setSelectedMethods] = useState<number[]>([]);
  const [typesFilters, setMethodsFilters] = useState<
    { title: string; id: number }[]
  >([]);
  const { t } = useTranslation();

  const paymentsMethodsTableName = import.meta.env.VITE_TABLE_PAYMENTS_METHOD;

  const handleCategoryChange = (id: number, checked: boolean) => {
    if (checked) {
      // Agregar el título si está marcado
      setSelectedMethods((prevMethods) => {
        const prev = [...prevMethods, id];
        props.onMethodChange(prev);
        return prev;
      });
    } else {
      // Quitar el título si está desmarcado
      setSelectedMethods((prevMethods) => {
        const filtered = prevMethods.filter((prevId) => prevId !== id);
        props.onMethodChange(filtered);
        return filtered;
      });
    }
  };

  useEffect(() => {
    // Utilizar useEffect para ejecutar código asincrónico después del montaje
    const fetchData = async () => {
      const filters = await Promise.all(
        props.dataDropdown.map(async (item) => {
          const title = item;
          const method: PaymentMethod = await getOneRow(
            "title",
            title,
            paymentsMethodsTableName,
          );
          return { title: title, id: method.id! };
        }),
      );
      setMethodsFilters(filters);
    };

    fetchData();
  }, [props.dataDropdown, paymentsMethodsTableName]);

  return (
    <Dropdown
      renderTrigger={({}) => (
        <button
          id="dropdownBgHoverButton"
          data-dropdown-toggle="dropdownBgHover"
          className="flex items-center justify-between w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg focus:outline-none focus-within:border-2 focus-within:border-cyan-500"
          type="button"
        >
          <span>{t(props.selectTitle)}</span>
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
      {typesFilters.map((item, index) => (
        <Dropdown.Item key={index}>
          <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
            <Checkbox
              id={`checkbox-item-${index}`}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
              checked={selectedMethods.includes(item.id)}
              onChange={(e) => handleCategoryChange(item.id, e.target.checked)}
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
