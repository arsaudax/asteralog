import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../types"

import { QuartzPluginData } from "../../plugins/vfile"
import { Date, getDate } from "../Date"

interface Options {
  limit?: number
}

export default ((opts?: Options) => {
  const BlogIndex: QuartzComponent = ({
    allFiles,
    cfg,
    displayClass,
  }: QuartzComponentProps) => {
    const limit = opts?.limit ?? 100

    let files = allFiles.filter((file) => {
      if (!file.slug) return false
      if (file.slug === "index") return false
      if (file.slug === "archive") return false
      return true
    })

    files.sort((a, b) => {
      const aDate = getDate(cfg, a) ?? new Date(0)
      const bDate = getDate(cfg, b) ?? new Date(0)

      return bDate.getTime() - aDate.getTime()
    })

    files = files.slice(0, limit)

    return (
      <div class={displayClass}>
        {files.map((file) => {
          const title =
            file.frontmatter?.title ?? file.slug ?? "Без названия"

          const date = getDate(cfg, file)

          return (
            <article class="blog-index-item" key={file.slug}>
              <h2>
                <a href={`/${file.slug}`} class="internal">
                  {title}
                </a>
              </h2>

              {date && (
                <div class="blog-index-date">
                  <Date date={date} locale={cfg.locale} />
                </div>
              )}
            </article>
          )
        })}
      </div>
    )
  }

  return BlogIndex
}) satisfies QuartzComponentConstructor