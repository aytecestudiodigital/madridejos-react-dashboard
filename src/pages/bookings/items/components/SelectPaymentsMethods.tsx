import { Checkbox, Dropdown } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { t } from "i18next";
import { ItemContext } from "../context/ItemContext";

interface PaymentMethodProps {
  dataDropdown: any[];
  onMethodChange: (selectedMethods: any[]) => void;
  defaultSelectedMethods: any[];
}

export default function SelectPaymentsMethods(props: PaymentMethodProps) {
  const [selectedMethods, setSelectedMethods] = useState<any[]>(
    props.defaultSelectedMethods ? props.defaultSelectedMethods : [],
  );
  const contextMethods = useContext(ItemContext);

  useEffect(() => {
    setSelectedMethods(props.defaultSelectedMethods);
    contextMethods.updatePaymentMethods(props.defaultSelectedMethods);
  }, [props.defaultSelectedMethods]);

  const handleMethodChange = (method: any, checked: boolean) => {
    if (checked) {
      // Agregar la categoría si está marcada
      const isSelected = [...selectedMethods];
      isSelected.push(method);
      contextMethods.updatePaymentMethods(isSelected);
      setSelectedMethods((prevMethods: any) => {
        const prev = [...prevMethods, method];
        props.onMethodChange(prev);
        return prev;
      });
    } else {
      // Quitar la categoría si está desmarcada
      const lessMethods = selectedMethods.filter(
        (prevMethod: any) => prevMethod.id !== method.id,
      );
      setSelectedMethods(lessMethods);
      contextMethods.updatePaymentMethods(lessMethods);
      props.onMethodChange(lessMethods);
    }
  };

  return (
    <Dropdown
      renderTrigger={({}) => (
        <button
          id="dropdownBgHoverButton"
          data-dropdown-toggle="dropdownBgHover"
          className="mt-1 flex items-center justify-between w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg focus:outline-none focus-within:border-2 focus-within:border-cyan-500"
          type="button"
        >
          <span>{t("SELECT")}</span>
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
      label={t("PAYMENTS_METHODS")}
      dismissOnClick={false}
    >
      {props.dataDropdown.map((item, index) => (
        <Dropdown.Item key={item.id}>
          <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
            <Checkbox
              id={`checkbox-item-${item.id}`}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
              checked={selectedMethods.map((it) => it.id).includes(item.id)}
              onChange={(e) => handleMethodChange(item, e.target.checked)}
            />
            <label
              htmlFor={`checkbox-item-${index}`}
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
