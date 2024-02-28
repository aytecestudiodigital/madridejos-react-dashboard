/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, CustomFlowbiteTheme } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { InscriptionAddDocuments } from "./InscriptionAddDocumentsComponents";
import { InscriptionFormContext } from "../../context/InscriptionFormContext";

interface docProps {
  setMandatoryTitle: (data: boolean) => void;
  documents: any[];
}
export const InscriptionDocumentsComponents = (props: docProps) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentsToUpdate, setDocumentsToUpdate] = useState<any[]>([]);
  const [documentsToDelete, setDocumentsToDelete] = useState<any[]>([]);
  const contextMethods = useContext(InscriptionFormContext);

  const customTheme: CustomFlowbiteTheme["card"] = {
    root: {
      children: "flex h-full flex-col justify-start gap-4 p-6",
    },
  };

  useEffect(() => {
    documents.length > 0
      ? props.setMandatoryTitle(true)
      : props.setMandatoryTitle(false);
  }, [documents]);

  useEffect(() => {
    if (props.documents.length > 0) {
      props.documents.forEach((document) => {
        if (!document.uuid) {
          document.uuid = crypto.randomUUID();
        }
      });
      setDocuments(props.documents);
    }
  }, [props.documents]);

  const handleAddDocument = () => {
    const newDocument = {
      title: "",
      description: "",
      enabled: true,
      required: true,
      uuid: crypto.randomUUID(),
    };
    setDocuments([...documents, newDocument]);
  };

  const handleDeleteDocument = (index: number) => {
    const newDocuments = [...documents];
    const toDelete = [...documentsToDelete];
    toDelete.push(newDocuments[index]);
    newDocuments.splice(index, 1);
    setDocuments(newDocuments);
    setDocumentsToDelete(toDelete);
    contextMethods.updateDocuments(newDocuments);
    contextMethods.updateDocumentsToDelete(toDelete);
  };

  const handleUpdateDocument = (index: any, data: any) => {
    const newDocuments = [...documents];
    const toUpdate = [...documentsToUpdate];
    newDocuments[index] = { ...newDocuments[index], ...data };
    if (!toUpdate[toUpdate.findIndex((e) => e.id === newDocuments[index].id)]) {
      toUpdate.push(newDocuments[index]);
    } else {
      toUpdate[toUpdate.findIndex((e) => e.id === newDocuments[index].id)] =
        newDocuments[index];
    }
    setDocuments(newDocuments);
    setDocumentsToUpdate(toUpdate);
    contextMethods.updateDocuments(newDocuments);
    contextMethods.updateDocumentsToUpdate(toUpdate);
  };

  return (
    <Card theme={customTheme}>
      <div className="flex items-center justify-between">
        <h1 className="font-bold dark:text-white">Listado de autorizaciones</h1>
      </div>
      <div>
        {documents.map((document, index) => (
          <InscriptionAddDocuments
            item={document}
            key={document.uuid}
            index={index}
            onDelete={handleDeleteDocument}
            onUpdate={(data, index) => handleUpdateDocument(index, data)}
          />
        ))}
        <div className="mt-8 flex justify-center">
          <Button
            className="w-96 text-primary"
            size="xs"
            color="light"
            onClick={handleAddDocument}
          >
            Añadir documento
          </Button>
        </div>
      </div>
    </Card>
  );
};
