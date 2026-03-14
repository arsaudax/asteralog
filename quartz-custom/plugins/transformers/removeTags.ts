// quartz-custom/plugins/transformers/removeTags.ts
import { QuartzTransformerPlugin } from "../../../quartz/plugins/types"

interface RemoveTagsOptions {
  tags: string[] // Массив служебных тегов для удаления
}

// Экспорт с маленькой буквы для консистентности с именем файла
export const removeTags: QuartzTransformerPlugin<RemoveTagsOptions> = (options) => {
  return {
    name: "RemoveTags",
    markdownPlugins() {
      return [
        () => {
          return (_tree, file) => {
            // Проверяем наличие frontmatter и тегов
            if (file.data.frontmatter?.tags && Array.isArray(file.data.frontmatter.tags)) {
              // Фильтруем только служебные теги, оставляем тематические
              file.data.frontmatter.tags = file.data.frontmatter.tags.filter(
                tag => !options?.tags?.includes(tag)
              )
              
              // Если после фильтрации массив пуст, удаляем поле tags
              if (file.data.frontmatter.tags.length === 0) {
                delete file.data.frontmatter.tags
              }
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