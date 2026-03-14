// quartz-custom/components/ContentMeta.tsx
import { QuartzComponent, QuartzComponentConstructor } from "../../quartz/components/types"
import { Date, getDate } from "../../quartz/components/Date"

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