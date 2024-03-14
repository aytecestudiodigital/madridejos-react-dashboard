/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorMessage } from "@hookform/error-message";
import {
  Button,
  Card,
  Label,
  Select,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuUserCog2, LuUserPlus2 } from "react-icons/lu";
import {
  getAll,
  getOneRow,
  getRowByColumn,
} from "../../../../server/supabaseQueries";
import { Content } from "../../../content/articles/models/Content";
import { Category } from "../../../content/categories/models/Category";
import { Users } from "../../../users/models/Users";
import { ItemModel } from "../models/ItemModel";
import { ItemResponsiblesModal } from "./ItemResposiblesModal";
import { truncateContent } from "../../../../utils/utils";

interface ItemTabProps {
  deleteButtonLabel: string;
  deleteOKLabel: string;
  deleteKOLabel: string;
  labelResponsibleCard: string;
  item: ItemModel | null;
  onChangeData: (data: any) => void;
}

export const TabItemAdvanced = (props: ItemTabProps) => {
  const { t } = useTranslation();

  const [itemData, setItemData] = useState<ItemModel | null>();
  const [mandatory, setMandatory] = useState(false);
  const [legalTextTitle, setLegalTextTitle] = useState("");
  const [legalTextId, setLegalTextId] = useState<any>("");

  const [sessionType, setSessionType] = useState<string | null>(null);
  const [hourEventInit, setHourEventInit] = useState<any>(null);
  const [hourEventEnd, setHourEventEnd] = useState<any>(null);
  const [technicians, setTechnicians] = useState<Users[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  const [contentCategories, setContentCategories] = useState<Category[] | null>(
    [],
  );
  const [content, setContent] = useState<Content[] | null>([]);

  const [openModal, setOpenModal] = useState(false);

  const contentCategoryTableName = import.meta.env
    .VITE_TABLE_CONTENT_CATEGORIES;
  const contentTableName = import.meta.env.VITE_TABLE_CONTENT;
  const responsiblesTableName = import.meta.env
    .VITE_TABLE_BOOKINGS_ITEMS_RESPONSIBLES;
  const usersTableName = import.meta.env.VITE_TABLE_USERS;
  const legalTextTableName = import.meta.env
    .VITE_TABLE_BOOKINGS_ITEMS_LEGAL_TEXT;

  const { register, formState, getValues, setValue } = useFormContext();

  useEffect(() => {
    if (props.item) {
      setItemData(props.item);
      getRowByColumn("item_id", props.item.id!, responsiblesTableName).then(
        async (responsibles: any[]) => {
          const usersResponsibles: Users[] = [];
          if (responsibles.length > 0) {
            await Promise.all(
              responsibles.map(async (responsible) => {
                const user = await getOneRow(
                  "id",
                  responsible.user_id,
                  usersTableName,
                );
                usersResponsibles.push(user);
              }),
            );
            setTechnicians(usersResponsibles);
          }
        },
      );

      if (props.item.legal_text_id) {
        getOneRow("id", props.item.legal_text_id, legalTextTableName).then(
          async (text: any) => {
            setMandatory(text.mandatory);
            setLegalTextTitle(text.title);
            setSelectedCategory(text.content_category_id);
            setSelectedContent(text.content_id);
            setLegalTextId(text.id);
          },
        );
      }
    } else {
      setValue("time_check_in", "hours");
      setValue("time_check_out", "hours");
    }
  }, [props.item]);

  const { errors } = formState;

  const handleSessionTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSessionType(event.target.value);
    setValue("session_type", event.target.value);
  };

  const onChangeInput = () => {
    const data = getValues();
    const object = {
      avalaible_seats: data.avalaible_seats,
      calendar_weeks: data.calendar_weeks,
      max_selected_time: data.max_selected_time,
      max_sessions: data.max_sessions,
      next_booking: data.next_booking,
      time_limit: data.time_limit,
      time_cancel: data.time_cancel,
      valuable_limit: data.valuable_limit,
      session_type: sessionType,
      time_check_in:
        data.time_check_in !== undefined ? data.time_check_in : null,
      time_check_out:
        data.time_check_out !== undefined ? data.time_check_out : null,
      technicians: technicians.length > 0 ? technicians : [],
      legal: {
        title: legalTextTitle,
        content_category_id: selectedCategory,
        content_id: selectedContent,
        mandatory: mandatory,
        id: legalTextId,
      },
    };
    props.onChangeData(object);
  };

  const onChangeLegalTitle = (e: any) => {
    setLegalTextTitle(e);
    onChangeInput();
  };

  const onChangeLegalCategory = (e: any) => {
    setSelectedCategory(e);
    onChangeInput();
  };

  const onChangeLegalContent = (e: any) => {
    setSelectedContent(e);
    onChangeInput();
  };

  useEffect(() => {
    onChangeInput();
  }, [technicians]);

  const closeModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const categories = await getAll(contentCategoryTableName);
      setContentCategories(categories.data);
    };

    fetchData();
  }, [true]);

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

  useEffect(() => {
    if (selectedCategory) {
      getRowByColumn(
        "content_category_id",
        selectedCategory,
        contentTableName,
      ).then((contents: Content[]) => {
        setContent(contents);
      });
    }
  }, [selectedCategory]);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold dark:text-white pt-2">Avanzado</h3>
      <div>
        <Label htmlFor="title">{t("LEGAL_TEXT")}</Label>
        <div className="flex items-center">
          <div className="grow pr-4">
            <TextInput
              className="mt-1"
              id="title"
              defaultValue={legalTextTitle}
              placeholder={t("LEGAL_TEXT_DESCRIPTION")}
              onBlur={(e) => onChangeLegalTitle(e.currentTarget.value)}
            />
          </div>
          <ToggleSwitch
            checked={mandatory}
            label={t("MANDATORY")}
            onChange={setMandatory}
            onBlur={() => onChangeInput()}
          />
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <div className="flex-grow w-1/2">
          <Label htmlFor="content_category_id">
            {t("CATEGORY_LEGAL_TEXT")}
          </Label>
          <Select
            className="mt-1"
            id="content_category_id"
            onChange={(e) => getContentByCartegory(e)}
            onBlur={(e) => onChangeLegalCategory(e.currentTarget.value)}
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
            className="mt-1"
            id="content_id"
            value={selectedContent ? selectedContent : ""}
            onChange={(e) => getContent(e.currentTarget.value)}
            disabled={!selectedCategory} // Deshabilita el select si no hay una categoría seleccionada
            onBlur={(e) => onChangeLegalContent(e.currentTarget.value)}
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

      <div className="flex justify-between gap-4">
        <div className="flex-grow w-1/3">
          <Label
            htmlFor="calendar_weeks"
            color={errors.calendar_weeks && "failure"}
          >
            {t("WEEKS")} *
          </Label>
          <input
            id="calendar_weeks"
            type="number"
            aria-describedby="helper-text-explanation"
            className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={"0"}
            min="0"
            {...register("calendar_weeks", {
              required: t("FORM_ERROR_MSG_REQUIRED"),
            })}
            required
            onBlur={() => onChangeInput()}
          />
          <p className="text-xs text-gray-500 mt-1">{t("WEEKS_DESCRIPTION")}</p>
          <ErrorMessage
            errors={errors}
            name="calendar_weeks"
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

        <div className="flex-grow w-1/3">
          <Label htmlFor="max_selected_time">{t("MAX_TIME")}</Label>
          <div className="flex items-center">
            <div className="grow">
              <TextInput
                className="mt-1"
                placeholder={t("MAX_TIME_PLACEHOLDER")}
                {...register("max_selected_time")}
                onBlur={() => onChangeInput()}
              />
              <p className="text-xs text-gray-500 mt-1">
                {t("MAX_TIME_DESCRIPTION")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-grow w-1/3">
          <Label
            htmlFor="avalaible_seats"
            color={errors.avalaible_seats && "failure"}
          >
            {t("SITES")} *
          </Label>
          <input
            id="avalaible_seats"
            type="number"
            aria-describedby="helper-text-explanation"
            className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={"0"}
            min="0"
            {...register("avalaible_seats", {
              required: t("FORM_ERROR_MSG_REQUIRED"),
            })}
            required
            onBlur={() => onChangeInput()}
          />
          <p className="text-xs text-gray-500 mt-1">{t("SITES_DESCRIPTION")}</p>

          <ErrorMessage
            errors={errors}
            name="avalaible_seats"
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

      <div className="flex justify-between gap-4">
        <div className="flex-grow w-1/2">
          <Label htmlFor="max_sessions">{t("MAX_SESSIONS")}</Label>
          <div className="flex items-center">
            <div className="grow">
              <TextInput
                className="mt-1"
                placeholder={t("MAX_SESSIONS")}
                {...register("max_sessions")}
                onBlur={() => onChangeInput()}
              />
              <p className="text-xs text-gray-500 mt-1">
                {t("MAX_SESSIONS_DESCRIPTION")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-grow w-1/2">
          <Label htmlFor="next_booking">{t("NEXT_BOOKING")}</Label>
          <div className="flex items-center">
            <div className="grow">
              <TextInput
                className="mt-1"
                placeholder={t("NEXT_BOOKING_PLACEHOLDER")}
                {...register("next_booking")}
                onBlur={() => onChangeInput()}
              />
              <p className="text-xs text-gray-500 mt-1">
                {t("NEXT_BOOKING_DESCRIPTION")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <div className="flex-grow w-1/2">
          <Label htmlFor="time_limit">{t("TIME_LIMIT")}</Label>
          <div className="flex items-center">
            <div className="grow">
              <TextInput
                className="mt-1"
                {...register("time_limit")}
                placeholder={t("TIME_LIMIT_PLACEHOLDER")}
                onBlur={() => onChangeInput()}
              />
              <p className="text-xs text-gray-500 mt-1">
                {t("TIME_LIMIT_DESCRIPTION")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-grow w-1/2">
          <Label htmlFor="time_cancel">{t("TIME_CANCEL")}</Label>
          <div className="flex items-center">
            <div className="grow">
              <TextInput
                className="mt-1"
                {...register("time_cancel")}
                placeholder={t("TIME_CANCEL_PLACEHOLDER")}
                onBlur={() => onChangeInput()}
              />
              <p className="text-xs text-gray-500 mt-1">
                {t("TIME_CANCEL_DESCRIPTION")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <div className="flex-grow w-1/2">
          <Label htmlFor="valuable_limit">{t("VALUABLE_LIMIT")}</Label>
          <Select
            className="mt-1"
            id="valuable_limit"
            {...register("valuable_limit")}
            onBlur={() => onChangeInput()}
          >
            <option hidden value={""}>
              {t("SELECT")}
            </option>
            <option value={"init"}>{t("INIT")}</option>
            <option value={"end"}>{t("END")}</option>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            {t("VALUABLE_LIMIT_DESCRIPTION")}
          </p>
        </div>

        <div className="flex-grow w-1/2">
          <Label htmlFor="session_type">{t("SESSION_TYPE")}</Label>
          <Select
            className="mt-1"
            id="session_type"
            {...register("session_type")}
            onChange={handleSessionTypeChange}
            onBlur={() => onChangeInput()}
          >
            <option hidden value={""}>
              {t("SELECT")}
            </option>
            <option value={"HOURS"}>{t("HOURS")}</option>
            <option value={"DAYS"}>{t("DAYS")}</option>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            {t("SESSION_TYPE_DESCRIPTION")}
          </p>
        </div>
      </div>

      {(sessionType || (itemData && itemData.session_type)) === "DAYS" ? (
        <>
          <div className="flex justify-between gap-4">
            <div className="flex-grow w-1/2">
              <Label
                htmlFor="time_check_in"
                color={errors.time_check_in && "failure"}
              >
                {t("TIME_CHECK_IN")} *
              </Label>
              <TextInput
                id="time_check_in"
                defaultValue={hourEventInit}
                {...register("time_check_in", {
                  required: t("FORM_ERROR_MSG_REQUIRED"),
                })}
                color={errors.time_check_in && "failure"}
                onChange={(e) => setHourEventInit(e.currentTarget.value)}
                onBlur={() => onChangeInput()}
                type="time"
              />
              <ErrorMessage
                errors={errors}
                name="time_check_in"
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
              <p className="text-xs text-gray-500 mt-1">
                {t("TIME_CHECK_IN_DESCRIPTION")}
              </p>
            </div>

            <div className="flex-grow w-1/2">
              <Label htmlFor="time_check_out">{t("TIME_CHECK_OUT")}</Label>
              <TextInput
                id="time_check_out"
                defaultValue={hourEventEnd}
                onChange={(e) => setHourEventEnd(e.currentTarget.value)}
                type="time"
                onBlur={() => onChangeInput()}
              />
              <p className="text-xs text-gray-500 mt-1">
                {t("TIME_CHECK_OUT_DESCRIPTION")}
              </p>
            </div>
          </div>
        </>
      ) : null}

      <div>
        <Card>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="responsibles">{props.labelResponsibleCard}</Label>
            <Button size="sm" color="light" onClick={() => setOpenModal(true)}>
              {technicians.length === 0 ? (
                <div className="flex items-center text-blue-900">
                  <LuUserPlus2 className="mr-1 text-lg text-blue-900" />
                  {t("ADD_BTN")}
                </div>
              ) : (
                <div className="flex items-center text-blue-900">
                  <LuUserCog2 className=" mr-1 text-lg text-blue-900" />
                  {t("EDIT_BTN")}
                </div>
              )}
            </Button>
          </div>

          <ItemResponsiblesModal
            showModal={openModal}
            closeModal={closeModal}
            setTechnicians={setTechnicians}
            selectedTechnicians={technicians}
            type="roles"
          />

          <div className="flex flex-col">
            {technicians.length > 0 ? (
              <div>
                <ul>
                  {technicians.map((technician) => (
                    <li className="text-sm" key={technician.id}>
                      <div className="flex justify-between">
                        <div className="flex-grow w-1 mb-1">
                          <p className="font-semibold">{`${technician.name}`}</p>
                        </div>
                        <div className="flex-grow w-1/2">
                          <p>{technician.email}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                {t("RESPONSIBLES_NOT_FOUND")}
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
