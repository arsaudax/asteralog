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
 */
export const hasTag = (file: QuartzPluginData, tag: string): boolean => {
  const tags = file.frontmatter?.tags
  return Array.isArray(tags) && tags.includes(tag)
}

// ==================================================
// ФИЛЬТРЫ ДЛЯ САДА (garden-*)
// ==================================================

/**
 * Фильтр для проводника (Explorer) в саду
 * Использует тег 'garden-explorer-exclude'
 */
export const gardenExplorerFilter = (node: FileTrieNode): boolean => {
  const tags = node.data?.frontmatter?.tags || []
  const hasExcludedTag = tags.includes("garden-explorer-exclude")
  return !hasExcludedTag
}

/**
 * Фильтр для графа (Graph) в саду
 * Использует тег 'garden-graph-exclude'
 */
export const gardenGraphFilter = (file: QuartzPluginData): boolean => {
  return !hasTag(file, "garden-graph-exclude")
}

// ==================================================
// ФИЛЬТРЫ ДЛЯ БЛОГА (blog-*)
// ==================================================

/**
 * Фильтр для недавних записей (RecentNotes) в блоге
 * Использует тег 'blog-recents-exclude'
 * Также проверяет, что файл имеет тег blog (через путь)
 */
export const blogRecentsFilter = (file: QuartzPluginData): boolean => {
  // Сначала проверяем, что это вообще файл блога
  const isBlogFile = file.slug && (
    file.slug.startsWith('blog/') || 
    file.slug === 'index' || 
    file.slug === 'archive'
  )
  
  if (!isBlogFile) return false
  
  // Проверяем тег исключения
  return !hasTag(file, "blog-recents-exclude")
}

/**
 * Фильтр для архива в блоге
 * Использует тег 'blog-archive-exclude'
 * Применяется на странице /archive
 */
export const blogArchiveFilter = (file: QuartzPluginData): boolean => {
  const isBlogFile = file.slug && (
    file.slug.startsWith('blog/') || 
    file.slug === 'index' || 
    file.slug === 'archive'
  )
  
  if (!isBlogFile) return false
  if (file.slug === 'archive') return false
  if (file.slug === 'index') return false
  
  return !hasTag(file, "blog-archive-exclude")
}

/**
 * Фильтр для обратных ссылок (Backlinks) в блоге
 * Использует тег 'blog-backlinks-exclude'
 */
export const blogBacklinksFilter = (file: QuartzPluginData): boolean => {
  const isBlogFile = file.slug && (
    file.slug.startsWith('blog/') || 
    file.slug === 'index' || 
    file.slug === 'archive'
  )
  
  if (!isBlogFile) return true
  
  return !hasTag(file, "blog-backlinks-exclude")
}

// ==================================================
// ФИЛЬТРЫ ДЛЯ ОБОИХ САЙТОВ
// ==================================================

/**
 * Фильтр для поиска
 * Использует тег 'search-exclude'
 */
export const searchFilter = (file: QuartzPluginData): boolean => {
  return !hasTag(file, "search-exclude")
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
// УНИВЕРСАЛЬНЫЕ ФИЛЬТРЫ (С УЧЁТОМ ТИПА САЙТА)
// ==================================================

/**
 * Универсальный фильтр для недавних записей
 * Автоматически выбирает правильный фильтр в зависимости от типа сайта
 */
export const recentNotesFilter = (file: QuartzPluginData, siteType: 'garden' | 'blog'): boolean => {
  if (siteType === 'blog') {
    return blogRecentsFilter(file)
  }
  // Для сада — все файлы сада показываются
  const isGardenFile = file.slug && (
    file.slug.startsWith('garden/') || 
    file.slug === 'index-garden'
  )
  return isGardenFile
}

/**
 * Универсальный фильтр для обратных ссылок
 */
export const backlinksFilter = (file: QuartzPluginData, siteType: 'garden' | 'blog'): boolean => {
  if (siteType === 'blog') {
    return blogBacklinksFilter(file)
  }
  // Для сада — показываем всё
  return true
}

// ==================================================
// ДЛЯ ОБРАТНОЙ СОВМЕСТИМОСТИ (СТАРЫЕ ТЕГИ)
// ==================================================

/**
 * @deprecated Используйте gardenExplorerFilter
 */
export const explorerFilter = gardenExplorerFilter

/**
 * @deprecated Используйте gardenGraphFilter
 */
export const graphFilter = gardenGraphFilter

/**
 * @deprecated Используйте blogRecentsFilter
 */
export const excludeFromRecents = (file: QuartzPluginData): boolean => {
  return hasTag(file, 'blog-recents-exclude') || hasTag(file, 'recents-exclude')
}

/**
 * @deprecated Используйте blogBacklinksFilter
 */
export const excludeFromBacklinks = (file: QuartzPluginData): boolean => {
  return hasTag(file, 'blog-backlinks-exclude') || hasTag(file, 'backlinks-exclude')
}