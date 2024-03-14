/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorMessage } from "@hookform/error-message";
import { Checkbox, Label, Select, TextInput, Textarea } from "flowbite-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HiTrash } from "react-icons/hi";
import { getAll, getRowByColumn } from "../../../../../server/supabaseQueries";
import { Category } from "../../../../content/categories/models/Category";
import { Content } from "../../../../content/articles/models/Content";
import { truncateContent } from "../../../../../utils/utils";

interface addAuthorizationProps {
  onDelete: (id: number) => void;
  onUpdate: (data: any, index: any) => void;
  index: number;
  item: any;
}
export const InscriptionAddAuthorizations = (props: addAuthorizationProps) => {
  const [authorizationType, setAuthorizationType] = useState<string>(
    props.item ? props.item.type : "TEXT",
  );
  const [selectedContent, setSelectedContent] = useState<string | null>(
    props.item ? props.item.content_id : null,
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    props.item ? props.item.content_category_id : null,
  );
  const [contentCategories, setContentCategories] = useState<Category[] | null>(
    [],
  );
  const [content, setContent] = useState<Content[] | null>([]);
  const [required, setRequired] = useState(props.item.required);
  const [enable, setEnable] = useState(props.item.enabled);

  const [title, setTitle] = useState(props.item ? props.item.title : "");
  const [description, setDescription] = useState(
    props.item ? props.item.description : "",
  );

  const { t } = useTranslation();
  const contentCategoryTableName = import.meta.env
    .VITE_TABLE_CONTENT_CATEGORIES;
  const contentTableName = import.meta.env.VITE_TABLE_CONTENT;

  const { register, formState } = useForm<any>({
    values: props.item ?? undefined,
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "all",
  });

  const { errors } = formState;

  useEffect(() => {
    const fetchData = async () => {
      const categories = await getAll(contentCategoryTableName);
      setContentCategories(categories.data);
    };
    fetchData();
  }, [true]);

  useEffect(() => {
    props.item.type = authorizationType;
    props.item.title = title;
    props.item.description = description;
    props.item.content_category_id =
      selectedCategory !== "" ? selectedCategory : null;
    props.item.content_id = selectedContent !== "" ? selectedContent : null;
    props.item.required = required;
    props.item.enabled = enable;
    props.onUpdate(props.item, props.index);
  }, [
    title,
    authorizationType,
    description,
    selectedCategory,
    selectedContent,
    required,
    enable,
  ]);

  const getContentByCartegory = async (e: ChangeEvent<HTMLSelectElement>) => {
    const categoryValue = e.target.value;
    setSelectedCategory(categoryValue);

    const contents = await getRowByColumn(
      "content_category_id",
      categoryValue,
      contentTableName,
    );
    setContent(contents);
  };

  const getContent = (e: any) => {
    setSelectedContent(e);
  };

  return (
    <div className="max-w overflow-auto p-1">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="pt-4 pr-4 sm:col-span-2">
          <Label htmlFor="title" color={errors.title && "failure"}>
            Título de la autorización *
          </Label>
          <div className="mt-1">
            <TextInput
              id="title"
              placeholder="Título de la autorización"
              {...register("title", {
                required: t("FORM_ERROR_MSG_REQUIRED"),
              })}
              color={errors.title && "failure"}
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
          <Label htmlFor="type">Tipo *</Label>
          <div className="mt-1">
            <Select
              {...register("type")}
              onChange={(e) => setAuthorizationType(e.currentTarget.value)}
              value={authorizationType ? authorizationType : "TEXT"}
            >
              <option hidden disabled value={""}>
                {t("SELECT")}
              </option>
              <option value={"TEXT"}>{"Texto"}</option>
              <option value={"ARTICLE"}>{"Artículo"}</option>
            </Select>
          </div>
        </div>
      </div>

      {authorizationType === "TEXT" ? (
        <div className="pt-4">
          <Label htmlFor="description">Descripción</Label>
          <div className="mt-1">
            <Textarea
              id="description"
              rows={2}
              {...register("description")}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                description ? description : "Descripción de la autorización"
              }
            />
          </div>
        </div>
      ) : authorizationType === "ARTICLE" ? (
        <div className="flex justify-between gap-4 mt-4">
          <div className="flex-grow w-1/2 mr-4">
            <Label htmlFor="content_category_id">
              {t("CATEGORY_LEGAL_TEXT")}
            </Label>
            <Select
              id="content_category_id"
              {...register("content_category_id")}
              onChange={(e) => getContentByCartegory(e)}
              //onBlur={(e) => onChangeLegalCategory(e.currentTarget.value)}
              value={selectedCategory ? selectedCategory : ""}
            >
              <option hidden value={""}>
                {t("SELECT")}
              </option>
              {contentCategories &&
                contentCategories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
            </Select>
          </div>

          <div className="flex-grow w-1/2">
            <Label htmlFor="content_id">{t("ARTICLE")}</Label>
            <Select
              id="content_id"
              {...register("content_id")}
              value={selectedContent ? selectedContent : ""}
              onChange={(e) => getContent(e.currentTarget.value)}
              disabled={!selectedCategory} // Deshabilita el select si no hay una categoría seleccionada
            >
              <option hidden value={""}>
                {t("SELECT")}
              </option>
              {content
                ? content.map((item) => (
                    <option key={item.id} value={item.id}>
                      {truncateContent(item.title, 100)}
                    </option>
                  ))
                : null}
            </Select>
            {!selectedCategory && (
              <p className="text-xs text-gray-500 mt-1">
                {t("SELECT_CATEGORY_FIRST")}
              </p>
            )}
          </div>
        </div>
      ) : null}

      <div className="flex mt-8 border-b-2 border-gray-200 dark:border-gray-700 pb-6">
        <div className="flex flex-grow items-center">
          <Checkbox
            id={`checkbox-required-${props.item.id}`}
            className="w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            checked={required}
            {...register("required")}
            onChange={(e) => setRequired(e.currentTarget.checked)}
          />
          <Label>Obligatorio</Label>
        </div>

        <div className="flex flex-grow items-center">
          <Checkbox
            id={`checkbox-enabled-${props.item.id}`}
            className="w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            checked={enable}
            {...register("enable")}
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
