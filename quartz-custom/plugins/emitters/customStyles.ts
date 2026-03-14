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
      // Собираем ВСЕ стили
      let allStyles = ""
      try {
        const rootDir = process.cwd()
        
        // Читаем все три файла
        const variablesPath = path.join(rootDir, "quartz-custom/styles/_variables.scss")
        const overridesPath = path.join(rootDir, "quartz-custom/styles/_overrides.scss")
        const customPath = path.join(rootDir, "quartz-custom/styles/custom.scss")
        
        console.log(`🔍 Reading styles from:`)
        console.log(`   - ${variablesPath}`)
        console.log(`   - ${overridesPath}`)
        console.log(`   - ${customPath}`)
        
        // Проверяем существование файлов
        await fs.access(variablesPath)
        await fs.access(overridesPath)
        await fs.access(customPath)
        
        // Читаем содержимое
        const variables = await fs.readFile(variablesPath, "utf-8")
        const overrides = await fs.readFile(overridesPath, "utf-8")
        const custom = await fs.readFile(customPath, "utf-8")
        
        // Удаляем директивы @use (они не нужны в финальном CSS)
        const cleanVariables = variables.replace(/@use .*;/g, '')
        const cleanOverrides = overrides.replace(/@use .*;/g, '')
        const cleanCustom = custom.replace(/@use .*;/g, '')
        
        // Объединяем все стили
        allStyles = [
          "/* ===== USER VARIABLES ===== */",
          cleanVariables,
          "/* ===== QUARTZ OVERRIDES ===== */",
          cleanOverrides,
          "/* ===== CUSTOM STYLES ===== */",
          cleanCustom
        ].join('\n\n')
        
        console.log(`✅ Loaded total styles: ${allStyles.length} bytes`)
      } catch (error) {
        console.warn(`⚠️ Error loading styles: ${error.message}`)
        console.log("ℹ️ No custom styles to emit")
        return
      }

      try {
        console.log("🎨 Processing styles with lightningcss...")
        
        const transformedStyles = transform({
          filename: "custom.css",
          code: Buffer.from(allStyles),
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
        
        // Важно: добавляем ресурс в сборку
        if (!ctx.resources) ctx.resources = { css: [], js: [], additionalHead: [] }
        if (!ctx.resources.css) ctx.resources.css = []
        ctx.resources.css.push({ content: "/custom.css" })
        
        yield outputPath
      } catch (error) {
        console.error("❌ Error processing custom styles:", error)
        
        // Fallback: сохраняем исходные стили как есть
        const outputPath = await writeFile(
          ctx,
          "custom" as FullSlug,
          ".css",
          allStyles
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