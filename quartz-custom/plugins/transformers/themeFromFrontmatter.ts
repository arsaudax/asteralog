import { QuartzTransformerPlugin } from "../../../quartz/plugins/types"
import { Root } from "mdast"

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
            // Frontmatter уже распарсен плагином FrontMatter и доступен в file.data.frontmatter
            if (file.data.frontmatter && file.data.frontmatter.theme) {
              const theme = file.data.frontmatter.theme === "light" ? "light" : "dark"
              file.data.frontmatter.theme = theme
              
              // Для отладки (будет видно в логах сборки)
              console.log(`🎨 Page ${file.data.slug} has theme: ${theme} (from frontmatter)`)
            } else {
              // Если тема не указана, используем тему по умолчанию
              file.data.frontmatter = file.data.frontmatter || {}
              file.data.frontmatter.theme = defaultTheme
            }
          }
        },
      ]
    },
  }
}