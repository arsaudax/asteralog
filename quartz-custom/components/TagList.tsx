import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { classNames } from "../../quartz/util/lang"
import style from "./styles/_tagList.scss"

interface Options {
  title?: string
  showCount?: boolean
  limit?: number
  currentPageOnly?: boolean  // ← НОВЫЙ ПАРАМЕТР
}

export default ((opts?: Options) => {
  const TagList: QuartzComponent = ({ allFiles, fileData, displayClass, cfg }: QuartzComponentProps) => {
    const title = opts?.title ?? "Все теги"
    const showCount = opts?.showCount ?? true
    const limit = opts?.limit ?? 0
    const currentPageOnly = opts?.currentPageOnly ?? false

    const hiddenTags = [
      'garden', 'blog',
      'garden-explorer-exclude', 'garden-graph-exclude',
      'blog-recents-exclude', 'blog-archive-exclude', 'blog-backlinks-exclude',
      'search-exclude', 'draft',
      'explorer-exclude', 'graph-exclude', 'recents-exclude', 'backlinks-exclude'
    ]

    const tagCounts = new Map<string, number>()

    // Определяем, какие файлы использовать
    const filesToProcess = currentPageOnly 
      ? [fileData]  // только текущая страница
      : allFiles    // все файлы

    filesToProcess.forEach(file => {
      const tags = file.frontmatter?.tags
      if (Array.isArray(tags)) {
        tags.forEach(tag => {
          if (!hiddenTags.includes(tag)) {
            tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
          }
        })
      }
    })

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