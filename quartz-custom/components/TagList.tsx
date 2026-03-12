// quartz-custom/components/TagList.tsx
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { classNames } from "../../quartz/util/lang"
import { i18n } from "../../quartz/i18n"
import style from "./styles/TagList.scss"

interface Options {
  title?: string
  showCount?: boolean
  limit?: number
  minCount?: number // минимальное количество постов для показа тега
  sortBy?: "count" | "name" // сортировка
}

export default ((opts?: Options) => {
  const TagList: QuartzComponent = ({ allFiles, displayClass, cfg, fileData }: QuartzComponentProps) => {
    const title = opts?.title ?? i18n(cfg.locale).components.tagList?.title ?? "Все теги"
    const showCount = opts?.showCount ?? true
    const limit = opts?.limit ?? 0
    const minCount = opts?.minCount ?? 1
    const sortBy = opts?.sortBy ?? "count"
    
    // Получаем текущий тег из URL (если мы на странице тега)
    const currentTag = fileData.slug?.startsWith('tags/') 
      ? decodeURIComponent(fileData.slug.replace('tags/', ''))
      : null

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

    // Фильтруем по минимальному количеству
    const filteredTags = Array.from(tagCounts.entries())
      .filter(([_, count]) => count >= minCount)

    // Сортируем
    const sortedTags = filteredTags.sort((a, b) => {
      if (sortBy === "count") {
        return b[1] - a[1] // по убыванию популярности
      } else {
        return a[0].localeCompare(b[0]) // по алфавиту
      }
    }).slice(0, limit || undefined)

    if (sortedTags.length === 0) {
      return null
    }

    return (
      <div class={classNames(displayClass, "tag-list")}>
        <h3>
          <span class="tag-list-title">{title}</span>
          {limit > 0 && sortedTags.length >= limit && (
            <a href="/tags" class="tag-list-all">Все →</a>
          )}
        </h3>
        <div class="tag-list-content">
          {sortedTags.map(([tag, count]) => (
            <a 
              href={`/tags/${encodeURIComponent(tag)}`} 
              class={classNames("tag-list-item", { active: currentTag === tag })}
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