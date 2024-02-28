import { Database } from "../../../../server/supabaseTypes";

export type Forms = {
  created_at?: string;
  created_by?: string | null;
  form_type?: Database["public"]["Enums"]["inscriptions_forms_type"];
  id?: string;
  inscription_id?: string;
  title?: string;
  updated_at?: string;
  updated_by?: string | null;
};
