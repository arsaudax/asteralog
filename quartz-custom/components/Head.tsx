// quartz-custom/components/Head.tsx
import { QuartzComponent, QuartzComponentConstructor } from "../../quartz/components/types"
import { i18n } from "../../quartz/i18n"
import { QuartzComponentProps } from "../../quartz/components/types"

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
                const stored = localStorage.getItem("theme");
                html.setAttribute("data-theme", stored || "dark");
                html.classList.add('no-transitions');
                setTimeout(() => html.classList.remove('no-transitions'), 100);
              })();
            `
          }}
        />

        {/* ===== ШРИФТЫ ===== */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono&display=swap"
          rel="stylesheet"
          media="print"
          onLoad="this.media='all'"
        />
        <noscript>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono&display=swap" rel="stylesheet" />
        </noscript>

        {/* ===== 🔥 КРИТИЧЕСКИЕ СТИЛИ ===== */}
        <link rel="stylesheet" href="/index.css" />
        <link rel="stylesheet" href="/custom.css" />

        {/* ===== OPEN GRAPH META ===== */}
        <meta property="og:site_name" content={cfg.pageTitle} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://garden.asteralog.ru/static/og-image.png" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://garden.asteralog.ru/static/og-image.png" />
        
        {cfg.baseUrl && (
          <link rel="canonical" href={`https://${cfg.baseUrl}${fileData.slug === 'index' ? '' : '/' + fileData.slug}`} />
        )}
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor