// quartz.layout.ts
import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import * as CustomComponent from "./quartz-custom/components"

// Определяем тип сайта
const siteType = (process.env?.SITE_TYPE as 'garden' | 'blog') || 'garden'

// Конфигурация проводника
const explorerConfig = {
  title: siteType === 'garden' ? "Сад" : "Блог",
  folderDefaultState: "collapsed",
  useSavedState: true,
}

// Конфигурация графа
const graphConfig = {
  localGraph: {
    showTags: false,
    excludeTags: ["graph-exclude"],
  },
  globalGraph: {
    showTags: false,
    excludeTags: ["graph-exclude"],
  },
}

// ==================================================
// КОМПОНЕНТЫ ВЕРХНЕЙ ПАНЕЛИ
// ==================================================
const headerComponents = [
  CustomComponent.PageTitle({ 
    logo: "/static/thistle.png",
    title: "Asteralog"
  }),
  Component.Search(),
  Component.Darkmode(),
]

// ==================================================
// БАЗОВЫЙ LAYOUT (ОБЩИЙ ДЛЯ ВСЕХ)
// ==================================================
export const sharedPageComponents: SharedLayout = {
  head: CustomComponent.Head(),
  header: headerComponents,
  afterBody: [],
  footer: CustomComponent.Footer({
    links: {
      Telegram: "https://t.me/asteralog",
      Instagram: "https://www.instagram.com/al.bogat",
      Behance: "https://www.behance.net/arsaudax",
    },
  }),
}

// ==================================================
// GARDEN (САД) — ПОЛНЫЙ НАБОР ПАНЕЛЕЙ
// ==================================================
export const gardenContentPageLayout: PageLayout = {
  ...sharedPageComponents,
  beforeBody: [
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
    Component.TagList(),
  ],
  left: [
    Component.DesktopOnly(Component.Explorer(explorerConfig)),
  ],
  right: [
    Component.DesktopOnly(Component.Graph(graphConfig)),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

export const gardenListPageLayout: PageLayout = {
  ...sharedPageComponents,
  beforeBody: [Component.ArticleTitle()],
  left: [
    Component.DesktopOnly(Component.Explorer(explorerConfig)),
  ],
  right: [],
}

// ==================================================
// BLOG — МИНИМАЛИСТИЧНЫЙ (ТОЛЬКО ОГЛАВЛЕНИЕ)
// ==================================================
export const blogContentPageLayout: PageLayout = {
  ...sharedPageComponents,
  beforeBody: [
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
    Component.TagList(),
  ],
  left: [],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

export const blogListPageLayout: PageLayout = {
  ...sharedPageComponents,
  beforeBody: [Component.ArticleTitle()],
  left: [],
  right: [],
}

// ==================================================
// ВЫБОР LAYOUT В ЗАВИСИМОСТИ ОТ ТИПА САЙТА
// ==================================================
export const defaultContentPageLayout: PageLayout =
  siteType === 'garden' ? gardenContentPageLayout : blogContentPageLayout

export const defaultListPageLayout: PageLayout =
  siteType === 'garden' ? gardenListPageLayout : blogListPageLayout