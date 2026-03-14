import { QuartzComponent, QuartzComponentConstructor } from "../types"

interface Options {
  logo?: string
  logoAlt?: string
  title?: string
}

export default ((opts?: Options) => {
  const PageTitle: QuartzComponent = ({ cfg }) => {
    const title = opts?.title ?? cfg.pageTitle ?? "Asteralog"

    return (
      <div class="page-title">
        <a href="/">
          {opts?.logo && (
            <img
              src={opts.logo}
              alt={opts.logoAlt ?? title}
              class="page-logo"
              width="56"
              height="56"
            />
          )}

          <span class="page-title-text">{title}</span>
        </a>
      </div>
    )
  }

  return PageTitle
}) satisfies QuartzComponentConstructor