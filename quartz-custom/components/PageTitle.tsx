import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { classNames } from "../../quartz/util/lang"

interface Options {
  logo?: string
  logoAlt?: string
  logoSize?: {
    desktop?: number
    tablet?: number
    mobile?: number
  }
}

export default ((opts?: Options) => {
  const PageTitle: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const logo = opts?.logo
    const logoAlt = opts?.logoAlt ?? "Логотип"
    const siteType = typeof process !== 'undefined' 
      ? (process.env?.BASE_URL?.includes('blog') ? 'blog' : 'garden')
      : 'garden'
    
    // Безопасное получение заголовка
    const pageTitle = cfg?.configuration?.pageTitle ?? "Asteralog"
    
    // Показываем логотип только в блоге
    const showLogo = siteType === 'blog' && logo
    
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

  // Стили компонента с адаптивностью
  PageTitle.css = `
  .page-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 0 var(--spacing-lg) 0;
    text-align: center;
  }
  
  .page-logo {
    width: 96px;
    height: 96px;
    object-fit: contain;
    margin-bottom: 12px;
    border-radius: 0; /* квадрат */
    transition: transform var(--transition-fast);
  }
  
  .page-logo:hover {
    transform: scale(1.02);
  }
  
  .page-title-link {
    font-size: 24px;
    font-weight: 600;
    color: var(--text-primary);
    text-decoration: none;
    transition: color var(--transition-fast);
  }
  
  .page-title-link:hover {
    color: var(--link-color);
  }
  
  /* Планшеты */
  @media (max-width: 768px) {
    .page-logo {
      width: 80px;
      height: 80px;
      margin-bottom: 10px;
    }
    
    .page-title-link {
      font-size: 20px;
    }
  }
  
  /* Мобильные */
  @media (max-width: 500px) {
    .page-logo {
      width: 64px;
      height: 64px;
      margin-bottom: 8px;
    }
    
    .page-title-link {
      font-size: 18px;
    }
  }
  `

  return PageTitle
}) satisfies QuartzComponentConstructor