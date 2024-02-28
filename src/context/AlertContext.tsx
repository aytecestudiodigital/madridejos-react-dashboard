/* eslint-disable @typescript-eslint/no-explicit-any */
import { Toast } from "flowbite-react";
import { createContext, useContext, useState } from "react";
import { HiCheck, HiOutlineTrash, HiX } from "react-icons/hi";

// Creamos el contexto de la alerta
export const AlertContext = createContext<any>(undefined!);

// Creamos un componente proveedor para el contexto de la alerta
export const AlertProvider = ({ children }: any) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [action, setAction] = useState("");

  const openAlert = (message: any, action: any) => {
    setAlertMessage(message);
    setShowAlert(true);
    setAction(action);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const closeAlert = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  // Definimos el valor del contexto con las funciones y el estado de la alerta
  const contextValue = {
    showAlert,
    alertMessage,
    openAlert,
    closeAlert,
  };

  return (
    <AlertContext.Provider value={contextValue}>
      {showAlert && (
        <div className="flex justify-end">
          <div className="fixed z-50 mt-12 mr-12">
            <Toast>
              {action === "insert" || action === "update" ? (
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                  <HiCheck className="h-5 w-5" />
                </div>
              ) : action === "delete" ? (
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                  <HiOutlineTrash className="h-5 w-5" />
                </div>
              ) : (
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                  <HiX className="h-5 w-5" />
                </div>
              )}
              <div className="ml-4 text-sm font-normal">{alertMessage}</div>
              <Toast.Toggle />
            </Toast>
          </div>
        </div>
      )}
      {children}
    </AlertContext.Provider>
  );
};

// Un hook personalizado para utilizar el contexto de la alerta en cualquier componente
export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert debe usarse dentro de un AlertProvider");
  }
  return context;
}
