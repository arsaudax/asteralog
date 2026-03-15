import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import * as CustomPlugins from "./quartz-custom/plugins"

// ==================================================
// ОПРЕДЕЛЕНИЕ ТИПА САЙТА
// ==================================================
const siteType = process.env.SITE_TYPE || 
                 (process.env.BASE_URL?.includes('blog') ? 'blog' : 'garden')

console.log(`\n🔧 Quartz Config: Building for ${siteType} site`)
console.log(`🔧 BASE_URL: ${process.env.BASE_URL || 'не задан'}`)

// ==================================================
// БАЗОВАЯ КОНФИГУРАЦИЯ
// ==================================================
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
// ЦВЕТОВЫЕ СХЕМЫ
// ==================================================

// Цвета для сада (darkMode = тема по умолчанию)
const gardenColors = {
  lightMode: {
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
  darkMode: {
    light: "#1a1c1e",
    lightgray: "#2e3235",
    gray: "#4a4f54",
    darkgray: "#d4d4d4",
    dark: "#ffffff",
    secondary: "#b5977a",
    tertiary: "#ab7d4c",
    highlight: "rgba(181, 151, 122, 0.15)",
    textHighlight: "#b3aa0288",
  },
}

// Цвета для блога (darkMode = тема по умолчанию)
const blogColors = {
  lightMode: {
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
  darkMode: {
    light: "#1a1c1e",
    lightgray: "#2e3235",
    gray: "#4a4f54",
    darkgray: "#d4d4d4",
    dark: "#ffffff",
    secondary: "#b5977a",
    tertiary: "#ab7d4c",
    highlight: "rgba(181, 151, 122, 0.15)",
    textHighlight: "#b3aa0288",
  },
}

// ==================================================
// ОСНОВНАЯ КОНФИГУРАЦИЯ
// ==================================================
const config: QuartzConfig = {
  configuration: {
    ...baseConfig,
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Inter",
        body: "Inter",
        code: "JetBrains Mono",
      },
      colors: siteType === 'blog' ? blogColors : gardenColors,
    },
  },
  plugins: {
    // ==================================================
    // ТРАНСФОРМЕРЫ (обрабатывают Markdown)
    // ==================================================
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
      Plugin.ObsidianFlavoredMarkdown({ 
        enableInHtmlEmbed: false 
      }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({
        markdownLinkResolution: "shortest",
        openLinksInNewTab: true,
      }),
      Plugin.Description(),
      Plugin.Latex({ 
        renderEngine: "katex" 
      }),
      // Кастомные трансформеры
      CustomPlugins.RemoveTags({ 
        tags: ["garden", "blog", "graph-exclude", "explorer-exclude", "backlinks-exclude"] 
      }),
      CustomPlugins.Img(),
    ],

    // ==================================================
    // ФИЛЬТРЫ (исключают файлы)
    // ==================================================
    filters: [
      Plugin.RemoveDrafts(),
    ],

    // ==================================================
    // ЭМИТТЕРЫ (генерируют файлы)
    // ==================================================
    emitters: [
      // Сначала базовые
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      
      // Потом индексы
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
        rssFullHtml: false,
        includeEmptyFiles: false,
      }),
      
      // Потом ассеты
      Plugin.Assets(),
      Plugin.Static(),
      
      // Затем кастомные (ВАЖНО: после стандартных)
      CustomPlugins.Static(),      // копирует файлы из quartz-custom/static
      CustomPlugins.CustomStyles(), // компилирует custom.scss
      
      // И наконец 404
      Plugin.NotFoundPage(),
    ],
  },
}

export default config