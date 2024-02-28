/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState } from "react";

export const InscriptionFormContext = createContext<any>(undefined);

export const InscriptionFormProvider = ({ children }: any) => {
  const [mainFormValues, setMainFormValues] = useState<any>(null);
  const [authFormValues, setAuthFormValues] = useState<any>(null);
  const [mainFormInputs, setmainFormInputs] = useState<any[]>([]);
  const [mainFormInputsToUpdate, setMainFormInputsToUpdate] = useState<any[]>(
    [],
  );
  const [mainFormInputsToDelete, setMainFormInputsToDelete] = useState<any[]>(
    [],
  );
  const [authFormInputs, setAuthFormInputs] = useState<any[]>([]);
  const [authFormInputsToUpdate, setAuthFormInputsToUpdate] = useState<any[]>(
    [],
  );
  const [authFormInputsToDelete, setAuthFormInputsToDelete] = useState<any[]>(
    [],
  );
  const [activitiesForm, setActivitiesForm] = useState<any>(null);
  const [mainActivities, setMainActivities] = useState<any[]>([]);
  const [mainActivitiesToUpdate, setMainActivitiesToUpdate] = useState<any[]>(
    [],
  );
  const [mainActivitiesToDelete, setMainActivitiesToDelete] = useState<any[]>(
    [],
  );
  const [aditionalActivities, setAditionalActivities] = useState<any[]>([]);
  const [aditionalActivitiesToUpdate, setAditionalActivitiesToUpdate] =
    useState<any[]>([]);
  const [aditionalActivitiesToDelete, setAditionalActivitiesToDelete] =
    useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [paymentMethodsToUpdate, setPaymentMethodsToUpdate] = useState<any[]>(
    [],
  );
  const [paymentsMethodsToDelete, setPaymentMethodsToDelete] = useState<any[]>(
    [],
  );
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [discountsToUpdate, setDiscountsToUpdate] = useState<any[]>([]);
  const [discountsToDelete, setDiscountsToDelete] = useState<any[]>([]);
  const [authorizations, setAuthorizations] = useState<any[]>([]);
  const [authorizationsToUpdate, setAuthorizationsToUpdate] = useState<any[]>(
    [],
  );
  const [authorizationsToDelete, setAuthorizationsToDelete] = useState<any[]>(
    [],
  );
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentsToUpdate, setDocumentsToUpdate] = useState<any[]>([]);
  const [documentsToDelete, setDocumentsToDelete] = useState<any[]>([]);

  const updateMainFormValues = (values: any) => {
    setMainFormValues(values);
  };

  const getFormValues = () => {
    const data = { ...mainFormValues };
    return data;
  };

  const updateAuthFormValues = (values: any) => {
    setAuthFormValues(values);
  };

  const getAuthFormValues = () => {
    const data = authFormValues;
    return data;
  };

  const updateMainInputs = (data: any) => {
    setmainFormInputs(data);
  };

  const getMainInputs = () => {
    const data = [...mainFormInputs];
    return data;
  };

  const updateMainInputsToUpdate = (data: any) => {
    setMainFormInputsToUpdate(data);
  };

  const getMainInputsToUpdate = () => {
    const data = [...mainFormInputsToUpdate];
    return data;
  };

  const updateMainInputsToDelete = (data: any) => {
    setMainFormInputsToDelete(data);
  };

  const getMainInputsToDelete = () => {
    const data = [...mainFormInputsToDelete];
    return data;
  };

  const updateAuthInputs = (data: any) => {
    setAuthFormInputs(data);
  };

  const getAuthInputs = () => {
    const data = [...authFormInputs];
    return data;
  };

  const updateAuthInputsToUpdate = (data: any) => {
    setAuthFormInputsToUpdate(data);
  };

  const getAuthInputsToUpdate = () => {
    const data = [...authFormInputsToUpdate];
    return data;
  };

  const updateAuthInputsToDelete = (data: any) => {
    setAuthFormInputsToDelete(data);
  };

  const getAuthInputsToDelete = () => {
    const data = [...authFormInputsToDelete];
    return data;
  };

  const updateActivitiesForm = (values: any) => {
    setActivitiesForm(values);
  };

  const getActivitiesForm = () => {
    const data = activitiesForm;
    return data;
  };

  const updateMainActivities = (data: any) => {
    setMainActivities(data);
  };

  const getMainActivities = () => {
    const data = [...mainActivities];
    return data;
  };

  const updateMainActivitiesToUpdate = (data: any) => {
    setMainActivitiesToUpdate(data);
  };

  const getMainActivitiesToUpdate = () => {
    const data = [...mainActivitiesToUpdate];
    return data;
  };

  const updateMainActivitiesToDelete = (data: any) => {
    setMainActivitiesToDelete(data);
  };

  const getMainActivitiesToDelete = () => {
    const data = [...mainActivitiesToDelete];
    return data;
  };

  const updateAditionalActivities = (data: any) => {
    setAditionalActivities(data);
  };

  const getAditionalActivities = () => {
    const data = [...aditionalActivities];
    return data;
  };

  const updateAditionalActivitiesToUpdate = (data: any) => {
    setAditionalActivitiesToUpdate(data);
  };

  const getAditionalActivitiesToUpdate = () => {
    const data = [...aditionalActivitiesToUpdate];
    return data;
  };

  const updateAditionalActivitiesToDelete = (data: any) => {
    setAditionalActivitiesToDelete(data);
  };

  const getAditionalActivitiesToDelete = () => {
    const data = [...aditionalActivitiesToDelete];
    return data;
  };

  const updatePaymentMethods = (data: any) => {
    setPaymentMethods(data);
  };

  const getPaymentMethods = () => {
    const data = [...paymentMethods];
    return data;
  };

  const updatePaymentMethodsToUpdate = (data: any) => {
    setPaymentMethodsToUpdate(data);
  };

  const getPaymentMethodsToUpdate = () => {
    const data = [...paymentMethodsToUpdate];
    return data;
  };

  const updatePaymentMethodsToDelete = (data: any) => {
    setPaymentMethodsToDelete(data);
  };

  const getPaymentMethodsToDelete = () => {
    const data = [...paymentsMethodsToDelete];
    return data;
  };

  const updateDiscounts = (data: any) => {
    setDiscounts(data);
  };

  const getDiscounts = () => {
    const data = [...discounts];
    return data;
  };

  const updateDiscountsToUpdate = (data: any) => {
    setDiscountsToUpdate(data);
  };

  const getDiscountsToUpdate = () => {
    const data = [...discountsToUpdate];
    return data;
  };

  const updateDiscountsToDelete = (data: any) => {
    setDiscountsToDelete(data);
  };

  const getDiscountsToDelete = () => {
    const data = [...discountsToDelete];
    return data;
  };

  const updateAuthorizations = (data: any) => {
    setAuthorizations(data);
  };

  const getAuthorizations = () => {
    const data = [...authorizations];
    return data;
  };

  const updateAuthorizationsToUpdate = (data: any) => {
    setAuthorizationsToUpdate(data);
  };

  const getAuthorizationsToUpdate = () => {
    const data = [...authorizationsToUpdate];
    return data;
  };

  const updateAuthorizationsToDelete = (data: any) => {
    setAuthorizationsToDelete(data);
  };

  const getAuthorizationsToDelete = () => {
    const data = [...authorizationsToDelete];
    return data;
  };

  const updateDocuments = (data: any) => {
    setDocuments(data);
  };

  const getDocuments = () => {
    const data = [...documents];
    return data;
  };

  const updateDocumentsToUpdate = (data: any) => {
    setDocumentsToUpdate(data);
  };

  const getDocumentsToUpdate = () => {
    const data = [...documentsToUpdate];
    return data;
  };

  const updateDocumentsToDelete = (data: any) => {
    setDocumentsToDelete(data);
  };

  const getDocumentsToDelete = () => {
    const data = [...documentsToDelete];
    return data;
  };

  const contextValue = {
    updateMainFormValues,
    getFormValues,
    updateAuthFormValues,
    getAuthFormValues,
    updateMainInputs,
    getMainInputs,
    updateMainInputsToUpdate,
    getMainInputsToUpdate,
    updateMainInputsToDelete,
    getMainInputsToDelete,
    updateAuthInputs,
    getAuthInputs,
    updateAuthInputsToUpdate,
    getAuthInputsToUpdate,
    updateAuthInputsToDelete,
    getAuthInputsToDelete,
    updateActivitiesForm,
    getActivitiesForm,
    updateMainActivities,
    getMainActivities,
    updateMainActivitiesToUpdate,
    getMainActivitiesToUpdate,
    updateMainActivitiesToDelete,
    getMainActivitiesToDelete,
    updateAditionalActivities,
    getAditionalActivities,
    updateAditionalActivitiesToUpdate,
    getAditionalActivitiesToUpdate,
    updateAditionalActivitiesToDelete,
    getAditionalActivitiesToDelete,
    updatePaymentMethods,
    getPaymentMethods,
    updatePaymentMethodsToUpdate,
    getPaymentMethodsToUpdate,
    updatePaymentMethodsToDelete,
    getPaymentMethodsToDelete,
    updateDiscounts,
    getDiscounts,
    updateDiscountsToUpdate,
    getDiscountsToUpdate,
    updateDiscountsToDelete,
    getDiscountsToDelete,
    updateAuthorizations,
    getAuthorizations,
    updateAuthorizationsToUpdate,
    getAuthorizationsToUpdate,
    updateAuthorizationsToDelete,
    getAuthorizationsToDelete,
    updateDocuments,
    getDocuments,
    updateDocumentsToUpdate,
    getDocumentsToUpdate,
    updateDocumentsToDelete,
    getDocumentsToDelete,
  };

  return (
    <InscriptionFormContext.Provider value={contextValue}>
      {children}
    </InscriptionFormContext.Provider>
  );
};
