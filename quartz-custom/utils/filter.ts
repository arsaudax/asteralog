import { QuartzPluginData } from "../../quartz/plugins/vfile"

// ⚠️ ВАЖНО: Эти фильтры используются ПОСЛЕ RemoveTags
// Поэтому тегов garden/blog уже нет в frontmatter!
// Теги explorer-exclude и graph-exclude ТОЖЕ удалены!

// ==================================================
// ОСНОВНЫЕ ФИЛЬТРЫ (для компонентов)
// ==================================================

// Для сада: все файлы из content-garden
export const gardenFilter = (file: QuartzPluginData): boolean => {
  return true // Все файлы в папке сада уже отфильтрованы
}

// Для блога: все файлы из content-blog
export const blogFilter = (file: QuartzPluginData): boolean => {
  return true // Все файлы в папке блога уже отфильтрованы
}

// ==================================================
// ФИЛЬТРЫ ДЛЯ EXCLUDE-ТЕГОВ (используются в конфигах компонентов)
// ==================================================

// ВНИМАНИЕ: Эти функции НЕ РАБОТАЮТ в компонентах, потому что теги удалены!
// Они оставлены только для обратной совместимости и документации.
// Вместо них используйте конфигурацию компонентов:

// Для Explorer:
// filterFn: (node) => !node.data?.tags?.includes("explorer-exclude")
// 
// Для Graph:
// excludeTags: ["graph-exclude"]

// ==================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (для обратной совместимости)
// ==================================================

/**
 * Проверяет наличие тега в frontmatter
 * @deprecated Не работает после RemoveTags. Используйте конфигурацию компонентов.
 */
export const hasTag = (file: QuartzPluginData, tag: string): boolean => {
  const tags = file.frontmatter?.tags
  return Array.isArray(tags) && tags.includes(tag)
}

/**
 * Проверяет, нужно ли исключить файл из проводника
 * @deprecated Не работает после RemoveTags. Используйте filterFn в конфиге Explorer.
 */
export const excludeFromExplorer = (file: QuartzPluginData): boolean => {
  return hasTag(file, 'explorer-exclude')
}

/**
 * Проверяет, нужно ли исключить файл из графа
 * @deprecated Не работает после RemoveTags. Используйте excludeTags в конфиге Graph.
 */
export const excludeFromGraph = (file: QuartzPluginData): boolean => {
  return hasTag(file, 'graph-exclude')
}

// ==================================================
// АЛЬТЕРНАТИВНЫЙ ПОДХОД (если всё же нужно проверять теги)
// ==================================================

/**
 * Проверяет наличие тега, используя путь к файлу (если теги удалены)
 * Работает даже после RemoveTags
 */
export const hasTagInPath = (file: QuartzPluginData, tag: string): boolean => {
  return file.slug?.includes(`/${tag}/`) ?? false
}

/**
 * Проверяет, является ли файл черновиком (по наличию draft в пути или frontmatter)
 */
export const isDraft = (file: QuartzPluginData): boolean => {
  // Проверка по frontmatter (если ещё не удалено)
  if (hasTag(file, 'draft')) return true
  
  // Проверка по пути
  return file.slug?.includes('/drafts/') ?? false
}