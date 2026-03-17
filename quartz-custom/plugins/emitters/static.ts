import fs from "fs"
import { FilePath, joinSegments } from "../../../quartz/util/path"
import { QuartzEmitterPlugin } from "../../../quartz/plugins/types"
import { glob } from "../../../quartz/util/glob"
import { dirname } from "path"

const QUARTZ_CUSTOM = "quartz-custom"

export const Static: QuartzEmitterPlugin = () => ({
  name: "CustomStatic",
  async *emit({ argv, cfg }) {
    // Небольшая задержка для встроенного Static плагина
    await new Promise((resolve) => setTimeout(resolve, 100))

    const staticPath = joinSegments(QUARTZ_CUSTOM, "static")
    
    // Проверяем, существует ли директория static
    try {
      await fs.promises.access(staticPath)
    } catch {
      console.log("ℹ️ Custom static directory not found, skipping")
      return
    }

    try {
      // Получаем все файлы в static директории
      const fps = await glob("**", staticPath, cfg.configuration.ignorePatterns)
      
      if (fps.length === 0) {
        console.log("ℹ️ No custom static files found")
        return
      }

      console.log(`📦 Copying ${fps.length} custom static files...`)
      
      const outputStaticPath = joinSegments(argv.output, "static")
      await fs.promises.mkdir(outputStaticPath, { recursive: true })
      
      let copiedCount = 0
      for (const fp of fps) {
        const src = joinSegments(staticPath, fp) as FilePath
        const dest = joinSegments(outputStaticPath, fp) as FilePath
        
        try {
          await fs.promises.mkdir(dirname(dest), { recursive: true })
          await fs.promises.copyFile(src, dest)
          copiedCount++
          console.log(`  ✓ ${fp}`)
        } catch (error) {
          console.error(`  ❌ Error copying ${fp}:`, error.message)
        }
        
        yield dest
      }
      
      console.log(`✅ Custom static: ${copiedCount}/${fps.length} files copied`)
    } catch (error) {
      console.error("❌ Error processing custom static files:", error)
    }
  },
  async *partialEmit() {},
})