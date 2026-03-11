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

// Цвета для сада - ТОЛЬКО ДЛЯ QUARTZ
const gardenColors = {
  lightMode: {
    light: "#1a1c1e",        // меняем на тёмный фон
    lightgray: "#2e3235",     // второстепенный фон
    gray: "#4a4f54",          // границы
    darkgray: "#d4d4d4",      // основной текст
    dark: "#ffffff",          // заголовки
    secondary: "#b5977a",     // ссылки
    tertiary: "#d4b69b",      // ссылки при наведении
    highlight: "rgba(181, 151, 122, 0.15)", // выделение
    textHighlight: "#2e2a24",
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

// Цвета для блога - ТОЛЬКО ДЛЯ QUARTZ
const blogColors = {
  lightMode: {
    light: "#1a1c1e",        // тоже тёмный фон
    lightgray: "#2e3235",
    gray: "#4a4f54",
    darkgray: "#d4d4d4",
    dark: "#ffffff",
    secondary: "#b5977a",
    tertiary: "#d4b69b",
    highlight: "rgba(181, 151, 122, 0.15)",
    textHighlight: "#2e2a24",
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
      colors: colors,  // Quartz нужны цвета
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