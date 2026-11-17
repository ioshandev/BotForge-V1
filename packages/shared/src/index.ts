import { z } from "zod";

export const botSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string(),
  provider: z.enum(["gemini", "openai", "anthropic"]),
  status: z.enum(["draft", "published"]),
});

export type Bot = z.infer<typeof botSchema>;

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  service: z.literal("api"),
});
