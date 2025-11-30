import { IKeyContact, KeyContactModel } from "./keyContact.model";

export const createKeyContact = async (data: IKeyContact) => {
  const newContact = new KeyContactModel(data);
  return await newContact.save();
};

export const getAllKeyContacts = async () => {
  return await KeyContactModel.find();
};

export const getKeyContactById = async (id: string) => {
  return await KeyContactModel.findById(id);
};

export const updateKeyContact = async (id: string, data: Partial<IKeyContact>) => {
  return await KeyContactModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteKeyContact = async (id: string) => {
  return await KeyContactModel.findByIdAndDelete(id);
};
