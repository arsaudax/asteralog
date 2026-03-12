// quartz-custom/plugins/emitters/customStyles.ts
import { FullSlug } from "../../../quartz/util/path"
import { QuartzEmitterPlugin } from "../../../quartz/plugins/types"
import { BuildCtx } from "../../../quartz/util/ctx"
import { Features, transform } from "lightningcss"
import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function writeFile(ctx: BuildCtx, slug: FullSlug, ext: string, content: string) {
  const filePath = path.join(ctx.argv.output, slug + ext)
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, content)
  return filePath
}

export const customStyles: QuartzEmitterPlugin = () => {
  return {
    name: "CustomStyles",
    
    async *emit(ctx: BuildCtx, _content, _resources) {
      // Читаем файл стилей при каждой сборке
      let customStyles = ""
      try {
        // Поднимаемся из .../plugins/emitters/ на 3 уровня вверх
        // Это должно привести в корень проекта
        const rootDir = path.resolve(__dirname, "../../../")
        const stylePath = path.join(rootDir, "quartz-custom/styles/custom.scss")
        
        console.log(`🔍 Current __dirname: ${__dirname}`)
        console.log(`🔍 Resolved rootDir: ${rootDir}`)
        console.log(`🔍 Looking for styles at: ${stylePath}`)
        
        // Проверяем существование файла
        await fs.access(stylePath)
        console.log(`✅ File exists!`)
        
        customStyles = await fs.readFile(stylePath, "utf-8")
        console.log(`📖 Read custom styles (${customStyles.length} bytes)`)
      } catch (error) {
        console.warn(`⚠️ Custom styles not found: ${error.message}`)
        console.log("ℹ️ No custom styles to emit")
        return
      }

      try {
        console.log("🎨 Processing custom styles...")
        
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
    
    async *partialEmit() {},
    
    externalResources: () => ({
      css: [{ content: "/custom.css" }]
    }),
  }
}