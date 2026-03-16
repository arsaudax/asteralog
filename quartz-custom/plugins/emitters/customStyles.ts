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
      // Правильный путь: поднимаемся на два уровня вверх, затем в styles/
      const customCssPath = join(__dirname, "../../styles/custom.scss")
      
      try {
        const customCss = readFileSync(customCssPath, "utf-8")
        
        yield {
          slug: "custom",
          content: customCss,
          ext: ".css",
        }
      } catch (error) {
        console.error(`❌ Не удалось загрузить custom.scss по пути: ${customCssPath}`)
        throw error
      }
    },
    externalResources: () => ({
      css: [{ content: "/custom.css" }],
    }),
  }
}