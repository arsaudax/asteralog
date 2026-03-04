import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { gardenFilter } from "./quartz-custom/utils/filter"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "Asteralog Garden",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "ru-RU",
    baseUrl: "garden.asteralog.ru",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#faf8f8",
          darkgray: "#4e4e4e",
          gray: "#a8a8a8",
          lightgray: "#e5e5e5",
          secondary: "#a2845e",
          tertiary: "#7e5a3a",
          highlight: "rgba(162, 132, 94, 0.15)",
        },
        darkMode: {
          light: "#161618",
          darkgray: "#afafaf",
          gray: "#646464",
          lightgray: "#393639",
          secondary: "#a2845e",
          tertiary: "#7e5a3a",
          highlight: "rgba(162, 132, 94, 0.15)",
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
      Plugin.Latex({ renderEngine: "katex" }),
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
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
    ],
    filters: [
        gardenFilter
    ],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config