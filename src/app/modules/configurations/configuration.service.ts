import { Configuration, IConfigurationModel } from "./configuration.model";
import { IField } from "./configuration.interface";

// const createOrUpdate = async (sectionName: string, fields: IField[]): Promise<IConfigurationModel[]> => {
//   await Configuration.findOneAndUpdate(
//     { sectionName },
//     { $set: { fields } },
//     { new: true, upsert: true }
//   );

//   return await Configuration.find();
// };

const createOrUpdate = async (
  sectionName: string,
  fields: IField[]
): Promise<IConfigurationModel[]> => {
  // await Configuration.findOneAndUpdate(
  //   { sectionName },
  //   { $push: { fields: { $each: fields } } },  // <-- Adds new fields
  //   { new: true, upsert: true }
  // );
  await Configuration.findOneAndUpdate(
    { sectionName },
    { $set: { fields } },
    { new: true, upsert: true }
  );

  return await Configuration.find();
};

const getAll = async (): Promise<IConfigurationModel[]> => {
  return await Configuration.find();
};

const getBySection = async (
  sectionName: string
): Promise<IConfigurationModel | null> => {
  return await Configuration.findOne({ sectionName });
};

const addField = async (
  sectionName: string,
  field: IField
): Promise<IConfigurationModel> => {
  const config = (await Configuration.findOne({
    sectionName,
  })) as IConfigurationModel | null;
  if (!config)
    throw new Error(`Configuration section '${sectionName}' not found`);

  config.fields.push(field);
  return await config.save();
};

const updateConfigurationField = async (
  sectionName: string,
  fieldName: string,
  updatedProperties: Partial<IField>
): Promise<IConfigurationModel> => {
  const config = (await Configuration.findOne({
    sectionName,
  })) as IConfigurationModel | null;
  if (!config)
    throw new Error(`Configuration section '${sectionName}' not found`);

  const index = config.fields.findIndex((f) => f.fieldName === fieldName);
  if (index === -1)
    throw new Error(
      `Field '${fieldName}' not found in section '${sectionName}'`
    );

  config.fields[index] = {
    ...config.fields[index].toObject(),
    ...updatedProperties,
  };
  return await config.save();
};

const deleteField = async (
  sectionName: string,
  fieldName: string
): Promise<IConfigurationModel> => {
  const config = (await Configuration.findOne({
    sectionName,
  })) as IConfigurationModel | null;
  if (!config)
    throw new Error(`Configuration section '${sectionName}' not found`);

  config.fields = config.fields.filter((f) => f.fieldName !== fieldName);
  return await config.save();
};

const deleteSectionByName = async (sectionName: string) => {
  const deleteSection = await Configuration.findOneAndDelete({ sectionName });
  if (!deleteSection) {
    throw new Error("Section not found");
  }
  return deleteSection;
};

export const configurationService = {
  createOrUpdate,
  getAll,
  getBySection,
  addField,
  updateConfigurationField,
  deleteField,
  deleteSectionByName,
};
