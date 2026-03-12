// quartz-custom/components/BlogIndex.tsx
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

    // Фильтруем файлы - исключаем index и archive
    let files = allFiles.filter(file => {
      const passed = filter(file)
      // Исключаем служебные страницы
      if (file.slug === 'index' || file.slug === 'archive') return false
      return passed
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
                    {tags.map((tag, index) => (
                      <span key={`${file.slug}-tag-${index}`} class="blog-index-tag">
                        {tag}
                      </span>
                    ))}
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
  .blog-index {
    margin: var(--spacing-lg) 0;
  }
  
  .blog-index--empty {
    padding: var(--spacing-xl);
    text-align: center;
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    border: 1px dashed var(--border-color);
  }
  
  .blog-index-empty {
    color: var(--text-muted);
    font-style: italic;
    margin: 0;
  }
  
  .blog-index-item {
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-xl);
    border-bottom: 1px solid var(--border-color);
  }
  
  .blog-index-item:last-child {
    border-bottom: none;
  }
  
  .blog-index-title {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-xs);
  }
  
  .blog-index-title a {
    color: var(--link-color);
    text-decoration: none;
  }
  
  .blog-index-title a:hover {
    color: var(--link-hover);
    text-decoration: underline;
  }
  
  .blog-index-date {
    color: var(--text-muted);
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-sm);
  }
  
  .blog-index-description {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-sm);
  }
  
  .blog-index-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }
  
  .blog-index-tag {
    font-size: var(--font-size-xs);
    padding: 0.2rem 0.5rem;
    background: var(--highlight);
    border-radius: var(--radius-sm);
    color: var(--link-color);
  }
  
  @media (max-width: 500px) {
    .blog-index-item {
      margin-bottom: var(--spacing-lg);
      padding-bottom: var(--spacing-lg);
    }
    
    .blog-index-title {
      font-size: var(--font-size-lg);
    }
  }
  `

  return BlogIndex
}) satisfies QuartzComponentConstructor