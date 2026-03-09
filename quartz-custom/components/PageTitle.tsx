import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { classNames } from "../../quartz/util/lang"

interface Options {
  logo?: string
  logoAlt?: string
  title?: string
}

export default ((opts?: Options) => {
  const PageTitle: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const logo = opts?.logo
    const logoAlt = opts?.logoAlt ?? "Логотип"
    const customTitle = opts?.title
    
    const siteType = typeof process !== 'undefined' 
      ? (process.env?.BASE_URL?.includes('blog') ? 'blog' : 'garden')
      : 'garden'
    
    const defaultTitle = siteType === 'blog' ? "Carduus camporum" : "Asteralog"
    const pageTitle = customTitle ?? defaultTitle
    const showLogo = siteType === 'blog' && logo  // ← Логотип ТОЛЬКО в блоге
    
    return (
      <h2 class={classNames(displayClass, "page-title")}>
        {showLogo && (
          <img 
            src={logo} 
            alt={logoAlt} 
            class="page-logo"
            loading="eager"
          />
        )}
        <a href="." class="page-title-link">{pageTitle}</a>
      </h2>
    )
  }

  PageTitle.css = `
  .page-title {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 0 0 var(--spacing-lg) 0;
    text-align: left;
  }
  
  .page-logo {
    width: 120px;              /* ← УМЕНЬШЕНО до 120px */
    height: 120px;
    object-fit: cover;          /* ← cover для круга (обрезает по краям) */
    margin-bottom: 12px;
    border-radius: 50%;         /* ← КРУГ */
    transition: transform var(--transition-fast);
    border: 2px solid var(--border-color); /* ← тонкая рамка */
  }
  
  .page-logo:hover {
    transform: scale(1.02);
    border-color: var(--link-color);
  }
  
  .page-title-link {
    font-size: 24px;
    font-weight: 600;
    color: var(--link-color);
    text-decoration: none;
    transition: color var(--transition-fast);
  }
  
  .page-title-link:hover {
    color: var(--link-hover);
  }
  
  @media (max-width: 768px) {
    .page-logo {
      width: 100px;              /* 120 * 0.83 */
      height: 100px;
      margin-bottom: 10px;
    }
    
    .page-title-link {
      font-size: 20px;
    }
  }
  
  @media (max-width: 500px) {
    .page-logo {
      width: 80px;               /* 120 * 0.66 */
      height: 80px;
      margin-bottom: 8px;
    }
    
    .page-title-link {
      font-size: 18px;
    }
  }
  `

  return PageTitle
}) satisfies QuartzComponentConstructor