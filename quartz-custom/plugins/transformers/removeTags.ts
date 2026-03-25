import { QuartzTransformerPlugin } from "../../../quartz/plugins/types"

interface RemoveTagsOptions {
  tags: string[]
}

export const RemoveTags: QuartzTransformerPlugin<RemoveTagsOptions> = (options) => {
  return {
    name: "RemoveTags",
    markdownPlugins() {
      return [
        () => {
          return (_tree, file) => {
            // Проверяем наличие frontmatter
            if (file.data.frontmatter) {
              // Удаляем только служебные теги из массива tags
              if (file.data.frontmatter.tags && Array.isArray(file.data.frontmatter.tags)) {
                file.data.frontmatter.tags = file.data.frontmatter.tags.filter(
                  tag => !options?.tags?.includes(tag)
                )
                
                if (file.data.frontmatter.tags.length === 0) {
                  delete file.data.frontmatter.tags
                }
              }
              
              // Поле type НЕ удаляем — оно нужно для фильтрации
            }
          }
        },
      ]
    },
  }
}

declare module "vfile" {
  interface DataMap {
    wordcount: number
  }
}