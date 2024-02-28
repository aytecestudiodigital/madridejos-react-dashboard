/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorMessage } from "@hookform/error-message";
import { Checkbox, Label, TextInput, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiTrash } from "react-icons/hi";

interface addDocumentsProps {
  onDelete: (id: number) => void;
  onUpdate: (data: any, index: any) => void;
  index: number;
  item: any;
}
export const InscriptionAddDocuments = (props: addDocumentsProps) => {
  const [title, setTitle] = useState(props.item ? props.item.title : "");
  const [description, setDescription] = useState(
    props.item ? props.item.description : "",
  );
  const [required, setRequired] = useState(
    props.item ? props.item.required : false,
  );
  const [enable, setEnable] = useState(props.item ? props.item.enabled : false);

  useEffect(() => {
    props.item.title = title;
    props.item.description = description;
    props.item.required = required;
    props.item.enabled = enable;
    props.onUpdate(props.item, props.index);
  }, [title, description, required, enable]);

  const { formState } = useForm<any>({
    values: props.item ?? undefined,
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "all",
  });

  const { errors } = formState;

  return (
    <div className="max-w overflow-auto p-1">
      <div className="pt-4">
        <Label htmlFor="title" color={errors.title && "failure"}>
          Título del documento *
        </Label>
        <div className="mt-1">
          <TextInput
            id="title"
            placeholder="Título del documento"
            defaultValue={props.item ? props.item.title : title}
            onBlur={(e) => setTitle(e.currentTarget.value)}
          />
        </div>

        <ErrorMessage
          errors={errors}
          name="title"
          render={({ messages }) =>
            messages &&
            Object.entries(messages).map(([type, message]) => (
              <p
                className="mt-2 text-sm text-red-600 dark:text-red-500"
                key={type}
              >
                {message}
              </p>
            ))
          }
        />
      </div>

      <div className="pt-4">
        <Label htmlFor="description">Descripción</Label>
        <div className="mt-1">
          <Textarea
            id="description"
            rows={2}
            placeholder={"Descripción del documento"}
            defaultValue={props.item ? props.item.description : description}
            onBlur={(e) => setDescription(e.currentTarget.value)}
            /* {...register("description", {})} */
          />
        </div>
      </div>

      <div className="flex mt-8 border-b-2 border-gray-200 dark:border-gray-700 pb-6">
        <div className="flex flex-grow items-center">
          <Checkbox
            id={`checkbox-required-${props.item.id}`}
            className="w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            checked={required}
            onChange={(e) => setRequired(e.currentTarget.checked)}
          />
          <Label>Obligatorio</Label>
        </div>

        <div className="flex flex-grow items-center">
          <Checkbox
            id={`checkbox-enabled-${props.item.id}`}
            className="w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            checked={props.item ? props.item.enabled : enable}
            onChange={(e) => setEnable(e.currentTarget.checked)}
          />
          <Label>Habilitado</Label>
        </div>

        <div className="flex justify-end">
          <HiTrash
            className="text-xl  text-red-500"
            onClick={() => props.onDelete(props.index)}
          />
        </div>
      </div>
    </div>
  );
};
