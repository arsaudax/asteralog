// quartz-custom/components/ArchiveLink.tsx
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { classNames } from "../../quartz/util/lang"
import style from "./styles/archiveLink.scss"

interface Options {
  sidebar?: boolean
  text?: string
  emoji?: "before" | "after" | "none"
  hideIfEmpty?: boolean
}

export default ((opts?: Options) => {
  const ArchiveLink: QuartzComponent = ({ displayClass, fileData, allFiles }: QuartzComponentProps) => {
    // Не показываем на служебных страницах
    const hideOnSlugs = ['archive', 'index', '404']
    if (hideOnSlugs.includes(fileData.slug || '')) return null
    
    // Проверка на наличие постов (если нужна)
    if (opts?.hideIfEmpty) {
      // Фильтруем файлы, которые должны быть в архиве
      const archiveFiles = allFiles.filter(file => {
        return file.slug && 
               file.type === "content" && 
               file.slug !== 'index' && 
               file.slug !== 'archive'
      })
      
      if (archiveFiles.length === 0) return null
    }
    
    const classes = ["archive-link-container"]
    if (opts?.sidebar) classes.push("archive-link-container--sidebar")
    
    const emoji = opts?.emoji ?? "after"
    const baseText = opts?.text ?? "Все записи"
    
    let linkText = baseText
    if (emoji === "before") linkText = `📚 ${baseText}`
    else if (emoji === "after") linkText = `${baseText} 📚`
    // else "none" — ничего не добавляем
    
    return (
      <div class={classNames(displayClass, ...classes)}>
        <a href="/archive" class="archive-link">
          {linkText}
          <span class="archive-arrow">→</span>
        </a>
      </div>
    )
  }

  ArchiveLink.css = style
  return ArchiveLink
}) satisfies QuartzComponentConstructor