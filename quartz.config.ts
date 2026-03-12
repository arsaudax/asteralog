import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import * as CustomPlugins from "./quartz-custom/plugins"

// Определяем, какой сайт собирается (только для title)
const siteType = process.env.SITE_TYPE || 
                 (process.env.BASE_URL?.includes('blog') ? 'blog' : 'garden')

// Базовая конфигурация
const baseConfig = {
  pageTitle: "Asteralog",
  pageTitleSuffix: siteType === 'blog' ? " | Блог" : " | Цифровой сад",
  enableSPA: false,
  enablePopovers: true,
  analytics: {
    provider: "plausible",
  },
  locale: "ru-RU",
  ignorePatterns: ["private", "templates", ".obsidian", "**/draft*"],
  defaultDateType: "created",
}

// ==================================================
// ЕДИНЫЕ ЦВЕТА ДЛЯ ОБОИХ САЙТОВ
// ==================================================

const colors = {
  lightMode: {
    light: "#ffffff",        // светлый фон (будет переопределён для сада)
    lightgray: "#f0f0f0",    // второстепенный фон
    gray: "#9a9a9a",         // muted текст
    darkgray: "#666666",     // второстепенный текст
    dark: "#333333",         // основной текст
    secondary: "#ab7d4c",    // ссылки (золотой)
    tertiary: "#7c5736",     // ссылки при наведении
    highlight: "rgba(171, 125, 76, 0.1)",
    textHighlight: "#fff23688",
  },
  darkMode: {
    light: "#1a1c1e",        // тёмный фон
    lightgray: "#2e3235",    // второстепенный фон
    gray: "#4a4f54",         // границы
    darkgray: "#d4d4d4",     // основной текст
    dark: "#ffffff",         // заголовки
    secondary: "#ab7d4c",    // ссылки
    tertiary: "#7c5736",     // ссылки при наведении
    highlight: "rgba(171, 125, 76, 0.15)",
    textHighlight: "#2e2a24",
  },
}

const config: QuartzConfig = {
  configuration: {
    ...baseConfig,
    baseUrl: process.env.BASE_URL || '',
    theme: {
      defaultTheme: "dark",
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Inter",
        body: "Inter",
        code: "JetBrains Mono",
      },
      colors: colors,  // 👈 ЕДИНЫЕ ЦВЕТА
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({ priority: ["filesystem"] }),
      Plugin.SyntaxHighlighting({
        theme: { light: "github-light", dark: "github-dark" },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ 
        markdownLinkResolution: "shortest", 
        openLinksInNewTab: true 
      }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
      CustomPlugins.RemoveTags({ 
        tags: ["garden", "blog", "explorer-exclude", "graph-exclude"] 
      }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({ enableSiteMap: true, enableRSS: true }),
      Plugin.Assets(),
      Plugin.Static(),
      CustomPlugins.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config