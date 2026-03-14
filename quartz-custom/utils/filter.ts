import { QuartzPluginData } from "../../quartz/plugins/vfile"

export const gardenFilter = (_file: QuartzPluginData): boolean => {
  return true
}

export const blogFilter = (_file: QuartzPluginData): boolean => {
  return true
}

export const hasTag = (file: QuartzPluginData, tag: string): boolean => {
  const tags = file.frontmatter?.tags
  return Array.isArray(tags) && tags.includes(tag)
}

export const isDraft = (file: QuartzPluginData): boolean => {
  if (hasTag(file, "draft")) return true
  return file.slug?.includes("/drafts/") ?? false
}