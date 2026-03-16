import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import * as CustomPlugins from "./quartz-custom/plugins"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "Asteralog",
    pageTitleSuffix: " | Asteralog",
    enableSPA: false,
    enablePopovers: true,
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
          light: "#f9f7f4",
          lightgray: "#e5e5e5",
          gray: "#b8b8b8",
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
          textHighlight: "#b3aa0288",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({ priority: ["frontmatter", "filesystem"] }),
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
      CustomPlugins.RemoveTags({ tags: ["garden", "blog", "graph-exclude", "explorer-exclude"] }),
      CustomPlugins.Img(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({ enableSiteMap: true, enableRSS: true, rssFullHtml: false }),
      Plugin.Assets(),
      Plugin.Static(),
      CustomPlugins.Static(),
      CustomPlugins.CustomStyles(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config