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

        {/* ===== УСИЛЕННАЯ РЕИНИЦИАЛИЗАЦИЯ КОМПОНЕНТОВ ===== */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Функция принудительной перезагрузки всех компонентов
              function forceReinitialize() {
                console.log('🔄 Принудительная реинициализация компонентов...');
                
                // 1. Перезапускаем поиск
                const searchBtn = document.querySelector('.search-button');
                if (searchBtn) {
                  searchBtn.click();
                  setTimeout(() => searchBtn.click(), 10);
                }
                
                // 2. Обновляем граф
                const graph = document.querySelector('#graph-container');
                if (graph) {
                  // Принудительно перерисовываем
                  const event = new Event('resize');
                  window.dispatchEvent(event);
                }
                
                // 3. Перезапускаем переключатель темы
                const darkmode = document.querySelector('.darkmode button');
                if (darkmode) {
                  // Эмулируем клик для переинициализации
                  darkmode.dispatchEvent(new Event('mouseover'));
                }
                
                // 4. Обновляем все интерактивные элементы
                setTimeout(() => {
                  window.dispatchEvent(new Event('resize'));
                  document.querySelectorAll('*').forEach(el => {
                    if (el.__reinitialize) el.__reinitialize();
                  });
                }, 50);
              }
              
              // Слушаем все возможные события навигации
              document.addEventListener('nav', () => {
                setTimeout(forceReinitialize, 100);
              });
              
              // Также запускаем после загрузки страницы
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', forceReinitialize);
              } else {
                setTimeout(forceReinitialize, 200);
              }
              
              // Дополнительная проверка после полной загрузки
              window.addEventListener('load', () => {
                setTimeout(forceReinitialize, 500);
              });
            `
          }}
        />
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor