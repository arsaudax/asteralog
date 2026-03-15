import { QuartzTransformerPlugin } from "../../../quartz/plugins/types"
import { Root as HtmlRoot } from "hast"
import { visit } from "unist-util-visit"
import { JSResource, CSSResource } from "../../../quartz/util/resources"

// @ts-ignore - динамические импорты для inline ресурсов
import imgZoomScript from "../../components/scripts/img-zoom.inline.ts"
// @ts-ignore - SCSS модули
import imgZoomStyle from "../../components/styles/image-zoom.inline.scss"
// @ts-ignore - SCSS модули
import imgGridStyle from "../../components/styles/image-grid.inline.scss"

export const Img: QuartzTransformerPlugin = () => ({
  name: "ImgZoom",
  
  htmlPlugins() {
    return [
      () => (tree: HtmlRoot, file: any) => {
        visit(tree, "element", (node) => {
          if (node.tagName === "img") {
            // Получаем cssclasses из frontmatter
            const frontmatter = file.data.frontmatter
            const cssClasses = frontmatter?.cssclasses || []
            
            // Добавляем класс img-zoom если указано в frontmatter
            if (Array.isArray(cssClasses) && cssClasses.includes("img-zoom")) {
              node.properties = node.properties || {}
              
              // Безопасно добавляем класс к существующим
              const existingClass = node.properties.className
              if (existingClass) {
                node.properties.className = Array.isArray(existingClass) 
                  ? [...existingClass, "img-zoom"]
                  : [existingClass, "img-zoom"]
              } else {
                node.properties.className = ["img-zoom"]
              }
            }
          }
        })
      },
    ]
  },

  externalResources() {
    const js: JSResource[] = []
    const css: CSSResource[] = []

    // Добавляем скрипт для зумирования
    if (imgZoomScript) {
      js.push({
        script: imgZoomScript,
        loadTime: "afterDOMReady",
        contentType: "inline",
      })
    }

    // Добавляем стили для зумирования
    if (imgZoomStyle) {
      css.push({
        content: imgZoomStyle,
        inline: true,
      })
    }

    // Добавляем стили для сеток изображений
    if (imgGridStyle) {
      css.push({
        content: imgGridStyle,
        inline: true,
      })
    }

    return { js, css }
  },
})