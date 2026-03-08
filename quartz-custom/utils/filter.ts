import { QuartzPluginData } from "../../quartz/plugins/vfile"

// ⚠️ ВАЖНО: Эти фильтры используются ПОСЛЕ RemoveTags
// Поэтому тегов garden/blog уже нет в frontmatter!

// Для сада: все файлы из content-garden
export const gardenFilter = (file: QuartzPluginData): boolean => {
  // Просто возвращаем true, так как все файлы в папке сада уже отфильтрованы
  return true
}

// Для блога: все файлы из content-blog
export const blogFilter = (file: QuartzPluginData): boolean => {
  // Просто возвращаем true, так как все файлы в папке блога уже отфильтрованы
  return true
}

// Если нужно исключить отдельные файлы, используем служебные теги
export const hasTag = (file: QuartzPluginData, tag: string): boolean => {
  const tags = file.frontmatter?.tags
  return Array.isArray(tags) && tags.includes(tag)
}

// Эти фильтры работают даже после RemoveTags
export const excludeFromExplorer = (file: QuartzPluginData): boolean => {
  return hasTag(file, 'explorer-exclude')
}

export const excludeFromGraph = (file: QuartzPluginData): boolean => {
  return hasTag(file, 'graph-exclude')
}

// Для обратной совместимости (если нужно)
export const hasPublishTag = (file: QuartzPluginData, tag: string): boolean => {
  // Проверяем оригинальные теги до удаления? Нет, уже поздно.
  // Поэтому используем другие методы - например, проверку пути
  return file.slug?.includes(tag) ?? false
}