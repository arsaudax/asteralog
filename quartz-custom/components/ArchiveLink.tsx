import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../types"

import { classNames } from "../../util/lang"
import style from "./styles/archiveLink.scss"

interface Options {
  sidebar?: boolean
  text?: string
}

export default ((opts?: Options) => {
  const ArchiveLink: QuartzComponent = ({
    displayClass,
    fileData,
  }: QuartzComponentProps) => {
    const slug = fileData.slug ?? ""

    if (slug === "" || slug === "index" || slug === "archive" || slug === "404") {
      return null
    }

    const classes = ["archive-link-container"]

    if (opts?.sidebar) {
      classes.push("archive-link-container--sidebar")
    }

    const text = opts?.text ?? "Все записи"

    return (
      <div class={classNames(displayClass, ...classes)}>
        <a href="/archive" class="archive-link">
          {text}
          <span class="archive-arrow">→</span>
        </a>
      </div>
    )
  }

  ArchiveLink.css = style

  return ArchiveLink
}) satisfies QuartzComponentConstructor