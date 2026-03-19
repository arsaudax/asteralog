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

    // Канонический URL
    const canonicalUrl = `https://${cfg.baseUrl}${fileData.slug === "index" ? "" : fileData.slug}`

    // Генерация Schema.org разметки
    const generateSchema = () => {
      const baseUrl = `https://${cfg.baseUrl}`
      const slug = fileData.slug
      const url = slug === "index" ? baseUrl : `${baseUrl}${slug}`
      const isArticle = !!fileData.frontmatter?.date
      const publishDate = fileData.frontmatter?.date || fileData.dates?.created
      const modifiedDate = fileData.dates?.modified || publishDate

      const schema: any = {
        "@context": "https://schema.org",
        "@type": isArticle ? "BlogPosting" : "WebPage",
        "@id": url,
        url: url,
        name: fileData.frontmatter?.title || cfg.pageTitle,
        description: description,
        inLanguage: cfg.locale || "ru-RU",
      }

      if (isArticle) {
        schema.headline = fileData.frontmatter?.title
        schema.datePublished = publishDate
        schema.dateModified = modifiedDate
        schema.author = {
          "@type": "Person",
          "name": fileData.frontmatter?.author || "Александр",
        }
        
        if (fileData.frontmatter?.cover || ogImageDefaultPath) {
          schema.image = fileData.frontmatter?.cover || ogImageDefaultPath
        }
      }

      return JSON.stringify(schema)
    }

    return (
      <head>
        {/* ===== ПРАВИЛЬНЫЙ СКРИПТ ТЕМЫ И ТИПА САЙТА ===== */}
        <script
          blocking="render"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Тема
                  const saved = localStorage.getItem('theme');
                  const theme = saved || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                  
                  // Тип сайта (сад/блог)
                  const isBlog = window.location.hostname.includes('blog');
                  document.documentElement.setAttribute('data-site-type', isBlog ? 'blog' : 'garden');
                  document.documentElement.classList.add(isBlog ? 'site-blog' : 'site-garden');
                  
                  if (!saved) {
                    localStorage.setItem('theme', 'dark');
                  }
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                  document.documentElement.setAttribute('data-site-type', 'garden');
                  document.documentElement.classList.add('site-garden');
                }
              })();
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

        {/* ===== ДОБАВЛЕНО: SEO-УЛУЧШЕНИЯ ===== */}
        {/* Каноническая ссылка */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Индексация */}
        <meta name="robots" content="index, follow" />
        
        {/* Автор */}
        <meta name="author" content={fileData.frontmatter?.author || "Александр"} />
        
        {/* Ключевые слова из тегов */}
        {fileData.frontmatter?.tags && (
          <meta name="keywords" content={fileData.frontmatter.tags.join(', ')} />
        )}

        {/* Подтверждение для поисковых систем (раскомментировать при необходимости) */}
        <meta name="google-site-verification" content="jI4JENr6uPnov8nCuV2R1NzWDomZHyK_kcVVGpFuTeg" />
        <meta name="yandex-verification" content="acdb3af63d06f102" />
        <meta name="google-site-verification" content="jI4JENr6uPnov8nCuV2R1NzWDomZHyK_kcVVGpFuTeg" />
        <meta name="yandex-verification" content="5c0a66c333cdc745" />

        {/* ===== Open Graph / Twitter ===== */}
        <meta name="og:site_name" content={cfg.pageTitle} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta property="og:description" content={description} />
        <meta property="og:image:alt" content={description} />
        <meta property="og:locale" content={cfg.locale || "ru_RU"} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:site" content="@ваш_аккаунт" /> {/* добавить при наличии */}

        {!usesCustomOgImage && (
          <>
            <meta property="og:image" content={ogImageDefaultPath} />
            <meta property="og:image:url" content={ogImageDefaultPath} />
            <meta property="og:image:secure_url" content={ogImageDefaultPath} />
            <meta name="twitter:image" content={ogImageDefaultPath} />
            <meta
              property="og:image:type"
              content={`image/${getFileExtension(ogImageDefaultPath) ?? "png"}`}
            />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
          </>
        )}

        {cfg.baseUrl && (
          <>
            <meta property="twitter:domain" content={cfg.baseUrl} />
            <meta property="og:url" content={socialUrl} />
            <meta property="twitter:url" content={socialUrl} />
          </>
        )}

        {/* ===== ДОБАВЛЕНО: Структурированные данные (Schema.org) ===== */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateSchema()
          }}
        />

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