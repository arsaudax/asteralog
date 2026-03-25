import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { classNames } from "../../quartz/util/lang"

// Стили импортируются из отдельного файла
import style from "./styles/_tagList.scss"

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

    // Список служебных тегов, которые НЕ должны показываться читателям
    const hiddenTags = [
      // Основные теги публикации
      'garden', 'blog',
      // Навигация в саду
      'garden-explorer-exclude', 'garden-graph-exclude',
      // Навигация в блоге
      'blog-recents-exclude', 'blog-archive-exclude', 'blog-backlinks-exclude',
      // Общие служебные
      'search-exclude', 'draft',
      // Старые теги (для обратной совместимости)
      'explorer-exclude', 'graph-exclude', 'recents-exclude', 'backlinks-exclude'
    ]

    // Собираем все теги и их количество
    const tagCounts = new Map<string, number>()
    allFiles.forEach(file => {
      const tags = file.frontmatter?.tags
      if (Array.isArray(tags)) {
        tags.forEach(tag => {
          // Исключаем служебные теги (обновлённый список)
          if (!hiddenTags.includes(tag)) {
            tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
          }
        })
      }
    })

    // Сортируем теги по алфавиту (для удобства читателя)
    const sortedTags = Array.from(tagCounts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
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