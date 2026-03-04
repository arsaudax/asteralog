import { QuartzPluginData } from "../../quartz/plugins/vfile";

// Фильтр для сада: оставляем заметки с тегом "garden"
export const gardenFilter = (file: QuartzPluginData) => {
  const tags = file.frontmatter?.tags;
  return Array.isArray(tags) && tags.includes('garden');
};

// Фильтр для блога: оставляем заметки с тегом "blog"
export const blogFilter = (file: QuartzPluginData) => {
  const tags = file.frontmatter?.tags;
  return Array.isArray(tags) && tags.includes('blog');
};

// Для отладки (можно добавить при необходимости)
export const gardenFilterDebug = (file: QuartzPluginData) => {
  const tags = file.frontmatter?.tags;
  const result = Array.isArray(tags) && tags.includes('garden');
  console.log(`📄 File: ${file.filePath}, tags:`, tags, `include: ${result}`);
  return result;
};