import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import * as CustomPlugins from "./quartz-custom/plugins"

// Определяем, какой сайт собирается с поддержкой SITE_TYPE и отладкой
const siteType = process.env.SITE_TYPE || 
                 (process.env.BASE_URL?.includes('blog') ? 'blog' : 'garden')

// Добавляем отладочный вывод (будет видно в логах GitHub Actions)
console.log(`\n🔧 ===== QUARTZ CONFIG =====`)
console.log(`🔧 Site: ${siteType === 'blog' ? '📝 Blog' : '🌱 Garden'}`)
console.log(`🔧 BASE_URL: ${process.env.BASE_URL || 'не задан'}`)
console.log(`🔧 SITE_TYPE: ${process.env.SITE_TYPE || 'не задан'}`)
console.log(`🔧 Default theme: ${siteType === 'blog' ? 'dark' : 'light'}`)
console.log(`🔧 ========================\n`)

// Базовая конфигурация (общая для обоих сайтов)
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

// Цвета для сада (СВЕТЛАЯ тема по умолчанию)
const gardenColors = {
  lightMode: {   // Светлая тема для сада (по умолчанию)
    light: "#f9f7f4",      // фон
    lightgray: "#e5e5e5",   // границы
    gray: "#9a9a9a",        // второстепенный текст
    darkgray: "#4a4a49",    // основной текст
    dark: "#2b2b2b",        // заголовки
    secondary: "#ab7d4c",   // ссылки
    tertiary: "#7c5736",    // ховеры
    highlight: "rgba(162, 132, 94, 0.15)", // выделение
    textHighlight: "#fff23688", // выделенный текст
  },
  darkMode: {    // Тёмная тема для сада (переключаемая)
    light: "#343434",       // фон
    lightgray: "#393639",    // границы
    gray: "#aaaaaa",         // второстепенный текст
    darkgray: "#ededed",     // основной текст
    dark: "#ffffff",         // заголовки
    secondary: "#ab7d4c",    // ссылки
    tertiary: "#7c5736",     // ховеры
    highlight: "rgba(162, 132, 94, 0.15)", // выделение
    textHighlight: "#b3aa0288", // выделенный текст
  },
}

// Цвета для блога (ТЁМНАЯ тема по умолчанию)
const blogColors = {
  lightMode: {   // Светлая тема для блога (переключаемая)
    light: "#ffffff",       // фон
    lightgray: "#f0f0f0",   // границы
    gray: "#9a9a9a",        // второстепенный текст
    darkgray: "#666666",    // основной текст
    dark: "#333333",        // заголовки
    secondary: "#ab7d4c",   // ссылки
    tertiary: "#7c5736",    // ховеры
    highlight: "rgba(162, 132, 94, 0.1)", // выделение
    textHighlight: "#fff23688", // выделенный текст
  },
  darkMode: {    // Тёмная тема для блога (по умолчанию)
    light: "#1a1c1e",       // тёмный фон
    lightgray: "#2e3235",   // тёмные границы
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
    baseUrl: process.env.BASE_URL || '', // Важно для корректных ссылок
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