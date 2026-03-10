import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { i18n } from "../../quartz/i18n"
import { FullSlug, getFileExtension, joinSegments, pathToRoot } from "../../quartz/util/path"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../../quartz/util/resources"
import { googleFontHref, googleFontSubsetHref } from "../../quartz/util/theme"
import { unescapeHTML } from "../../quartz/util/escape"
import { CustomOgImagesEmitterName } from "../../quartz/plugins/emitters/ogImage"

export default (() => {
  const Head: QuartzComponent = ({ cfg, fileData, externalResources, ctx }: QuartzComponentProps) => {
    const titleSuffix = cfg.pageTitleSuffix ?? ""
    const title = (fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title) + titleSuffix
    const description = fileData.frontmatter?.socialDescription
      ?? fileData.frontmatter?.description
      ?? unescapeHTML(fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description)

    const { css, js, additionalHead } = externalResources
    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const baseDir = fileData.slug === "404" ? url.pathname : pathToRoot(fileData.slug!)
    const iconPath = joinSegments(baseDir, "static/icon.png")
    const socialUrl = fileData.slug === "404" ? url.toString() : joinSegments(url.toString(), fileData.slug!)
    const usesCustomOgImage = ctx.cfg.plugins.emitters.some(e => e.name === CustomOgImagesEmitterName)
    const ogImageDefaultPath = `https://${cfg.baseUrl}/static/og-image.png`

    // inline критический CSS для первого кадра
    const criticalCSS = `
      html[data-theme="dark"] body,
      html[data-theme="dark"] #quartz-root,
      html[data-theme="dark"] #quartz-body {
        background: #1a1c1e !important;
        color: #d4d4d4 !important;
      }
      html[data-theme="light"] body,
      html[data-theme="light"] #quartz-root,
      html[data-theme="light"] #quartz-body {
        background: #f9f7f4 !important;
        color: #2b2b2b !important;
      }
      html.no-transitions *,
      html.no-transitions *::before,
      html.no-transitions *::after {
        transition: none !important;
        animation: none !important;
      }
    `

    // скрипт ранней установки темы
    const earlyThemeScript = `
      (function() {
        try {
          const html = document.documentElement;
          let theme = null;
          try { theme = localStorage.getItem('saved-theme'); } catch(e) { theme = null; }

          if (!theme) {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          }

          html.setAttribute('data-theme', theme);
          html.classList.add('no-transitions');
          html.style.backgroundColor = theme === 'dark' ? '#1a1c1e' : '#f9f7f4';
          html.style.color = theme === 'dark' ? '#d4d4d4' : '#2b2b2b';
        } catch(e) {}
      })();
    `

    // финальный скрипт для SPA и очистки no-transitions
    const finalizeThemeScript = `
      (function() {
        const removeTransitions = () => {
          const html = document.documentElement;
          html.classList.remove('no-transitions');
          html.style.backgroundColor = '';
          html.style.color = '';
        };

        if (document.readyState === 'loading') {
          window.addEventListener('DOMContentLoaded', () => requestAnimationFrame(removeTransitions), { once: true });
        } else {
          requestAnimationFrame(removeTransitions);
        }

        document.addEventListener('nav', function() { 
          try {
            const theme = localStorage.getItem('saved-theme');
            if (theme) {
              document.documentElement.setAttribute('data-theme', theme);
            }
          } catch(e) {} 
        });
      })();
    `

    return (
      <html 
        lang="ru"
        dir="ltr"
        data-theme="dark" 
        style={{ backgroundColor: '#1a1c1e', color: '#d4d4d4' }}
      >
        <head>
          <meta charSet="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta name="color-scheme" content="dark light"/>
          <title>{title}</title>
          <meta name="description" content={description}/>
          <meta name="generator" content="Quartz"/>
          <link rel="icon" href={iconPath}/>

          {/* 1) Ранняя установка темы */}
          <script dangerouslySetInnerHTML={{ __html: earlyThemeScript }} />

          {/* 2) Критический CSS */}
          <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />

          {/* 3) Шрифты и CDN */}
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com"/>
          <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous"/>
          {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
            <>
              <link rel="preload" as="style" href={`${googleFontHref(cfg.theme)}&display=swap`}/>
              <link rel="stylesheet" href={`${googleFontHref(cfg.theme)}&display=swap`} media="print" onLoad="this.media='all'"/>
              {cfg.theme.typography.title && (
                <>
                  <link rel="preload" as="style" href={`${googleFontSubsetHref(cfg.theme, cfg.pageTitle)}&display=swap`}/>
                  <link rel="stylesheet" href={`${googleFontSubsetHref(cfg.theme, cfg.pageTitle)}&display=swap`} media="print" onLoad="this.media='all'"/>
                </>
              )}
              <noscript>
                <link rel="stylesheet" href={`${googleFontHref(cfg.theme)}&display=swap`}/>
                {cfg.theme.typography.title && (
                  <link rel="stylesheet" href={`${googleFontSubsetHref(cfg.theme, cfg.pageTitle)}&display=swap`}/>
                )}
              </noscript>
            </>
          )}

          {/* 4) Open Graph / Twitter */}
          <meta property="og:site_name" content={cfg.pageTitle}/>
          <meta property="og:title" content={title}/>
          <meta property="og:type" content="website"/>
          <meta property="og:description" content={description}/>
          <meta property="og:image:alt" content={description}/>
          <meta name="twitter:card" content="summary_large_image"/>
          <meta name="twitter:title" content={title}/>
          <meta name="twitter:description" content={description}/>
          {!usesCustomOgImage && (
            <>
              <meta property="og:image" content={ogImageDefaultPath}/>
              <meta property="og:image:url" content={ogImageDefaultPath}/>
              <meta name="twitter:image" content={ogImageDefaultPath}/>
              <meta property="og:image:type" content={`image/${getFileExtension(ogImageDefaultPath) ?? "png"}`}/>
            </>
          )}
          {cfg.baseUrl && (
            <>
              <meta property="twitter:domain" content={cfg.baseUrl}/>
              <meta property="og:url" content={socialUrl}/>
              <meta property="twitter:url" content={socialUrl}/>
            </>
          )}

          {/* 5) Основные CSS и JS ресурсы от Quartz */}
          {css.map(res => CSSResourceToStyleElement(res, true))}
          {js.filter(res => res.loadTime === 'beforeDOMReady').map(res => JSResourceToScriptElement(res, true))}
          {additionalHead.map(res => typeof res === 'function' ? res(fileData) : res)}

          {/* 6) Финальный скрипт */}
          <script dangerouslySetInnerHTML={{ __html: finalizeThemeScript }} />
        </head>
      </html>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor