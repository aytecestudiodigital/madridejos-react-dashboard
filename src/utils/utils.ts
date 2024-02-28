/* eslint-disable @typescript-eslint/no-explicit-any */
import { getOneRow } from "../server/supabaseQueries";
import * as XLSX from "xlsx";

export const isAllowed = async (userId: any) => {
  try {
    const tableNameUsers = import.meta.env.VITE_TABLE_USERS;
    const tableNameRoles = import.meta.env.VITE_TABLE_USER_ROLES;

    const user = await getOneRow("id", userId, tableNameUsers);
    const role = await getOneRow("id", user.role, tableNameRoles);
    return role.rules;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const createXLs = async (data: any[], title: string) => {
  await new Promise((resolve) =>
    setTimeout(() => {
      /* generate worksheet */
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Listado");

      /* save to file */
      const alias = createAlias(title);
      XLSX.writeFile(wb, alias + ".xlsx");
      resolve(true);
    }, 2000),
  );
};

export const createAlias = (_string: string) => {
  let str = _string.toLowerCase();
  str = str.replace(/á/g, "a");
  str = str.replace(/é/g, "e");
  str = str.replace(/í/g, "i");
  str = str.replace(/ó/g, "o");
  str = str.replace(/ú/g, "u");
  str = str.replace(/ñ/g, "n");
  str = str.replace(/ü/g, "u");
  str = str.replace(/\)/g, "");
  str = str.replace(/\(/g, "");
  str = str.replace(/ /g, "-");
  return str;
};
