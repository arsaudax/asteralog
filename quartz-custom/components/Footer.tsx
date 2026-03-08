import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { classNames } from "../../quartz/util/lang"
import style from "./styles/footer.scss"

interface Options {
  links: Record<string, string>
  showCopyright?: boolean
  showSocial?: boolean
  showPoweredBy?: boolean
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass, fileData }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links || {}
    const showCopyright = opts?.showCopyright ?? true
    const showPoweredBy = opts?.showPoweredBy ?? true
    
    // Определяем тип сайта для эмодзи
    const siteType = typeof process !== 'undefined' 
      ? (process.env?.BASE_URL?.includes('blog') ? 'blog' : 'garden')
      : 'garden'
    
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
          
          {/* Ссылки из конфига */}
          {Object.keys(links).length > 0 && (
            <ul class="footer-links">
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
          )}
        </div>
        
        {/* Техническая информация */}
        {showPoweredBy && (
          <div class="footer-meta">
            <span class="footer-powered">
              Сделано на <a href="https://quartz.jzhao.xyz/" target="_blank" rel="noopener noreferrer">Quartz</a>
            </span>
            <span class="footer-separator">·</span>
            <span class="footer-license">
              <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener noreferrer">
                CC BY-NC 4.0
              </a>
            </span>
          </div>
        )}
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor