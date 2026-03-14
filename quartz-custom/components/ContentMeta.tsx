import { QuartzComponent, QuartzComponentConstructor } from "../types"
import { Date, getDate } from "../Date"

interface Options {
  showReadingTime?: boolean
}

export default ((opts?: Options) => {
  const ContentMeta: QuartzComponent = ({ cfg, fileData }) => {
    const date = getDate(cfg, fileData)

    return (
      <div class="content-meta">
        {date && (
          <span class="meta-item meta-created">
            <Date date={date} locale={cfg.locale} />
          </span>
        )}

        {opts?.showReadingTime && fileData.readingTime && (
          <span class="meta-item meta-reading">
            {Math.ceil(fileData.readingTime.minutes)} мин. чтения
          </span>
        )}
      </div>
    )
  }

  return ContentMeta
}) satisfies QuartzComponentConstructor