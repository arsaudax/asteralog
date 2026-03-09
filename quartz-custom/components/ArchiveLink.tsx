import { QuartzComponent, QuartzComponentConstructor } from "../../quartz/components/types"
import { classNames } from "../../quartz/util/lang"

interface Options {
  sidebar?: boolean
  text?: string
}

export default ((opts?: Options) => {
  const ArchiveLink: QuartzComponent = ({ displayClass }) => {
    const classes = ["archive-link-container"]
    if (opts?.sidebar) classes.push("sidebar")
    
    const linkText = opts?.text ?? "📚 Все записи →"
    
    return (
      <div class={classNames(displayClass, ...classes)}>
        <a href="/archive" class="archive-link">{linkText}</a>
      </div>
    )
  }

  return ArchiveLink
}) satisfies QuartzComponentConstructor