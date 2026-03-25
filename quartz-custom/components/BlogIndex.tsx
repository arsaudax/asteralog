import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { QuartzPluginData } from "../../quartz/plugins/vfile"
import { Date, getDate } from "../../quartz/components/Date"
import { classNames } from "../../quartz/util/lang"
import { resolveRelative } from "../../quartz/util/path"
import { hasTag } from "../../quartz-custom/utils/filter"

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

    // Фильтруем файлы
    let files = allFiles.filter(file => {
      // Исключаем служебные страницы
      if (file.slug === 'index') return false
      if (file.slug === 'archive') return false
      
      // Применяем переданный фильтр
      const passed = filter(file)
      if (!passed) return false
      
      return true
    })

    // Сортируем по дате (новые сверху)
    files.sort((a, b) => {
      const aDate = getDate(cfg, a) ?? new Date(0)
      const bDate = getDate(cfg, b) ?? new Date(0)
      return bDate.getTime() - aDate.getTime()
    })

    // Ограничиваем количество
    files = files.slice(0, limit)

    if (files.length === 0) {
      return (
        <div class={classNames(displayClass, "blog-index", "blog-index--empty")}>
          <p class="blog-index-empty">Пока нет записей в блоге.</p>
        </div>
      )
    }

    return (
      <div class={classNames(displayClass, "blog-index")}>
        <div class="page-list">
          {files.map((file) => {
            const title = file.frontmatter?.title || file.slug || "Без названия"
            const date = getDate(cfg, file)
            const description = file.frontmatter?.description || file.description || ""
            const tags = file.frontmatter?.tags || []
            const url = resolveRelative(file.slug!, file.slug!)

            // Служебные теги для скрытия
            const hiddenTags = [
              'garden', 'blog',
              'garden-explorer-exclude', 'garden-graph-exclude',
              'blog-recents-exclude', 'blog-archive-exclude', 'blog-backlinks-exclude',
              'search-exclude', 'draft',
              'explorer-exclude', 'graph-exclude', 'recents-exclude', 'backlinks-exclude'
            ]

            return (
              <article class="blog-index-item" key={file.slug}>
                <h2 class="blog-index-title">
                  <a href={url} class="internal">
                    {title}
                  </a>
                </h2>
                
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
                    {tags.map(tag => {
                      if (hiddenTags.includes(tag)) return null
                      return <span key={tag} class="blog-index-tag">{tag}</span>
                    }).filter(Boolean)}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </div>
    )
  }

  BlogIndex.css = `
  /* стили из blogIndex.scss */
  `

  return BlogIndex
}) satisfies QuartzComponentConstructor