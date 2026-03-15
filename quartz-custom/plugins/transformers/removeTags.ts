import { QuartzTransformerPlugin } from "../../../quartz/plugins/types"

interface RemoveTagsOptions {
  tags: string[]
}

export const RemoveTags: QuartzTransformerPlugin<RemoveTagsOptions> = (options) => {
  return {
    name: "RemoveTags",
    markdownPlugins() {
      return [
        () => (_tree, file) => {
          if (file.data.frontmatter?.tags) {
            // Сохраняем только тематические теги, удаляем служебные
            file.data.frontmatter.tags = file.data.frontmatter.tags.filter(
              (tag: string) => !options?.tags.includes(tag)
            )
          }
        },
      ]
    },
  }
}