import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { QuartzPluginData } from "../../quartz/plugins/vfile"
import { Date, getDate } from "../../quartz/components/Date"
import { classNames } from "../../quartz/util/lang"

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

    // 🔍 ОТЛАДКА - расширенная
    console.log("=== BlogIndex Debug ===")
    console.log("Component mounted on page:", window?.location?.pathname || "unknown")
    console.log("Total files:", allFiles.length)
    console.log("Files:", JSON.stringify(allFiles.map(f => ({
      slug: f.slug,
      title: f.frontmatter?.title,
      date: f.frontmatter?.date,
      tags: f.frontmatter?.tags,
      hasValidDate: !!getDate(cfg, f)
    })), null, 2))

    // Фильтруем файлы
    let files = allFiles.filter(file => {
      const passed = filter(file)
      console.log(`File ${file.slug}: filter=${passed}, tags=${file.frontmatter?.tags?.join(',')}, date=${file.frontmatter?.date || 'undefined'}`)
      return passed
    })
    
    console.log("After filter:", files.length, "files")

    // Сортируем по дате (новые сверху)
    files.sort((a, b) => {
      const aDate = getDate(cfg, a) ?? new Date(0)
      const bDate = getDate(cfg, b) ?? new Date(0)
      console.log(`Sort: ${a.slug} (${aDate.toISOString()}) vs ${b.slug} (${bDate.toISOString()}) → ${bDate > aDate ? 'b newer' : 'a newer'}`)
      return bDate.getTime() - aDate.getTime()
    })

    // Ограничиваем количество
    files = files.slice(0, limit)

    console.log("Final files:", files.map(f => f.slug))
    console.log("=== End Debug ===\n")

    if (files.length === 0) {
      return (
        <div class={classNames(displayClass, "blog-index", "blog-index--empty")}>
          <p class="blog-index-empty">Пока нет записей в блоге.</p>
        </div>
      )
    }

    return (
      <div class={classNames(displayClass, "blog-index")}>
        <div class="blog-index-list">
          {files.map((file) => {
            const title = file.frontmatter?.title || file.slug || "Без названия"
            const date = getDate(cfg, file)
            const description = file.frontmatter?.description || file.description || ""
            const tags = file.frontmatter?.tags || []
            const slug = file.slug || ""
            
            return (
              <article class="blog-index-item" key={slug}>
                <a href={slug} class="internal blog-index-link">
                  <h2 class="blog-index-title">{title}</h2>
                  
                  {showDate && date && (
                    <div class="blog-index-date">
                      <Date date={date} locale={cfg.locale} />
                    </div>
                  )}
                  
                  {showDescription && description && (
                    <p class="blog-index-description">{description}</p>
                  )}
                  
                  {showTags && tags.length > 0 && (
                    <div class="blog-index-tags">
                      {tags.map(tag => (
                        <span key={tag} class="blog-index-tag">{tag}</span>
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

  // Стили вынесены в отдельный SCSS файл
  BlogIndex.css = `
  /* Стили будут загружены из blogIndex.scss */
  `

  return BlogIndex
}) satisfies QuartzComponentConstructor