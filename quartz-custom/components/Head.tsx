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
        ==================================================== */}
        
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <title>{title}</title>

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
                
                let counter = 0;
                const interval = setInterval(() => {
                  counter++;
                  if (html.getAttribute('saved-theme') !== 'dark') {
                    html.setAttribute('saved-theme', 'dark');
                  }
                  if (counter > 100) clearInterval(interval);
                }, 10);
              })();
            `
          }}
        />

        <meta name="description" content={description} />
        <link rel="icon" href={iconPath} />
        <meta name="color-scheme" content="dark light" />

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
              
              padding: 10px 20px 15px 20px !important;
              
              background: rgba(26, 28, 30, 0.85) !important;
              backdrop-filter: blur(12px) !important;
              border-bottom: 1px solid var(--border-color) !important;
              
              transform: translateY(0) !important;
              transition: transform 0.3s ease-in-out !important;
              box-sizing: border-box !important;
              width: 100% !important;
            }
            
            html[saved-theme="light"] .left.sidebar {
              background: rgba(249, 247, 244, 0.85) !important;
            }
            
            .left.sidebar.hidden {
              transform: translateY(-100%) !important;
            }
            
            /* Логотип и текст */
            .page-title {
              display: flex !important;
              align-items: center !important;
              gap: 24px !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            
            .page-logo {
              width: 36px !important;
              height: 36px !important;
              min-width: 36px !important;
              border-radius: 50% !important;
              object-fit: cover !important;
              border: 2px solid var(--border-color) !important;
            }
            
            .page-title-link {
              font-size: 18px !important;
              font-weight: 600 !important;
              color: var(--link-color) !important;
              line-height: 36px !important;
              text-decoration: none !important;
              white-space: nowrap !important;
              overflow: hidden !important;
              text-overflow: ellipsis !important;
            }
            
            /* Контейнер для кнопок */
            .button-container {
              display: flex !important;
              align-items: center !important;
              gap: 1px !important;
              flex-shrink: 0 !important;
            }
            
            /* Кнопка поиска */
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
            
            /* Кнопка темы */
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
            
            /* Переключение иконок темы */
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

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
          <>
            <link rel="preload" as="style" href={`${googleFontHref(cfg.theme)}&display=swap`} />
            <link rel="stylesheet" href={`${googleFontHref(cfg.theme)}&display=swap`} media="print" onLoad="this.media='all'" />
            {cfg.theme.typography.title && (
              <>
                <link rel="preload" as="style" href={`${googleFontSubsetHref(cfg.theme, cfg.pageTitle)}&display=swap`} />
                <link rel="stylesheet" href={`${googleFontSubsetHref(cfg.theme, cfg.pageTitle)}&display=swap`} media="print" onLoad="this.media='all'" />
              </>
            )}
            <noscript>
              <link rel="stylesheet" href={`${googleFontHref(cfg.theme)}&display=swap`} />
              {cfg.theme.typography.title && (
                <link rel="stylesheet" href={`${googleFontSubsetHref(cfg.theme, cfg.pageTitle)}&display=swap`} />
              )}
            </noscript>
          </>
        )}

        {/* Open Graph мета-теги */}
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
            <meta property="og:image:type" content={`image/${getFileExtension(ogImageDefaultPath) ?? "png"}`} />
          </>
        )}
        
        {cfg.baseUrl && (
          <>
            <meta property="twitter:domain" content={cfg.baseUrl} />
            <meta property="og:url" content={socialUrl} />
            <meta property="twitter:url" content={socialUrl} />
          </>
        )}

        {css.map((res) => CSSResourceToStyleElement(res, true))}
        {js.filter((res) => res.loadTime === "beforeDOMReady").map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((res) => typeof res === "function" ? res(fileData) : res)}

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
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
                
                if (window.innerWidth <= 500) {
                  let lastScrollTop = 0;
                  const header = document.querySelector('.left.sidebar');
                  
                  if (header) {
                    window.addEventListener('scroll', () => {
                      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                      
                      if (currentScrollTop > lastScrollTop && currentScrollTop > 50) {
                        header.classList.add('hidden');
                      } else if (currentScrollTop < lastScrollTop) {
                        header.classList.remove('hidden');
                      }
                      
                      if (currentScrollTop < 10) {
                        header.classList.remove('hidden');
                      }
                      
                      lastScrollTop = currentScrollTop;
                    });
                  }
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