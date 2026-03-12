// quartz-custom/components/ArchiveLink.tsx
import { QuartzComponent, QuartzComponentConstructor } from "../../quartz/components/types"
import { classNames } from "../../quartz/util/lang"
import style from "./styles/archiveLink.scss"

interface Options {
  sidebar?: boolean
  text?: string
  emoji?: "before" | "after" | "none"
  hideIfEmpty?: boolean // если на странице нет постов для архива
}

export default ((opts?: Options) => {
  const ArchiveLink: QuartzComponent = ({ displayClass, fileData }) => {
    const classes = ["archive-link-container"]
    if (opts?.sidebar) classes.push("sidebar")
    
    // Не показываем на странице архива
    if (fileData.slug === 'archive') return null
    
    // Не показываем, если включена опция hideIfEmpty
    // (нужна будет дополнительная логика для проверки наличия постов)
    if (opts?.hideIfEmpty) {
      // TODO: добавить проверку через allFiles
      // пока просто заглушка
    }
    
    const emoji = opts?.emoji ?? "after" // по умолчанию эмодзи после текста
    const baseText = opts?.text ?? "Все записи"
    
    let linkText = baseText
    if (emoji === "before") linkText = `${baseText} 📚`
    else if (emoji === "after") linkText = `${baseText} 📚`
    else linkText = baseText
    
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