import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import * as CustomPlugins from "./quartz-custom/plugins" // ПОЛНОСТЬЮ ОТКЛЮЧАЕМ

// Определяем, какой сайт собирается
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

// Цвета для сада (garden.asteralog.ru)
const gardenColors = {
  lightMode: {
    light: "#f9f7f4",
    lightgray: "#e5e5e5",
    gray: "#9a9a9a",
    darkgray: "#4a4a49",
    dark: "#2b2b2b",
    secondary: "#ab7d4c",
    tertiary: "#7c5736",
    highlight: "rgba(171, 125, 76, 0.15)",
    textHighlight: "#fff23688",
  },
  darkMode: {
    light: "#1a1c1e",
    lightgray: "#2e3235",
    gray: "#4a4f54",
    darkgray: "#d4d4d4",
    dark: "#ffffff",
    secondary: "#ab7d4c",
    tertiary: "#7c5736",
    highlight: "rgba(171, 125, 76, 0.15)",
    textHighlight: "#2e2a24",
  },
}

// Цвета для блога (blog.asteralog.ru)
const blogColors = {
  lightMode: {
    light: "#ffffff",
    lightgray: "#f0f0f0",
    gray: "#9a9a9a",
    darkgray: "#666666",
    dark: "#333333",
    secondary: "#ab7d4c",
    tertiary: "#7c5736",
    highlight: "rgba(171, 125, 76, 0.1)",
    textHighlight: "#fff23688",
  },
  darkMode: {
    light: "#1a1c1e",
    lightgray: "#2e3235",
    gray: "#4a4f54",
    darkgray: "#d4d4d4",
    dark: "#ffffff",
    secondary: "#ab7d4c",
    tertiary: "#7c5736",
    highlight: "rgba(171, 125, 76, 0.15)",
    textHighlight: "#2e2a24",
  },
}

// Выбираем цвета в зависимости от типа сайта
const colors = siteType === 'blog' ? blogColors : gardenColors

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
      colors: colors,
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
      // CustomPlugins.CustomStyles(), // ❌ ВРЕМЕННО УБРАНО
      Plugin.NotFoundPage(),
    ],
  },
}

export default config