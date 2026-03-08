import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { classNames } from "../../quartz/util/lang"
import style from "./styles/footer.scss"

interface Options {
  links?: Record<string, string>
  showCopyright?: boolean
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links || {}
    const showCopyright = opts?.showCopyright ?? true
    
    // Определяем тип сайта для ссылки на другой сайт
    const siteType = typeof process !== 'undefined' 
      ? (process.env?.BASE_URL?.includes('blog') ? 'blog' : 'garden')
      : 'garden'
    
    const otherSite = siteType === 'blog' ? 'garden' : 'blog'
    const otherSiteUrl = siteType === 'blog' 
      ? 'https://garden.asteralog.ru' 
      : 'https://blog.asteralog.ru'
    const otherSiteEmoji = siteType === 'blog' ? '🌱' : '📝'
    const otherSiteName = siteType === 'blog' ? 'Сад' : 'Блог'
    const siteEmoji = siteType === 'blog' ? '📝' : '🌱'
    
    return (
      <footer class={classNames(displayClass, "footer")}>
        <div class="footer-content">
          {/* Копирайт с эмодзи сайта */}
          {showCopyright && (
            <div class="footer-copyright">
              <span class="footer-emoji">{siteEmoji}</span>
              <span class="footer-text">
                Asteralog © {year}
              </span>
            </div>
          )}
          
          {/* Ссылки */}
          <ul class="footer-links">
            {/* Ссылка на другой сайт (сад/блог) */}
            <li class="footer-link-item">
              <a 
                href={otherSiteUrl} 
                class="footer-link"
              >
                {otherSiteEmoji} {otherSiteName}
              </a>
            </li>
            
            {/* Остальные ссылки из конфига */}
            {Object.entries(links).map(([text, link]) => (
              <li key={text} class="footer-link-item">
                <a 
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="footer-link"
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor