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

// Для отладки (временно):
export const gardenFilterDebug = (file: QuartzPluginData) => {
  const tags = file.frontmatter?.tags;
  const result = Array.isArray(tags) && tags.includes('garden');
  console.log(`📄 File: ${file.filePath}`);
  console.log(`   Tags:`, tags);
  console.log(`   Include in garden: ${result}`);
  return result;
};

export const blogFilterDebug = (file: QuartzPluginData) => {
  const tags = file.frontmatter?.tags;
  const result = Array.isArray(tags) && tags.includes('blog');
  console.log(`📄 File: ${file.filePath}`);
  console.log(`   Tags:`, tags);
  console.log(`   Include in blog: ${result}`);
  return result;
};