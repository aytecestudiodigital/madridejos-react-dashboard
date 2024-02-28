import { Database } from "../../../../server/supabaseTypes";

export type NormalInscription = {
  activity_max_products?: number | null;
  activity_min_products?: number;
  activity_order_asc?: boolean;
  activity_order_by?: Database["public"]["Enums"]["inscriptions_activities_order_by"];
  activity_title: string;
  activity_type: string;
  acumulated_discounts?: boolean;
  aditional_activity_description?: string | null;
  aditional_activity_title?: string | null;
  advanced?: boolean;
  attached_description?: string | null;
  attached_title?: string | null;
  authorizations_description?: string | null;
  authorizations_title: string;
  created_at?: string;
  created_by?: string | null;
  date_end?: string | null;
  date_init: string;
  description?: string | null;
  discounts_description?: string | null;
  enable?: boolean;
  group_id?: string | null;
  id?: string;
  image?: string | null;
  inscription_type?: Database["public"]["Enums"]["inscription_type"];
  org_id: string;
  payment_period_type?:
    | Database["public"]["Enums"]["payment_fraction_period"]
    | null;
  payments_account_id?: string | null;
  period_end_date?: string | null;
  period_init_date?: string | null;
  period_month_day?: number | null;
  period_week_day?: Database["public"]["Enums"]["week_days"] | null;
  report_email?: string | null;
  report_user?: string | null;
  title: string;
  updated_at?: string;
  updated_by?: string | null;
  payment_title?: string;
  payment_description?: string;
};
