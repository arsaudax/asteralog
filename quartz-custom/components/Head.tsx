import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { i18n } from "../../quartz/i18n"
import { FullSlug, getFileExtension, joinSegments, pathToRoot } from "../../quartz/util/path"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../../quartz/util/resources"
import { googleFontHref, googleFontSubsetHref } from "../../quartz/util/theme"
import { unescapeHTML } from "../../quartz/util/escape"
import { CustomOgImagesEmitterName } from "../../quartz/plugins/emitters/ogImage"

export default (() => {
  const Head: QuartzComponent = ({
    cfg,
    fileData,
    externalResources,
    ctx,
  }: QuartzComponentProps) => {
    const titleSuffix = cfg.pageTitleSuffix ?? ""
    const title =
      (fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title) + titleSuffix
    const description =
      fileData.frontmatter?.socialDescription ??
      fileData.frontmatter?.description ??
      unescapeHTML(fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description)

    const { css, js, additionalHead } = externalResources

    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const path = url.pathname as FullSlug
    const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug!)
    const iconPath = joinSegments(baseDir, "static/icon.png")

    const socialUrl =
      fileData.slug === "404" ? url.toString() : joinSegments(url.toString(), fileData.slug!)

    const usesCustomOgImage = ctx.cfg.plugins.emitters.some(
      (e) => e.name === CustomOgImagesEmitterName,
    )
    const ogImageDefaultPath = `https://${cfg.baseUrl}/static/og-image.png`

    return (
      <head>
        {/* ===== КРИТИЧЕСКИЙ CSS ДЛЯ ТЁМНОЙ ТЕМЫ ===== */}
        <style>{`
          html, body {
            background: #1a1c1e !important;
            color: #ffffff !important;
          }
          
          /* Принудительно устанавливаем переменные до загрузки Quartz */
          :root {
            --light: #1a1c1e !important;
            --lightgray: #2e3235 !important;
            --gray: #4a4f54 !important;
            --darkgray: #d4d4d4 !important;
            --dark: #ffffff !important;
            --secondary: #b5977a !important;
            --tertiary: #d4b69b !important;
            --highlight: rgba(181, 151, 122, 0.15) !important;
          }
        `}</style>

        {/* ===== МАКСИМАЛЬНО АГРЕССИВНЫЙ СКРИПТ ТЕМЫ ===== */}
        <script
          blocking="render"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // 1. Мгновенно ставим dark
                document.documentElement.setAttribute('saved-theme', 'dark');
                localStorage.setItem('saved-theme', 'dark');
                
                // 2. На всякий случай дублируем в data-theme
                document.documentElement.setAttribute('data-theme', 'dark');
                
                // 3. Принудительные стили через JS (самый жирный приоритет)
                document.documentElement.style.backgroundColor = '#1a1c1e';
                document.body.style.backgroundColor = '#1a1c1e';
                document.body.style.color = '#ffffff';
                
                // 4. Объявляем переменные через JS (если CSS не сработал)
                const root = document.documentElement;
                root.style.setProperty('--light', '#1a1c1e');
                root.style.setProperty('--lightgray', '#2e3235');
                root.style.setProperty('--gray', '#4a4f54');
                root.style.setProperty('--darkgray', '#d4d4d4');
                root.style.setProperty('--dark', '#ffffff');
                root.style.setProperty('--secondary', '#b5977a');
                root.style.setProperty('--tertiary', '#d4b69b');
              })();
            `
          }}
        />

        {/* ===== ОТСЛЕЖИВАНИЕ ИЗМЕНЕНИЙ ТЕМЫ ===== */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Наблюдаем за изменениями атрибута
              const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                  if (mutation.attributeName === 'saved-theme') {
                    const theme = document.documentElement.getAttribute('saved-theme');
                    if (theme === 'light') {
                      // Если кто-то посмел поставить light — возвращаем dark
                      document.documentElement.setAttribute('saved-theme', 'dark');
                    }
                  }
                });
              });
              
              observer.observe(document.documentElement, { attributes: true });
              
              // Перехватываем попытки изменить тему через localStorage
              const originalSetItem = localStorage.setItem;
              localStorage.setItem = function(key, value) {
                if (key === 'saved-theme' && value === 'light') {
                  // Игнорируем попытки поставить light
                  return;
                }
                originalSetItem.call(this, key, value);
              };
            `
          }}
        />

        {/* ===== БАЗОВЫЕ META ===== */}
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="dark light" />
        <meta name="description" content={description} />
        <meta name="generator" content="Quartz" />
        <link rel="icon" href={iconPath} />

        {/* ===== Open Graph / Twitter ===== */}
        <meta name="og:site_name" content={cfg.pageTitle} />
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

        {/* ===== ШРИФТЫ ===== */}
        {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="stylesheet" href={googleFontHref(cfg.theme)} />
            {cfg.theme.typography.title && (
              <link rel="stylesheet" href={googleFontSubsetHref(cfg.theme, cfg.pageTitle)} />
            )}
          </>
        )}

        {/* ===== CSS ===== */}
        {css.map((resource) => CSSResourceToStyleElement(resource, true))}
        
        {/* ===== JS ===== */}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        
        {/* ===== ДОПОЛНИТЕЛЬНЫЕ HEAD ЭЛЕМЕНТЫ ===== */}
        {additionalHead.map((resource) => {
          if (typeof resource === "function") {
            return resource(fileData)
          } else {
            return resource
          }
        })}
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor