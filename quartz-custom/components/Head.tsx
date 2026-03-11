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
             ЭТАЛОННАЯ РЕАЛИЗАЦИЯ ИЗ PRODUCTION-КЕЙСОВ
             Источники: joshwcomeau.com, bram.us, overreacted.io
             
             ВАЖНО: ТОЛЬКО meta и скрипт до CSS!
             Ничего лишнего до критического скрипта!
        ==================================================== */}
        
        {/* 1. МИНИМАЛЬНЫЕ META - только то, что нужно для работы */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <title>{title}</title>

        {/* 2. КРИТИЧЕСКИЙ СКРИПТ ТЕМЫ - ПЕРВЫЙ! (Josh W. Comeau) */}
        <script>
          {`
            // Максимально примитивно - никаких функций высшего порядка
            // Однобуквенные переменные для минимального размера
            (function(){
              try{
                var d=document.documentElement;
                var t='dark'; // по умолчанию тёмная
                
                // Проверяем localStorage (одна строка)
                try{var s=localStorage.getItem('saved-theme');if(s==='light'){t='light';}}catch(e){}
                
                // Определяем тип сайта по hostname
                if(window.location.hostname.indexOf('blog')>-1){
                  d.classList.add('site-blog');
                }else{
                  d.classList.add('site-garden');
                }
                
                // Устанавливаем атрибут для CSS
                d.setAttribute('saved-theme',t);
                
                // Inline-стили для первого кадра (гарантия)
                if(t==='dark'){
                  d.style.backgroundColor='#1a1c1e';
                  d.style.color='#d4d4d4';
                }else{
                  d.style.backgroundColor='#f9f7f4';
                  d.style.color='#2b2b2b';
                }
                
                // Блокируем переходы
                d.classList.add('no-transitions');
                
              }catch(e){
                // Фатальный fallback
                var d=document.documentElement;
                d.setAttribute('saved-theme','dark');
                d.style.backgroundColor='#1a1c1e';
                d.style.color='#d4d4d4';
                d.classList.add('no-transitions');
              }
            })();
          `}
        </script>

        {/* 3. ОСТАЛЬНЫЕ META (уже не критичные) */}
        <meta name="description" content={description} />
        <link rel="icon" href={iconPath} />
        <meta name="color-scheme" content="dark light" />

        {/* 4. КРИТИЧЕСКИЙ CSS (Bram.us) */}
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

        {/* 5. ПРЕКОННЕКТ ДЛЯ ШРИФТОВ (оптимизация) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* 6. ШРИФТЫ - неблокирующая загрузка */}
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

        {/* 7. OPEN GRAPH / TWITTER META */}
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

        {/* 8. ОСНОВНЫЕ РЕСУРСЫ QUARTZ */}
        {css.map((res) => CSSResourceToStyleElement(res, true))}
        {js
          .filter((res) => res.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((res) =>
          typeof res === "function" ? res(fileData) : res,
        )}

                {/* 9. ФИНАЛЬНЫЙ СКРИПТ - ТОЛЬКО УБИРАЕТ БЛОКИРОВКУ */}
        <script>{`
          (function(){
            // Убираем блокировку переходов после загрузки
            var clean=function(){
              var h=document.documentElement;
              h.classList.remove('no-transitions');
              h.style.backgroundColor='';
              h.style.color='';
            };
            
            if(document.readyState==='loading'){
              window.addEventListener('DOMContentLoaded',function(){
                window.requestAnimationFrame(clean);
              },{once:true});
            }else{
              window.requestAnimationFrame(clean);
            }
            
            // ВНИМАНИЕ: НИКАКОГО КОДА ДЛЯ УСТАНОВКИ ТЕМЫ ЗДЕСЬ НЕТ!
            // Тема уже установлена первым скриптом
            
          })();
        `}</script>

      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor