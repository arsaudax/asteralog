// quartz.config.ts
import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

// Определяем тип сайта с отладкой
const siteType = process.env.SITE_TYPE || 
                 (process.env.BASE_URL?.includes('blog') ? 'blog' : 'garden')

// Добавим отладочный вывод (будет видно в логах сборки)
console.log(`\n🔧 Quartz Config: Building for ${siteType} site`)
console.log(`🔧 BASE_URL: ${process.env.BASE_URL || 'не задан'}`)
console.log(`🔧 SITE_TYPE: ${process.env.SITE_TYPE || 'не задан'}`)

const config: QuartzConfig = {
  configuration: {
    pageTitle: "Asteralog",
    pageTitleSuffix: siteType === 'blog' ? " | Блог" : " | Цифровой сад",
    enableSPA: false,
    enablePopovers: true,
    analytics: { provider: "plausible" },
    locale: "ru-RU",
    baseUrl: process.env.BASE_URL || 
             (siteType === 'blog' ? 'blog.asteralog.ru' : 'garden.asteralog.ru'),
    ignorePatterns: ["private", "templates", ".obsidian", "**/drafts/*"],
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
          light: "#f9f7f4",
          lightgray: "#e5e5e5",
          gray: "#9a9a9a",
          darkgray: "#4a4a49",
          dark: "#2b2b2b",
          secondary: "#ab7d4c",
          tertiary: "#7c5736",
          highlight: "rgba(171, 125, 76, 0.15)",
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
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({ priority: ["frontmatter", "filesystem"] }),
      Plugin.SyntaxHighlighting({ 
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ 
        enableInHtmlEmbed: false,
        parseTags: true,
        enableCallouts: true,
      }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ 
        markdownLinkResolution: "shortest",
        openLinksInNewTab: true,
      }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
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
        includeEmptyFiles: false,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config