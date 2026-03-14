// quartz-custom/components/Head.tsx
import { QuartzComponent, QuartzComponentConstructor } from "../../quartz/components/types"
import { i18n } from "../../quartz/i18n"
import { QuartzComponentProps } from "../../quartz/components/types"

export default (() => {
  const Head: QuartzComponent = ({ cfg, fileData }: QuartzComponentProps) => {
    const title = (fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title) +
      (cfg.pageTitleSuffix ?? "")

    return (
      <head>
        {/* ===== БАЗОВЫЕ META ===== */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <meta name="color-scheme" content="dark light" />
        <title>{title}</title>
        <meta name="description" content={fileData.frontmatter?.description ?? "Asteralog — цифровой сад и блог"} />
        <link rel="icon" href="/static/icon.png" />

        {/* ===== ПРОСТОЙ СКРИПТ ТЕМЫ ===== */}
        <script
          blocking="render"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const html = document.documentElement;
                const isBlog = window.location.hostname.includes('blog');
                html.classList.add(isBlog ? 'site-blog' : 'site-garden');
                
                // Просто берём тему из localStorage или ставим dark
                const theme = localStorage.getItem('theme') || 'dark';
                html.setAttribute('data-theme', theme);
              })();
            `
          }}
        />

        {/* ===== ШРИФТЫ ===== */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

        {/* ===== CSS ===== */}
        <link rel="stylesheet" href="/index.css" />
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor