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
        {/* БАЗОВЫЕ META (всегда первые) */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <title>{title}</title>

        {/* КРИТИЧЕСКИЙ СКРИПТ ТЕМЫ (проверенное решение) */}
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
              })();
            `
          }}
        />

        <meta name="description" content={description} />
        <link rel="icon" href={iconPath} />
        <meta name="color-scheme" content="dark light" />

        {/* ====================================================
            ЕДИНЫЙ БЛОК СТИЛЕЙ ДЛЯ ХЕДЕРА
            Архитектура основана на лучших практиках из кейсов:
            - Knowledge Base pattern (Logo+Title | Search | Theme)
            - Sticky + transform: translateY
            - Scroll threshold (header height + delta)
            - Offset for content
        ==================================================== */}
        <style>{`
          /* Базовые стили (без изменений) */
          html.no-transitions *,
          html.no-transitions *::before,
          html.no-transitions *::after {
            transition: none !important;
            animation: none !important;
          }
          html[saved-theme="dark"] { background-color: #1a1c1e; color: #d4d4d4; }
          html[saved-theme="dark"] body,
          html[saved-theme="dark"] #quartz-root,
          html[saved-theme="dark"] #quartz-body {
            background-color: #1a1c1e !important;
            color: #d4d4d4 !important;
          }
          html[saved-theme="light"] { background-color: #f9f7f4; color: #2b2b2b; }
          html[saved-theme="light"] body,
          html[saved-theme="light"] #quartz-root,
          html[saved-theme="light"] #quartz-body {
            background-color: #f9f7f4 !important;
            color: #2b2b2b !important;
          }
          body { background: inherit; color: inherit; }
          #quartz-root { min-height: 100vh; }

          /* ===== АРХИТЕКТУРА МОБИЛЬНОГО ХЕДЕРА ===== */
          @media (max-width: 500px) {
            /* 1. Sticky позиционирование (не fixed) */
            .left.sidebar {
              position: sticky !important;
              top: 0 !important;
              z-index: 999999 !important;
              
              /* 2. Knowledge Base Pattern: flex space-between */
              display: flex !important;
              align-items: center !important;
              justify-content: space-between !important;
              
              padding: 10px 20px !important;
              background: rgba(26, 28, 30, 0.85) !important;
              backdrop-filter: blur(12px) !important;
              border-bottom: 1px solid var(--border-color) !important;
              
              /* 3. Transform для анимации (не top) */
              transform: translateY(0) !important;
              transition: transform 0.3s ease-in-out !important;
              box-sizing: border-box !important;
              width: 100% !important;
            }
            html[saved-theme="light"] .left.sidebar {
              background: rgba(249, 247, 244, 0.85) !important;
            }
            
            /* Класс скрытия через transform */
            .left.sidebar.hidden {
              transform: translateY(-100%) !important;
            }
            
            /* Левая группа: Логотип + Title */
            .page-title {
              display: flex !important;
              align-items: center !important;
              gap: 12px !important;
              margin: 0 !important;
              padding: 0 !important;
              flex-shrink: 1 !important;
              min-width: 0 !important;
            }
            .page-logo {
              width: 52px !important;
              height: 52px !important;
              min-width: 52px !important;
              border-radius: 50% !important;
              object-fit: cover !important;
              border: 2px solid var(--border-color) !important;
              display: block !important;
            }
            .page-title-link {
              font-size: 18px !important;
              font-weight: 600 !important;
              color: var(--link-color) !important;
              line-height: 1.3 !important;
              white-space: nowrap !important;
              overflow: hidden !important;
              text-overflow: ellipsis !important;
            }
            
            /* Центральная группа: Поиск (кнопка) */
            .search {
              display: flex !important;
              align-items: center !important;
              position: relative !important;
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
            .search-button:hover {
              background: var(--highlight) !important;
              border-color: var(--link-color) !important;
            }
            .search-button p { display: none !important; }
            .search-button svg {
              width: 20px !important;
              height: 20px !important;
              color: var(--link-color) !important;
            }
            
            /* Правая группа: Тема */
            .darkmode {
              display: flex !important;
              align-items: center !important;
            }
            .darkmode button {
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
            .darkmode button:hover {
              background: var(--highlight) !important;
              border-color: var(--link-color) !important;
            }
            .darkmode button span { display: none !important; }
            .darkmode button svg {
              width: 20px !important;
              height: 20px !important;
              color: var(--link-color) !important;
            }
            
            /* Поле поиска (выпадающее) */
            .search-container {
              display: none !important;
              position: absolute !important;
              top: calc(100% + 8px) !important;
              left: 0 !important;
              right: 0 !important;
              background: var(--bg-primary) !important;
              border: 1px solid var(--border-color) !important;
              border-radius: 12px !important;
              padding: 12px !important;
              box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
              z-index: 1000000 !important;
            }
            .search.active .search-container { display: block !important; }
            .search-container input {
              width: 100% !important;
              padding: 10px !important;
              border-radius: 8px !important;
              border: 1px solid var(--border-color) !important;
              background: var(--bg-secondary) !important;
              color: var(--text-primary) !important;
              font-size: 16px !important;
              outline: none !important;
            }
            .search-container input:focus {
              border-color: var(--link-color) !important;
              box-shadow: 0 0 0 3px var(--highlight) !important;
            }
            
            .spacer.mobile-only { display: none !important; }
          }
          @media (max-width: 800px) { .explorer { display: none !important; } }
        `}</style>

        {/* ОСТАЛЬНЫЕ РЕСУРСЫ (шрифты, мета-теги, скрипты) */}
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
            <noscript>{/* ... fallback links ... */}</noscript>
          </>
        )}

        {/* Open Graph мета-теги (без изменений) */}
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

        {/* Основные ресурсы Quartz */}
        {css.map((res) => CSSResourceToStyleElement(res, true))}
        {js.filter((res) => res.loadTime === "beforeDOMReady").map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((res) => typeof res === "function" ? res(fileData) : res)}

        {/* ====================================================
            ФИНАЛЬНЫЙ СКРИПТ С АРХИТЕКТУРНО ПРАВИЛЬНОЙ ЛОГИКОЙ СКРОЛЛА
        ==================================================== */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // 1. Убираем блокировку переходов после загрузки
                const clean = function() {
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

                // 2. Логика поиска (без изменений)
                const searchButton = document.querySelector('.search-button');
                const searchEl = document.querySelector('.search');
                if (searchButton && searchEl) {
                  searchButton.addEventListener('click', function(e) {
                    e.preventDefault(); e.stopPropagation();
                    searchEl.classList.toggle('active');
                    if (searchEl.classList.contains('active')) {
                      setTimeout(() => searchEl.querySelector('input')?.focus(), 100);
                    }
                  });
                  document.addEventListener('click', (e) => { if (!searchEl.contains(e.target) && searchEl.classList.contains('active')) searchEl.classList.remove('active'); });
                  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && searchEl.classList.contains('active')) searchEl.classList.remove('active'); });
                }

                // 3. Логика скролла на мобильных устройствах (архитектурно правильная)
                if (window.innerWidth <= 500) {
                  let lastScrollTop = 0;
                  const header = document.querySelector('.left.sidebar');
                  const headerHeight = header ? header.offsetHeight : 70; // высота хедера
                  const scrollDelta = 5; // порог чувствительности (из Medium статьи)

                  if (header) {
                    window.addEventListener('scroll', function() {
                      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

                      // 1. Проверка на порог чувствительности (delta)
                      if (Math.abs(lastScrollTop - currentScrollTop) <= scrollDelta) return;

                      // 2. Логика скрытия/показа
                      if (currentScrollTop > lastScrollTop && currentScrollTop > headerHeight) {
                        // Скролл вниз И проскроллили больше высоты хедера
                        header.classList.add('hidden');
                      } else if (currentScrollTop < lastScrollTop) {
                        // Скролл вверх
                        header.classList.remove('hidden');
                      }

                      // 3. Всегда показывать в самом верху
                      if (currentScrollTop <= 5) {
                        header.classList.remove('hidden');
                      }

                      lastScrollTop = currentScrollTop;
                    });
                  }
                }

                // 4. Уважение к настройкам пользователя (prefers-reduced-motion)
                const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
                if (mediaQuery.matches) {
                  const style = document.createElement('style');
                  style.innerHTML = '.left.sidebar { transition: none !important; }';
                  document.head.appendChild(style);
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