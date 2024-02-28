import { Database } from "../../../../server/supabaseTypes";

export type PaymentMethod = {
  created_at: string;
  created_by: string | null;
  enable: boolean;
  enviroment: string;
  id: number;
  key_signature_production: string | null;
  key_signature_sandbox: string | null;
  merchant_code: string | null;
  org_id: string;
  provider: Database["public"]["Enums"]["payments_methods_provider"] | null;
  terminal: number | null;
  title: string;
  type: Database["public"]["Enums"]["payments_methods_type"];
  updated_at: string;
  updated_by: string | null;
  viafirma_group: string | null;
  viafirma_template: string | null;
};
