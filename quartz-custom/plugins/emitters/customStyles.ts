// quartz-custom/plugins/CustomStyles.ts
import { FullSlug, joinSegments } from "../../quartz/util/path"
import { QuartzEmitterPlugin } from "../../quartz/plugins/types"
import { BuildCtx } from "../../quartz/util/ctx"
import { Features, transform } from "lightningcss"
import { write } from "../../quartz/plugins/emitters/helpers"

// Импортируем стили с обработкой ошибок
let customStyles = ""
try {
  // Динамический импорт для избежания ошибок при отсутствии файла
  customStyles = (await import("../../styles/custom.scss?raw")).default || ""
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
        // Transform and minify the custom SCSS
        const transformedStyles = transform({
          filename: "custom.css",
          code: Buffer.from(customStyles),
          minify: true,
          targets: {
            safari: (15 << 16) | (6 << 8), // 15.6
            ios_saf: (15 << 16) | (6 << 8), // 15.6
            edge: 115 << 16, // 115
            firefox: 102 << 16, // 102
            chrome: 109 << 16, // 109
          },
          include: Features.MediaQueries | Features.Nesting, // 🔥 Добавлена поддержка вложенности
        })

        // Emit the custom stylesheet
        yield write({
          ctx,
          slug: "custom" as FullSlug,
          ext: ".css",
          content: transformedStyles.code.toString(),
        })
        
        console.log("✅ Custom styles emitted successfully")
      } catch (error) {
        console.error("❌ Error processing custom styles:", error)
        
        // Fallback: эмитируем исходные стили без трансформации
        console.log("ℹ️ Emitting raw styles as fallback")
        yield write({
          ctx,
          slug: "custom" as FullSlug,
          ext: ".css",
          content: customStyles,
        })
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