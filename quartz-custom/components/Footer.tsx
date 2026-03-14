import { QuartzComponent, QuartzComponentConstructor } from "../types"

interface Options {
  links?: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = () => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? {}

    return (
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-copyright">
            Asteralog © {year}
          </div>

          {Object.keys(links).length > 0 && (
            <ul class="footer-links">
              {Object.entries(links).map(([text, url]) => (
                <li key={text}>
                  <a href={url} rel="noopener noreferrer">
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