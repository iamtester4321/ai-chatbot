import { z } from "zod";

export const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
});

export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
