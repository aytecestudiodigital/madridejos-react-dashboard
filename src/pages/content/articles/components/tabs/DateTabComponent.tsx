/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getOneRow } from "../../../../../server/supabaseQueries";
import { useFormContext } from "react-hook-form";

interface DateTabProps {
  categoryId: any;
  defaultDateInit: Date;
  defaultDateEnd: Date;
  defaultDateEventInit: Date;
  defaultDateEventEnd: Date;
}

export default function DateTab({
  categoryId,
  defaultDateInit,
  defaultDateEnd,
  defaultDateEventInit,
  defaultDateEventEnd,
}: DateTabProps) {
  const [enabledCheck, setEnabledCheck] = useState(false);
  const [category, setCategory] = useState("");
  const [dateInit, setDateInit] = useState<any>(null);
  const [dateEnd, setDateEnd] = useState<any>(null);
  const [dateEventInit, setDateEventInit] = useState<any>(null);
  const [dateEventEnd, setDateEventEnd] = useState<any>(null);
  const [hourEventInit, setHourEventInit] = useState<any>(null);
  const [hourEventEnd, setHourEventEnd] = useState<any>(null);

  const { setValue } = useFormContext();

  const { t } = useTranslation();

  useEffect(() => {
    if (defaultDateInit !== null) {
      setDateInit(
        defaultDateInit.toISOString().split("T")[0] +
          "T" +
          defaultDateInit.toLocaleTimeString(),
      );
    }
    if (defaultDateEnd !== null) {
      setDateEnd(
        defaultDateEnd.toISOString().split("T")[0] +
          "T" +
          defaultDateEnd.toLocaleTimeString(),
      );
    }
    if (defaultDateEventInit !== null) {
      if (defaultDateEventInit.getHours() === 1) {
        setEnabledCheck(true);
        setDateEventInit(defaultDateEventInit.toISOString().split("T")[0]);
      } else {
        setDateEventInit(defaultDateEventInit.toISOString().split("T")[0]);
        setHourEventInit(defaultDateEventInit.toLocaleTimeString());
      }
    }
    if (defaultDateEventEnd !== null) {
      if (defaultDateEventEnd.getHours() === 1) {
        setEnabledCheck(true);
        setDateEventEnd(defaultDateEventEnd.toISOString().split("T")[0]);
      } else {
        setDateEventEnd(defaultDateEventEnd.toISOString().split("T")[0]);
        setHourEventEnd(defaultDateEventEnd.toLocaleTimeString());
      }
    }

    if (categoryId != "") {
      getOneRow(
        "id",
        categoryId,
        import.meta.env.VITE_TABLE_CONTENT_CATEGORIES,
      ).then((category) => {
        setCategory(category.title);
      });
    }
  }, [categoryId]);

  useEffect(() => {
    setValue("publish_date_init", dateInit);
    setValue("publish_date_end", dateEnd);
  }, [dateInit]);

  useEffect(() => {
    setValue("publish_date_end", dateEnd);
  }, [dateEnd]);

  useEffect(() => {
    if (dateEventInit !== null && dateEventEnd !== null) {
      if (!enabledCheck) {
        setValue("event_date_init", dateEventInit + "T" + hourEventInit);

        setValue("event_date_end", dateEventEnd + "T" + hourEventEnd);
      } else {
        setValue("event_date_init", dateEventInit);

        setValue("event_date_end", dateEventEnd);
      }
    }
  }, [dateEventInit, dateEventEnd]);

  return (
    <div className="p-4">
      <div className="grid grid-cols-12 sm:grid-cols-12 gap-4">
        <div className="col-span-6">
          <div>
            <Label className="text" htmlFor="name">
              {t("DATE_INIT_PUBLISH")}
            </Label>
            <div className="mt-1">
              <TextInput
                defaultValue={dateInit}
                onChange={(e) => setDateInit(e.currentTarget.value)}
                className="w-56"
                type="datetime-local"
              />
            </div>
          </div>
        </div>
        <div className="col-span-6">
          <div className="">
            <Label className="text" htmlFor="name">
              {t("DATE_END_PUBLISH")}
            </Label>
            <div className="mt-1">
              <TextInput
                defaultValue={dateEnd}
                onChange={(e) => setDateEnd(e.currentTarget.value)}
                className="w-56"
                type="datetime-local"
              />
            </div>
          </div>
        </div>
        {category === "Agenda municipal" || category === "Eventos" ? (
          <div className="col-span-6">
            <div className="mt-4">
              <Label className="text" htmlFor="name">
                {t("EVENTS_DATE")}
              </Label>
              <div className="mt-1 flex justify-start gap-4">
                <div className="flex gap-2">
                  <TextInput
                    defaultValue={dateEventInit}
                    onChange={(e) => setDateEventInit(e.currentTarget.value)}
                    className=""
                    type="date"
                  />
                  {!enabledCheck ? (
                    <TextInput
                      defaultValue={hourEventInit}
                      onChange={(e) => setHourEventInit(e.currentTarget.value)}
                      type="time"
                    />
                  ) : (
                    <></>
                  )}
                </div>
                <p className="mt-2">a</p>
                <div className="flex gap-2">
                  {!enabledCheck ? (
                    <TextInput
                      defaultValue={hourEventEnd}
                      onChange={(e) => setHourEventEnd(e.currentTarget.value)}
                      type="time"
                    />
                  ) : (
                    <></>
                  )}
                  <TextInput
                    defaultValue={dateEventEnd}
                    onChange={(e) => setDateEventEnd(e.currentTarget.value)}
                    className=""
                    type="date"
                  />
                </div>
              </div>
              <div className="flex mt-4 items-center">
                <Checkbox
                  id="allDay"
                  checked={enabledCheck}
                  onChange={() => setEnabledCheck(!enabledCheck)}
                />
                <Label htmlFor="allDay" className="ml-2">
                  {t("ALL_DAY")}
                </Label>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
