// quartz-custom/components/Head.tsx
import { QuartzComponent, QuartzComponentConstructor } from "../../quartz/components/types"

export default (() => {
  const Head: QuartzComponent = () => {
    return (
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <title>Asteralog</title>
        <link rel="stylesheet" href="/index.css" />
        
        {/* Критический скрипт темы */}
        <script
          blocking="render"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const html = document.documentElement;
                
                // Определяем тип сайта по hostname
                const isBlog = window.location.hostname.includes('blog');
                html.classList.add(isBlog ? 'site-blog' : 'site-garden');
                
                // Устанавливаем тему из localStorage или по умолчанию dark
                const theme = localStorage.getItem('theme') || 'dark';
                html.setAttribute('data-theme', theme);
                
                // Блокируем transitions до полной загрузки
                html.classList.add('no-transitions');
                
                // Убираем блокировку после загрузки
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', () => {
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
      </head>
    )
  }
  return Head
}) satisfies QuartzComponentConstructor