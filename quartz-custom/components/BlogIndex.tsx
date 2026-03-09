import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { QuartzPluginData } from "../../quartz/plugins/vfile"
import { Date, getDate } from "../../quartz/components/Date"
import { classNames } from "../../quartz/util/lang"
import { resolveRelative } from "../../quartz/util/path"

interface Options {
  limit?: number
  filter?: (file: QuartzPluginData) => boolean
  showDescription?: boolean
  showTags?: boolean
  showDate?: boolean
}

export default ((opts?: Options) => {
  const BlogIndex: QuartzComponent = ({ allFiles, displayClass, cfg }: QuartzComponentProps) => {
    const limit = opts?.limit ?? 100
    const filter = opts?.filter ?? (() => true)
    const showDescription = opts?.showDescription ?? true
    const showTags = opts?.showTags ?? true
    const showDate = opts?.showDate ?? true

    // 🔍 ОТЛАДКА
    const isBrowser = typeof window !== 'undefined'
    
    if (process.env.NODE_ENV !== "production") {
      console.log("=== BlogIndex Debug ===")
      if (isBrowser) {
        console.log("📍 Page URL:", window.location.pathname)
      } else {
        console.log("📍 Component rendering in Node.js (build time)")
      }
      console.log("📍 Total files:", allFiles.length)
    }

    // Фильтруем файлы
    let files = allFiles.filter(file => {
      // Пользовательский фильтр
      const passed = filter(file)

      // Исключаем только index, но не archive для архива
      if (file.slug === 'index') return false
      return passed
    })

    // Сортировка по дате (новые сверху)
    files.sort((a, b) => {
      const aDate = getDate(cfg, a) ?? new Date(0)
      const bDate = getDate(cfg, b) ?? new Date(0)
      return bDate.getTime() - aDate.getTime()
    })

    // Ограничиваем количество
    files = files.slice(0, limit)

    if (process.env.NODE_ENV !== "production") {
      console.log("📍 Final files:", files.map(f => f.slug))
      console.log("=== End Debug ===\n")
    }

    if (files.length === 0) {
      return (
        <div class={classNames(displayClass, "blog-index", "blog-index--empty")}>
          <p class="blog-index-empty">Пока нет записей в блоге.</p>
        </div>
      )
    }

    return (
      <div 
        class={classNames(displayClass, "blog-index")} 
        style={{ border: "3px solid red", padding: "15px", margin: "15px 0" }}
      >
        {/* 🔍 Визуальная отладка */}
        <div style={{ background: "#ff0", color: "#000", padding: "5px", marginBottom: "10px", fontWeight: "bold" }}>
          🔴 BLOG INDEX RENDERED - Posts: {files.length}
        </div>

        <div class="blog-index-list">
          {files.map((file) => {
            const title = file.frontmatter?.title || file.slug || "Без названия"
            const date = getDate(cfg, file)
            const description = file.frontmatter?.description || file.description || ""
            const tags = file.frontmatter?.tags || []
            const url = resolveRelative(file.slug!, file.slug!)

            return (
              <article class="blog-index-item" key={file.slug} style={{ marginBottom: "15px", borderBottom: "1px solid #333" }}>
                <a href={url} class="internal blog-index-link" style={{ color: "#ab7d4c" }}>
                  <h2 class="blog-index-title">{title}</h2>
                  
                  {showDate && date && (
                    <div class="blog-index-date" style={{ color: "#a0a0a0" }}>
                      <Date date={date} locale={cfg.locale} />
                    </div>
                  )}
                  
                  {showDescription && description && (
                    <p class="blog-index-description" style={{ color: "#d4d4d4" }}>{description}</p>
                  )}
                  
                  {showTags && tags.length > 0 && (
                    <div class="blog-index-tags">
                      {tags.map(tag => (
                        <span key={tag} class="blog-index-tag" style={{ color: "#ab7d4c", border: "1px solid #333", padding: "2px 4px", marginRight: "4px" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </a>
              </article>
            )
          })}
        </div>
      </div>
    )
  }

  BlogIndex.css = `
  /* стили можно подключать через blogIndex.scss */
  `

  return BlogIndex
}) satisfies QuartzComponentConstructor