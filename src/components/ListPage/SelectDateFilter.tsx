import { Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
/**
 *
 * block w-full border disabled:cursor-not-allowed
 * disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900
 * focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600
 * dark:bg-gray-700 dark:text-white dark:placeholder-gray-400
 * dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg
 */
interface FiltersProps {
  dataDropdown: any[];
  onFilterChange: (selectedFilters: any[]) => void;
  title: string;
  showCustom: boolean;
}
//! Se usa cuando pasamos queremos filtrar por fechas

export default function SelectFilter(props: FiltersProps) {
  const [filteredDate, setFilteredDate] = useState("");
  const [dateInitFiltered, setDateInitFiltered] = useState("");
  const [dateEndFiltered, setDateEndFiltered] = useState("");
  const [singleDateToFilter, setSingleDateToFilter] = useState("");

  useEffect(() => {
    if (filteredDate === "TODAY" || filteredDate === "YESTERDAY") {
      setDateInitFiltered("");
      setDateEndFiltered("");
    }
  }, [filteredDate]);

  useEffect(() => {
    const customFilterDates: string[] = [];
    if (filteredDate !== "CUSTOM") {
      if (singleDateToFilter !== "") {
        customFilterDates.push(singleDateToFilter);
      }
    } else {
      if (dateInitFiltered !== "" && dateEndFiltered !== "") {
        customFilterDates.push(dateInitFiltered, dateEndFiltered);
      }
    }
    props.onFilterChange(customFilterDates);
  }, [dateInitFiltered, dateEndFiltered, singleDateToFilter]);
  useEffect(() => {
    if (props.showCustom) {
      onFilteredDate("ALWAYS");
      setDateInitFiltered("");
      setDateEndFiltered("");
    }
  }, [props.showCustom]);

  const onFilteredDate = (value: any) => {
    if (value === "ALWAYS") {
      setSingleDateToFilter("");
      setFilteredDate("");
    } else if (value === "TODAY") {
      setFilteredDate("TODAY");
      setSingleDateToFilter(new Date().toLocaleDateString());
    } else if (value === "YESTERDAY") {
      setFilteredDate("YESTERDAY");
      const today = new Date();
      const dayInMilliseconds = 24 * 60 * 60 * 1000;
      const yesterday = new Date(
        today.getTime() - dayInMilliseconds,
      ).toLocaleDateString();
      setSingleDateToFilter(yesterday);
    } else if (value === "CUSTOM") {
      setFilteredDate("CUSTOM");
    }
  };

  return (
    <div className="flex gap-4 items-center">
      <div>
        <Select
          value={""}
          onChange={(e) => onFilteredDate(e.currentTarget.value)}
          className="mt-1 w-40"
        >
          {" "}
          <option hidden disabled value="">
            Fecha de registro
          </option>
          <option value="ALWAYS">Siempre</option>
          <option value="TODAY">Hoy</option>
          <option value="YESTERDAY">Ayer</option>
          <option value="CUSTOM">Intervalo personalizado</option>
        </Select>
      </div>
      {filteredDate === "CUSTOM" && (
        <>
          <div>
            <div className="mt-1">
              <TextInput
                id="initDateInput"
                defaultValue={dateInitFiltered}
                onBlur={(e) => setDateInitFiltered(e.currentTarget.value)}
                type="date"
                onChange={(e) => {
                  const startDate = new Date(e.currentTarget.value);
                  const endDateInput = document.getElementById(
                    "endDateInput",
                  ) as HTMLInputElement;
                  if (endDateInput) {
                    endDateInput.min = startDate.toISOString().split("T")[0];
                    if (startDate > new Date(dateEndFiltered)) {
                      setDateEndFiltered(startDate.toISOString().split("T")[0]);
                    }
                    endDateInput.max = new Date().toISOString().split("T")[0];
                    if (new Date() > new Date(dateEndFiltered)) {
                      setDateEndFiltered(startDate.toISOString().split("T")[0]);
                    }
                  }
                }}
              />
            </div>
          </div>
          <div>
            <div className="mt-1">
              <TextInput
                id="endDateInput"
                defaultValue={dateEndFiltered}
                onChange={(e) => {
                  const endDate = new Date(e.currentTarget.value);
                  const startDateInput = document.getElementById(
                    "initDateInput",
                  ) as HTMLInputElement;
                  if (startDateInput) {
                    startDateInput.max = endDate.toISOString().split("T")[0];
                    if (endDate < new Date(dateInitFiltered)) {
                      setDateInitFiltered(endDate.toISOString().split("T")[0]);
                    }
                  }
                  setDateEndFiltered(e.currentTarget.value);
                }}
                type="date"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
