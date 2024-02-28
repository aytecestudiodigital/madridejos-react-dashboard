// ? https://aytecdigital.atlassian.net/wiki/spaces/AYMO2/pages/26607622/Entidades

export type ContentEntity = {
  id?: number;
  created_by?: string;
  updated_by?: string;
  created_at?: Date;
  updated_at?: Date;
  title: string;
  description?: string;
  enabled: boolean;
  isEvent: boolean;
  groups: FieldsGroup[];
};

export type FieldsGroup = {
  title: string;
  fields?: EntityField[];
};

export type EntityField = {
  fieldId?: string;
  label: string;
  type: FieldType;
  value?: any; // para meterle valores por defecto o una lista de posibles valores.
  isOptional: boolean;
  order: number;
  isFilterable: boolean; // por defecto a false
};

export enum FieldType {
  String = "STRING",
  Integer = "INTEGER",
  Float = "FLOAT",
  Datetime = "DATETIME", // campo formato fecha
  Boolean = "BOOLEAN",
  ListMultiple = "LIST_MULTIPLE",
  ListUnique = "LIST_UNIQUE",
  Wysiwyg = "WYSIWYG", // el objeto que devuelve el editor-js
  Html = "HTML",
  ListImages = "LIST_IMAGES", // array de objetos de imagen
  ListVideos = "LIST_VIDEOS", // array de objetos de video
  Documents = "DOCUMENTS",
  Map = "MAP",
  Phone = "PHONE",
  Url = "URL",
  Email = "EMAIL",
}
