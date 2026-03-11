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
             ФИНАЛЬНАЯ РАБОЧАЯ ВЕРСИЯ С МОБИЛЬНОЙ ВЁРСТКОЙ
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

        {/* 4. КРИТИЧЕСКИЙ CSS (включая мобильные стили) */}
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

          /* ===== МОБИЛЬНЫЕ СТИЛИ (до 500px) ===== */
          @media (max-width: 500px) {
            .left.sidebar {
              display: grid;
              grid-template-columns: 1fr 40px 40px;
              grid-template-rows: auto auto auto auto;
              gap: 8px;
              padding: 10px 12px;
              margin: 0;
              position: sticky;
              top: 0;
              z-index: 20;
              background: color-mix(in srgb, var(--bg-primary) 92%, transparent);
              backdrop-filter: blur(6px);
              border-bottom: 1px solid var(--border-color);
            }
            
            .left .page-title {
              grid-column: 1 / -1;
              grid-row: 1;
              display: flex !important;
              align-items: center !important;
              gap: 12px !important;
              margin: 0 !important;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            
            .left .page-logo {
              width: 64px !important;
              height: 64px !important;
              border-radius: 50%;
              object-fit: cover;
              border: 2px solid var(--border-color);
              flex-shrink: 0;
              display: block !important;
            }
            
            .left .page-title-link {
              font-size: 20px;
              font-weight: 600;
              color: var(--link-color);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            
            .spacer.mobile-only {
              grid-column: 1 / -1;
              grid-row: 2;
              display: block !important;
              height: 12px !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            
            .left .search {
              display: contents !important;
            }
            
            .left .search-button {
              grid-column: 2 !important;
              grid-row: 1 !important;
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              padding: 0;
              background: var(--bg-secondary);
              border: 1px solid var(--border-color);
              z-index: 2;
            }
            
            .left .search-button p {
              display: none;
            }
            
            .left .search-button svg {
              width: 20px;
              height: 20px;
              color: var(--link-color);
            }
            
            .left .darkmode {
              grid-column: 3 !important;
              grid-row: 1 !important;
              justify-self: end;
              z-index: 2;
            }
            
            .left .darkmode button {
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              padding: 0;
              background: var(--bg-secondary);
              border: 1px solid var(--border-color);
            }
            
            .left .darkmode button span {
              display: none;
            }
            
            .left .darkmode button svg {
              width: 20px;
              height: 20px;
              color: var(--link-color);
            }
            
            .left .search .search-container {
              grid-column: 1 / -1;
              grid-row: 3;
              width: 100%;
            }
            
            .left .search input {
              width: 100%;
              padding: 10px 12px;
              border-radius: 8px;
              border: 1px solid var(--border-color);
              background: var(--bg-secondary);
              color: var(--text-primary);
              font-size: 16px;
            }
            
            .left .search input:focus {
              border-color: var(--link-color);
              outline: none;
              box-shadow: 0 0 0 3px var(--highlight);
            }
            
            .right {
              display: flex;
              flex-direction: column;
              gap: 0 !important;
              padding: 12px;
            }
            
            .right .graph,
            .right .backlinks {
              display: block;
              padding: 8px 0 !important;
            }
            
            .right .toc,
            .right .tag-list {
              display: none;
            }
            
            [data-site-type="blog"] .right .tag-list,
            [data-site-type="blog"] .right .archive-link-container {
              display: block;
              padding: 8px 0 !important;
            }
            
            [data-site-type="blog"] .right .graph,
            [data-site-type="blog"] .right .backlinks,
            [data-site-type="blog"] .right .toc,
            [data-site-type="blog"] .right .recent-notes {
              display: none;
            }
            
            .right h3 {
              margin-bottom: 4px !important;
              border-bottom: none !important;
              font-size: 0.9rem;
            }
            
            .explorer {
              display: none !important;
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

        {/* 8. ФИНАЛЬНЫЙ СКРИПТ - УБИРАЕТ БЛОКИРОВКУ ПЕРЕХОДОВ */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
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
              })();
            `
          }}
        />

      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor