// quartz.config.ts
import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "Asteralog",
    pageTitleSuffix: "",
    enableSPA: false,
    enablePopovers: true,
    analytics: { provider: "plausible" },
    locale: "ru-RU",
    baseUrl: process.env.BASE_URL || "garden.asteralog.ru",
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
      Plugin.SyntaxHighlighting({ keepBackground: false }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
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
      Plugin.ContentIndex({ enableSiteMap: true, enableRSS: true }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config