import { QuartzTransformerPlugin } from "../types"
import { Root } from "mdast"
import { visit } from "unist-util-visit"
export const ImageCaption: QuartzTransformerPlugin = () => {
  return {
    name: "ImageCaption",
    markdownPlugins() {
      return [
        () => (tree: Root) => {
          const images: any[] = []
          
          // Находим все параграфы с изображениями
          visit(tree, "paragraph", (node: any) => {
            // Ищем изображения в параграфе
            const hasImage = node.children?.some(
              (child: any) => child.type === "image"
            )
            
            if (hasImage) {
              images.push({
                node,
                index: tree.children.indexOf(node)
              })
            }
          })
          // Обрабатываем каждое изображение
          images.forEach(({ node, index }) => {
            const image = node.children.find((c: any) => c.type === "image")
            if (!image) return
            
            // Собираем текст из изображения (alt)
            const altText = image.alt || ""
            
            // Ищем следующие параграфы (это будет подпись)
            let captionText = ""
            let captionLength = 0
            
            for (let i = index + 1; i < tree.children.length; i++) {
              const nextNode = tree.children[i]
              if (nextNode.type !== "paragraph") break
              
              // Проверяем, не содержит ли следующий параграф изображение
              const hasImage = nextNode.children?.some(
                (child: any) => child.type === "image"
              )
              if (hasImage) break
              
              // Собираем текст подписи
              const text = nextNode.children
                ?.map((c: any) => c.value || "")
                .join(" ")
                .trim()
              
              if (text) {
                captionText += (captionText ? "<br>" : "") + text
                captionLength++
              } else {
                break
              }
            }
            
            // Создаём figure с подписью
            const figure = {
              type: "html",
              value: `<figure class="image-with-caption">
  <img src="${image.url}" alt="${altText}" class="img-zoom">
  <figcaption>${captionText || altText}</figcaption>
</figure>`
            }
            
            // Удаляем изображение и все параграфы подписи
            tree.children.splice(index, 1 + captionLength, figure)
          })
        }
      ]
    }
  }
}