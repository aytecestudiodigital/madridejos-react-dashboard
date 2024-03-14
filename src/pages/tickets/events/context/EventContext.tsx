/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState } from "react";

export const EventContext = createContext<any>(undefined);

export const EventProvider = ({ children }: any) => {
  const [normalPaymentMethods, setNormalPaymentMethods] = useState<any[]>([]);
  const [techniciansPaymentMethods, setTechniciansPaymentMethods] = useState<
    any[]
  >([]);

  const updateNormalPaymentMethods = (data: any) => {
    setNormalPaymentMethods(data);
  };

  const getNormalPaymentMethods = () => {
    const data = [...normalPaymentMethods];
    return data;
  };

  const updateTechniciansPaymentMethods = (data: any) => {
    setTechniciansPaymentMethods(data);
  };

  const getTechniciansPaymentMethods = () => {
    const data = [...techniciansPaymentMethods];
    return data;
  };

  const contextValue = {
    updateNormalPaymentMethods,
    getNormalPaymentMethods,
    updateTechniciansPaymentMethods,
    getTechniciansPaymentMethods,
  };

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};
