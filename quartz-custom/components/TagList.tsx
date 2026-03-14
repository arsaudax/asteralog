import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../types"

import { classNames } from "../../util/lang"

interface Options {
  limit?: number
}

export default ((opts?: Options) => {
  const TagList: QuartzComponent = ({
    allFiles,
    displayClass,
  }: QuartzComponentProps) => {
    const limit = opts?.limit ?? 20

    const tagCounts = new Map<string, number>()

    allFiles.forEach((file) => {
      const tags = Array.isArray(file.frontmatter?.tags)
        ? file.frontmatter.tags
        : []

      tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
      })
    })

    const sorted = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)

    return (
      <div class={classNames(displayClass, "tag-list")}>
        {sorted.map(([tag, count]) => (
          <a
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            class="tag-list-item"
          >
            {tag} <span class="tag-count">{count}</span>
          </a>
        ))}
      </div>
    )
  }

  return TagList
}) satisfies QuartzComponentConstructor