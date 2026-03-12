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
             ✅ Тёмная тема по умолчанию
             ✅ Переключение темы работает
             ✅ Логотип 64x64
             ✅ Мобильный header скрывается при скролле
        ==================================================== */}
        
        {/* 1. МИНИМАЛЬНЫЕ META */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <meta name="color-scheme" content="dark light" />
        <title>{title}</title>

        {/* 2. КРИТИЧЕСКИЙ СКРИПТ ТЕМЫ */}
        <script
          blocking="render"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                const html = document.documentElement;
                const stored = localStorage.getItem('theme');
                const theme = stored || 'dark';
                html.setAttribute('saved-theme', theme);
                html.setAttribute('data-theme', theme);
              })();
            `
          }}
        />

        <meta name="description" content={description} />
        <link rel="icon" href={iconPath} />

        {/* 3. КРИТИЧЕСКИЙ CSS */}
        <style>{`
          /* ===== БАЗОВЫЕ СТИЛИ ===== */
          html[saved-theme="dark"],
          html[data-theme="dark"] {
            background-color: #1a1c1e;
            color: #d4d4d4;
          }
          
          html[saved-theme="light"],
          html[data-theme="light"] {
            background-color: #f9f7f4;
            color: #2b2b2b;
          }
          
          body {
            background: inherit;
            color: inherit;
          }

          /* ===== МОБИЛЬНЫЙ HEADER ===== */
          @media (max-width: 500px) {
            .sidebar.left {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 12px 20px;
              background: rgba(26, 28, 30, 0.85);
              backdrop-filter: blur(12px);
              border-bottom: 1px solid var(--border-color);
              z-index: 100;
              transition: transform 0.35s ease;
              transform: translateY(0);
              box-sizing: border-box;
            }
            
            html[data-theme="light"] .sidebar.left {
              background: rgba(249, 247, 244, 0.85);
            }
            
            .sidebar.left.hidden {
              transform: translateY(-100%);
            }
            
            /* ===== ЛОГОТИП ===== */
            .page-title {
              display: flex;
              align-items: center;
              gap: 20px;
              margin: 0;
              padding: 0;
            }
            
            .page-logo {
              width: 64px !important;
              height: 64px !important;
              min-width: 64px !important;
              min-height: 64px !important;
              border-radius: 50%;
              object-fit: cover;
              border: 2px solid var(--border-color);
              display: block;
            }
            
            .page-title-link {
              font-size: 18px;
              font-weight: 600;
              color: var(--link-color);
              text-decoration: none;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            
            /* ===== КНОПКИ ===== */
            .search-button {
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 10px;
              background: var(--bg-secondary);
              border: 1px solid var(--border-color);
              cursor: pointer;
              padding: 0;
            }
            
            .search-button svg {
              width: 20px;
              height: 20px;
              color: var(--link-color);
            }
            
            .darkmode {
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: transparent;
              border: none;
              cursor: pointer;
              padding: 0;
            }
            
            .darkmode svg {
              width: 22px;
              height: 22px;
              color: var(--link-color);
              fill: var(--link-color);
            }
            
            html[data-theme="dark"] .darkmode .dayIcon {
              display: none;
            }
            
            html[data-theme="dark"] .darkmode .nightIcon {
              display: block;
            }
            
            html[data-theme="light"] .darkmode .dayIcon {
              display: block;
            }
            
            html[data-theme="light"] .darkmode .nightIcon {
              display: none;
            }
            
            .spacer.mobile-only {
              display: none;
            }
          }

          @media (max-width: 800px) {
            .explorer {
              display: none;
            }
          }
        `}</style>

        {/* 4. ШРИФТЫ И РЕСУРСЫ */}
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

        {/* 5. OPEN GRAPH META */}
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

        {/* 6. ОСНОВНЫЕ РЕСУРСЫ QUARTZ */}
        {css.map((res) => CSSResourceToStyleElement(res, true))}
        {js
          .filter((res) => res.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((res) =>
          typeof res === "function" ? res(fileData) : res,
        )}

        {/* 7. ФИНАЛЬНЫЙ СКРИПТ */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // ===== МОБИЛЬНЫЙ HEADER =====
                let mobileHeaderInitialized = false;
                
                function initMobileHeader() {
                  if (mobileHeaderInitialized) return;
                  
                  const header = document.querySelector('.sidebar.left');
                  if (!header) return;
                  
                  mobileHeaderInitialized = true;
                  header.classList.remove('hidden');
                  
                  let lastScroll = 0;
                  const headerHeight = 70;
                  const delta = 5;
                  
                  function handleScroll() {
                    const current = window.scrollY;
                    
                    if (Math.abs(current - lastScroll) <= delta) return;
                    
                    if (current > lastScroll && current > headerHeight) {
                      header.classList.add('hidden');
                    } else {
                      header.classList.remove('hidden');
                    }
                    
                    if (current < 10) {
                      header.classList.remove('hidden');
                    }
                    
                    lastScroll = current;
                  }
                  
                  window.addEventListener('scroll', handleScroll, { passive: true });
                }
                
                if (window.innerWidth <= 500) {
                  initMobileHeader();
                }
                document.addEventListener('nav', initMobileHeader);
              })();
            `
          }}
        />
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor