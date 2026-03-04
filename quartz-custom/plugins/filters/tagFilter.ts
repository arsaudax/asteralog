import { QuartzFilterPlugin } from "../../../quartz/plugins/types"

export const TagFilter = (tagName: string): QuartzFilterPlugin => () => {
  return {
    name: "TagFilter",
    shouldPublish({ file }) {
      const tags = file.data.frontmatter?.tags
      return Array.isArray(tags) && tags.includes(tagName)
    },
  }
}