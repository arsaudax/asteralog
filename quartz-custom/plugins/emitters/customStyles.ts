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
      // ПРАВИЛЬНЫЙ ПУТЬ: поднимаемся на 3 уровня до quartz-custom/, затем в styles/
      const customCssPath = join(__dirname, "../../../styles/custom.scss")
      
      console.log(`📁 Загрузка стилей из: ${customCssPath}`)
      
      try {
        const customCss = readFileSync(customCssPath, "utf-8")
        
        yield {
          slug: "custom",
          content: customCss,
          ext: ".css",
        }
      } catch (error) {
        console.error(`❌ Не удалось загрузить custom.scss по пути: ${customCssPath}`)
        console.error(`📁 Текущая директория: ${__dirname}`)
        
        // Попробуем найти файл для отладки
        const fs = require('fs')
        const findFile = (startPath: string) => {
          console.log(`🔍 Поиск в: ${startPath}`)
          if (fs.existsSync(startPath)) {
            const files = fs.readdirSync(startPath)
            console.log(`   Найдено: ${files.join(', ')}`)
          }
        }
        
        findFile(join(__dirname, "../../../"))
        findFile(join(__dirname, "../../../styles/"))
        
        throw error
      }
    },
    externalResources: () => ({
      css: [{ content: "/custom.css" }],
    }),
  }
}