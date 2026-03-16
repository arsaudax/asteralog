import { QuartzEmitterPlugin } from "../../../quartz/plugins/types"
import { readFileSync } from "fs"
import { join } from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const CustomStyles: QuartzEmitterPlugin = () => {
  return {
    name: "CustomStyles",
    async *emit(ctx) {
      const customCssPath = join(__dirname, "../../styles/custom.scss")
      const customCss = readFileSync(customCssPath, "utf-8")
      
      // Преобразуем SCSS в CSS (упрощённо, в реальности используется lightningcss)
      // В рабочей версии здесь трансформация, но для простоты оставим как есть
      
      yield {
        slug: "custom",
        content: customCss,
        ext: ".css",
      }
    },
    externalResources: () => ({
      css: [{ content: "/custom.css" }],
    }),
  }
}