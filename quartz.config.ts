import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import * as CustomPlugins from "./quartz-custom/plugins"

// Определяем, какой сайт собирается
const siteType = process.env.SITE_TYPE || 
                 (process.env.BASE_URL?.includes('blog') ? 'blog' : 'garden')

// Добавляем отладочный вывод
console.log(`\n🔧 ===== QUARTZ CONFIG =====`)
console.log(`🔧 Site: ${siteType === 'blog' ? '📝 Blog' : '🌱 Garden'}`)
console.log(`🔧 BASE_URL: ${process.env.BASE_URL || 'не задан'}`)
console.log(`🔧 SITE_TYPE: ${process.env.SITE_TYPE || 'не задан'}`)
console.log(`🔧 Default theme: dark (принудительно для обоих сайтов)`)
console.log(`🔧 ========================\n`)

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

// Цвета для сада (ТЁМНАЯ тема по умолчанию)
const gardenColors = {
  lightMode: {   // Светлая тема для сада (переключаемая)
    light: "#f9f7f4",
    lightgray: "#e5e5e5",
    gray: "#9a9a9a",
    darkgray: "#4a4a49",
    dark: "#2b2b2b",
    secondary: "#ab7d4c",
    tertiary: "#7c5736",
    highlight: "rgba(162, 132, 94, 0.15)",
    textHighlight: "#fff23688",
  },
  darkMode: {    // Тёмная тема для сада (ПО УМОЛЧАНИЮ)
    light: "#1a1c1e",       // темный фон
    lightgray: "#2e3235",   // темные границы
    gray: "#4a4f54",        // второстепенный текст
    darkgray: "#d4d4d4",    // основной текст
    dark: "#ffffff",        // заголовки
    secondary: "#b5977a",   // ссылки
    tertiary: "#d4b69b",    // ховеры
    highlight: "rgba(181, 151, 122, 0.15)", // выделение
    textHighlight: "#2e2a24", // выделенный текст
  },
}

// Цвета для блога (ТЁМНАЯ тема по умолчанию)
const blogColors = {
  lightMode: {   // Светлая тема для блога (переключаемая)
    light: "#ffffff",
    lightgray: "#f0f0f0",
    gray: "#9a9a9a",
    darkgray: "#666666",
    dark: "#333333",
    secondary: "#ab7d4c",
    tertiary: "#7c5736",
    highlight: "rgba(162, 132, 94, 0.1)",
    textHighlight: "#fff23688",
  },
  darkMode: {    // Тёмная тема для блога (ПО УМОЛЧАНИЮ)
    light: "#1a1c1e",       // темный фон
    lightgray: "#2e3235",   // темные границы
    gray: "#4a4f54",        // второстепенный текст
    darkgray: "#d4d4d4",    // основной текст
    dark: "#ffffff",        // заголовки
    secondary: "#b5977a",   // ссылки
    tertiary: "#d4b69b",    // ховеры
    highlight: "rgba(181, 151, 122, 0.15)", // выделение
    textHighlight: "#2e2a24", // выделенный текст
  },
}

// Выбираем нужные цвета на основе siteType
const colors = siteType === 'blog' ? blogColors : gardenColors

const config: QuartzConfig = {
  configuration: {
    ...baseConfig,
    baseUrl: process.env.BASE_URL || '',
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Inter",
        body: "Inter",
        code: "JetBrains Mono",
      },
      colors: colors,
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({
        markdownLinkResolution: "shortest",
        openLinksInNewTab: true,
      }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
      CustomPlugins.RemoveTags({ tags: ["garden", "blog", "explorer-exclude", "graph-exclude"] }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
        rssFullHtml: false,
        includeEmptyFiles: false,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      CustomPlugins.Static(),
      CustomPlugins.CustomStyles(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config