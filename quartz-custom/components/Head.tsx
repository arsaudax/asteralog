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
        {/* 0. АБСОЛЮТНЫЙ МИНИМУМ ДЛЯ РАБОТЫ СТРАНИЦЫ */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <title>{title}</title>

        {/* ====================================================
             ВАЖНО: ПЕРВЫЙ СКРИПТ - КРИТИЧЕСКИЙ ДЛЯ ТЕМЫ
             Вставляем как прямой тег <script>, НЕ через div
        ==================================================== */}
        <script
          blocking="render"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Максимально примитивно - без функций высшего порядка
                  var saved = null;
                  try {
                    saved = localStorage.getItem('saved-theme');
                  } catch(e) {}
                  
                  // Определяем тему: приоритет у сохранённой, иначе тёмная
                  var theme = saved === 'light' ? 'light' : 'dark';
                  
                  // Добавляем класс сайта по hostname
                  if (window.location.hostname.indexOf('blog') > -1) {
                    document.documentElement.classList.add('site-blog');
                  } else {
                    document.documentElement.classList.add('site-garden');
                  }
                  
                  // Устанавливаем атрибут для CSS
                  document.documentElement.setAttribute('saved-theme', theme);
                  
                  // Inline-стили для первого кадра
                  if (theme === 'dark') {
                    document.documentElement.style.backgroundColor = '#1a1c1e';
                    document.documentElement.style.color = '#d4d4d4';
                  } else {
                    document.documentElement.style.backgroundColor = '#f9f7f4';
                    document.documentElement.style.color = '#2b2b2b';
                  }
                  
                  // Блокируем переходы на время загрузки
                  document.documentElement.classList.add('no-transitions');
                  
                } catch(e) {
                  // Фатальный fallback - тёмная тема
                  document.documentElement.setAttribute('saved-theme', 'dark');
                  document.documentElement.style.backgroundColor = '#1a1c1e';
                  document.documentElement.style.color = '#d4d4d4';
                  document.documentElement.classList.add('no-transitions');
                }
              })();
            `
          }}
        />

        {/* ОСТАЛЬНЫЕ META */}
        <meta name="description" content={description} />
        <link rel="icon" href={iconPath} />
        <meta name="color-scheme" content="dark light" />

        {/* КРИТИЧЕСКИЙ CSS */}
        <style>{`
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
        `}</style>

        {/* ПРЕКОННЕКТ ДЛЯ ШРИФТОВ */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* ШРИФТЫ */}
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

        {/* OPEN GRAPH META */}
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

        {/* ОСНОВНЫЕ РЕСУРСЫ QUARTZ */}
        {css.map((res) => CSSResourceToStyleElement(res, true))}
        {js
          .filter((res) => res.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((res) =>
          typeof res === "function" ? res(fileData) : res,
        )}

        {/* ФИНАЛЬНЫЙ СКРИПТ */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var clean = function() {
                var html = document.documentElement;
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
              
              document.addEventListener('nav', function() {
                try {
                  var theme = localStorage.getItem('saved-theme');
                  if (theme === 'dark' || theme === 'light') {
                    document.documentElement.setAttribute('saved-theme', theme);
                  }
                } catch(e) {}
              });
              
              window.addEventListener('storage', function(e) {
                if (e.key === 'saved-theme') {
                  var theme = e.newValue;
                  if (theme === 'dark' || theme === 'light') {
                    document.documentElement.setAttribute('saved-theme', theme);
                  }
                }
              });
            })();
          `
        }} />

      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor