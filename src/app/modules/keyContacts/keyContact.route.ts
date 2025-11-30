import { Router } from "express";
import * as keyContactController from "./keyContact.controller";

const router = Router();

router.post("/create", keyContactController.createKeyContact);
router.get("/getAll", keyContactController.getAllKeyContacts);
router.get("/getSingle/:id", keyContactController.getKeyContactById);
router.put("/update/:id", keyContactController.updateKeyContact);
router.delete("/delete/:id", keyContactController.deleteKeyContact);

export const keyContacts = router;
