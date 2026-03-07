import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { gardenFilter, blogFilter } from "./quartz-custom/utils/filter"
import * as CustomComponent from "./quartz-custom/components"
import TagList from "./quartz-custom/components/TagList"
import BlogIndex from "./quartz-custom/components/BlogIndex"
import { FileTrieNode } from "./quartz/components/scripts/spa"

// Определяем тип сайта по BASE_URL
const getSiteType = () => {
  if (typeof process === "undefined") return "garden"
  const baseUrl = process.env?.BASE_URL || ""
  return baseUrl.includes("blog") ? "blog" : "garden"
}

// Конфигурация проводника
const explorerConfig = {
  filterFn: (node: FileTrieNode) => {
    const hasExcludedTag = node.data?.tags?.includes("explorer-exclude") === true
    return !hasExcludedTag
  },
  mapFn: (node: FileTrieNode) => {
    if (!node.isFolder) {
      node.displayName = "⊹ " + node.displayName
    }
  },
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

// Конфигурация обратных ссылок
const backlinksConfig = {
  hideWhenEmpty: true,
}

// Конфигурация хлебных крошек
const breadcrumbsConfig = {
  rootName: "🏡",
}

// Общие компоненты
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: CustomComponent.Footer({
    links: {
      Telegram: "https://t.me/asteralog",
      Instagram: "https://www.instagram.com/al.bogat",
      Behance: "https://www.behance.net/arsaudax",
    },
  }),
}

// ==============================
// МАКЕТ САДА
// ==============================

export const gardenContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(breadcrumbsConfig),
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer(explorerConfig)),
  ],
  right: [
    Component.DesktopOnly(Component.Graph(graphConfig)),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(backlinksConfig),
    Component.RecentNotes({
      limit: 5,
      showTags: false,
      filter: gardenFilter,
    }),
  ],
}

// ==============================
// МАКЕТ ПОСТА БЛОГА
// ==============================

export const blogPostPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(breadcrumbsConfig),
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
    Component.TagList(),
  ],
  left: [],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    TagList(),
    Component.Backlinks(backlinksConfig),
  ],
}

// ==============================
// МАКЕТ ГЛАВНОЙ СТРАНИЦЫ БЛОГА
// ==============================

export const blogIndexPageLayout: PageLayout = {
  beforeBody: [
    BlogIndex,  // ← ИСПРАВЛЕНО: просто компонент, без вызова
  ],
  left: [],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    TagList(),
    Component.Backlinks(backlinksConfig),
  ],
}

// ==============================
// ГЛАВНЫЙ ВЫБОР МАКЕТА
// ==============================

export const defaultContentPageLayout = ((props: any) => {
  const siteType = getSiteType()

  // САД
  if (siteType === "garden") {
    return gardenContentPageLayout
  }

  // БЛОГ
  if (props.fileData.slug === "index") {
    return blogIndexPageLayout
  }

  return blogPostPageLayout
}) as unknown as PageLayout