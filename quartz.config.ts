// quartz.config.ts
import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import * as CustomPlugins from "./quartz-custom/plugins"
import { readFile } from "fs/promises"
import { join } from "path"

// Определяем, какой сайт собирается (только для title)
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

// ==================================================
// ЕДИНЫЕ ЦВЕТА ДЛЯ ОБОИХ САЙТОВ
// ==================================================

const colors = {
  lightMode: {
    light: "#f9f7f4",        // 🔥 ИЗМЕНЕНО: светло-бежевый для сада
    lightgray: "#e5e5e5",    // 🔥 ИЗМЕНЕНО: светлый серый для карточек
    gray: "#9a9a9a",         // muted текст
    darkgray: "#4a4a49",     // 🔥 ИЗМЕНЕНО: второстепенный текст
    dark: "#2b2b2b",         // 🔥 ИЗМЕНЕНО: основной текст
    secondary: "#ab7d4c",    // ссылки (золотой)
    tertiary: "#7c5736",     // ссылки при наведении
    highlight: "rgba(171, 125, 76, 0.15)",
    textHighlight: "#fff23688",
  },
  darkMode: {
    light: "#1a1c1e",        // тёмный фон
    lightgray: "#2e3235",    // второстепенный фон
    gray: "#4a4f54",         // границы
    darkgray: "#d4d4d4",     // основной текст
    dark: "#ffffff",         // заголовки
    secondary: "#ab7d4c",    // ссылки
    tertiary: "#7c5736",     // ссылки при наведении
    highlight: "rgba(171, 125, 76, 0.15)",
    textHighlight: "#2e2a24",
  },
}

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
      
      // 🔥 НОВЫЙ ЭМИТТЕР: кастомные стили
      {
        name: "custom-styles",
        async emit({ argv }) {
          try {
            const customCssPath = join(argv.directory, "quartz/styles/custom.scss")
            const content = await readFile(customCssPath, "utf-8")
            return [{
              content,
              slug: "index" as any,
              ext: ".scss",
              frontmatter: {},
              text: content,
              description: "",
              dates: {}
            }]
          } catch (err) {
            console.warn("⚠️ custom.scss not found, skipping...")
            return []
          }
        },
        async *emitPartial() {},
        async *partialEmitInfo() {}
      } as any,
      
      Plugin.NotFoundPage(),
    ],
  },
}

export default config