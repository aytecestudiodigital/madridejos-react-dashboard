/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Tabs } from "flowbite-react";
import { FC, useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { HeaderItemPageComponent } from "../../../../components/ListPage/HeaderItemPage";
import {
  deleteRow,
  getOneRow,
  insertRow,
  updateRow,
} from "../../../../server/supabaseQueries";
import { IncriptionDetailsCard } from "../components/IncriptionDetailsCard";
import { InscriptionActivitiesCard } from "../components/InscriptionActivitiesCard";
import { InscriptionAditionalsCard } from "../components/InscriptionAditionalsCard";
import { InscriptionAuthorizationsCard } from "../components/InscriptionAuthorizationsCard";
import { InscriptionDiscountsCard } from "../components/InscriptionDiscountsCard";
import { InscriptionDocumentsCard } from "../components/InscriptionDocumentsCard";
import { RootState } from "../../../../store/store";
import { useSelector } from "react-redux";
import { InscriptionFormCard } from "../components/InscriptionFormCard";
import { getDataByColumn } from "../data/NormalInscriptioProvider";
import { Forms } from "../models/Forms";
import { NormalInscription } from "../models/NormalInscription";
import { InscriptionFormContext } from "../context/InscriptionFormContext";
import { Product } from "../models/Products";
import { Discount } from "../models/Discounts";
import { InscriptionPaymentMethodsCard } from "../components/InscriptionPaymentMethodsCard";
import { supabase } from "../../../../server/supabase";
import { AlertContext } from "../../../../context/AlertContext";

export const EditNormalInscriptionsPage: FC = () => {
  /**
   * Definición de datos
   */
  const navigate = useNavigate();
  const location = useLocation();
  const contextMethods = useContext(InscriptionFormContext);

  /**
   * Configuración de la página
   */
  const breadcrumb = [
    {
      title: "INSCRIPTIONS",
      path: "/inscriptions/normal",
    },
    {
      title: "INSCRIPTION_PAGE_CARD_DETAILS",
    },
  ];

  const [pageTitle, setPageTitle] = useState<string>("EDIT_INSCRIPTION");

  const inscriptionTable = import.meta.env.VITE_TABLE_INSCRIPTIONS;

  const [saving, setSaving] = useState<boolean>(false);
  const [inscription, setInscription] = useState<NormalInscription | any>(
    location.state,
  );
  const [mainForm, setMainForm] = useState<Forms>();
  const [authForm, setAuthForm] = useState<Forms>();

  const [products, setProducts] = useState<Product[]>([]);
  const [aditionalProducts, setAditionalProducts] = useState<Product[]>([]);

  const [discounts, setDiscounts] = useState<Discount[]>([]);

  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  const [authorizations, setAuthorizations] = useState<any[]>([]);

  const [documents, setDocuments] = useState<any[]>([]);

  const { openAlert } = useContext(AlertContext);

  const { id } = useParams();

  const [enableFormTab, setEnableFormTab] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const [validFormTab, setValidFormTab] = useState(false);
  const [validPayments, setValidPayments] = useState(false);

  const selectForms = async () => {
    if (inscription || id) {
      const inscriptionId = inscription ? inscription.id : id;
      const forms = await getDataByColumn(
        "inscriptions_forms",
        "inscription_id",
        inscriptionId,
      );
      let auth: Forms = {};
      let main: Forms = {};
      if (forms && forms.length > 0) {
        for await (const form of forms) {
          if (form.form_type === "MAIN") {
            main = form;
          } else {
            auth = form;
          }
        }
        setMainForm(main);
        setAuthForm(auth);
      }
    }
  };

  const selectProducts = async () => {
    if (inscription || id) {
      const inscriptionId = inscription ? inscription.id : id;
      const totalProducts = await getDataByColumn(
        "inscriptions_products",
        "inscription_id",
        inscriptionId,
      );
      const normals: Product[] = [];
      const aditionals: Product[] = [];
      if (totalProducts && totalProducts.length > 0) {
        for await (const product of totalProducts) {
          if (product.is_additional) {
            aditionals.push(product);
          } else {
            normals.push(product);
          }
        }
        setAditionalProducts(aditionals);
        setProducts(normals);
        contextMethods.updateMainActivities(normals);
        contextMethods.updateAditionalActivities(aditionals);
      }
    }
  };

  const selectDiscounts = async () => {
    if (inscription || id) {
      const inscriptionId = inscription ? inscription.id : id;
      const totalDiscounts = await getDataByColumn(
        "inscriptions_discounts",
        "inscription_id",
        inscriptionId,
      );

      if (totalDiscounts && totalDiscounts.length > 0) {
        setDiscounts(totalDiscounts);
      }
    }
  };

  const selectPaymentMethods = async () => {
    if (inscription || id) {
      const inscriptionId = inscription ? inscription.id : id;
      const totalMethodsPayments = await getDataByColumn(
        "inscriptions_payments_methods",
        "inscription_id",
        inscriptionId,
      );

      if (totalMethodsPayments && totalMethodsPayments.length > 0) {
        setPaymentMethods(totalMethodsPayments);
      }
    }
  };

  const selectAuthorizations = async () => {
    if (inscription || id) {
      const inscriptionId = inscription ? inscription.id : id;
      const totalAuthorizations = await getDataByColumn(
        "inscriptions_authorizations",
        "inscription_id",
        inscriptionId,
      );

      if (totalAuthorizations && totalAuthorizations.length > 0) {
        setAuthorizations(totalAuthorizations);
      }
    }
  };

  const selectDocuments = async () => {
    if (inscription || id) {
      const inscriptionId = inscription ? inscription.id : id;
      const totalDocuments = await getDataByColumn(
        "inscriptions_attacheds",
        "inscription_id",
        inscriptionId,
      );

      if (totalDocuments && totalDocuments.length > 0) {
        setDocuments(totalDocuments);
      }
    }
  };

  useEffect(() => {
    if (user) {
      if (!user.users_roles.rules.inscriptions.inscriptions.access_module) {
        openAlert("No tienes acceso a esta página", "error");
        navigate("/");
      }
    }
  }, [user]);

  useEffect(() => {
    setPageTitle(inscription || id ? "EDIT_INSCRIPTION" : "NEW_INSCRIPTION");

    if (id) {
      getOneRow("id", id, inscriptionTable).then((data) => {
        setInscription(data);
        methods.reset(data);
      });
    }

    selectForms();
    selectProducts();
    selectDiscounts();
    selectPaymentMethods();
    selectAuthorizations();
    selectDocuments();
  }, [id]);

  useEffect(() => {
    setValidPayments(false);
    const activitiesSelected: any[] = contextMethods.getMainActivities();
    const paymentMethods = contextMethods.getPaymentMethods();
    let activityToPay = false;
    activitiesSelected.forEach((activity) => {
      if (activity.price > 0) {
        activityToPay = true;
      }
    });
    if (activityToPay && paymentMethods.length > 0) {
      setValidPayments(true);
    }
    if (!activityToPay) {
      setValidPayments(true);
    }
    if (activityToPay && paymentMethods.length === 0) {
      setValidPayments(false);
    }
  }, [contextMethods]);

  const onBack = () => {
    navigate("/inscriptions/normal");
  };

  const methods = useForm<NormalInscription>({
    values: inscription ?? undefined,
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "all",
  });

  const { formState, getValues } = methods;
  const { isValid } = formState;

  const onSave = async (close: boolean) => {
    //TODO - isValid en guardar / guardar y cerrar
    setSaving(true);
    const formValues = getValues();
    const reportUser = await getOneRow(
      "email",
      formValues.report_email!,
      "users",
    );
    const userLogged = JSON.parse(localStorage.getItem("userLogged")!);
    const inscriptionToSave: any = {
      title: formValues.title,
      inscription_type: formValues.inscription_type,
      description: formValues.description,
      image: formValues.image ? formValues.image : null,
      report_email: formValues.report_email,
      report_user: reportUser ? reportUser.id : null,
      payments_account_id: formValues.payments_account_id
        ? formValues.payments_account_id
        : null,
      date_init: formValues.date_init,
      date_end: formValues.date_end,
      org_id: "043ec7c2-572a-4199-9aa1-af6af822e76a",
      created_by: user?.id,
      updated_by: user?.id,
      enable: formValues.enable,
      advanced: true,
      discounts_description: formValues.discounts_description
        ? formValues.discounts_description
        : null,
      acumulated_discounts: formValues.acumulated_discounts,
      authorizations_description: formValues.authorizations_description
        ? formValues.authorizations_description
        : null,
      attached_title: formValues.attached_title
        ? formValues.attached_title
        : null,
      attached_description: formValues.attached_description
        ? formValues.attached_description
        : null,
      authorizations_title: formValues.authorizations_title
        ? formValues.authorizations_title
        : null,
      activity_max_products: formValues.activity_max_products,
      activity_min_products: formValues.activity_min_products,
      activity_order_asc: formValues.activity_order_asc,
      aditional_activity_title: formValues.aditional_activity_title
        ? formValues.aditional_activity_title
        : null,
      aditional_activity_description: formValues.aditional_activity_description
        ? formValues.aditional_activity_description
        : null,
      activity_title: formValues.activity_title,
      activity_type: formValues.activity_type,
      activity_order_by: formValues.activity_order_by,
      payment_period_type: null,
      period_week_day: null,
      period_month_day: null,
      period_init_date: null,
      period_end_date: null,
      group_id: user?.group_id,
      payment_title: formValues.payment_title ? formValues.payment_title : null,
      payment_description: formValues.payment_description
        ? formValues.payment_description
        : null,
    };

    const mainInputs = contextMethods.getMainInputs();
    const mainInputsToUpdate = contextMethods.getMainInputsToUpdate();
    const mainInputsToDelete = contextMethods.getMainInputsToDelete();
    const authInputs = contextMethods.getAuthInputs();
    const authInputsToUpdate = contextMethods.getAuthInputsToUpdate();
    const authInputsToDelete = contextMethods.getAuthInputsToDelete();
    const mainFormValues = contextMethods.getFormValues();
    const authFormValues = contextMethods.getAuthFormValues();
    const mainActivities = contextMethods.getMainActivities();
    const mainActivitiesToUpdate = contextMethods.getMainActivitiesToUpdate();
    const mainActivitiesToDelete = contextMethods.getMainActivitiesToDelete();
    const aditionalActivities = contextMethods.getAditionalActivities();
    const aditionalActivitiesToUpdate =
      contextMethods.getAditionalActivitiesToUpdate();
    const aditionalActivitiesToDelete =
      contextMethods.getAditionalActivitiesToDelete();
    const discounts = contextMethods.getDiscounts();
    const discountToUpdate = contextMethods.getDiscountsToUpdate();
    const discountsToDelete = contextMethods.getDiscountsToDelete();
    const authorizations = contextMethods.getAuthorizations();
    const authorizationsToUpdate = contextMethods.getAuthorizationsToUpdate();
    const authorizationsToDelete = contextMethods.getAuthorizationsToDelete();
    const paymentMethods = contextMethods.getPaymentMethods();
    const paymentMethodsToUpdate = contextMethods.getPaymentMethodsToUpdate();
    const paymentMethodsToDelete = contextMethods.getPaymentMethodsToDelete();
    const documents = contextMethods.getDocuments();
    const documentsToUpdate = contextMethods.getDocumentsToUpdate();
    const documentsToDelete = contextMethods.getDocumentsToDelete();

    if (!inscription || !id) {
      const inscriptionCreated = await insertRow(
        inscriptionToSave,
        "inscriptions",
      );
      if (inscriptionCreated) {
        if (mainFormValues) {
          mainFormValues.inscription_id = inscriptionCreated.id;
          const createdMainForm = await insertRow(
            mainFormValues,
            "inscriptions_forms",
          );
          if (createdMainForm) {
            if (mainInputs.length > 0) {
              for await (const input of mainInputs) {
                input.form_id = createdMainForm.id;
                await insertRow(input, "inscriptions_input");
              }
            }
          }
        }
        if (authFormValues) {
          authFormValues.inscription_id = inscriptionCreated.id;
          const createdAuthForm = await insertRow(
            authFormValues,
            "inscriptions_forms",
          );
          if (createdAuthForm) {
            if (authInputs.length > 0) {
              for await (const input of authInputs) {
                input.form_id = createdAuthForm.id;
                await insertRow(input, "inscriptions_input");
              }
            }
          }
        }
        if (mainActivities.length > 0) {
          for await (const product of mainActivities) {
            product.inscription_id = inscriptionCreated.id;
            await insertRow(product, "inscriptions_products");
          }
        }
        if (aditionalActivities.length > 0) {
          for await (const product of aditionalActivities) {
            product.inscription_id = inscriptionCreated.id;
            await insertRow(product, "inscriptions_products");
          }
        }
        if (discounts.length > 0) {
          for await (const discount of discounts) {
            discount.inscription_id = inscriptionCreated.id;
            await insertRow(discount, "inscriptions_discounts");
          }
        }
        if (authorizations.length > 0) {
          for await (const authorization of authorizations) {
            authorization.inscription_id = inscriptionCreated.id;
            await insertRow(authorization, "inscriptions_authorizations");
          }
        }
        if (paymentMethods.length > 0) {
          for await (const paymentMethod of paymentMethods) {
            paymentMethod.inscription_id = inscriptionCreated.id;
            await insertRow(paymentMethod, "inscriptions_payments_methods");
          }
        }
        if (documents.length > 0) {
          for await (const document of documents) {
            document.inscription_id = inscriptionCreated.id;
            await insertRow(document, "inscriptions_attacheds");
          }
        }
        openAlert("Inscripción creada con éxito", "insert");
        setInscription(inscriptionCreated);
      }
    } else {
      inscriptionToSave.id = id;
      const inscriptionUpdated = await updateRow(
        inscriptionToSave,
        "inscriptions",
      );
      if (inscriptionUpdated) {
        if (mainFormValues) {
          const updatedMainMainForm = await updateRow(
            mainFormValues,
            "inscriptions_forms",
          );
          if (updatedMainMainForm) {
            if (mainInputs.length > 0) {
              for await (const input of mainInputs) {
                if (!input.id || input.id === undefined) {
                  input.form_id = updatedMainMainForm.id;
                  await insertRow(input, "inscriptions_input");
                }
              }
            }
            if (mainInputsToUpdate.length > 0) {
              for await (const input of mainInputsToUpdate) {
                if (input.id) {
                  await updateRow(input, "inscriptions_input");
                }
              }
            }
            if (mainInputsToDelete.length > 0) {
              for await (const input of mainInputsToDelete) {
                if (input.id) {
                  await deleteRow(input.id, "inscriptions_input");
                }
              }
            }
          }
        }
        if (authFormValues) {
          const updatedAuthForm = await updateRow(
            authFormValues,
            "inscriptions_forms",
          );
          if (updatedAuthForm) {
            if (authInputs.length > 0) {
              for await (const input of authInputs) {
                if (!input.id || input.id === undefined) {
                  input.form_id = updatedAuthForm.id;
                  await insertRow(input, "inscriptions_input");
                }
              }
            }
            if (authInputsToUpdate.length > 0) {
              for await (const input of authInputsToUpdate) {
                if (input.id) {
                  await updateRow(input, "inscriptions_input");
                }
              }
            }
            if (authInputsToDelete.length > 0) {
              for await (const input of authInputsToDelete) {
                if (input.id) {
                  await deleteRow(input.id, "inscriptions_input");
                }
              }
            }
          }
        }
        if (mainActivities.length > 0) {
          for await (const product of mainActivities) {
            if (!product.id || product.id === undefined) {
              product.inscription_id = inscription.id;
              await insertRow(product, "inscriptions_products");
            }
          }
        }
        if (mainActivitiesToUpdate.length > 0) {
          for await (const product of mainActivitiesToUpdate) {
            if (product.id) {
              await updateRow(product, "inscriptions_products");
            }
          }
        }
        if (mainActivitiesToDelete.length > 0) {
          for await (const product of mainActivitiesToDelete) {
            if (product.id) {
              await deleteRow(product.id, "inscriptions_products");
            }
          }
        }
        if (aditionalActivities.length > 0) {
          for await (const product of aditionalActivities) {
            if (!product.id || product.id === undefined) {
              product.inscription_id = inscription.id;
              await insertRow(product, "inscriptions_products");
            }
          }
        }
        if (aditionalActivitiesToUpdate.length > 0) {
          for await (const product of aditionalActivitiesToUpdate) {
            if (product.id) {
              await updateRow(product, "inscriptions_products");
            }
          }
        }
        if (aditionalActivitiesToDelete.length > 0) {
          for await (const product of aditionalActivitiesToDelete) {
            if (product.id) {
              await deleteRow(product.id, "inscriptions_products");
            }
          }
        }
        if (discounts.length > 0) {
          for await (const discount of discounts) {
            if (!discount.id || discount.id === undefined) {
              discount.inscription_id = inscription.id;
              await insertRow(discount, "inscriptions_discounts");
            }
          }
        }
        if (discountToUpdate.length > 0) {
          for await (const discount of discountToUpdate) {
            if (discount.id) {
              await updateRow(discount, "inscriptions_discounts");
            }
          }
        }
        if (discountsToDelete.length > 0) {
          for await (const discount of discountsToDelete) {
            if (discount.id) {
              await deleteRow(discount.id, "inscriptions_discounts");
            }
          }
        }
        if (authorizations.length > 0) {
          for await (const authorization of authorizations) {
            if (!authorization.id || authorization.id === undefined) {
              authorization.inscription_id = inscription.id;
              await insertRow(authorization, "inscriptions_authorizations");
            }
          }
        }
        if (authorizationsToUpdate.length > 0) {
          for await (const authorization of authorizationsToUpdate) {
            if (authorization.id) {
              await updateRow(authorization, "inscriptions_authorizations");
            }
          }
        }
        if (authorizationsToDelete.length > 0) {
          for await (const authorization of authorizationsToDelete) {
            if (authorization.id) {
              await deleteRow(authorization.id, "inscriptions_authorizations");
            }
          }
        }
        if (paymentMethods.length > 0) {
          for await (const paymentMethod of paymentMethods) {
            if (
              !paymentMethod.inscription_id ||
              paymentMethod.inscription_id === undefined
            ) {
              paymentMethod.inscription_id = inscription.id;
              await insertRow(paymentMethod, "inscriptions_payments_methods");
            }
          }
        }
        if (paymentMethodsToUpdate.length > 0) {
          for await (const paymentMethod of paymentMethodsToUpdate) {
            if (
              paymentMethod.inscription_id &&
              paymentMethod.payment_method_id
            ) {
              await supabase
                .from("inscriptions_payments_methods")
                .update({
                  ...paymentMethod,
                  updated_at: new Date().toISOString(),
                  updated_by: userLogged.id,
                })
                .eq("inscription_id", paymentMethod.inscription_id)
                .eq("payment_method_id", paymentMethod.payment_method_id)
                .select();
            }
          }
        }
        if (paymentMethodsToDelete.length > 0) {
          for await (const paymentMethod of paymentMethodsToDelete) {
            if (paymentMethod.inscription_id) {
              await supabase
                .from("inscriptions_payments_methods")
                .delete()
                .eq("inscription_id", paymentMethod.inscription_id)
                .eq("payment_method_id", paymentMethod.payment_method_id);
            }
          }
        }
        if (documents.length > 0) {
          for await (const document of documents) {
            if (!document.id || document.id === undefined) {
              document.inscription_id = inscription.id;
              await insertRow(document, "inscriptions_attacheds");
            }
          }
        }
        if (documentsToUpdate.length > 0) {
          for await (const document of documentsToUpdate) {
            if (document.id) {
              await updateRow(document, "inscriptions_attacheds");
            }
          }
        }
        if (documentsToDelete.length > 0) {
          for await (const document of documentsToDelete) {
            if (document.id) {
              await deleteRow(document.id, "inscriptions_attacheds");
            }
          }
        }
        openAlert("Inscripción actualizada con éxito", "update");
        setInscription(inscriptionUpdated);
      }
    }
    setSaving(false);
    selectForms();
    selectProducts();
    selectDiscounts();
    selectPaymentMethods();
    selectAuthorizations();
    selectDocuments();
    close && onBack();
  };

  return (
    <>
      <HeaderItemPageComponent
        title={pageTitle}
        breadcrumb={breadcrumb}
        saving={saving}
        showBackButton={true}
        showButtonSave={true}
        showButtonSaveAndClose={true}
        saveButtonDisabled={!isValid || !validFormTab || !validPayments}
        onBack={onBack}
        onSave={onSave}
      />
      <form>
        <div className="p-4 dark:bg-gray-900">
          <div className="xl:col-auto order-last xl:order-first">
            <div className=" gap-y-4">
              <FormProvider {...methods}>
                <Card>
                  <>
                    <Tabs.Group>
                      <Tabs.Item title="Detalles">
                        <IncriptionDetailsCard
                          inscription={inscription}
                          onValidForm={(valid) => setEnableFormTab(valid)}
                        />
                      </Tabs.Item>
                      <Tabs.Item title="Formularios" disabled={!enableFormTab}>
                        <InscriptionFormCard
                          mainForm={mainForm}
                          authForm={authForm}
                          onValidTitle={(value) => setValidFormTab(value)}
                        />
                      </Tabs.Item>

                      <Tabs.Item title="Actividades" disabled={!enableFormTab}>
                        <InscriptionActivitiesCard
                          inscription={inscription}
                          products={products}
                        />
                      </Tabs.Item>
                      <Tabs.Item title="Adicionales" disabled={!enableFormTab}>
                        <InscriptionAditionalsCard
                          products={aditionalProducts}
                        />
                      </Tabs.Item>
                      <Tabs.Item title="Descuentos" disabled={!enableFormTab}>
                        <InscriptionDiscountsCard discounts={discounts} />
                      </Tabs.Item>
                      <Tabs.Item
                        title="Autorizaciones"
                        disabled={!enableFormTab}
                      >
                        <InscriptionAuthorizationsCard
                          authorizations={authorizations}
                        />
                      </Tabs.Item>
                      <Tabs.Item
                        title="Métodos de pago"
                        disabled={!enableFormTab}
                      >
                        <InscriptionPaymentMethodsCard
                          paymentMethods={paymentMethods}
                        />
                      </Tabs.Item>
                      <Tabs.Item title="Documentos" disabled={!enableFormTab}>
                        <InscriptionDocumentsCard documents={documents} />
                      </Tabs.Item>
                    </Tabs.Group>
                  </>
                </Card>
              </FormProvider>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
