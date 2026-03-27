import { QuartzPluginData } from "../../quartz/plugins/vfile"
import { FileTrieNode } from "../../quartz/util/fileTrie"

// ==================================================
// ФИЛЬТРЫ ПО ПОЛЮ type (не удаляется плагинами)
// ==================================================

/**
 * Фильтр для сада
 * type === 'garden' — только в сад
 */
export const gardenFilter = (file: QuartzPluginData): boolean => {
  const type = file.frontmatter?.type
  return type === 'garden'
}

/**
 * Фильтр для блога
 * type === 'blog' — только в блог
 */
export const blogFilter = (file: QuartzPluginData): boolean => {
  const type = file.frontmatter?.type
  return type === 'blog'
}

// ==================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ==================================================

export const hasTag = (file: QuartzPluginData, tag: string): boolean => {
  const tags = file.frontmatter?.tags
  return Array.isArray(tags) && tags.includes(tag)
}

// ==================================================
// ФИЛЬТРЫ ДЛЯ САДА (garden-*)
// ==================================================

/**
 * Фильтр для проводника (Explorer)
 * Использует node.data.tags — родной способ Quartz
 */
export const gardenExplorerFilter = (node: FileTrieNode): boolean => {
  const tags = node.data?.tags || []
  const hasExcludedTag = tags.includes("garden-explorer-exclude")
  return !hasExcludedTag
}

/**
 * Фильтр для графа (Graph) — больше не нужен, используем excludeTags в конфиге
 * @deprecated Используйте excludeTags в graphConfig
 */
export const gardenGraphFilter = (file: QuartzPluginData): boolean => {
  return !hasTag(file, "garden-graph-exclude")
}

// ==================================================
// ФИЛЬТРЫ ДЛЯ БЛОГА (blog-*)
// ==================================================

export const blogRecentsFilter = (file: QuartzPluginData): boolean => {
  // Проверяем тип: blog ИЛИ both
  const type = file.frontmatter?.type
  if (type !== 'blog' && type !== 'both') {
    return false
  }
  
  if (file.slug === 'index') return false
  if (file.slug === 'archive') return false
  if (hasTag(file, "blog-recents-exclude")) return false
  
  return true
}

export const blogArchiveFilter = (file: QuartzPluginData): boolean => {
  // Проверяем тип: blog ИЛИ both
  const type = file.frontmatter?.type
  if (type !== 'blog' && type !== 'both') {
    return false
  }
  
  if (file.slug === 'index') return false
  if (file.slug === 'archive') return false
  if (hasTag(file, "blog-archive-exclude")) return false
  
  return true
}

export const blogBacklinksFilter = (file: QuartzPluginData): boolean => {
  const type = file.frontmatter?.type
  if (type !== 'blog' && type !== 'both') return true
  
  return !hasTag(file, "blog-backlinks-exclude")
}

// ==================================================
// ОБЩИЕ ФИЛЬТРЫ
// ==================================================

export const searchFilter = (file: QuartzPluginData): boolean => {
  return !hasTag(file, "search-exclude")
}

export const topicFilter = (fileNode: FileTrieNode): boolean => {
  return true
}

// ==================================================
// УНИВЕРСАЛЬНЫЕ ФИЛЬТРЫ (С УЧЁТОМ ТИПА САЙТА)
// ==================================================

export const recentNotesFilter = (file: QuartzPluginData, siteType: 'garden' | 'blog'): boolean => {
  if (siteType === 'blog') {
    return blogRecentsFilter(file)
  }
  const type = file.frontmatter?.type
  return type === 'garden'
}

export const backlinksFilter = (file: QuartzPluginData, siteType: 'garden' | 'blog'): boolean => {
  if (siteType === 'blog') {
    return blogBacklinksFilter(file)
  }
  return true
}

// ==================================================
// ДЛЯ ОБРАТНОЙ СОВМЕСТИМОСТИ (СТАРЫЕ ФУНКЦИИ)
// ==================================================

/** @deprecated Используйте gardenExplorerFilter */
export const explorerFilter = gardenExplorerFilter

/** @deprecated Используйте gardenGraphFilter (но лучше использовать excludeTags) */
export const graphFilter = gardenGraphFilter

/** @deprecated Используйте blogRecentsFilter */
export const excludeFromRecents = (file: QuartzPluginData): boolean => {
  return hasTag(file, 'blog-recents-exclude') || hasTag(file, 'recents-exclude')
}

/** @deprecated Используйте blogBacklinksFilter */
export const excludeFromBacklinks = (file: QuartzPluginData): boolean => {
  return hasTag(file, 'blog-backlinks-exclude') || hasTag(file, 'backlinks-exclude')
}