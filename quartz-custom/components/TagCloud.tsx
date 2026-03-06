import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { classNames } from "../../quartz/util/lang"
import style from "./styles/tagCloud.scss"

interface TagCount {
  tag: string
  count: number
}

const TagCloud: QuartzComponent = ({ cfg, fileData, allFiles, displayClass }: QuartzComponentProps) => {
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
  
  // Сортируем теги по частоте (от самых популярных)
  const sortedTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }))
  
  if (sortedTags.length === 0) {
    return null
  }
  
  // Находим максимальное количество для масштабирования
  const maxCount = Math.max(...sortedTags.map(t => t.count))
  
  return (
    <div class={classNames(displayClass, "tag-cloud")}>
      <h3>🏷️ Облако тегов</h3>
      <div class="tag-cloud-content">
        {sortedTags.map(({ tag, count }) => {
          // Размер шрифта от 0.9rem до 2rem в зависимости от популярности
          const size = 0.9 + (count / maxCount) * 1.1
          // Прозрачность от 0.7 до 1
          const opacity = 0.7 + (count / maxCount) * 0.3
          
          return (
            <a
              href={`/tags/${tag}`}
              class="tag-cloud-item"
              data-count={count}
              style={{
                fontSize: `${size}rem`,
                opacity: opacity,
              }}
            >
              {tag}
              <span class="tag-count">{count}</span>
            </a>
          )
        })}
      </div>
    </div>
  )
}

TagCloud.css = style
export default (() => TagCloud) satisfies QuartzComponentConstructor