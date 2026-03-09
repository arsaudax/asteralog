import { QuartzTransformerPlugin } from "../../../quartz/plugins/types"
import { Root } from "mdast"
import { visit } from "unist-util-visit"
import YAML from "yaml"

interface ThemeFromFrontmatterOptions {
  defaultTheme?: "light" | "dark"
}

export const ThemeFromFrontmatter: QuartzTransformerPlugin<ThemeFromFrontmatterOptions> = (opts) => {
  const defaultTheme = opts?.defaultTheme ?? "dark"

  return {
    name: "ThemeFromFrontmatter",
    markdownPlugins() {
      return [
        () => {
          return (tree: Root, file) => {
            // Читаем frontmatter
            let frontmatter: any = {}
            visit(tree, "yaml", (node: any) => {
              frontmatter = YAML.parse(node.value)
            })

            // Если в frontmatter есть поле theme, сохраняем его
            if (frontmatter && frontmatter.theme) {
              const theme = frontmatter.theme === "light" ? "light" : "dark"
              file.data.frontmatter = file.data.frontmatter || {}
              file.data.frontmatter.theme = theme
              
              // Добавляем для отладки
              console.log(`🎨 Page ${file.data.slug} has theme: ${theme} (from frontmatter)`)
            } else {
              // Иначе используем тему по умолчанию
              file.data.frontmatter = file.data.frontmatter || {}
              file.data.frontmatter.theme = defaultTheme
            }
          }
        },
      ]
    },
  }
}