// export interface Iconfiguration{
//     fullName: string;
//     dateOfBirth: Date | string;
//     phoneNumber: string;
// } 

// src/modules/configuration/configuration.interface.ts

// export interface IFieldOption {
//   label: string;
//   value: string;
// }

// export interface IField {
//   toObject(): IField;
//   fieldName: string;             // e.g. "Full Name", "Gender", "Date of Birth"
//   fieldType: string;             // e.g. "text", "number", "date", "select"
//   isRequired: boolean;           // whether field is mandatory
//   placeholder?: string;          // optional placeholder
//   options?: IFieldOption[];      // for dropdown/select fields
//   order?: number;                // to control order in frontend
//   active?: boolean;              // can be used to show/hide
// }

// export interface IConfiguration {
//   sectionName: string;           // e.g. "Registration", "Vitals Check"
//   fields: IField[];              // list of fields under that section
// }

export interface IField {
  toObject(): IField;
  fieldName: string;
  fieldType: "text" | "number" | "date" | "select" | "checkbox" | "radio" | "textarea" | "file";
  isRequired?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  order?: number;
  active?: boolean;
}

export interface IConfiguration {
  sectionName: string;
  fields: IField[];
}
