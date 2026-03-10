import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { i18n } from "../../quartz/i18n"
import { FullSlug, getFileExtension, joinSegments, pathToRoot } from "../../quartz/util/path"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../../quartz/util/resources"
import { googleFontHref, googleFontSubsetHref } from "../../quartz/util/theme"
import { unescapeHTML } from "../../quartz/util/escape"
import { CustomOgImagesEmitterName } from "../../quartz/plugins/emitters/ogImage"

export default (() => {
  const Head: QuartzComponent = ({ cfg, fileData, externalResources, ctx }: QuartzComponentProps) => {
    const titleSuffix = cfg.pageTitleSuffix ?? ""
    const title = (fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title) + titleSuffix
    const description = fileData.frontmatter?.socialDescription
      ?? fileData.frontmatter?.description
      ?? unescapeHTML(fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description)

    const { css, js, additionalHead } = externalResources
    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const baseDir = fileData.slug === "404" ? url.pathname : pathToRoot(fileData.slug!)
    const iconPath = joinSegments(baseDir, "static/icon.png")
    const socialUrl = fileData.slug === "404" ? url.toString() : joinSegments(url.toString(), fileData.slug!)
    const usesCustomOgImage = ctx.cfg.plugins.emitters.some(e => e.name === CustomOgImagesEmitterName)
    const ogImageDefaultPath = `https://${cfg.baseUrl}/static/og-image.png`

    // Определяем тему прямо в шаблоне (без JS для первого кадра)
    const initialTheme = (() => {
      // Мы не можем прочитать localStorage здесь, поэтому полагаемся на системные настройки
      // Это будет переопределено JS, если есть сохранённая тема
      return "dark"; // по умолчанию тёмная
    })()

    return (
      <html 
        lang="ru" 
        dir="ltr" 
        saved-theme={initialTheme}
        style={{
          backgroundColor: initialTheme === 'dark' ? '#1a1c1e' : '#f9f7f4',
          color: initialTheme === 'dark' ? '#d4d4d4' : '#2b2b2b',
        }}
      >
        <head>
          <meta charSet="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta name="color-scheme" content="dark light"/>
          <title>{title}</title>
          <meta name="description" content={description}/>
          <meta name="generator" content="Quartz"/>
          <link rel="icon" href={iconPath}/>

          {/* 1) Критический CSS для первого кадра */}
          <style>{`
            html[saved-theme="dark"] body,
            html[saved-theme="dark"] #quartz-root,
            html[saved-theme="dark"] #quartz-body {
              background: #1a1c1e !important;
              color: #d4d4d4 !important;
            }
            html[saved-theme="light"] body,
            html[saved-theme="light"] #quartz-root,
            html[saved-theme="light"] #quartz-body {
              background: #f9f7f4 !important;
              color: #2b2b2b !important;
            }
            html.no-transitions *,
            html.no-transitions *::before,
            html.no-transitions *::after {
              transition: none !important;
              animation: none !important;
            }
          `}</style>

          {/* 2) Preload критических ресурсов */}
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com"/>
          <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous"/>

          {/* 3) Шрифты с display=swap */}
          {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
            <>
              <link 
                rel="preload" 
                as="style" 
                href={`${googleFontHref(cfg.theme)}&display=swap`}
              />
              <link 
                rel="stylesheet" 
                href={`${googleFontHref(cfg.theme)}&display=swap`} 
                media="print" 
                onLoad="this.media='all'"
              />
              {cfg.theme.typography.title && (
                <>
                  <link 
                    rel="preload" 
                    as="style" 
                    href={`${googleFontSubsetHref(cfg.theme, cfg.pageTitle)}&display=swap`}
                  />
                  <link 
                    rel="stylesheet" 
                    href={`${googleFontSubsetHref(cfg.theme, cfg.pageTitle)}&display=swap`}
                    media="print" 
                    onLoad="this.media='all'"
                  />
                </>
              )}
              <noscript>
                <link rel="stylesheet" href={`${googleFontHref(cfg.theme)}&display=swap`}/>
                {cfg.theme.typography.title && (
                  <link rel="stylesheet" href={`${googleFontSubsetHref(cfg.theme, cfg.pageTitle)}&display=swap`}/>
                )}
              </noscript>
            </>
          )}

          {/* 4) Скрипт ранней установки темы (корректирует localStorage) */}
          <script dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const html = document.documentElement;
                  
                  // Читаем сохранённую тему
                  let theme = null;
                  try { theme = localStorage.getItem('saved-theme'); } catch(e) { theme = null; }
                  
                  // Если нет сохранённой, смотрим системные настройки
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  
                  // Обновляем атрибут
                  html.setAttribute('saved-theme', theme);
                  
                  // Обновляем inline-стили
                  html.style.backgroundColor = theme === 'dark' ? '#1a1c1e' : '#f9f7f4';
                  html.style.color = theme === 'dark' ? '#d4d4d4' : '#2b2b2b';
                  
                  // Отключаем переходы на время первого рендера
                  html.classList.add('no-transitions');
                } catch(e) { /* silent */ }
              })();
            `
          }} />

          {/* 5) Open Graph / Twitter мета-теги */}
          <meta property="og:site_name" content={cfg.pageTitle}/>
          <meta property="og:title" content={title}/>
          <meta property="og:type" content="website"/>
          <meta property="og:description" content={description}/>
          <meta property="og:image:alt" content={description}/>
          <meta name="twitter:card" content="summary_large_image"/>
          <meta name="twitter:title" content={title}/>
          <meta name="twitter:description" content={description}/>

          {!usesCustomOgImage && (
            <>
              <meta property="og:image" content={ogImageDefaultPath}/>
              <meta property="og:image:url" content={ogImageDefaultPath}/>
              <meta name="twitter:image" content={ogImageDefaultPath}/>
              <meta property="og:image:type" content={`image/${getFileExtension(ogImageDefaultPath) ?? "png"}`}/>
            </>
          )}

          {cfg.baseUrl && (
            <>
              <meta property="twitter:domain" content={cfg.baseUrl}/>
              <meta property="og:url" content={socialUrl}/>
              <meta property="twitter:url" content={socialUrl}/>
            </>
          )}

          {/* 6) Основные CSS и JS ресурсы от Quartz */}
          {css.map(res => CSSResourceToStyleElement(res, true))}
          {js
            .filter(res => res.loadTime === 'beforeDOMReady')
            .map(res => JSResourceToScriptElement(res, true))}
          {additionalHead.map(res => typeof res === 'function' ? res(fileData) : res)}

          {/* 7) Финальный скрипт: убираем no-transitions и восстанавливаем тему после навигации */}
          <script dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Убираем no-transitions после первого кадра
                const removeTransitions = function() {
                  const html = document.documentElement;
                  html.classList.remove('no-transitions');
                  html.style.backgroundColor = '';
                  html.style.color = '';
                };
                
                // Используем requestAnimationFrame для точной синхронизации с рендером
                if (document.readyState === 'loading') {
                  window.addEventListener('DOMContentLoaded', () => {
                    requestAnimationFrame(removeTransitions);
                  }, { once: true });
                } else {
                  requestAnimationFrame(removeTransitions);
                }
                
                // Восстанавливаем тему при SPA-переходах
                document.addEventListener('nav', function() { 
                  try {
                    const theme = localStorage.getItem('saved-theme');
                    if (theme) {
                      document.documentElement.setAttribute('saved-theme', theme);
                    }
                  } catch(e) {} 
                });
              })();
            `
          }} />
        </head>
      </html>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor