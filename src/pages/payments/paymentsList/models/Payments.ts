import { Database } from "../../../../server/supabaseTypes";

export type Payments = {
  amount: number;
  collection_date?: string | null;
  created_at?: string;
  id?: string;
  payments_order_id: string;
  product_id: string;
  redsys_message_result?: string | null;
  redsys_order?: string | null;
  state: Database["public"]["Enums"]["states"];
  updated_at?: string;
};
