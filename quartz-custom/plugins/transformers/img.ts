import { QuartzTransformerPlugin } from "../../../quartz/plugins/types"
import { Root as HtmlRoot } from "hast"
import { visit } from "unist-util-visit"
import { JSResource, CSSResource } from "../../../quartz/util/resources"

// @ts-ignore - динамические импорты
import imgZoomScript from "../../scripts/img-zoom.inline.ts"  // ← ИЗМЕНЁННЫЙ ПУТЬ
import imgZoomStyle from "../../components/styles/image-zoom.inline.scss"
import imgGridStyle from "../../components/styles/image-grid.inline.scss"

export const Img: QuartzTransformerPlugin = () => ({
  name: "ImgZoom",
  
  htmlPlugins() {
    return [
      () => (tree: HtmlRoot, file: any) => {
        visit(tree, "element", (node) => {
          if (node.tagName === "img") {
            const frontmatter = file.data.frontmatter
            const cssClasses = frontmatter?.cssclasses || []
            
            if (Array.isArray(cssClasses) && cssClasses.includes("img-zoom")) {
              node.properties = node.properties || {}
              
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

    if (imgZoomScript) {
      js.push({
        script: imgZoomScript,
        loadTime: "afterDOMReady",
        contentType: "inline",
      })
    }

    if (imgZoomStyle) {
      css.push({
        content: imgZoomStyle,
        inline: true,
      })
    }

    if (imgGridStyle) {
      css.push({
        content: imgGridStyle,
        inline: true,
      })
    }

    return { js, css }
  },
})