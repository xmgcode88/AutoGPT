import z from "zod";

export const publishAgentSchema = z.object({
  title: z.string().min(1, "请输入标题").max(100, "标题需少于 100 个字符"),
  subheader: z
    .string()
    .min(1, "请输入副标题")
    .max(200, "副标题需少于 200 个字符"),
  slug: z
    .string()
    .min(1, "请输入 Slug")
    .max(50, "Slug 需少于 50 个字符")
    .regex(/^[a-z0-9-]+$/, "Slug 只能包含小写字母、数字和连字符（-）"),
  youtubeLink: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      try {
        const url = new URL(val);
        const allowedHosts = [
          "youtube.com",
          "www.youtube.com",
          "youtu.be",
          "www.youtu.be",
        ];
        return allowedHosts.includes(url.hostname);
      } catch {
        return false;
      }
    }, "请输入有效的 YouTube 链接"),
  category: z.string().min(1, "请选择分类"),
  description: z
    .string()
    .min(1, "请输入描述")
    .max(1000, "描述需少于 1000 个字符"),
  recommendedScheduleCron: z.string().optional(),
  instructions: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 2000, "使用说明需少于 2000 个字符"),
});

export type PublishAgentFormData = z.infer<typeof publishAgentSchema>;

export interface PublishAgentInfoInitialData {
  agent_id: string;
  title: string;
  subheader: string;
  slug: string;
  thumbnailSrc: string;
  youtubeLink: string;
  category: string;
  description: string;
  additionalImages?: string[];
  recommendedScheduleCron?: string;
  instructions?: string;
}
