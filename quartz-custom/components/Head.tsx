// quartz-custom/components/Head.tsx
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { i18n } from "../../quartz/i18n"

export default (() => {
  const Head: QuartzComponent = ({ cfg, fileData }: QuartzComponentProps) => {
    const title = (fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title) +
      (cfg.pageTitleSuffix ?? "")
    
    const description = fileData.frontmatter?.description ?? 
                        fileData.frontmatter?.socialDescription ??
                        "Asteralog — цифровой сад и блог"

    return (
      <head>
        {/* ===== БАЗОВЫЕ META ===== */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <meta name="color-scheme" content="dark light" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/static/icon.png" />

        {/* ===== 🔥 КРИТИЧЕСКИЙ СКРИПТ ТЕМЫ ===== */}
        <script
          blocking="render"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const html = document.documentElement;
                
                // Определяем тип сайта по hostname
                const isBlog = window.location.hostname.includes('blog');
                html.classList.add(isBlog ? 'site-blog' : 'site-garden');
                
                // Устанавливаем тему ДО загрузки CSS
                const stored = localStorage.getItem("theme");
                html.setAttribute("data-theme", stored || "dark");
                
                // Блокируем transitions до полной загрузки
                html.classList.add('no-transitions');
                
                // Убираем блокировку после загрузки страницы
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', () => {
                    // Небольшая задержка для гарантии
                    setTimeout(() => {
                      html.classList.remove('no-transitions');
                    }, 100);
                  });
                } else {
                  setTimeout(() => {
                    html.classList.remove('no-transitions');
                  }, 100);
                }
              })();
            `
          }}
        />

        {/* ===== ШРИФТЫ С ЛЕНИВОЙ ЗАГРУЗКОЙ ===== */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload критического шрифта */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          crossOrigin="anonymous"
        />
        
        {/* Ленивая загрузка с media="print" */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          media="print"
          onLoad="this.media='all'"
          crossOrigin="anonymous"
        />
        
        {/* Fallback для браузеров без JS */}
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
            crossOrigin="anonymous"
          />
        </noscript>

        {/* ===== OPEN GRAPH META ===== */}
        <meta property="og:site_name" content={cfg.pageTitle} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://${cfg.baseUrl}${fileData.slug === 'index' ? '' : '/' + fileData.slug}`} />
        
        {fileData.frontmatter?.image ? (
          <meta property="og:image" content={fileData.frontmatter.image} />
        ) : (
          <meta property="og:image" content={`https://${cfg.baseUrl}/static/og-image.png`} />
        )}
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        
        {fileData.frontmatter?.image ? (
          <meta name="twitter:image" content={fileData.frontmatter.image} />
        ) : (
          <meta name="twitter:image" content={`https://${cfg.baseUrl}/static/og-image.png`} />
        )}
        
        {cfg.baseUrl && (
          <link rel="canonical" href={`https://${cfg.baseUrl}${fileData.slug === 'index' ? '' : '/' + fileData.slug}`} />
        )}
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor