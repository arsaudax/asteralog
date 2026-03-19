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
          visit(tree, "paragraph", (node: any, index: number) => {
            const hasImage = node.children?.some(
              (child: any) => child.type === "image"
            )
            
            if (hasImage) {
              images.push({
                node,
                index
              })
            }
          })

          // Обрабатываем каждое изображение справа налево (чтобы не сбивать индексы)
          images.reverse().forEach(({ node, index }) => {
            const image = node.children.find((c: any) => c.type === "image")
            if (!image) return
            
            const altText = image.alt || ""
            
            // Смотрим, что идёт после этого параграфа
            const nextNode = tree.children[index + 1]
            
            // Если следующий узел существует и это параграф (и нет пустой строки)
            if (nextNode?.type === "paragraph") {
              // Проверяем, нет ли пустой строки между ними
              // В MDAST пустая строка создаёт отдельный параграф с одним символом
              const isWhitespace = nextNode.children?.length === 1 && 
                                   nextNode.children[0].value === ''
              
              if (!isWhitespace) {
                // Собираем текст подписи из следующего параграфа
                const captionLines: string[] = []
                
                nextNode.children.forEach((child: any) => {
                  if (child.type === "text") {
                    captionLines.push(child.value)
                  } else if (child.type === "break") {
                    captionLines.push("<br>")
                  }
                })
                
                const captionHtml = captionLines.join('')
                
                // Создаём figure
                const figure = {
                  type: "html",
                  value: `<figure class="image-with-caption">
  <img src="${image.url}" alt="${altText}" class="img-zoom">
  <figcaption>${captionHtml}</figcaption>
</figure>`
                }
                
                // Заменяем оба параграфа (изображение и подпись) на figure
                tree.children.splice(index, 2, figure)
              }
            }
          })
        }
      ]
    }
  }
}