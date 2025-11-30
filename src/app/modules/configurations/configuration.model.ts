import { Schema, model, Document } from "mongoose";
import { IConfiguration, IField } from "./configuration.interface";

export interface IConfigurationModel extends IConfiguration, Document {}

// const FieldSchema = new Schema<IField>(
//   {
//     fieldName: { type: String, required: true },
//     fieldType: {
//       type: String,
//       enum: ["text","number","date","select","checkbox","radio","textarea","file"],
//       required: true,
//     },
//     isRequired: { type: Boolean, default: false },
//     placeholder: { type: String },
//     options: [{ label: String, value: String }],
//     order: { type: Number, default: 0 },
//     active: { type: Boolean, default: true },
//   },
//   { _id: false }
// );


// const FieldSchema = new Schema<IField>(
//   {
//     fieldName: { type: String, required: true },
//     fieldType: {
//       type: String,
//       enum: ["text", "number", "date", "select", "checkbox", "radio", "textarea", "file"],
//       required: true,
//     },
//     isRequired: { type: Boolean, default: false },
//     placeholder: { type: String },

//     // For select/radio/checkbox dynamic options
//     options: {
//       type: [{ label: String, value: String }],
//       default: [],
//       validate: {
//         validator: function (v: any[]) {
//           // Only validate when type is select
//           if (this.fieldType === "select") {
//             return v && v.length > 0;
//           }
//           return true;
//         },
//         message: "Options are required when fieldType is 'select'.",
//       },
//     },

//     order: { type: Number, default: 0 },
//     active: { type: Boolean, default: true },
//   },
//   { _id: false }
// );


// const FieldSchema = new Schema<IField>(
//   {
//     fieldName: { type: String, required: true },

//     fieldType: {
//       type: String,
//       enum: [
//         "text",
//         "number",
//         "date",
//         "select",
//         "checkbox",
//         "radio",
//         "textarea",
//         "file",
//       ],
//       required: true,
//     },

//     isRequired: { type: Boolean, default: false },
//     placeholder: { type: String },

//     // This becomes nested FIELD under checkbox
//     options: {
//       type: [ 
//         {
//           fieldName: { type: String, required: true },
//           fieldType: {
//             type: String,
//             enum: ["text", "number", "date", "textarea", "file"],
//             required: true,
//           },
//           placeholder: { type: String },
//           isRequired: { type: Boolean, default: false }
//         }
//       ],
//       default: [],
//     },

//     order: { type: Number, default: 0 },
//     active: { type: Boolean, default: true },
//   },
//   { _id: false }
// );


const FieldSchema = new Schema<IField>(
  {
    fieldName: { type: String, required: true },

    fieldType: {
      type: String,
      enum: [
        "text",
        "number",
        "date",
        "select",
        "checkbox",
        "radio",
        "textarea",
        "file",
      ],
      required: true,
    },

    isRequired: { type: Boolean, default: false, set: () => false },
    placeholder: { type: String },

    // OPTIONS LOGIC
    options: {
      type: Array,
      default: [],
      validate: {
        validator: function (v: any[]) {
          if (this.fieldType === "select" || this.fieldType === "radio") {
            return v.every(opt => opt.label && opt.value);
          }

          if (this.fieldType === "checkbox") {
            return v.every(
              c =>
                c.fieldName &&
                c.fieldType &&
                ["text", "number", "date", "textarea", "file"].includes(
                  c.fieldType
                )
            );
          }

          return true;
        },
        message: "Invalid options format.",
      },
    },

    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { _id: false }
);



const ConfigurationSchema = new Schema<IConfigurationModel>(
  {
    sectionName: { type: String, required: true, unique: true },
    fields: { type: [FieldSchema], default: [] },
  },
  { timestamps: true }
);

export const Configuration = model<IConfigurationModel>("Configuration", ConfigurationSchema);

