import { useTranslation } from "react-i18next";

interface StateComponentProps {
  state: string | boolean;
}

export default function StateComponent({ state }: StateComponentProps) {
  const { t } = useTranslation();
  return (
    <>
      {state === "PUBLISH" ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-green-100 rounded-full">
          <svg
            className="w-4 h-4 mr-1 text-green-600 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 16 12"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5.917 5.724 10.5 15 1.5"
            />
          </svg>
          <label style={{ color: "green" }}>{t("PUBLISH")}</label>
        </div>
      ) : state === "UNPUBLISH" ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-red-100 rounded-full">
          <svg
            className="w-4 h-4 mr-1 text-red-600 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 16 12"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <label style={{ color: "red" }}>{t("UNPUBLISH")}</label>
        </div>
      ) : state === "CREATED" ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-green-300 rounded-full">
          <label>Creada</label>
        </div>
      ) : state === "ASSIGNED" ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-orange-300 rounded-full">
          <label>Asignada</label>
        </div>
      ) : state === "OPEN" ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-green-400 rounded-full">
          <label>Abierta</label>
        </div>
      ) : state === "IN_PROGRESS" ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-yellow-300 rounded-full">
          <label>En proceso</label>
        </div>
      ) : state === "VALIDATED" ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-green-600 text-white rounded-full">
          <label>Validada</label>
        </div>
      ) : state === "REOPEN" ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-blue-500 rounded-full">
          <label>Reabierta</label>
        </div>
      ) : state === "CANCELLED" ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-black text-white rounded-full">
          <label>Cancelada</label>
        </div>
      ) : state === "CLOSED" ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-red-700 text-white rounded-full">
          <label>Cerrada</label>
        </div>
      ) : null}
    </>
  );
}
