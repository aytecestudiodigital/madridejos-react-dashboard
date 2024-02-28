import { Database } from "../../../../server/supabaseTypes";

export type PaymentsOrders = {
  amount: number;
  card_id?: string | null;
  created_at?: string;
  created_by?: string | null;
  id?: string;
  module: Database["public"]["Enums"]["module"];
  payment_account_id: string;
  payment_method_id: number;
  record_id: string;
  state: Database["public"]["Enums"]["states"];
  total_payments?: number | null;
  updated_at?: string;
  updated_by?: string | null;
  user_id: string;
};
