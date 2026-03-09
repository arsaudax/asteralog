import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import * as CustomPlugins from "./quartz-custom/plugins"

// Определяем, какой сайт собирается с поддержкой SITE_TYPE и отладкой
const siteType = process.env.SITE_TYPE || 
                 (process.env.BASE_URL?.includes('blog') ? 'blog' : 'garden')

// Отладка только в development
if (process.env.NODE_ENV !== "production") {
  console.log(`\n🔧 ===== QUARTZ CONFIG =====`)
  console.log(`🔧 Site: ${siteType === 'blog' ? '📝 Blog' : '🌱 Garden'}`)
  console.log(`🔧 BASE_URL: ${process.env.BASE_URL || 'не задан'}`)
  console.log(`🔧 SITE_TYPE: ${process.env.SITE_TYPE || 'не задан'}`)
  console.log(`🔧 Default theme: dark`)
  console.log(`🔧 ========================\n`)
}

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
  // defaultDateType: "created", // УДАЛЕНО
}

// Цвета для сада (СВЕТЛАЯ тема по умолчанию)
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
    tertiary: "#d4b69b",
    highlight: "rgba(181, 151, 122, 0.15)",
    textHighlight: "#2e2a24",
  },
}

// Цвета для блога (ТЁМНАЯ тема по умолчанию)
const blogColors = {
  lightMode: {
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
  darkMode: {
    light: "#1a1c1e",
    lightgray: "#2e3235",
    gray: "#4a4f54",
    darkgray: "#d4d4d4",
    dark: "#ffffff",
    secondary: "#b5977a",
    tertiary: "#d4b69b",
    highlight: "rgba(181, 151, 122, 0.15)",
    textHighlight: "#2e2a24",
  },
}

// Выбираем цвета на основе siteType
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
      CustomPlugins.ThemeFromFrontmatter({ defaultTheme: "dark" }),
      Plugin.CreatedModifiedDate({
        priority: ["filesystem"], // Только файловая система
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
      // Plugin.Darkmode(), // ← УДАЛЕНО!
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