import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// 定义封面图的 schema（包含图片源和尺寸）
const coverSchema = z.object({
  src: z.any(), // 允许导入的图片模块（实际类型为 ImageMetadata）
  width: z.number(), // 图片宽度
  height: z.number(), // 图片高度
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts/" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    lastModified: z.string().optional(),
    const coverSchema: z.string();  // 只保留图片源路径字符串
    coverAlt: z.string(),
    category: z.array(z.string()),
    tags: z.array(z.string()),
    author: z.string(),
  }),
});

export const collections = { posts };
    