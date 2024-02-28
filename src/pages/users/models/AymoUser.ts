export type AymoUser = {
  id?: string;
  uid?: string;
  name?: string;
  surname?: string;
  document?: string;
  document_type?: "DNI" | "NIE" | "CIF";
  email?: string;
  phone?: string;
  created_at?: string;
  password?: string;
  group_id?: string | null;
  role?: string | null;
};
