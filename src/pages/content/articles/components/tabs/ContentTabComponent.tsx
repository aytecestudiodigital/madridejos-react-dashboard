/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorMessage } from "@hookform/error-message";
import {
  Checkbox,
  Label,
  Select,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Editor from "react-simple-wysiwyg";
import {
  getAll,
  getOneRow,
  getRowByColumn,
} from "../../../../../server/supabaseQueries";
import { ContentCategory } from "../../../categories/models/ContentCategory";

interface ContentProps {
  item: any;
  categoryTitleOnChange: Function;
  onCategoryChange: Function;
}

export default function ContentTab(props: ContentProps) {
  const { t } = useTranslation();
  const categoriesTable = import.meta.env.VITE_TABLE_CONTENT_CATEGORIES;
  const tableNameContentCategoryTags = import.meta.env
    .VITE_TABLE_CONTENT_CATEGORIES_TAGS;

  const [category, setCategory] = useState<string>("");
  const [switchNotifiable, setSwitchNotifiable] = useState(false);
  const [totalCategoriesTags, setTotalCategoriesTags] = useState<any[]>([]);
  const [totalCategories, setTotalCategories] = useState<any[]>([]);
  const [htmlTab, setHtmlTab] = useState("");

  const { register, formState, setValue } = useFormContext();

  const { errors } = formState;

  function onChange(e: any) {
    setHtmlTab(e.target.value);
    setValue("content", e.target.value);
  }

  function notifiable(e: any) {
    getOneRow("id", e.target.value, categoriesTable).then(
      (result: ContentCategory) => {
        setSwitchNotifiable(result.notifiable!);
        props.categoryTitleOnChange(result.title);
        props.onCategoryChange(result.id);
      },
    );
  }

  function getTags(e: any) {
    getRowByColumn(
      "content_category_id",
      e.target.value,
      tableNameContentCategoryTags,
    ).then((result) => {
      setTotalCategoriesTags(result);
    });
  }

  useEffect(() => {
    if (props.item) {
      setHtmlTab(props.item.content);
      getOneRow(
        "id",
        props.item.content_category_id,
        import.meta.env.VITE_TABLE_CONTENT_CATEGORIES,
      ).then((categoryResult) => {
        setSwitchNotifiable(categoryResult.notifiable);
        setCategory(props.item.content_category_id);
        props.categoryTitleOnChange(categoryResult.title);
        props.onCategoryChange(categoryResult.id);
      });
    }
  }, [props.item]);

  useEffect(() => {}, [props.item]);

  useEffect(() => {
    const fetchData = async () => {
      setCategory("");
      getTotalCategories();
    };

    fetchData();
  }, [true]);

  const getTotalCategories = () => {
    getAll(categoriesTable).then((result) => {
      const { data } = result;
      setTotalCategories(data ? data : []);
    });
  };

  return (
    <div className="p-4 mb-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 sm:pr-4 sm:border-r sm:border-gray-200">
          <div>
            <Label htmlFor="name" color={errors.title && "failure"}>
              {t("TITLE")} *
            </Label>
            <div className="mt-1">
              <TextInput
                id="title"
                placeholder={t("CONTENT_TITLE")}
                {...register("title", {
                  required: t("FORM_ERROR_MSG_REQUIRED"),
                })}
                color={errors.title && "failure"}
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

          <div className="py-8">
            <Label htmlFor="content">{t("CONTENT_TYPE")}</Label>
            <div className="mt-1">
              <Editor
                containerProps={{ style: { height: "400px" } }}
                value={htmlTab}
                onChange={onChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="external_url">{t("EXTERNAL_URL")}</Label>
            <div className="mt-1">
              <TextInput
                id="external_url"
                placeholder={t("EXTERNAL_URL_DESCRIPTION")}
                {...register("external_url")}
              />
            </div>
          </div>
        </div>
        <div className="sm:col-span-1">
          <ToggleSwitch
            className="mt-8"
            checked={switchNotifiable}
            label="Enviar notificación"
            onChange={setSwitchNotifiable}
          />
          <div className="mt-8">
            <Label
              htmlFor="category"
              color={errors.content_category_id && "failure"}
            >
              {t("CONTENT_CATEGORY_ID")} *
            </Label>
            <div className="mt-1">
              <div className="max-w-md">
                <div>
                  <Label htmlFor="content_category_id" />
                </div>
                <Select
                  id="content_category_id"
                  {...register("content_category_id", {
                    required: t("FORM_ERROR_MSG_REQUIRED"),
                  })}
                  value={category ? category : ""}
                  onChange={(e) => {
                    notifiable(e);
                    setCategory(e.target.value);
                    getTags(e);
                  }}
                >
                  <option disabled value="">
                    {t("SELECT")}
                  </option>
                  {totalCategories &&
                    totalCategories.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                </Select>
              </div>
            </div>
            <ErrorMessage
              errors={errors}
              name="content_category_id"
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

          <div className="mt-8">
            <Label htmlFor="status" color={errors.state && "failure"}>
              {t("CATEGORY_STATE_REQUIRED")}
            </Label>
            <div className="mt-1">
              <div className="max-w-md">
                <Select
                  id="state"
                  {...register("state", {
                    required: t("FORM_ERROR_MSG_REQUIRED"),
                  })}
                >
                  <option value="PUBLISH">{t("PUBLISH")}</option>
                  <option value="UNPUBLISH">{t("UNPUBLISH")}</option>
                </Select>
              </div>
              <ErrorMessage
                errors={errors}
                name="status"
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
          </div>

          <div className="mt-8">
            <Label htmlFor="order" color={errors.order && "failure"}>
              {t("CATEGORY_ORDER_REQUIRED")}
            </Label>
            <input
              type="number"
              aria-describedby="helper-text-explanation"
              className="max-w-md bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={props.item ? props.item.order : 0}
              min="0"
              {...register("order", {
                required: t("FORM_ERROR_MSG_REQUIRED"),
              })}
              required
            />
            <ErrorMessage
              errors={errors}
              name="order"
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

          {totalCategoriesTags.length > 0 ? (
            <div className="mt-8">
              <Label htmlFor="tags">Temas</Label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {totalCategoriesTags.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <Checkbox
                      id={`checkbox-item-${index}`}
                      className="mt-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor={`checkbox-item-${index}`}
                      className="mt-2 w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                    >
                      {item.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
