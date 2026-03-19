import { QuartzTransformerPlugin } from "../types"
import { Root } from "mdast"
import { visit } from "unist-util-visit"

export const ImageCaption: QuartzTransformerPlugin = () => {
  return {
    name: "ImageCaption",
    markdownPlugins() {
      return [
        () => (tree: Root) => {
          // Ищем параграфы, где есть изображение и другой текст
          visit(tree, "paragraph", (node: any, index: number) => {
            const imageIndex = node.children.findIndex(
              (child: any) => child.type === "image"
            )
            
            // Если есть изображение и после него есть текст
            if (imageIndex !== -1 && node.children.length > imageIndex + 1) {
              const image = node.children[imageIndex]
              const altText = image.alt || ""
              
              // Собираем текст после изображения
              const captionParts = node.children.slice(imageIndex + 1)
              const captionHtml = captionParts.map((part: any) => {
                if (part.type === "text") return part.value
                if (part.type === "break") return "<br>"
                return ""
              }).join('')
              
              // Создаём figure с подписью
              const figure = {
                type: "html",
                value: `<figure class="image-with-caption">
  <img src="${image.url}" alt="${altText}" class="img-zoom">
  <figcaption>${captionHtml}</figcaption>
</figure>`
              }
              
              // Заменяем весь параграф на figure
              tree.children.splice(index, 1, figure)
            }
          })
        }
      ]
    }
  }
}