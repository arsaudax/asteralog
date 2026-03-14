// quartz.layout.ts
import { PageLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
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
  localGraph: { showTags: false, excludeTags: ["graph-exclude"] },
  globalGraph: { showTags: false, excludeTags: ["graph-exclude"] },
}

// ==================================================
// LAYOUT ДЛЯ САДА — со всеми панелями
// ==================================================
export const gardenLayout: PageLayout = {
  head: CustomComponent.Head(),
  
  beforeBody: [
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
    Component.TagList(),
  ],
  
  left: [
    CustomComponent.PageTitle({ logo: "/static/thistle.png", title: "Asteralog" }),
    Component.Search(),
    Component.Darkmode(),
    Component.Explorer(explorerConfig),
  ],
  
  right: [
    Component.Graph(graphConfig),
    Component.TableOfContents(),
    Component.Backlinks(),
  ],
  
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
// LAYOUT ДЛЯ БЛОГА — без графа, без проводника
// ==================================================
export const blogLayout: PageLayout = {
  head: CustomComponent.Head(),
  
  beforeBody: [
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
    Component.TagList(),
  ],
  
  left: [],  // в блоге нет левой панели
  
  right: [
    Component.TableOfContents(),
    Component.Backlinks(),
  ],
  
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
// ВЫБОР LAYOUT В ЗАВИСИМОСТИ ОТ ТИПА САЙТА
// ==================================================
export const defaultContentPageLayout: PageLayout = 
  siteType === 'garden' ? gardenLayout : blogLayout

export const defaultListPageLayout: PageLayout = 
  siteType === 'garden' ? gardenLayout : blogLayout