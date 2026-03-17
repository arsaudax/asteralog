import { QuartzComponent, QuartzComponentConstructor } from "../../quartz/components/types"
import { classNames } from "../../quartz/util/lang"

interface Options {
  sidebar?: boolean
  text?: string
  emoji?: "before" | "after" | "none"
}

export default ((opts?: Options) => {
  const ArchiveLink: QuartzComponent = ({ displayClass }) => {
    const classes = ["archive-link-container"]
    if (opts?.sidebar) classes.push("sidebar")
    
    const emoji = opts?.emoji ?? "none"
    const baseText = opts?.text ?? "Все записи"
    
    let linkText = baseText
    // Убираем стрелку из текста — она будет добавляться через CSS
    if (emoji === "before") linkText = `📚 ${baseText}`
    else if (emoji === "after") linkText = `${baseText} 📚`
    else linkText = baseText
    
    return (
      <div class={classNames(displayClass, ...classes)}>
        <a href="/archive" class="archive-link">{linkText}</a>
      </div>
    )
  }

  return ArchiveLink
}) satisfies QuartzComponentConstructor