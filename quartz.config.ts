import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import * as CustomPlugins from "./quartz-custom/plugins"

// Определяем, какой сайт собирается с поддержкой SITE_TYPE и отладкой
const siteType = process.env.SITE_TYPE || 
                 (process.env.BASE_URL?.includes('blog') ? 'blog' : 'garden')

// Добавляем отладочный вывод (будет видно в логах GitHub Actions)
console.log(`\n🔧 Quartz Config: Building for ${siteType} site`)
console.log(`🔧 BASE_URL: ${process.env.BASE_URL || 'не задан'}`)
console.log(`🔧 SITE_TYPE: ${process.env.SITE_TYPE || 'не задан'}`)

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
  ignorePatterns: ["private", "templates", ".obsidian"],
  defaultDateType: "created",
}

// Цвета для сада (СВЕТЛАЯ тема по умолчанию)
const gardenColors = {
  lightMode: {   // Светлая тема для сада (по умолчанию)
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
  darkMode: {    // Тёмная тема для сада (переключаемая)
    light: "#343434",
    lightgray: "#393639",
    gray: "#aaaaaa",
    darkgray: "#ededed",
    dark: "#ffffff",
    secondary: "#ab7d4c",
    tertiary: "#7c5736",
    highlight: "rgba(162, 132, 94, 0.15)",
    textHighlight: "#b3aa0288",
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
  darkMode: {    // Тёмная тема для блога (по умолчанию)
    light: "#343434",
    lightgray: "#393639",
    gray: "#aaaaaa",
    darkgray: "#ededed",
    dark: "#ffffff",
    secondary: "#ab7d4c",
    tertiary: "#7c5736",
    highlight: "rgba(162, 132, 94, 0.15)",
    textHighlight: "#b3aa0288",
  },
}

// Выбираем нужные цвета на основе siteType
const colors = siteType === 'blog' ? blogColors : gardenColors

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
      CustomPlugins.RemoveTags({ tags: ["garden", "blog"] }),
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