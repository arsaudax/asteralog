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
             ФИНАЛЬНАЯ АРХИТЕКТУРНО ПРАВИЛЬНАЯ ВЕРСИЯ
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

        {/* 4. КРИТИЧЕСКИЙ CSS */}
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

          /* ===== МОБИЛЬНЫЕ СТИЛИ ===== */
          @media (max-width: 500px) {
            .left.sidebar {
              position: sticky !important;
              top: 0 !important;
              z-index: 999999 !important;
              
              display: flex !important;
              align-items: center !important;
              justify-content: space-between !important;
              
              padding: 10px 20px !important;
              
              background: rgba(26, 28, 30, 0.85) !important;
              backdrop-filter: blur(12px) !important;
              -webkit-backdrop-filter: blur(12px) !important;
              
              border-bottom: 1px solid var(--border-color) !important;
              
              transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;
              box-sizing: border-box !important;
              width: 100% !important;
            }
            
            .left.sidebar.hidden {
              transform: translateY(-100%) !important;
            }
            
            /* Логотип */
            .page-title {
              display: flex !important;
              align-items: center !important;
              gap: 8px !important;
              margin: 0 !important;
              padding: 0 !important;
              flex-shrink: 1 !important;
              min-width: 0 !important;
            }
            
            .page-logo {
              width: 32px !important;
              height: 32px !important;
              border-radius: 50% !important;
              object-fit: cover !important;
              border: 2px solid var(--border-color) !important;
              flex-shrink: 0 !important;
              display: block !important;
            }
            
            .page-title-link {
              font-size: 17px !important;
              font-weight: 600 !important;
              color: var(--link-color) !important;
              line-height: 1.2 !important;
              white-space: nowrap !important;
              overflow: hidden !important;
              text-overflow: ellipsis !important;
              display: inline-block !important;
            }
            
            /* Контейнер для действий */
            .actions-container {
              display: flex !important;
              align-items: center !important;
              gap: 8px !important;
              flex-shrink: 0 !important;
            }
            
            /* Кнопка поиска */
            .search {
              display: flex !important;
              align-items: center !important;
              position: relative !important;
            }
            
            .search-button {
              width: 36px !important;
              height: 36px !important;
              
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              
              border-radius: 10px !important;
              
              background: var(--bg-secondary) !important;
              border: 1px solid var(--border-color) !important;
              
              cursor: pointer !important;
              padding: 0 !important;
              transition: all 0.2s ease !important;
            }
            
            .search-button:hover {
              background: var(--highlight) !important;
              border-color: var(--link-color) !important;
            }
            
            .search-button p {
              display: none !important;
            }
            
            .search-button svg {
              width: 18px !important;
              height: 18px !important;
              color: var(--link-color) !important;
            }
            
            /* Кнопка темы */
            .darkmode {
              display: flex !important;
              align-items: center !important;
            }
            
            .darkmode button {
              width: 36px !important;
              height: 36px !important;
              
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              
              border-radius: 10px !important;
              
              background: var(--bg-secondary) !important;
              border: 1px solid var(--border-color) !important;
              
              cursor: pointer !important;
              padding: 0 !important;
              transition: all 0.2s ease !important;
            }
            
            .darkmode button:hover {
              background: var(--highlight) !important;
              border-color: var(--link-color) !important;
            }
            
            .darkmode button span {
              display: none !important;
            }
            
            .darkmode button svg {
              width: 18px !important;
              height: 18px !important;
              color: var(--link-color) !important;
            }
            
            /* Поле поиска */
            .search-container {
              display: none !important;
              position: absolute !important;
              top: calc(100% + 8px) !important;
              left: 0 !important;
              right: 0 !important;
              background: var(--bg-primary) !important;
              border: 1px solid var(--border-color) !important;
              border-radius: 12px !important;
              padding: 12px !important;
              box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
              z-index: 1000000 !important;
            }
            
            .search.active .search-container {
              display: block !important;
            }
            
            .search-container input {
              width: 100% !important;
              padding: 10px !important;
              border-radius: 8px !important;
              border: 1px solid var(--border-color) !important;
              background: var(--bg-secondary) !important;
              color: var(--text-primary) !important;
              font-size: 16px !important;
              outline: none !important;
            }
            
            .search-container input:focus {
              border-color: var(--link-color) !important;
              box-shadow: 0 0 0 3px var(--highlight) !important;
            }
            
            .spacer.mobile-only {
              display: none !important;
            }
          }

          /* ===== СТИЛИ ДЛЯ ЭКРАНОВ ДО 800px ===== */
          @media (max-width: 800px) {
            .explorer {
              display: none !important;
            }
          }

          /* ===== СТИЛИ ДЛЯ СВЕТЛОЙ ТЕМЫ ===== */
          html[saved-theme="light"] .left.sidebar {
            background: rgba(249, 247, 244, 0.85) !important;
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

        {/* 8. ФИНАЛЬНЫЙ СКРИПТ */}
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
                
                // ===== СКРОЛЛ-ПОВЕДЕНИЕ =====
                if (window.innerWidth <= 500) {
                  function initScrollBehavior() {
                    const header = document.querySelector('.left.sidebar');
                    
                    if (header) {
                      let lastScrollTop = 0;
                      window.addEventListener('scroll', function() {
                        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                        
                        if (scrollTop > lastScrollTop && scrollTop > 30) {
                          header.classList.add('hidden');
                        } else if (scrollTop < lastScrollTop) {
                          header.classList.remove('hidden');
                        }
                        
                        if (scrollTop < 5) {
                          header.classList.remove('hidden');
                        }
                        
                        lastScrollTop = scrollTop;
                      });
                    } else {
                      setTimeout(initScrollBehavior, 100);
                    }
                  }
                  
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', initScrollBehavior);
                  } else {
                    initScrollBehavior();
                  }
                }
                
                // ===== ПОИСК =====
                const searchButton = document.querySelector('.search-button');
                const searchEl = document.querySelector('.search');
                
                if (searchButton && searchEl) {
                  searchButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    searchEl.classList.toggle('active');
                    
                    if (searchEl.classList.contains('active')) {
                      const input = searchEl.querySelector('input');
                      setTimeout(() => {
                        if (input) input.focus();
                      }, 100);
                    }
                  });
                  
                  // Закрытие по клику вне
                  document.addEventListener('click', function(e) {
                    if (!searchEl.contains(e.target) && searchEl.classList.contains('active')) {
                      searchEl.classList.remove('active');
                    }
                  });
                  
                  // Закрытие по Escape
                  document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape' && searchEl.classList.contains('active')) {
                      searchEl.classList.remove('active');
                    }
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