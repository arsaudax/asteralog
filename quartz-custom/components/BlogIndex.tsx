import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { QuartzPluginData } from "../../quartz/plugins/vfile"
import { Date, getDate } from "../../quartz/components/Date"
import { classNames } from "../../quartz/util/lang"

interface Options {
  limit?: number
  filter?: (file: QuartzPluginData) => boolean
}

export default ((opts?: Options) => {
  const BlogIndex: QuartzComponent = ({ allFiles, displayClass, cfg }: QuartzComponentProps) => {
    const limit = opts?.limit ?? 100
    const filter = opts?.filter ?? (() => true)

    // Фильтруем файлы
    let files = allFiles.filter(filter)
    
    // Сортируем по дате (новые сверху)
    files.sort((a, b) => {
      const aDate = getDate(cfg, a) ?? new Date(0)
      const bDate = getDate(cfg, b) ?? new Date(0)
      return bDate.getTime() - aDate.getTime()
    })

    // Ограничиваем количество
    files = files.slice(0, limit)

    if (files.length === 0) {
      return <div class={classNames(displayClass, "blog-index")}>
        <p>Пока нет записей в блоге.</p>
      </div>
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
              <article class="blog-index-item">
                <a href={slug} class="internal blog-index-link">
                  <h2 class="blog-index-title">{title}</h2>
                  {date && (
                    <div class="blog-index-date">
                      <Date date={date} locale={cfg.locale} />
                    </div>
                  )}
                  {description && (
                    <p class="blog-index-description">{description}</p>
                  )}
                  {tags.length > 0 && (
                    <div class="blog-index-tags">
                      {tags.map(tag => (
                        <span class="blog-index-tag">{tag}</span>
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
  .blog-index-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  .blog-index-item {
    border-bottom: 1px solid var(--lightgray);
    padding-bottom: 1.5rem;
  }
  .blog-index-item:last-child {
    border-bottom: none;
  }
  .blog-index-link {
    text-decoration: none;
    color: inherit;
    display: block;
    transition: transform 0.2s ease;
  }
  .blog-index-link:hover {
    transform: translateX(4px);
  }
  .blog-index-title {
    font-size: 1.5rem;
    margin: 0 0 0.5rem 0;
    color: var(--secondary);
  }
  .blog-index-date {
    font-size: 0.9rem;
    color: var(--gray);
    margin-bottom: 0.75rem;
  }
  .blog-index-description {
    color: var(--darkgray);
    margin: 0 0 0.75rem 0;
    line-height: 1.6;
  }
  .blog-index-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .blog-index-tag {
    font-size: 0.8rem;
    padding: 0.2rem 0.5rem;
    background: var(--highlight);
    border-radius: 4px;
    color: var(--secondary);
  }
  @media (max-width: 500px) {
    .blog-index-list {
      gap: 1.5rem;
    }
    .blog-index-title {
      font-size: 1.25rem;
    }
  }
  `

  return BlogIndex
}) satisfies QuartzComponentConstructor