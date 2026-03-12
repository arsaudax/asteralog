// quartz-custom/plugins/emitters/customStyles.ts
import { FullSlug, joinSegments } from "../../../quartz/util/path"
import { QuartzEmitterPlugin } from "../../../quartz/plugins/types"
import { BuildCtx } from "../../../quartz/util/ctx"
import { Features, transform } from "lightningcss"
import fs from "fs/promises"
import path from "path"

// Своя функция записи файла
async function writeFile(ctx: BuildCtx, slug: FullSlug, ext: string, content: string) {
  const filePath = path.join(ctx.argv.output, slug + ext)
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, content)
  return filePath
}

// Импортируем стили с обработкой ошибок
let customStyles = ""
try {
  // Читаем файл напрямую
  const stylePath = path.join(__dirname, "../../styles/custom.scss")
  customStyles = await fs.readFile(stylePath, "utf-8")
  console.log(`📖 Read custom styles from ${stylePath}`)
} catch (error) {
  console.warn("⚠️ Custom styles not found, using empty styles")
  customStyles = "/* No custom styles */"
}

export const CustomStyles: QuartzEmitterPlugin = () => {
  return {
    name: "CustomStyles",
    async *emit(ctx: BuildCtx, _content, _resources) {
      // Если нет стилей, ничего не эмитируем
      if (!customStyles || customStyles === "/* No custom styles */") {
        console.log("ℹ️ No custom styles to emit")
        return
      }

      try {
        console.log("🎨 Processing custom styles...")
        
        // Transform and minify the custom SCSS
        const transformedStyles = transform({
          filename: "custom.css",
          code: Buffer.from(customStyles),
          minify: true,
          targets: {
            safari: (15 << 16) | (6 << 8),
            ios_saf: (15 << 16) | (6 << 8),
            edge: 115 << 16,
            firefox: 102 << 16,
            chrome: 109 << 16,
          },
          include: Features.MediaQueries | Features.Nesting,
        })

        // Сохраняем обработанный CSS
        const outputPath = await writeFile(
          ctx, 
          "custom" as FullSlug, 
          ".css", 
          transformedStyles.code.toString()
        )
        
        console.log(`✅ Custom styles emitted to ${outputPath}`)
        yield outputPath
      } catch (error) {
        console.error("❌ Error processing custom styles:", error)
        
        // Fallback: сохраняем исходные стили без обработки
        console.log("ℹ️ Emitting raw styles as fallback")
        const outputPath = await writeFile(
          ctx,
          "custom" as FullSlug,
          ".css",
          customStyles
        )
        console.log(`⚠️ Raw styles saved to ${outputPath}`)
        yield outputPath
      }
    },
    
    async *partialEmit() {
      // Не используется для этого плагина
    },
    
    externalResources: () => {
      return {
        css: [
          {
            content: "/custom.css",
          },
        ],
      }
    },
  }
}