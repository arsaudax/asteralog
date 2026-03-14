// quartz.layout.ts
import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { gardenFilter, blogFilter } from "./quartz-custom/utils/filter"
import * as CustomComponent from "./quartz-custom/components"
import { FileTrieNode } from "./quartz/components/scripts/spa"

// Определяем тип сайта
const siteType = (process.env?.SITE_TYPE as 'garden' | 'blog') || 'garden'

// Конфигурация проводника
const explorerConfig = {
  filterFn: (node: FileTrieNode) => {
    const hasExcludedTag = node.data?.tags?.includes("explorer-exclude")
    return !hasExcludedTag
  },
  mapFn: (node: FileTrieNode) => {
    if (!node.isFolder) {
      node.displayName = "⊹ " + node.displayName
    }
  },
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
// SHARED COMPONENTS — ТОЛЬКО head И footer
// ==================================================
export const sharedPageComponents: SharedLayout = {
  head: CustomComponent.Head(),
  header: [],  // оставляем пустым
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
// ОСНОВНОЙ LAYOUT — КАК В СТАРОМ РАБОЧЕМ ФАЙЛЕ
// ==================================================
export const defaultContentPageLayout: PageLayout = {
  head: sharedPageComponents.head,
  header: sharedPageComponents.header,
  
  beforeBody: [
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
    Component.TagList(),
  ],
  
  left: [
    CustomComponent.PageTitle({ 
      logo: "/static/thistle.png",
      title: "Asteralog"
    }),
    Component.Search(),
    Component.Darkmode(),
    // Проводник только в саду
    ...(siteType === 'garden' 
      ? [Component.Explorer(explorerConfig)]
      : []),
  ],
  
  right: [
    // Граф только в саду
    ...(siteType === 'garden'
      ? [Component.Graph(graphConfig)]
      : []),
    Component.TableOfContents(),
    Component.Backlinks(),
  ],
  
  afterBody: [],
  
  footer: sharedPageComponents.footer,
}

export const defaultListPageLayout: PageLayout = {
  head: sharedPageComponents.head,
  header: sharedPageComponents.header,
  
  beforeBody: [Component.ArticleTitle()],
  
  left: [
    CustomComponent.PageTitle({ 
      logo: "/static/thistle.png",
      title: "Asteralog"
    }),
    Component.Search(),
    Component.Darkmode(),
    Component.Explorer(explorerConfig),
  ],
  
  right: [],
  
  afterBody: [],
  
  footer: sharedPageComponents.footer,
}