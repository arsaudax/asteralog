// quartz-custom/components/PageTitle.tsx
import { QuartzComponent, QuartzComponentConstructor } from "../../quartz/components/types"

interface Options {
  logo?: string
  logoAlt?: string
  title?: string
}

export default ((opts?: Options) => {
  const PageTitle: QuartzComponent = () => {
    return (
      <div class="page-title">
        <a href="/">
          {opts?.logo && (
            <img 
              src={opts.logo} 
              alt={opts.logoAlt || opts.title || "Logo"} 
              class="page-logo"
            />
          )}
          <span class="page-title-text">{opts?.title || "Asteralog"}</span>
        </a>
      </div>
    )
  }

  // Стили теперь только в custom.scss
  return PageTitle
}) satisfies QuartzComponentConstructor