// quartz-custom/components/Footer.tsx
import { QuartzComponent, QuartzComponentConstructor } from "../../quartz/components/types"

interface Options {
  links?: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = () => {
    const year = new Date().getFullYear()
    const links = opts?.links || {}
    
    return (
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-copyright">
            <span class="footer-emoji">📝</span>
            <span class="footer-text">Asteralog © {year}</span>
          </div>
          
          {Object.keys(links).length > 0 && (
            <ul class="footer-links">
              {Object.entries(links).map(([text, url]) => (
                <li key={text} class="footer-link-item">
                  <a 
                    href={url} 
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
      </footer>
    )
  }
  return Footer
}) satisfies QuartzComponentConstructor