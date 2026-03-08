import { Date, getDate } from "../../quartz/components/Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import style from "./styles/contentMeta.scss"
import readingTime from "reading-time"
import { JSX } from "preact"
import { classNames } from "../../quartz/util/lang"

interface ContentMetaOptions {
  showReadingTime: boolean
  showComma: boolean
  showWordCount?: boolean
  showAuthor?: boolean
  showCategory?: boolean
  dateFormat?: "short" | "long" | "relative"
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
  showWordCount: false,
  showAuthor: false,
  showCategory: false,
  dateFormat: "long",
}

/**
 * Форматирует время чтения с эмодзи
 * Использует разные эмодзи в зависимости от длины
 */
function formatReadingTime(minutes: number, siteType?: string): string {
  const cups = Math.round(minutes / 3)
  
  // Разные эмодзи для сада и блога
  const emoji = siteType === 'blog' ? '📖' : '🌱'
  
  if (cups > 5) {
    // Для длинных текстов
    const bentos = Math.round(cups / Math.E)
    return `${new Array(bentos).fill("🍱").join("")} ${minutes} мин`
  } else if (cups > 2) {
    // Для средних текстов
    return `${new Array(cups).fill("☕️").join("")} ${minutes} мин`
  } else {
    // Для коротких текстов
    return `${emoji} ${minutes} мин`
  }
}

/**
 * Форматирует количество слов
 */
function formatWordCount(words: number): string {
  if (words < 1000) {
    return `${words} слов`
  } else {
    return `${(words / 1000).toFixed(1)}k слов`
  }
}

/**
 * Форматирует дату в относительном формате
 */
function formatRelativeDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return "сегодня"
  if (days === 1) return "вчера"
  if (days < 7) return `${days} дня назад`
  if (days < 30) return `${Math.floor(days / 7)} нед. назад`
  if (days < 365) return `${Math.floor(days / 30)} мес. назад`
  return `${Math.floor(days / 365)} г. назад`
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }
  
  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text
    if (!text) return null
    
    // Определяем тип сайта
    const siteType = typeof process !== 'undefined' 
      ? (process.env?.BASE_URL?.includes('blog') ? 'blog' : 'garden')
      : 'garden'
    
    const segments: (string | JSX.Element)[] = []

    // Дата создания
    if (fileData.dates?.created) {
      const createdDate = getDate(cfg, fileData)
      if (createdDate) {
        let dateDisplay: string | JSX.Element
        if (options.dateFormat === "relative") {
          dateDisplay = (
            <span title={createdDate.toLocaleDateString("ru-RU")}>
              {formatRelativeDate(createdDate)}
            </span>
          )
        } else {
          dateDisplay = <Date date={createdDate} locale={cfg.locale} />
        }
        segments.push(<span class="meta-created">{dateDisplay}</span>)
      }
    }

    // Время чтения и количество слов
    if (options.showReadingTime) {
      const { minutes, words } = readingTime(text)
      const readingTimeDisplay = formatReadingTime(Math.ceil(minutes), siteType)
      
      if (options.showWordCount) {
        segments.push(
          <span class="meta-reading">
            {readingTimeDisplay} · {formatWordCount(words)}
          </span>
        )
      } else {
        segments.push(<span class="meta-reading">{readingTimeDisplay}</span>)
      }
    }

    // Автор (из frontmatter)
    if (options.showAuthor && fileData.frontmatter?.author) {
      segments.push(
        <span class="meta-author">
          ✍️ {fileData.frontmatter.author}
        </span>
      )
    }

    // Категория (из frontmatter)
    if (options.showCategory && fileData.frontmatter?.category) {
      segments.push(
        <span class="meta-category">
          📁 {fileData.frontmatter.category}
        </span>
      )
    }

    return (
      <div 
        show-comma={options.showComma} 
        class={classNames(displayClass, "content-meta")}
        data-site-type={siteType}
        data-separator={options.showComma ? "comma" : "dot"}
      >
        {segments.map((segment, i) => (
          <span key={i} class="meta-item">{segment}</span>
        ))}
      </div>
    )
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor