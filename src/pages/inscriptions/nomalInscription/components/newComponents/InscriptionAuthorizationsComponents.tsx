/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, CustomFlowbiteTheme } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { InscriptionAddAuthorizations } from "./InscriptionAddAuthorizationsComponents";
import { InscriptionFormContext } from "../../context/InscriptionFormContext";

interface InscriptionAuthorizationsComponentProps {
  authorizations: any[];
}

export const InscriptionAuthorizationsComponents = (
  props: InscriptionAuthorizationsComponentProps,
) => {
  const [authorizations, setAuthorizations] = useState<any[]>([]);
  const [authorizationsToUpdate, setAuthorizationsToUpdate] = useState<any[]>(
    [],
  );
  const [authorizationsToDelete, setAuthorizationsToDelete] = useState<any[]>(
    [],
  );
  const contextMethods = useContext(InscriptionFormContext);

  const customTheme: CustomFlowbiteTheme["card"] = {
    root: {
      children: "flex h-full flex-col justify-start gap-4 p-6",
    },
  };

  useEffect(() => {
    if (props.authorizations.length > 0) {
      props.authorizations.forEach((authorization) => {
        if (!authorization.uuid) {
          authorization.uuid = crypto.randomUUID();
        }
      });
      setAuthorizations(props.authorizations);
    }
  }, [props.authorizations]);

  const handleAddAuthorization = () => {
    const newAuthorization = {
      title: "",
      description: "",
      type: "",
      content_id: "",
      content_category_id: "",
      enabled: true,
      required: true,
      uuid: crypto.randomUUID(),
    };
    setAuthorizations([...authorizations, newAuthorization]);
  };

  const handleDeleteAuthorization = (index: number) => {
    const newAuthorizations = [...authorizations];
    const toDelete = [...authorizationsToDelete];
    toDelete.push(newAuthorizations[index]);
    newAuthorizations.splice(index, 1);
    setAuthorizations(newAuthorizations);
    setAuthorizationsToDelete(toDelete);
    contextMethods.updateAuthorizations(newAuthorizations);
    contextMethods.updateAuthorizationsToDelete(toDelete);
  };

  const handleUpdateAuthorization = (index: any, data: any) => {
    const newAuthorizations = [...authorizations];
    const toUpdate = [...authorizationsToUpdate];
    newAuthorizations[index] = data;
    if (
      !toUpdate[toUpdate.findIndex((e) => e.id === newAuthorizations[index].id)]
    ) {
      toUpdate.push(newAuthorizations[index]);
    } else {
      toUpdate[
        toUpdate.findIndex((e) => e.id === newAuthorizations[index].id)
      ] = newAuthorizations[index];
    }
    setAuthorizations(newAuthorizations);
    setAuthorizationsToUpdate(toUpdate);
    contextMethods.updateAuthorizations(newAuthorizations);
    contextMethods.updateAuthorizationsToUpdate(toUpdate);
  };

  return (
    <Card theme={customTheme}>
      <div className="flex items-center justify-between">
        <h1 className="font-bold dark:text-white">Listado de autorizaciones</h1>
      </div>
      <div>
        {authorizations &&
          authorizations.map((authorization, index) => {
            return (
              <InscriptionAddAuthorizations
                index={index}
                key={authorization.uuid}
                item={authorization}
                onDelete={(index) => handleDeleteAuthorization(index)}
                onUpdate={(data: any, index) =>
                  handleUpdateAuthorization(index, data)
                }
              />
            );
          })}
        <div className="mt-8 flex justify-center">
          <Button
            className="w-96 text-primary"
            size="xs"
            color="light"
            onClick={handleAddAuthorization}
          >
            Añadir autorización
          </Button>
        </div>
      </div>
    </Card>
  );
};
