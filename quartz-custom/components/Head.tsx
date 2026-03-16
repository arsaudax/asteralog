import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { i18n } from "../../quartz/i18n"

export default (() => {
  const Head: QuartzComponent = ({ cfg, fileData }: QuartzComponentProps) => {
    const title = (fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title) +
      (cfg.pageTitleSuffix ?? "")

    return (
      <head>
        {/* ===== БАЗОВЫЕ META ===== */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="dark light" />
        <title>{title}</title>
        <meta name="description" content={fileData.frontmatter?.description ?? "Asteralog — цифровой сад и блог"} />
        <link rel="icon" href="/static/icon.png" />

        {/* ===== КРИТИЧЕСКИЙ СКРИПТ ДЛЯ ТЕМЫ (БЕЗ FOUC) ===== */}
        <script
          blocking="render"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const html = document.documentElement;
                const saved = localStorage.getItem('saved-theme');
                
                // Устанавливаем класс в зависимости от сохранённой темы
                if (saved === 'dark') {
                  html.setAttribute('saved-theme', 'dark');
                } else if (saved === 'light') {
                  html.setAttribute('saved-theme', 'light');
                } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  html.setAttribute('saved-theme', 'dark');
                } else {
                  html.setAttribute('saved-theme', 'dark'); // По умолчанию тёмная
                }
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
        <link rel="stylesheet" href="/custom.css" />

        {/* ===== РЕИНИЦИАЛИЗАЦИЯ КОМПОНЕНТОВ ПОСЛЕ SPA-ПЕРЕХОДОВ ===== */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('nav', () => {
                // Принудительно перерисовываем компоненты
                setTimeout(() => {
                  window.dispatchEvent(new Event('resize'));
                  
                  // Реинициализация поиска
                  const search = document.querySelector('.search');
                  if (search && (search as any).__onNav) {
                    (search as any).__onNav();
                  }
                  
                  // Реинициализация графа
                  const graph = document.querySelector('#graph-container');
                  if (graph && (graph as any).__onNav) {
                    (graph as any).__onNav();
                  }
                }, 100);
              });
            `
          }}
        />
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor