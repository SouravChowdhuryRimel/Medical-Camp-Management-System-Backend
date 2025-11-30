import { z } from "zod";

const update_user = z.object({
    name: z.string().optional(),
    accountId: z.string(),
})

export const user_validations = {
    update_user
}