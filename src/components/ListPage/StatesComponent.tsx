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
        <div className="container items-center flex flex-row max-w-max px-4 bg-purple-100 text-purple-800 rounded-full">
          <label className="font-medium">Creada</label>
        </div>
      ) : state === "ASSIGNED" ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-orange-100 text-orange-800 rounded-full">
          <label className="font-medium">Asignada</label>
        </div>
      ) : state === "OPEN" ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-blue-100 text-blue-800 rounded-full">
          <label className="font-medium">Abierta</label>
        </div>
      ) : state === "IN_PROGRESS" ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-yellow-100 text-yellow-800 rounded-full">
          <label className="font-medium">En proceso</label>
        </div>
      ) : state === "PENDING" ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-yellow-100 text-yellow-800 rounded-full">
          <label className="font-medium">Pendiente</label>
        </div>
      ) : state === "VALIDATED" ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-green-100 text-green-800 rounded-full">
          <label className="font-medium">Validada</label>
        </div>
      ) : state === "CONFIRMED" ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-green-100 text-green-800 rounded-full">
          <label className="font-medium">Confirmada</label>
        </div>
      ) : state === "COMPLETED" ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-green-100 text-green-800 rounded-full">
          <label className="font-medium">Completada</label>
        </div>
      ) : state === "REOPEN" ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-blue-100 text-blue-800 rounded-full">
          <label className="font-medium">Reabierta</label>
        </div>
      ) : state === "CANCELLED" || state === "CANCELED" ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-red-100 text-red-800 rounded-full">
          <label className="font-medium">Cancelada</label>
        </div>
      ) : state === "DENIED" ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-red-100 text-red-800 rounded-full">
          <label className="font-medium">Denegada</label>
        </div>
      ) : state === "ERROR" ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-red-100 text-red-800 rounded-full">
          <label className="font-medium">Error</label>
        </div>
      ) : state === "CLOSED" ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-gray-100 text-gray-800 rounded-full">
          <label className="font-medium">Cerrada</label>
        </div>
      ) : state === "STANDBY" ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-red-100 text-red-800 rounded-full">
          <label className="font-medium">Borrador</label>
        </div>
      ) : state === "SEND" ? (
        <div className="container items-center flex flex-row max-w-max px-4 bg-green-100 text-green-800 rounded-full">
          <label className="font-medium">Enviado</label>
        </div>
      ) : null}
    </>
  );
}
