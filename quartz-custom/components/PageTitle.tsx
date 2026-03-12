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
              onError={(e) => {
                // Если логотип не загрузился, скрываем его
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          )}
          <span class="page-title-text">{opts?.title || "Asteralog"}</span>
        </a>
      </div>
    )
  }

  return PageTitle
}) satisfies QuartzComponentConstructor