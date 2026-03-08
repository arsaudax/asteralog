import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { classNames } from "../../quartz/util/lang"

// Стили импортируются из отдельного файла
import style from "./styles/tagList.scss"

interface Options {
  title?: string
  showCount?: boolean
  limit?: number
}

export default ((opts?: Options) => {
  const TagList: QuartzComponent = ({ allFiles, displayClass, cfg }: QuartzComponentProps) => {
    const title = opts?.title ?? "Все теги"
    const showCount = opts?.showCount ?? true
    const limit = opts?.limit ?? 0

    // Собираем все теги и их количество
    const tagCounts = new Map<string, number>()
    allFiles.forEach(file => {
      const tags = file.frontmatter?.tags
      if (Array.isArray(tags)) {
        tags.forEach(tag => {
          // Исключаем служебные теги
          if (!['garden', 'blog', 'explorer-exclude', 'graph-exclude'].includes(tag)) {
            tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
          }
        })
      }
    })

    // Сортируем теги по количеству (от самых популярных)
    const sortedTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit || undefined)

    if (sortedTags.length === 0) {
      return null
    }

    return (
      <div class={classNames(displayClass, "tag-list")}>
        <h3>{title}</h3>
        <div class="tag-list-content">
          {sortedTags.map(([tag, count]) => (
            <a 
              href={`/tags/${tag}`} 
              class="tag-list-item"
              data-tag={tag}
              key={tag}
            >
              {tag}
              {showCount && <span class="tag-count">{count}</span>}
            </a>
          ))}
        </div>
      </div>
    )
  }

  TagList.css = style
  return TagList
}) satisfies QuartzComponentConstructor