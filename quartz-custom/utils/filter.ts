import { QuartzPluginData } from "../../quartz/plugins/vfile"
import { FileTrieNode } from "../../quartz/util/fileTrie"

// ⚠️ ВАЖНО: Эти фильтры используются ПОСЛЕ RemoveTags
// Поэтому тегов garden/blog уже нет в frontmatter!

// ==================================================
// ФИЛЬТРЫ ДЛЯ РАЗДЕЛОВ (ПРОСТЫЕ)
// ==================================================

/**
 * Фильтр для сада
 * Все файлы в content-garden уже отфильтрованы скриптом синхронизации
 */
export const gardenFilter = (file: QuartzPluginData): boolean => {
  return true
}

/**
 * Фильтр для блога
 * Все файлы в content-blog уже отфильтрованы скриптом синхронизации
 */
export const blogFilter = (file: QuartzPluginData): boolean => {
  return true
}

// ==================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ==================================================

/**
 * Проверка наличия тега в frontmatter
 * (теги типа explorer-exclude, graph-exclude остаются)
 */
export const hasTag = (file: QuartzPluginData, tag: string): boolean => {
  const tags = file.frontmatter?.tags
  return Array.isArray(tags) && tags.includes(tag)
}

// ==================================================
// ФИЛЬТРЫ ИСКЛЮЧЕНИЯ (ИСПОЛЬЗУЮТ СЛУЖЕБНЫЕ ТЕГИ)
// ==================================================

/**
 * Исключение из проводника
 * Использует тег 'explorer-exclude'
 */
export const excludeFromExplorer = (file: QuartzPluginData): boolean => {
  return hasTag(file, 'explorer-exclude')
}

/**
 * Фильтр для проводника (обратный от excludeFromExplorer)
 * Используется в компоненте Explorer
 */
export const explorerFilter = (node: FileTrieNode): boolean => {
  const hasExcludedTag = node.data?.frontmatter?.tags?.includes("explorer-exclude") === true
  return !hasExcludedTag
}

/**
 * Исключение из графа
 * Использует тег 'graph-exclude'
 */
export const excludeFromGraph = (file: QuartzPluginData): boolean => {
  return hasTag(file, 'graph-exclude')
}

/**
 * Фильтр для графа (обратный от excludeFromGraph)
 * Используется в компоненте Graph
 */
export const graphFilter = (file: QuartzPluginData): boolean => {
  return !hasTag(file, 'graph-exclude')
}

// ==================================================
// ФИЛЬТР ДЛЯ ПРОВОДНИКА (ПО ПАПКАМ)
// ==================================================

/**
 * Фильтр для проводника по папкам
 * Можно исключать целые директории
 */
export const topicFilter = (fileNode: FileTrieNode): boolean => {
  // Пример: скрыть папку "private"
  // if (fileNode.name === 'private') return false
  
  // Пример: скрыть все файлы в папке "drafts"
  // if (fileNode.path?.includes('drafts')) return false
  
  // По умолчанию показываем всё
  return true
}

// ==================================================
// ДОПОЛНИТЕЛЬНЫЕ ФИЛЬТРЫ (ПРИ НЕОБХОДИМОСТИ)
// ==================================================

/**
 * Исключение из недавних записей
 * Использует тег 'recents-exclude'
 */
export const excludeFromRecents = (file: QuartzPluginData): boolean => {
  return hasTag(file, 'recents-exclude')
}

/**
 * Исключение из поиска
 * Использует тег 'search-exclude'
 */
export const excludeFromSearch = (file: QuartzPluginData): boolean => {
  return hasTag(file, 'search-exclude')
}