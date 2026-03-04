import { QuartzPluginData } from "../../quartz/plugins/vfile"

export const gardenFilter = (file: QuartzPluginData) => {
  const tags = file.frontmatter?.tags
  return Array.isArray(tags) && tags.includes('garden')
}

export const blogFilter = (file: QuartzPluginData) => {
  const tags = file.frontmatter?.tags
  return Array.isArray(tags) && tags.includes('blog')
}