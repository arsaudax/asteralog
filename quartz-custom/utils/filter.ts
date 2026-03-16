import { QuartzPluginData } from "../../quartz/plugins/vfile"
import { FileTrieNode } from "../../quartz/util/fileTrie"

export const gardenFilter = (file: QuartzPluginData) => {
  const tags = file.frontmatter?.tags
  return Array.isArray(tags) && tags.includes('garden')
}

export const blogFilter = (file: QuartzPluginData) => {
  const tags = file.frontmatter?.tags
  return Array.isArray(tags) && tags.includes('blog')
}

export const topicFilter = (fileNode: FileTrieNode) => {
  // Фильтр для проводника - можно исключать целые папки
  // Например, чтобы скрыть папку "private":
  // return !fileNode.name?.includes('private')
  return true
}

// Утилита для проверки наличия тега
export const hasTag = (file: QuartzPluginData, tag: string): boolean => {
  const tags = file.frontmatter?.tags
  return Array.isArray(tags) && tags.includes(tag)
}

// Фильтр для исключения из проводника
export const explorerFilter = (node: FileTrieNode): boolean => {
  const hasExcludedTag = node.data?.frontmatter?.tags?.includes("explorer-exclude") === true
  return !hasExcludedTag
}

// Фильтр для графа
export const graphFilter = (file: QuartzPluginData): boolean => {
  return !hasTag(file, 'graph-exclude')
}