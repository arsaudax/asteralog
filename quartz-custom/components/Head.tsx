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
             ФИНАЛЬНАЯ ЗАЩИЩЁННАЯ ВЕРСИЯ
             Скрипт блокирует рендер и защищает тему от переопределения
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
              // МАКСИМАЛЬНО АГРЕССИВНО - ПЕРЕОПРЕДЕЛЯЕМ ВСЁ
              (function() {
                const html = document.documentElement;
                
                // 1. Устанавливаем тёмную тему
                html.setAttribute('saved-theme', 'dark');
                
                // 2. Inline-стили для первого кадра
                html.style.backgroundColor = '#1a1c1e';
                html.style.color = '#d4d4d4';
                
                // 3. Добавляем классы
                html.classList.add('site-garden', 'no-transitions');
                
                // 4. ПЕРЕОПРЕДЕЛЯЕМ setAttribute для защиты от переопределения
                const originalSetAttribute = html.setAttribute;
                html.setAttribute = function(name, value) {
                  // Если кто-то пытается установить светлую тему - блокируем
                  if (name === 'saved-theme' && value === 'light') {
                    console.warn('🛡️ Заблокирована попытка установить светлую тему');
                    return originalSetAttribute.call(this, name, 'dark');
                  }
                  // В остальных случаях пропускаем
                  return originalSetAttribute.call(this, name, value);
                };
                
                // 5. Защита от переопределения через style
                const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
                CSSStyleDeclaration.prototype.setProperty = function(property, value, priority) {
                  // Если кто-то пытается переопределить цвета темы
                  if (property === 'background-color' || property === 'color') {
                    console.warn('🛡️ Заблокировано изменение цвета через CSSOM');
                    return;
                  }
                  return originalSetProperty.call(this, property, value, priority);
                };
                
                // 6. Интервал проверки (каждые 10мс в первую секунду)
                let counter = 0;
                const interval = setInterval(() => {
                  counter++;
                  
                  // Проверяем атрибут
                  if (html.getAttribute('saved-theme') !== 'dark') {
                    console.warn('🛡️ Восстанавливаем атрибут темы');
                    html.setAttribute('saved-theme', 'dark');
                  }
                  
                  // Проверяем inline-стили
                  if (html.style.backgroundColor !== '#1a1c1e' || html.style.color !== '#d4d4d4') {
                    console.warn('🛡️ Восстанавливаем inline-стили');
                    html.style.backgroundColor = '#1a1c1e';
                    html.style.color = '#d4d4d4';
                  }
                  
                  // Проверяем класс
                  if (!html.classList.contains('no-transitions')) {
                    console.warn('🛡️ Восстанавливаем класс no-transitions');
                    html.classList.add('no-transitions');
                  }
                  
                  // Останавливаем через 100 проверок (примерно 1 секунда)
                  if (counter > 100) {
                    clearInterval(interval);
                    console.log('🛡️ Защита отключена - страница загружена');
                    
                    // Восстанавливаем оригинальный setAttribute
                    setTimeout(() => {
                      html.setAttribute = originalSetAttribute;
                    }, 100);
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