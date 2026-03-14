import { QuartzTransformerPlugin } from "../../../quartz/plugins/types"

interface Options {
  tags: string[]
}

export const removeTags: QuartzTransformerPlugin<Options> = (opts) => ({
  name: "RemoveTags",

  markdownPlugins() {
    return [
      () => {
        return (_tree, file) => {
          const tags = file.data.frontmatter?.tags

          if (!Array.isArray(tags)) return

          const filtered = tags.filter(
            (tag: string) => !opts?.tags?.includes(tag)
          )

          if (filtered.length === 0) {
            delete file.data.frontmatter.tags
          } else {
            file.data.frontmatter.tags = filtered
          }
        }
      },
    ]
  },
})