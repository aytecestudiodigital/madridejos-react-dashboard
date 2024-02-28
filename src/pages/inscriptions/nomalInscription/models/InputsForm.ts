import { Database } from "../../../../server/supabaseTypes";

export type InputForm = {
  created_at?: string;
  created_by?: string | null;
  deleteable?: boolean;
  enabled?: boolean;
  form_id?: string;
  id?: string;
  order?: number;
  placeholder?: string | null;
  required?: boolean;
  title?: string;
  data_user?: null | Database["public"]["Enums"]["inscriptions_input_types"];
  type?: Database["public"]["Enums"]["inscriptions_input_types"];
  updated_at?: string;
  updated_by?: string | null;
  values?: string[] | null;
};

/**
 * inscriptions_input_types:
        | "STRING"
        | "INTEGER"
        | "FLOAT"
        | "DATETIME"
        | "BOOLEAN"
        | "LIST_MULTIPLE"
        | "LIST_UNIQUE"
        | "WYSIWYG"
        | "HTML"
        | "LIST_IMAGES"
        | "LIST_VIDEOS"
        | "DOCUMENTS"
        | "MAP"
        | "PHONE"
        | "URL"
        | "EMAIL";
 */

/**
         *  data_user:
         * "NONE"
        | "NAME"
        | "SURNAME"
        | "NIF"
        | "EMAIL"
        | "PHONE"
        | "ADDRESS"
        | "LOCALITY"
        | "POSTAL_CODE"
        | "PROVINCE"
        | "DATE_BIRTH"
         */
