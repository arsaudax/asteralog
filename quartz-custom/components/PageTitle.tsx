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

  PageTitle.css = `
    .page-title a {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
    }
    
    .page-logo {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--border-color);
    }
    
    .page-title-text {
      font-size: 18px;
      font-weight: 600;
      color: var(--link-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `

  return PageTitle
}) satisfies QuartzComponentConstructor