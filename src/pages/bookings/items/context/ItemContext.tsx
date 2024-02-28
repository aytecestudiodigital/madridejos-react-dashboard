/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState } from "react";

export const ItemContext = createContext<any>(undefined);

export const ItemProvider = ({ children }: any) => {
  const [legalFormValue, setLegalFormValue] = useState<any>(null);
  const [technicals, setTechnicals] = useState<any[]>([]);
  const [technicalsToUpdate, setTechnicalsToUpdate] = useState<any[]>([]);
  const [technicalsToDelete, setTechnicalsToDelete] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [paymentMethodsToUpdate, setPaymentMethodsToUpdate] = useState<any[]>(
    [],
  );
  const [paymentMethodsToDelete, setPaymentMethodsToDelete] = useState<any[]>(
    [],
  );

  const updateLegalFormValue = (value: any) => {
    setLegalFormValue(value);
  };

  const getLegalFormValue = () => {
    const data = legalFormValue;
    return data;
  };

  const updateTechnicals = (value: any) => {
    setTechnicals(value);
  };

  const getTechnicals = () => {
    const data = [...technicals];
    return data;
  };

  const updateTechnicalsToUpdate = (value: any) => {
    setTechnicalsToUpdate(value);
  };

  const getTechnicalsToUpdate = () => {
    const data = [...technicalsToUpdate];
    return data;
  };

  const updateTechnicalsToDelete = (value: any) => {
    setTechnicalsToDelete(value);
  };

  const getTechnicalsToDelete = () => {
    const data = [...technicalsToDelete];
    return data;
  };

  const updatePaymentMethods = (value: any) => {
    setPaymentMethods(value);
  };

  const getPaymentMethods = () => {
    const data = [...paymentMethods];
    return data;
  };

  const updatePaymentMethodsToUpdate = (value: any) => {
    setPaymentMethodsToUpdate(value);
  };

  const getPaymentMethodsToUpdate = () => {
    const data = [...paymentMethodsToUpdate];
    return data;
  };

  const updatePaymentMethodsToDelete = (value: any) => {
    setPaymentMethodsToDelete(value);
  };

  const getPaymentMethodsToDelete = () => {
    const data = [...paymentMethodsToDelete];
    return data;
  };

  const contextValue = {
    updateLegalFormValue,
    getLegalFormValue,
    updateTechnicals,
    getTechnicals,
    updateTechnicalsToUpdate,
    getTechnicalsToUpdate,
    updateTechnicalsToDelete,
    getTechnicalsToDelete,
    updatePaymentMethods,
    getPaymentMethods,
    updatePaymentMethodsToUpdate,
    getPaymentMethodsToUpdate,
    updatePaymentMethodsToDelete,
    getPaymentMethodsToDelete,
  };

  return (
    <ItemContext.Provider value={contextValue}>{children}</ItemContext.Provider>
  );
};
