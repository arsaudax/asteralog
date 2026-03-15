import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import * as CustomComponent from "./quartz-custom/components"
import { FileTrieNode } from "./quartz/components/scripts/spa"

// Конфигурация (без siteType, потому что layout один для всех)
const explorerConfig = {
  filterFn: (node: FileTrieNode) => {
    const hasExcludedTag = node.data?.frontmatter?.tags?.includes("explorer-exclude") === true
    return !hasExcludedTag
  },
  mapFn: (node: FileTrieNode) => {
    if (!node.isFolder) node.displayName = "⊹ " + node.displayName
  },
  title: "Сад",
  folderDefaultState: "collapsed",
  useSavedState: true,
}

const graphConfig = {
  localGraph: { showTags: false, excludeTags: ["graph-exclude"] },
  globalGraph: { showTags: false, excludeTags: ["graph-exclude"] },
}

const backlinksConfig = { hideWhenEmpty: true }
const breadcrumbsConfig = { rootName: "🏠" }

// ==================================================
// ОБЩИЕ КОМПОНЕНТЫ
// ==================================================
export const sharedPageComponents: SharedLayout = {
  head: CustomComponent.Head(),
  header: [CustomComponent.ScrollBehavior()],
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
// ЕДИНСТВЕННЫЙ МАКЕТ ДЛЯ ВСЕХ СТРАНИЦ
// ==================================================
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(breadcrumbsConfig),
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
    CustomComponent.TagList(),
  ],
  
  left: [
    CustomComponent.PageTitle({ logo: "/static/thistle.png", title: "Asteralog" }),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer(explorerConfig)),
  ],
  
  right: [
    Component.DesktopOnly(Component.Graph(graphConfig)),
    Component.DesktopOnly(Component.TableOfContents()),
    CustomComponent.TagList(),
    Component.Backlinks(backlinksConfig),
  ],
  
  afterBody: [],
}

// ==================================================
// МАКЕТ ДЛЯ СТРАНИЦ-СПИСКОВ
// ==================================================
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(breadcrumbsConfig),
    Component.ArticleTitle(),
  ],
  
  left: [
    CustomComponent.PageTitle({ logo: "/static/thistle.png", title: "Asteralog" }),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer(explorerConfig)),
  ],
  
  right: [],
  
  afterBody: [],
}

export default defaultContentPageLayout