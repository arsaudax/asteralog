import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import * as CustomPlugins from "./quartz-custom/plugins"

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

// Цвета для сада
const gardenColors = {
  darkMode: {
    light: "#1a1c1e",        // bg-primary
    lightgray: "#2e3235",     // bg-secondary
    gray: "#4a4f54",          // border-color
    darkgray: "#d4d4d4",      // text-secondary
    dark: "#ffffff",          // text-primary
    secondary: "#af7d4c",     // link-color
    tertiary: "#7c5736",      // link-hover
    highlight: "rgba(181, 151, 122, 0.15)",
  },
  lightMode: {
    light: "#f9f7f4",
    lightgray: "#e5e5e5",
    gray: "#b8b8b8",
    darkgray: "#4a4a49",
    dark: "#2b2b2b",
    secondary: "#af7d4c",
    tertiary: "#7c5736",
    highlight: "rgba(162, 132, 94, 0.15)",
  }
}

// Цвета для блога
const blogColors = {
  darkMode: {
    light: "#1a1c1e",
    lightgray: "#2e3235",
    gray: "#4a4f54",
    darkgray: "#d4d4d4",
    dark: "#ffffff",
    secondary: "#af7d4c",
    tertiary: "#7c5736",
    highlight: "rgba(181, 151, 122, 0.15)",
  },
  lightMode: {
    light: "#ffffff",
    lightgray: "#f0f0f0",
    gray: "#9a9a9a",
    darkgray: "#666666",
    dark: "#333333",
    secondary: "#af7d4c",
    tertiary: "#7c5736",
    highlight: "rgba(162, 132, 94, 0.1)",
  }
}

// Выбираем цвета в зависимости от типа сайта
const colors = siteType === 'blog' ? blogColors : gardenColors

const config: QuartzConfig = {
  configuration: {
    ...baseConfig,
    baseUrl: process.env.BASE_URL || '',
    theme: {
      defaultTheme: "dark",  // принудительно тёмная тема
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
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest", openLinksInNewTab: true }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
      CustomPlugins.RemoveTags({ tags: ["garden", "blog", "explorer-exclude", "graph-exclude"] }),
      CustomPlugins.ImageCaption(),  // ← ДОБАВИТЬ СЮДА (после RemoveTags)
      CustomPlugins.Img(),           // ← ДОЛЖЕН БЫТЬ ПОСЛЕ ImageCaption
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
      CustomPlugins.CustomStyles(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config