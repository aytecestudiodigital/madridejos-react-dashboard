import { Database } from "../../../../server/supabaseTypes";

export type Product = {
  advanced?: boolean | null;
  applicable_discounts?: boolean | null;
  created_at?: string;
  created_by?: string | null;
  days?: Database["public"]["Enums"]["week_days"][] | null;
  enabled?: boolean;
  id?: string;
  inscription_id: string;
  is_additional?: boolean;
  unique?: boolean;
  observations?: string | null;
  order?: number | null;
  place?: string | null;
  places: number;
  price: number;
  required?: boolean;
  teacher?: string | null;
  time_end?: string | null;
  time_init?: string | null;
  title: string;
  updated_at?: string;
  updated_by?: string | null;
  waiting_list?: boolean | null;
  years?: number[] | null;
};
