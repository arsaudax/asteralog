// quartz-custom/components/Head.tsx

import {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../quartz/components/types"

import { i18n } from "../../quartz/i18n"
import {
  getFileExtension,
  joinSegments,
  pathToRoot,
} from "../../quartz/util/path"

import {
  CSSResourceToStyleElement,
  JSResourceToScriptElement,
} from "../../quartz/util/resources"

import {
  googleFontHref,
  googleFontSubsetHref,
} from "../../quartz/util/theme"

import { unescapeHTML } from "../../quartz/util/escape"
import { CustomOgImagesEmitterName } from "../../quartz/plugins/emitters/ogImage"

export default (() => {
  const Head: QuartzComponent = ({
    cfg,
    fileData,
    externalResources,
    ctx,
  }: QuartzComponentProps) => {
    
    const title =
      (fileData.frontmatter?.title ??
        i18n(cfg.locale).propertyDefaults.title) +
      (cfg.pageTitleSuffix ?? "")

    const description =
      fileData.frontmatter?.socialDescription ??
      fileData.frontmatter?.description ??
      unescapeHTML(
        fileData.description?.trim() ??
          i18n(cfg.locale).propertyDefaults.description,
      )

    const { css, js, additionalHead } = externalResources

    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const baseDir =
      fileData.slug === "404"
        ? url.pathname
        : pathToRoot(fileData.slug!)

    const iconPath = joinSegments(baseDir, "static/icon.png")

    const socialUrl =
      fileData.slug === "404"
        ? url.toString()
        : joinSegments(url.toString(), fileData.slug!)

    const usesCustomOgImage =
      ctx.cfg.plugins.emitters.some(
        (e) => e.name === CustomOgImagesEmitterName,
      )

    const ogImageDefaultPath =
      `https://${cfg.baseUrl}/static/og-image.png`

    return (
      <head>
        {/* ====================================================
             ФИНАЛЬНАЯ РАБОЧАЯ ВЕРСИЯ 
             С МОБИЛЬНОЙ ВЁРСТКОЙ И СКРОЛЛ-ПОВЕДЕНИЕМ
        ==================================================== */}
        
        {/* 1. МИНИМАЛЬНЫЕ META */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <title>{title}</title>

        {/* 2. КРИТИЧЕСКИЙ СКРИПТ С БЛОКИРОВКОЙ РЕНДЕРА И ЗАЩИТОЙ */}
        <script
          blocking="render"
          dangerouslySetInnerHTML={{
            __html: `
              // ФИНАЛЬНАЯ ЗАЩИЩЁННАЯ ВЕРСИЯ (БЕЗ ЛОГОВ)
              (function() {
                const html = document.documentElement;
                
                // Устанавливаем тёмную тему
                html.setAttribute('saved-theme', 'dark');
                html.style.backgroundColor = '#1a1c1e';
                html.style.color = '#d4d4d4';
                html.classList.add('site-garden', 'no-transitions');
                
                // Защита от переопределения (без логов)
                let counter = 0;
                const interval = setInterval(() => {
                  counter++;
                  
                  if (html.getAttribute('saved-theme') !== 'dark') {
                    html.setAttribute('saved-theme', 'dark');
                  }
                  if (html.style.backgroundColor !== '#1a1c1e') {
                    html.style.backgroundColor = '#1a1c1e';
                  }
                  if (html.style.color !== '#d4d4d4') {
                    html.style.color = '#d4d4d4';
                  }
                  if (!html.classList.contains('no-transitions')) {
                    html.classList.add('no-transitions');
                  }
                  
                  if (counter > 100) {
                    clearInterval(interval);
                  }
                }, 10);
              })();
            `
          }}
        />

        {/* 3. ОСТАЛЬНЫЕ META */}
        <meta name="description" content={description} />
        <link rel="icon" href={iconPath} />
        <meta name="color-scheme" content="dark light" />

        {/* 4. КРИТИЧЕСКИЙ CSS (с мобильными стилями и !important) */}
        <style>{`
          /* ===== БАЗОВЫЕ СТИЛИ ===== */
          html.no-transitions *,
          html.no-transitions *::before,
          html.no-transitions *::after {
            transition: none !important;
            animation: none !important;
          }
          
          html[saved-theme="dark"] {
            background-color: #1a1c1e;
            color: #d4d4d4;
          }
          
          html[saved-theme="dark"] body,
          html[saved-theme="dark"] #quartz-root,
          html[saved-theme="dark"] #quartz-body {
            background-color: #1a1c1e !important;
            color: #d4d4d4 !important;
          }
          
          html[saved-theme="light"] {
            background-color: #f9f7f4;
            color: #2b2b2b;
          }
          
          html[saved-theme="light"] body,
          html[saved-theme="light"] #quartz-root,
          html[saved-theme="light"] #quartz-body {
            background-color: #f9f7f4 !important;
            color: #2b2b2b !important;
          }
          
          body {
            background: inherit;
            color: inherit;
          }
          
          #quartz-root {
            min-height: 100vh;
          }

          /* ===== МОБИЛЬНЫЕ СТИЛИ С !important ===== */
          @media (max-width: 500px) {
            .left.sidebar {
              display: grid !important;
              grid-template-columns: 1fr 40px 40px !important;
              grid-template-rows: auto !important;
              gap: 4px !important;
              padding: 8px 16px !important;
              margin: 0 !important;
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              z-index: 20 !important;
              background: color-mix(in srgb, var(--bg-primary) 92%, transparent) !important;
              backdrop-filter: blur(6px) !important;
              border-bottom: 1px solid var(--border-color) !important;
              transform: translateY(0) !important;
              transition: transform 0.3s ease !important;
            }
            
            /* Класс для скрытой панели */
            .left.sidebar.hidden {
              transform: translateY(-100%) !important;
            }
            
            .left .page-title {
              grid-column: 1 !important;
              grid-row: 1 !important;
              display: flex !important;
              align-items: center !important;
              justify-content: flex-start !important;
              gap: 8px !important;
              margin: 0 !important;
              overflow: hidden !important;
              white-space: nowrap !important;
              text-overflow: ellipsis !important;
            }
            
            .left .page-logo {
              width: 40px !important;
              height: 40px !important;
              border-radius: 50% !important;
              object-fit: cover !important;
              border: 2px solid var(--border-color) !important;
              flex-shrink: 0 !important;
              display: block !important;
            }
            
            .left .page-title-link {
              font-size: 16px !important;
              font-weight: 600 !important;
              color: var(--link-color) !important;
              white-space: nowrap !important;
              overflow: hidden !important;
              text-overflow: ellipsis !important;
            }
            
            .spacer.mobile-only {
              display: none !important;
            }
            
            .left .search {
              display: contents !important;
            }
            
            .left .search-button {
              grid-column: 2 !important;
              grid-row: 1 !important;
              width: 40px !important;
              height: 40px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              border-radius: 50% !important;
              padding: 0 !important;
              background: var(--bg-secondary) !important;
              border: 1px solid var(--border-color) !important;
              z-index: 2 !important;
            }
            
            .left .search-button p {
              display: none !important;
            }
            
            .left .search-button svg {
              width: 20px !important;
              height: 20px !important;
              color: var(--link-color) !important;
            }
            
            .left .darkmode {
              grid-column: 3 !important;
              grid-row: 1 !important;
              justify-self: end !important;
              z-index: 2 !important;
            }
            
            .left .darkmode button {
              width: 40px !important;
              height: 40px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              border-radius: 50% !important;
              padding: 0 !important;
              background: var(--bg-secondary) !important;
              border: 1px solid var(--border-color) !important;
            }
            
            .left .darkmode button span {
              display: none !important;
            }
            
            .left .darkmode button svg {
              width: 20px !important;
              height: 20px !important;
              color: var(--link-color) !important;
            }
            
            .left .search .search-container {
              display: none !important;
            }
            
            /* Добавляем отступ для контента */
            .page {
              padding-top: 60px !important;
            }
          }

          /* ===== СТИЛИ ДЛЯ ЭКРАНОВ ДО 800px ===== */
          @media (max-width: 800px) {
            .explorer {
              display: none !important;
            }
          }
        `}</style>

        {/* 5. ШРИФТЫ И ОСТАЛЬНЫЕ РЕСУРСЫ */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

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
              <link rel="stylesheet" href={`${googleFontHref(cfg.theme)}&display=swap`} />
              {cfg.theme.typography.title && (
                <link
                  rel="stylesheet"
                  href={`${googleFontSubsetHref(cfg.theme, cfg.pageTitle)}&display=swap`}
                />
              )}
            </noscript>
          </>
        )}

        {/* 6. OPEN GRAPH META */}
        <meta property="og:site_name" content={cfg.pageTitle} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta property="og:description" content={description} />
        <meta property="og:image:alt" content={description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />

        {!usesCustomOgImage && (
          <>
            <meta property="og:image" content={ogImageDefaultPath} />
            <meta property="og:image:url" content={ogImageDefaultPath} />
            <meta name="twitter:image" content={ogImageDefaultPath} />
            <meta
              property="og:image:type"
              content={`image/${getFileExtension(ogImageDefaultPath) ?? "png"}`}
            />
          </>
        )}

        {cfg.baseUrl && (
          <>
            <meta property="twitter:domain" content={cfg.baseUrl} />
            <meta property="og:url" content={socialUrl} />
            <meta property="twitter:url" content={socialUrl} />
          </>
        )}

        {/* 7. ОСНОВНЫЕ РЕСУРСЫ QUARTZ */}
        {css.map((res) => CSSResourceToStyleElement(res, true))}
        {js
          .filter((res) => res.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((res) =>
          typeof res === "function" ? res(fileData) : res,
        )}

        {/* 8. ФИНАЛЬНЫЙ СКРИПТ - УБИРАЕТ БЛОКИРОВКУ И ДОБАВЛЯЕТ СКРОЛЛ-ПОВЕДЕНИЕ */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Очистка блокировки переходов
                const clean = function() {
                  const html = document.documentElement;
                  html.classList.remove('no-transitions');
                  html.style.backgroundColor = '';
                  html.style.color = '';
                };
                
                if (document.readyState === 'loading') {
                  window.addEventListener('DOMContentLoaded', function() {
                    window.requestAnimationFrame(clean);
                  }, { once: true });
                } else {
                  window.requestAnimationFrame(clean);
                }
                
                // ===== СКРОЛЛ-ПОВЕДЕНИЕ ДЛЯ МОБИЛЬНОЙ ПАНЕЛИ =====
                if (window.innerWidth <= 500) {
                  let lastScrollTop = 0;
                  const header = document.querySelector('.left.sidebar');
                  
                  window.addEventListener('scroll', function() {
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    
                    // Скролл вниз
                    if (scrollTop > lastScrollTop && scrollTop > 50) {
                      header.classList.add('hidden');
                    } 
                    // Скролл вверх
                    else if (scrollTop < lastScrollTop) {
                      header.classList.remove('hidden');
                    }
                    
                    // Если в самом верху - показываем
                    if (scrollTop < 10) {
                      header.classList.remove('hidden');
                    }
                    
                    lastScrollTop = scrollTop;
                  });
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