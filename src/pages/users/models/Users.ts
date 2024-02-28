import { Database } from "../../../server/supabaseTypes";

export type Users = {
  created_at: string;
  document: string;
  document_type: Database["public"]["Enums"]["document_type"];
  email: string;
  group_id: string | null;
  id: string;
  is_superadmin: boolean;
  name: string | null;
  phone: string | null;
  role: string | null;
  surname: string | null;
  uid: string | null;
  updated_at: string;
};
