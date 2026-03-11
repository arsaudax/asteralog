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
        {/* 1. МИНИМАЛЬНЫЕ META */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <title>{title}</title>

        {/* 2. КРИТИЧЕСКИЙ СКРИПТ ТЕМЫ (ВАШ РАБОЧИЙ) */}
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
                  if (counter > 10) clearInterval(interval); // 100ms
                }, 10);
              })();
            `
          }}
        />

        <meta name="description" content={description} />
        <link rel="icon" href={iconPath} />
        <meta name="color-scheme" content="dark light" />

        {/* 3. ТОЛЬКО НЕОБХОДИМЫЕ CSS-ПРАВКИ */}
        <style>{`
          /* ===== БАЗОВЫЕ СТИЛИ (БЕЗ ИЗМЕНЕНИЙ) ===== */
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

          /* ===== ТОЧЕЧНЫЕ ПРАВКИ (ТОЛЬКО НУЖНОЕ) ===== */
          @media (max-width: 500px) {
            /* Расстояние между кругом и текстом */
            .page-title {
              gap: 20px !important;
            }
            
            /* Убираем лишний спейсер */
            .spacer.mobile-only {
              display: none !important;
            }
            
            /* Кнопка темы без рамки */
            .darkmode button {
              background: transparent !important;
              border: none !important;
            }
            
            /* Нижний отступ панели */
            .left.sidebar {
              padding-bottom: 15px !important;
            }
          }
        `}</style>

        {/* 4. ШРИФТЫ И РЕСУРСЫ */}
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

        {/* 6. РЕСУРСЫ QUARTZ */}
        {css.map((res) => CSSResourceToStyleElement(res, true))}
        {js.filter((res) => res.loadTime === "beforeDOMReady").map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((res) => typeof res === "function" ? res(fileData) : res)}

        {/* 7. ФИНАЛЬНЫЙ СКРИПТ (СКРОЛЛ-ПОВЕДЕНИЕ) */}
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
                
                // Скролл-поведение (Medium/Quackit)
                if (window.innerWidth <= 500) {
                  let lastScroll = 0;
                  const header = document.querySelector('.left.sidebar');
                  const headerHeight = 70;
                  const threshold = 10;
                  
                  if (header) {
                    window.addEventListener('scroll', () => {
                      const currentScroll = window.scrollY;
                      
                      if (currentScroll > lastScroll && currentScroll > headerHeight) {
                        header.classList.add('hidden');
                      } else if (currentScroll < lastScroll) {
                        header.classList.remove('hidden');
                      }
                      
                      if (currentScroll < threshold) {
                        header.classList.remove('hidden');
                      }
                      
                      lastScroll = currentScroll;
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