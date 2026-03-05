import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import * as CustomPlugins from "./quartz-custom/plugins"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "Asteralog",
    pageTitleSuffix: " | Asteralog",
    enableSPA: false,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "ru-RU",
    // baseUrl НЕТ! Задаётся через переменную окружения
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Inter",
        body: "Inter",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#f9f7f4",      // основной фон сайта
          lightgray: "#e5e5e5",   // второстепенный фон
          gray: "#b8b8b8",        // границы
          darkgray: "#4a4a49",    // второстепенный текст
          dark: "#2b2b2b",        // основной текст
          secondary: "#ab7d4c",   // акцентный цвет
          tertiary: "#7c5736",    // дополнительный акцент
          highlight: "rgba(162, 132, 94, 0.15)", // подсветка фона
          textHighlight: "#fff23688", // выделение текста
        },
        darkMode: {
          light: "#343434",       // основной фон сайта (тёмный)
          lightgray: "#393639",    // второстепенный фон
          gray: "#575756",         // границы
          darkgray: "#ededed",     // второстепенный текст
          dark: "#ffffff",         // основной текст
          secondary: "#ab7d4c",    // акцентный цвет (тот же)
          tertiary: "#7c5736",     // дополнительный акцент
          highlight: "rgba(162, 132, 94, 0.15)", // подсветка фона
          textHighlight: "#b3aa0288", // выделение текста
        },
      },
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
      CustomPlugins.RemoveTags({ tags: ["garden", "blog"] }), // Удаляем служебные теги
      // CustomPlugins.Img(), // Раскомментировать, если нужен zoom изображений
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