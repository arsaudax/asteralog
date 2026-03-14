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
  // Можно добавить логику исключения папок
  return true
}