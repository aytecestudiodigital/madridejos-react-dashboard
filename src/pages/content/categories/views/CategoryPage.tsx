/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorMessage } from "@hookform/error-message";
import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Label,
  Select,
  TextInput,
} from "flowbite-react";
import { t } from "i18next";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { HiHome, HiOutlineArrowLeft } from "react-icons/hi";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AlertContext } from "../../../../context/AlertContext";
import {
  deleteRow,
  getAll,
  getOneRow,
  insertRow,
  updateRow,
} from "../../../../server/supabaseQueries";
import { DeleteCategoryModal } from "../components/DeleteCategoryModal";
import { Category } from "../models/Category";
import { RootState } from "../../../../store/store";
import { useSelector } from "react-redux";

export default function CategoryPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const table_content_categories = import.meta.env
    .VITE_TABLE_CONTENT_CATEGORIES;
  const table_content_categories_tags = import.meta.env
    .VITE_TABLE_CONTENT_CATEGORIES_TAGS;
  const [pageTitle, setPageTitle] = useState("");
  const [category, setCategory] = useState<Category>({});
  const [initialTags, setInitialTags] = useState<any>([]);
  const [tagsObject, setTagsObject] = useState<any>([]);
  const { openAlert } = useContext(AlertContext);

  const { register, handleSubmit, formState } = useForm<Category>({
    values: category ?? undefined,
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "all",
  });
  const { errors, isValid } = formState;

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user) {
      if (!user.users_roles.rules.content.categories.access_module) {
        openAlert("No tienes acceso a esta página", "error");
        navigate("/");
      }
    }
  }, [user]);

  useEffect(() => {
    if (id === "new") {
      setPageTitle(t("ADD_CATEGORY"));
      if (location.state && location.state.order) {
        const newCategory = { ...category };
        newCategory.order = location.state.order;
        setCategory(newCategory);
      }
    } else
      getOneRow("id", id!, table_content_categories).then((category) => {
        setCategory(category);
        setPageTitle(t("EDIT_CATEGORY"));
        const tagsCollection: any[] = [];
        const tagObjects: any = [];
        getAll(table_content_categories_tags).then((tags) => {
          tags.data?.forEach((tag) => {
            if (tag.content_category_id === id) {
              tagObjects.push(tag);
              tagsCollection.push(tag.title);
            }
          });
          setInitialTags(tagsCollection);
          setTagsObject(tagObjects);
          if (tagsCollection.length > 0) {
            const newTags = tagsCollection.join(",");
            const newCategory = { ...category };
            newCategory.tags = newTags;
            setCategory(newCategory);
          }
        });
      });
  }, [id]);

  const onSubmit: SubmitHandler<Category> = async (data) => {
    if (isValid) {
      let state = {};
      let tags: any = [];
      const newCategory = {
        title: data.title,
        state: data.state,
        content_type: data.content_type,
        order: data.order,
        notifiable: data.notifiable,
      };
      if (data.tags !== "") {
        tags = data.tags?.split(",");
      }
      delete data.tags;
      const categoryUpdated = data.id
        ? await updateRow(data, table_content_categories)
        : await insertRow(newCategory, table_content_categories);
      if (data.id) {
        state = {
          update: t("UPDATE_CATEGORY_SUCCESS"),
        };
        if (tags.length > initialTags.length) {
          const newTags = tags.slice(initialTags.length, tags.length);
          newTags.forEach(async (tag: any) => {
            const newTag = {
              title: tag,
              content_category_id: categoryUpdated.id,
            };
            await insertRow(newTag, table_content_categories_tags);
          });
        } else if (tags.length === initialTags.length) {
          tags.forEach((tag: any, index: any) => {
            tagsObject[index].title = tag;
          });
          tagsObject.forEach(async (tag: any) => {
            await updateRow(tag, table_content_categories_tags);
          });
        } else if (tags.length < initialTags.length) {
          const deletedTags: any = [];
          initialTags.forEach((iTag: any) => {
            let match = false;
            if (tags.length > 0) {
              tags.forEach((tag: any) => {
                if (tag === iTag) {
                  match = true;
                }
              });
            }
            if (!match) {
              deletedTags.push(iTag);
            }
          });
          for await (const deleteTag of deletedTags) {
            const tagToDelete: any =
              tagsObject[
                tagsObject.findIndex((tag: any) => tag.title === deleteTag)
              ];
            tagsObject.splice(
              tagsObject[
                tagsObject.findIndex((tag: any) => tag.title === deleteTag)
              ],
              1,
            );
            await deleteRow(tagToDelete.id, table_content_categories_tags);
          }
          if (tagsObject.length > 0) {
            for await (const tag of tagsObject) {
              await updateRow(tag, table_content_categories_tags);
            }
          }
        }
      } else {
        state = {
          insert: t("INSERT_CATEGORY_SUCCESS"),
        };
        if (tags?.length > 0) {
          tags?.forEach(async (tag: any) => {
            const newTag = {
              title: tag,
              content_category_id: categoryUpdated.id,
            };
            await insertRow(newTag, table_content_categories_tags);
          });
        }
      }
      data.id
        ? openAlert(t("UPDATE_CATEGORY_SUCCESS"), "update")
        : openAlert(t("INSERT_CATEGORY_SUCCESS"), "insert");
      navigate("/content/categories", {
        state: state,
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="mb-1 w-full">
            <div>
              <Breadcrumb className="mb-4 mt-2">
                <Breadcrumb.Item href="/">
                  <div className="flex items-center gap-x-3">
                    <HiHome className="text-xl" />
                    <span className="dark:text-white">{t("HOME")}</span>
                  </div>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="/content">
                  {t("CONTENT_TYPE")}
                </Breadcrumb.Item>
                <Breadcrumb.Item href="/content/categories">
                  {t("CATEGORIES_TITLE")}
                </Breadcrumb.Item>
                <Breadcrumb.Item>{pageTitle}</Breadcrumb.Item>
              </Breadcrumb>

              <div className="flex items-center">
                <Button
                  size="xs"
                  color="light"
                  className="mr-4"
                  as={Link}
                  to="/content/categories"
                >
                  <HiOutlineArrowLeft className="mr-2" />
                  {t("BACK")}
                </Button>

                <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                  {pageTitle}
                </h1>

                <div className="flex flex-grow justify-end gap-x-4">
                  <Button color="primary" disabled={!isValid} type="submit">
                    <div className="flex items-center gap-x-3">{t("SAVE")}</div>
                  </Button>
                  {category.id && (
                    <DeleteCategoryModal
                      category={category}
                      onCategoryDelete={() =>
                        navigate("/content/categories", {
                          state: { delete: t("DELETE_CATEGORY_SUCCESS") },
                        })
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <Card>
            <div className="px-4 divide-y">
              <div className="mb-4">
                <h1 className="text-xl">{t("CATEGORY_DATA")}</h1>
                <p className="text-gray-500 text-sm">
                  {t("CATEGORY_DETAILS_DESCRIPTION")}
                </p>
              </div>

              <div className="grid grid-cols-12 p-4">
                <div className="col-span-4">
                  <Label htmlFor="title" value={t("CATEGORY_NAME_REQUIRED")} />
                </div>
                <div className="col-span-8">
                  <TextInput
                    className="w-96"
                    id="title"
                    type="text"
                    {...register("title", {
                      required: t("FORM_ERROR_MSG_REQUIRED"),
                    })}
                    required
                  />
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
              </div>
              <div className="grid grid-cols-12 p-4">
                <div className="col-span-4">
                  <Label htmlFor="state" value={t("CATEGORY_STATE_REQUIRED")} />
                </div>
                <div className="col-span-8">
                  <Select
                    {...register("state", {
                      validate: (value: any) =>
                        value !== "" ||
                        t("EDIT_CATEGORY_FORM_ERROR_MSG_SELECT"),
                    })}
                    className="w-96"
                    id="state"
                    required
                  >
                    <option value="" disabled>
                      {t("SELECT")}
                    </option>
                    <option value={"PUBLISH"}>{t("PUBLISH")}</option>
                    <option value={"UNPUBLISH"}>{t("UNPUBLISH")}</option>
                    <option value={"ARCHIVED"}>{t("ARCHIVED")}</option>
                  </Select>
                  <ErrorMessage
                    errors={errors}
                    name="state"
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
              <div className="grid grid-cols-12 p-4">
                <div className="col-span-4">
                  <Label
                    htmlFor="content_type"
                    value={t("CATEGORY_CONTENT_TYPE_REQUIRED")}
                  />
                </div>
                <div className="col-span-8">
                  <Select
                    {...register("content_type", {
                      validate: (value: any) =>
                        value !== "" || t("FORM_ERROR_MSG_REQUIRED"),
                    })}
                    className="w-96"
                    id="content_type"
                    required
                  >
                    <option value="" disabled>
                      {t("SELECT")}
                    </option>
                    <option value={"ARTICLES"}>{t("ARTICLES")}</option>
                    <option value={"EVENTS"}>{t("EVENTS")}</option>
                    <option value={"PLACES"}>{t("PLACES")}</option>
                  </Select>
                  <ErrorMessage
                    errors={errors}
                    name="state"
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
              <div className="grid grid-cols-12 p-4">
                <div className="col-span-4">
                  <Label htmlFor="tags" value={t("CATEGORY_TAGS_REQUIRED")} />
                </div>
                <div className="col-span-8">
                  <TextInput
                    className="w-96"
                    {...register("tags")}
                    id="tags"
                    type="text"
                    placeholder=""
                  />
                  <p className="text-sm text-gray-500">
                    {t("CATEGORY_TAGS_DESCRIPTION")}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-12 p-4">
                <div className="col-span-4">
                  <Label htmlFor="order" value={t("CATEGORY_ORDER_REQUIRED")} />
                </div>
                <div className="col-span-8">
                  <TextInput
                    className="w-96"
                    {...register("order")}
                    id="order"
                    type="number"
                    min={"0"}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    {t("CATEGORY_ORDER_DESCRIPTION")}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-12 p-4">
                <div className="col-span-4">
                  <Label
                    htmlFor="notifiable"
                    value={t("CATEGORY_NOTIFIABLE_REQUIRED")}
                  />
                  <p className="mt-12 text-sm text-gray-500 font-bold">
                    {t("MANDATORY_FIELDS")}
                  </p>
                </div>
                <div className="col-span-8">
                  <div className="flex gap-2">
                    <Checkbox {...register("notifiable")} id="notifiable" />
                    <Label
                      htmlFor="notifiable"
                      className="flex"
                      value="Habilitar notificaciones"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    {t("CATEGORY_NOTIFIABLE_DESCRIPTION")}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </>
  );
}
