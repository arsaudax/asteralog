import { QuartzPluginData } from "../../quartz/plugins/vfile"
import { FileTrieNode } from "../../quartz/util/fileTrie"

/**
 * Фильтр для заметок сада (тег garden)
 */
export const gardenFilter = (file: QuartzPluginData): boolean => {
  const tags = file.frontmatter?.tags
  return Array.isArray(tags) && tags.includes('garden')
}

/**
 * Фильтр для заметок блога (тег blog)
 */
export const blogFilter = (file: QuartzPluginData): boolean => {
  const tags = file.frontmatter?.tags
  return Array.isArray(tags) && tags.includes('blog')
}

/**
 * Фильтр для проводника (Explorer)
 * Можно исключать целые папки из отображения
 */
export const topicFilter = (fileNode: FileTrieNode): boolean => {
  // Пример: исключить папку "private" из проводника
  // if (fileNode.slugSegment === "private") return false
  
  // По умолчанию показываем всё
  return true
}

/**
 * Вспомогательные фильтры для исключений
 */
export const hasTag = (file: QuartzPluginData, tag: string): boolean => {
  const tags = file.frontmatter?.tags
  return Array.isArray(tags) && tags.includes(tag)
}

export const excludeFromExplorer = (file: QuartzPluginData): boolean => {
  return hasTag(file, 'explorer-exclude')
}

export const excludeFromGraph = (file: QuartzPluginData): boolean => {
  return hasTag(file, 'graph-exclude')
}