
import mongoose, { Schema, Document, Model } from "mongoose";
import { Configuration } from "../configurations/configuration.model";

export interface IPatientRegistrationModel extends Document {
  [key: string]: any;
}

// 🧠 Map field types from configuration → Mongoose schema types
const mapFieldType = (fieldType: string) => {
  switch (fieldType) {
    case "number":
      return Number;
    case "date":
      return Date;
    case "file":
      return [String];
    case "checkbox":
      return Boolean;
    default:
      return String;
  }
};

// 🧩 Build schema dynamically from Configuration collection
const buildPatientSchema = async (): Promise<Schema> => {
  const configurations = await Configuration.find();
  const schemaFields: Record<string, any> = {};

  for (const config of configurations) {
    const sectionName = config.sectionName;
    const sectionFields: Record<string, any> = {};

    for (const field of config.fields) {
      sectionFields[field.fieldName] = {
        type: mapFieldType(field.fieldType),
        required: field.isRequired || false,
      };
    }

    schemaFields[sectionName] = sectionFields;
  }

  // Common global fields (not section-based)
  schemaFields.campName = { type: String };
  schemaFields.campId = { type: String };
  schemaFields.status = { type: String};

  schemaFields.report = { type: Schema.Types.Mixed };
  schemaFields.reportGeneratedAt = { type: Date };
  schemaFields.reportStatus = { type: String, default: "Not Generated" };

  return new Schema(schemaFields, { timestamps: true });
};

// 🧠 Get dynamic patient model safely
// export const getPatientModel = async (): Promise<
//   Model<IPatientRegistrationModel>
// > => {
//   const modelName = "PatientRegistration";
//   if (mongoose.models[modelName]) {
//     return mongoose.models[modelName] as Model<IPatientRegistrationModel>;
//   }

//   const schema = await buildPatientSchema();
//   return mongoose.model<IPatientRegistrationModel>(modelName, schema);
// };
export const getPatientModel = async (): Promise<
  Model<IPatientRegistrationModel>
> => {
  const modelName = "PatientRegistration";

  // ❗ Always delete old model to regenerate dynamic schema
  if (mongoose.models[modelName]) {
    delete mongoose.models[modelName];
  }

  const schema = await buildPatientSchema();
  return mongoose.model<IPatientRegistrationModel>(modelName, schema);
};
