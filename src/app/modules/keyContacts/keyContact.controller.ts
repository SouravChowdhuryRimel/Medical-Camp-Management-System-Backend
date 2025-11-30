import { Request, Response } from "express";
import * as keyContactService from "./keyContact.service";

export const createKeyContact = async (req: Request, res: Response) => {
  try {
    const contact = await keyContactService.createKeyContact(req.body);
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: "Failed to create contact", error });
  }
};

export const getAllKeyContacts = async (_req: Request, res: Response) => {
  try {
    const contacts = await keyContactService.getAllKeyContacts();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch contacts", error });
  }
};

export const getKeyContactById = async (req: Request, res: Response) => {
  try {
    const contact = await keyContactService.getKeyContactById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch contact", error });
  }
};

export const updateKeyContact = async (req: Request, res: Response) => {
  try {
    const contact = await keyContactService.updateKeyContact(req.params.id, req.body);
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: "Failed to update contact", error });
  }
};

export const deleteKeyContact = async (req: Request, res: Response) => {
  try {
    const contact = await keyContactService.deleteKeyContact(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete contact", error });
  }
};
