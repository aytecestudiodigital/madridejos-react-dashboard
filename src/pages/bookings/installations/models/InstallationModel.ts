export type InstallationModel = {
  id?: string;
  title?: string;
  description?: string;
  enable?: boolean;
  type?: "INSTALLATION" | "SERVICE";
  created_at?: Date | string;
  updated_at?: Date | string;
  created_by?: string;
  updated_by?: string;
  org_id?: string;
  images?: string[];
  group_id?: string;
};
