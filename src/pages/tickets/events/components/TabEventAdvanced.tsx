/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label, Select, TextInput, ToggleSwitch } from "flowbite-react";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  getAll,
  getOneRow,
  getRowByColumn,
} from "../../../../server/supabaseQueries";
import { ErrorMessage } from "@hookform/error-message";
import { truncateContent } from "../../../../utils/utils";

interface TabEventAdvancedProps {
  item: any;
}

export const TabEventAdvanced = (props: TabEventAdvancedProps) => {
  const { register, formState, getValues, setValue } = useFormContext();
  const { errors } = formState;
  const [mandatory, setMandatory] = useState(false);
  const [selectedContentCategory, setSelectedContentCategory] =
    useState<any>("");
  const [contentCategories, setContentCategories] = useState<any[]>([]);
  const [contents, setContents] = useState<any[]>([]);
  const [selectedContent, setSelectedContent] = useState("");
  const [entryControl, setEntryControl] = useState(false);
  const [dateInitValidation, setDateInitValidation] = useState("");
  const [dateEndValidation, setDateEndValidation] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const categoriesDb = await getAll("content_categories");
      if (categoriesDb.data) {
        setContentCategories(categoriesDb.data);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedContentCategory !== "") {
        const contentsDb = await getRowByColumn(
          "content_category_id",
          selectedContentCategory,
          "content",
        );
        if (contentsDb) {
          setContents(contentsDb);
        }
      }
    };
    fetchData();
  }, [selectedContentCategory]);

  useEffect(() => {
    if (props.item) {
      const fetchData = async () => {
        const formValues = getValues();
        if (formValues.legal_required) {
          setMandatory(true);
        } else {
          setMandatory(false);
        }
        if (formValues.legal_content) {
          const contentDb = await getOneRow(
            "id",
            formValues.legal_content,
            "content",
          );
          if (contentDb) {
            setSelectedContent(contentDb.id);
            const categorieDb = await getOneRow(
              "id",
              contentDb.content_category_id,
              "content_categories",
            );
            if (categorieDb) {
              setSelectedContentCategory(categorieDb.id);
            }
          }
        }
        if (formValues.entry_control) {
          setEntryControl(true);
        } else {
          setEntryControl(false);
        }
        if (formValues.validation_date_init) {
          if (
            new Date(formValues.validation_date_init)
              .toLocaleTimeString("es")
              .split(":")[0] === "0"
          ) {
            setDateInitValidation(
              new Date(formValues.validation_date_init)
                .toISOString()
                .split("T")[0] +
                "T" +
                "0" +
                new Date(formValues.validation_date_init).toLocaleTimeString(
                  "es",
                ),
            );
          } else {
            setDateInitValidation(
              new Date(formValues.validation_date_init)
                .toISOString()
                .split("T")[0] +
                "T" +
                new Date(formValues.validation_date_init).toLocaleTimeString(
                  "es",
                ),
            );
          }
        }
        if (formValues.validation_date_end) {
          if (
            new Date(formValues.validation_date_init)
              .toLocaleTimeString("es")
              .split(":")[0] === "0"
          ) {
            setDateEndValidation(
              new Date(formValues.validation_date_end)
                .toISOString()
                .split("T")[0] +
                "T" +
                "0" +
                new Date(formValues.validation_date_end).toLocaleTimeString(
                  "es",
                ),
            );
          } else {
            setDateEndValidation(
              new Date(formValues.validation_date_end)
                .toISOString()
                .split("T")[0] +
                "T" +
                new Date(formValues.validation_date_end).toLocaleTimeString(
                  "es",
                ),
            );
          }
        }
      };
      fetchData();
    }
  }, [props.item]);

  useEffect(() => {
    setValue("entry_control", entryControl);
  }, [entryControl]);

  useEffect(() => {
    setValue("legal_required", mandatory);
  }, [mandatory]);

  const onChangeDates = (value: any, date: any) => {
    if (date === "dateEndValidation") {
      setDateEndValidation(value);
    } else if (date === "dateInitValidation") {
      setDateInitValidation(value);
    }
  };

  const onChangeCategory = (value: any) => {
    setSelectedContentCategory(value);
  };

  useEffect(() => {
    if (dateInitValidation !== "") {
      setValue("validation_date_init", new Date(dateInitValidation));
    }
  }, [dateInitValidation]);

  useEffect(() => {
    if (dateEndValidation !== "") {
      setValue("validation_date_init", new Date(dateEndValidation));
    }
  }, [dateEndValidation]);

  useEffect(() => {
    setValue("legal_content", selectedContent);
  }, [selectedContent]);

  return (
    <div className="p-2">
      <div>
        <Label htmlFor="title">Título del texto legal</Label>
        <div className="flex items-center">
          <div className="grow pr-4">
            <TextInput
              {...register("legal_title")}
              className="mt-1"
              id="title"
              placeholder={"Inserte un título"}
            />
          </div>
          <ToggleSwitch
            checked={mandatory}
            label={"Obligatorio"}
            onChange={(e) => setMandatory(e)}
          />
        </div>
      </div>
      <div className="flex justify-between gap-4 mt-4">
        <div className="flex-grow w-1/2">
          <Label htmlFor="content_category_id">
            {t("CATEGORY_LEGAL_TEXT")}
          </Label>
          <Select
            className="mt-1"
            id="content_category_id"
            onChange={(e) => onChangeCategory(e.currentTarget.value)}
            value={selectedContentCategory}
          >
            <option hidden value={""}>
              {t("SELECT")}
            </option>
            {contentCategories.map((category, index) => (
              <option key={index} value={category.id}>
                {category.title}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex-grow w-1/2">
          <Label htmlFor="content_id">{t("ARTICLE")}</Label>
          <Select
            className="mt-1"
            id="content_id"
            value={selectedContent}
            onChange={(e) => setSelectedContent(e.currentTarget.value)}
            disabled={selectedContentCategory === ""} // Deshabilita el select si no hay una categoría seleccionada
          >
            <option hidden value={""}>
              {t("SELECT")}
            </option>
            {contents.map((content, index) => (
              <option key={index} value={content.id}>
                {truncateContent(content.title, 50)}
              </option>
            ))}
          </Select>
          {selectedContentCategory === "" && (
            <p className="text-xs text-gray-500 mt-1">
              Selecciona primero el texto legal
            </p>
          )}
        </div>
      </div>
      <div className="mt-4">
        <Label color={errors.capacity && "failure"}>Capacidad *</Label>
        <div className="flex items-center">
          <div className="grow pr-4">
            <TextInput
              className="mt-1"
              color={errors.capacity && "failure"}
              defaultValue={0}
              {...register("capacity", {
                required: t("FORM_ERROR_MSG_REQUIRED"),
              })}
              type="number"
              min={0}
            />
            <ErrorMessage
              errors={errors}
              name="capacity"
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
          <ToggleSwitch
            checked={entryControl}
            onChange={(e) => setEntryControl(e)}
            label="Controlar entrada"
          />
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        <div className="w-full">
          <Label>Inicio de validación</Label>
          <div className="mt-1">
            <TextInput
              defaultValue={dateInitValidation}
              onChange={(e) =>
                onChangeDates(e.currentTarget.value, "dateInitValidation")
              }
              type="datetime-local"
            />
          </div>
        </div>
        <div className="w-full">
          <Label>Fin de validación</Label>
          <div className="mt-1">
            <TextInput
              defaultValue={dateEndValidation}
              onChange={(e) =>
                onChangeDates(e.currentTarget.value, "dateEndValidation")
              }
              type="datetime-local"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
