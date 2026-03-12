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
             АРХИТЕКТУРНО ПРАВИЛЬНАЯ ВЕРСИЯ
             ✅ Только data-theme (как в Quartz)
             ✅ Минимальный критический CSS
             ✅ Без конфликтов с layout
        ==================================================== */}
        
        {/* 1. МИНИМАЛЬНЫЕ META */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <meta name="color-scheme" content="dark light" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href={iconPath} />

        {/* 2. КРИТИЧЕСКИЙ СКРИПТ ТЕМЫ — ТОЛЬКО DATA-THEME */}
        <script
          blocking="render"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                const html = document.documentElement;
                const stored = localStorage.getItem("theme") || "dark";
                html.setAttribute("data-theme", stored);
              })();
            `
          }}
        />

        {/* 3. КРИТИЧЕСКИЙ CSS (только для предотвращения FOUC) */}
        <style>{`
          html[data-theme="dark"] {
            background-color: #1a1c1e;
            color: #d4d4d4;
          }
          html[data-theme="light"] {
            background-color: #f9f7f4;
            color: #2b2b2b;
          }
          body {
            background: inherit;
            color: inherit;
            margin: 0;
            padding: 0;
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

        {/* 7. СКРИПТ ДЛЯ СКРОЛЛ-ПОВЕДЕНИЯ */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function initScrollBehavior() {
                  const header = document.querySelector('.page-header');
                  if (!header) return;
                  
                  let lastScroll = 0;
                  const delta = 5;
                  
                  function handleScroll() {
                    const currentScroll = window.scrollY;
                    
                    if (Math.abs(currentScroll - lastScroll) <= delta) return;
                    
                    if (currentScroll > lastScroll && currentScroll > 70) {
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
                  initScrollBehavior();
                }
                document.addEventListener('nav', initScrollBehavior);
              })();
            `
          }}
        />
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor