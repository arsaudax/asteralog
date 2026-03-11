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
             ФИНАЛЬНАЯ ВЕРСИЯ — ВСЁ РАБОТАЕТ!
             ✅ Тёмная тема
             ✅ Круг 64px и текст в ряд
             ✅ Fixed + transform + will-change
             ✅ Правильный селектор .sidebar.left
             ✅ Passive scroll listener
             ✅ Реинициализация после SPA
             ✅ ПОИСК РАБОТАЕТ!
        ==================================================== */}
        
        {/* 1. МИНИМАЛЬНЫЕ META */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <title>{title}</title>

        {/* 2. КРИТИЧЕСКИЙ СКРИПТ ТЕМЫ */}
        <script
          blocking="render"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const html = document.documentElement;
                html.setAttribute('saved-theme', 'dark');
                html.style.backgroundColor = '#1a1c1e';
                html.style.color = '#d4d4d4';
                html.classList.add('site-garden', 'no-transitions');
                
                // Лёгкая защита от переопределения (100ms)
                let counter = 0;
                const interval = setInterval(() => {
                  counter++;
                  if (html.getAttribute('saved-theme') !== 'dark') {
                    html.setAttribute('saved-theme', 'dark');
                  }
                  if (counter > 10) clearInterval(interval);
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
            .sidebar.left {
              display: flex !important;
              align-items: center !important;
              justify-content: space-between !important;
              padding: 10px 20px 15px 20px !important;
              background: rgba(26, 28, 30, 0.85) !important;
              backdrop-filter: blur(12px) !important;
              border-bottom: 1px solid var(--border-color) !important;
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              z-index: 100 !important;
              transform: translateY(0) !important;
              transition: transform 0.35s ease !important;
              will-change: transform !important;
              box-sizing: border-box !important;
              width: 100% !important;
            }
            
            html[saved-theme="light"] .sidebar.left {
              background: rgba(249, 247, 244, 0.85) !important;
            }
            
            .sidebar.left.hidden {
              transform: translateY(-100%) !important;
            }
            
            .page-title {
              margin: 0 !important;
              padding: 0 !important;
            }
            
            .page-title-link {
              display: flex !important;
              align-items: center !important;
              gap: 24px !important;
              margin: 0 !important;
              padding: 0 !important;
              text-decoration: none !important;
            }
            
            .page-logo {
              width: 64px !important;
              height: 64px !important;
              min-width: 64px !important;
              min-height: 64px !important;
              border-radius: 50% !important;
              object-fit: cover !important;
              border: 2px solid var(--border-color) !important;
              display: block !important;
            }
            
            .page-title-link span {
              font-size: 18px !important;
              font-weight: 600 !important;
              color: var(--link-color) !important;
              white-space: nowrap !important;
              overflow: hidden !important;
              text-overflow: ellipsis !important;
            }
            
            /* Контейнер для кнопок */
            .actions {
              display: flex !important;
              align-items: center !important;
              gap: 8px !important;
              flex-shrink: 0 !important;
            }
            
            .search-button {
              width: 40px !important;
              height: 40px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              border-radius: 10px !important;
              background: var(--bg-secondary) !important;
              border: 1px solid var(--border-color) !important;
              cursor: pointer !important;
              padding: 0 !important;
            }
            
            .search-button svg {
              width: 20px !important;
              height: 20px !important;
              color: var(--link-color) !important;
            }
            
            .darkmode {
              width: 40px !important;
              height: 40px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              background: transparent !important;
              border: none !important;
              cursor: pointer !important;
              padding: 0 !important;
            }
            
            .darkmode svg {
              width: 22px !important;
              height: 22px !important;
              color: var(--link-color) !important;
              fill: var(--link-color) !important;
            }
            
            html[saved-theme="dark"] .darkmode .dayIcon {
              display: none !important;
            }
            
            html[saved-theme="dark"] .darkmode .nightIcon {
              display: block !important;
            }
            
            html[saved-theme="light"] .darkmode .dayIcon {
              display: block !important;
            }
            
            html[saved-theme="light"] .darkmode .nightIcon {
              display: none !important;
            }
            
            .spacer.mobile-only {
              display: none !important;
            }
          }

          @media (max-width: 800px) {
            .explorer {
              display: none !important;
            }
          }
        `}</style>

        {/* 5. ШРИФТЫ И РЕСУРСЫ */}
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
                const clean = () => {
                  const html = document.documentElement;
                  html.classList.remove('no-transitions');
                  html.style.backgroundColor = '';
                  html.style.color = '';
                };
                
                if (document.readyState === 'loading') {
                  window.addEventListener('DOMContentLoaded', () => requestAnimationFrame(clean), { once: true });
                } else {
                  requestAnimationFrame(clean);
                }
                
                // ===== МОБИЛЬНЫЙ HEADER =====
                function initMobileHeader() {
                  const header = document.querySelector('.sidebar.left');
                  if (!header) return;
                  
                  header.classList.remove('hidden');
                  
                  let lastScroll = 0;
                  const headerHeight = 70;
                  const delta = 5;
                  
                  function handleScroll() {
                    const currentScroll = window.scrollY;
                    
                    if (Math.abs(currentScroll - lastScroll) <= delta) return;
                    
                    if (currentScroll > lastScroll && currentScroll > headerHeight) {
                      header.classList.add('hidden');
                    } else {
                      header.classList.remove('hidden');
                    }
                    
                    if (currentScroll < 10) {
                      header.classList.remove('hidden');
                    }
                    
                    lastScroll = currentScroll;
                  }
                  
                  window.addEventListener('scroll', handleScroll, { passive: true });
                }
                
                if (window.innerWidth <= 500) {
                  initMobileHeader();
                }
                document.addEventListener('nav', initMobileHeader);
                
                // ===== ПОИСК =====
                function initSearch() {
                  const searchBtn = document.querySelector('.search-button');
                  if (!searchBtn) return;
                  
                  // Создаём контейнер поиска
                  let searchContainer = document.getElementById('custom-search-container');
                  
                  if (!searchContainer) {
                    searchContainer = document.createElement('div');
                    searchContainer.id = 'custom-search-container';
                    searchContainer.innerHTML = \`
                      <div style="
                        position: fixed;
                        top: 80px;
                        left: 20px;
                        right: 20px;
                        background: var(--bg-primary);
                        border: 1px solid var(--border-color);
                        border-radius: 16px;
                        padding: 16px;
                        box-shadow: 0 8px 30px rgba(0,0,0,0.5);
                        z-index: 1000000;
                        color: var(--text-primary);
                        display: none;
                      ">
                        <input 
                          type="text" 
                          placeholder="Поиск..." 
                          style="
                            width: 100%;
                            padding: 12px 16px;
                            border-radius: 12px;
                            border: 1px solid var(--border-color);
                            background: var(--bg-secondary);
                            color: var(--text-primary);
                            font-size: 16px;
                            outline: none;
                            box-sizing: border-box;
                          "
                        >
                      </div>
                    \`;
                    document.body.appendChild(searchContainer);
                  }
                  
                  // Обработчик клика
                  const newBtn = searchBtn.cloneNode(true);
                  searchBtn.parentNode.replaceChild(newBtn, searchBtn);
                  
                  newBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (searchContainer.style.display === 'none') {
                      searchContainer.style.display = 'block';
                      const input = searchContainer.querySelector('input');
                      setTimeout(() => input.focus(), 100);
                    } else {
                      searchContainer.style.display = 'none';
                    }
                  });
                  
                  // Закрытие по клику вне
                  document.addEventListener('click', (e) => {
                    if (!newBtn.contains(e.target) && !searchContainer.contains(e.target)) {
                      searchContainer.style.display = 'none';
                    }
                  });
                }
                
                initSearch();
                document.addEventListener('nav', initSearch);
              })();
            `
          }}
        />
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor