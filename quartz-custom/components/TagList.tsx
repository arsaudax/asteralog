import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { classNames } from "../../quartz/util/lang"
import style from "./styles/tagList.scss"

interface TagCount {
  tag: string
  count: number
}

const TagList: QuartzComponent = ({ cfg, fileData, allFiles, displayClass }: QuartzComponentProps) => {
  // Служебные теги, которые нужно скрыть
  const excludeTags = new Set(['garden', 'blog', 'graph-exclude', 'explorer-exclude', 'backlinks-exclude', 'recents-exclude'])
  
  const tagCounts = new Map<string, number>()
  
  // Собираем все теги из всех файлов
  for (const file of allFiles) {
    const tags = file.frontmatter?.tags
    if (!Array.isArray(tags)) continue
    
    for (const tag of tags) {
      if (excludeTags.has(tag)) continue // Пропускаем служебные теги
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    }
  }
  
  // Сортируем теги по алфавиту
  const sortedTags = Array.from(tagCounts.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([tag, count]) => ({ tag, count }))
  
  if (sortedTags.length === 0) {
    return null
  }
  
  return (
    <div class={classNames(displayClass, "tag-list")}>
      <h3>📋 Все теги</h3>
      <div class="tag-list-content">
        {sortedTags.map(({ tag, count }) => (
          <a
            href={`/tags/${tag}`}
            class="tag-list-item"
          >
            {tag}
            <span class="tag-count">{count}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

TagList.css = style
export default (() => TagList) satisfies QuartzComponentConstructor