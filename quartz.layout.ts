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

// Конфигурация обратных ссылок
const backlinksConfig = {
  hideWhenEmpty: true,
}

// Конфигурация хлебных крошек
const breadcrumbsConfig = {
  rootName: "🏡",
}

// ==================================================
// SHARED COMPONENTS — ОБЯЗАТЕЛЬНО ДЛЯ QUARTZ!
// ==================================================
export const sharedPageComponents: SharedLayout = {
  head: CustomComponent.Head(),
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

// ==================================================
// ОСНОВНОЙ LAYOUT
// ==================================================
export const defaultContentPageLayout: PageLayout = {
  ...sharedPageComponents,
  beforeBody: [
    Component.Breadcrumbs(breadcrumbsConfig),
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
    Component.TagList(),
  ],
  
  // Левая панель содержит PageTitle, поиск, тему и проводник
  left: [
    CustomComponent.PageTitle({ 
      logo: "/static/thistle.png",
      title: "Asteralog"
    }),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    // Проводник только в саду и только на десктопе
    ...(siteType === 'garden' 
      ? [Component.DesktopOnly(Component.Explorer(explorerConfig))]
      : []),
  ],
  
  // Правая панель
  right: [
    // Граф только в саду
    ...(siteType === 'garden'
      ? [Component.DesktopOnly(Component.Graph(graphConfig))]
      : []),
    Component.DesktopOnly(Component.TableOfContents()),
    // Недавние заметки с фильтром по типу сайта
    Component.RecentNotes({
      limit: siteType === 'blog' ? 8 : 5,
      showTags: siteType === 'blog',
      title: siteType === 'blog' ? "Последние записи" : "Недавние заметки",
      filter: siteType === 'blog' ? blogFilter : gardenFilter,
    }),
    CustomComponent.TagList(),
    Component.Backlinks(backlinksConfig),
  ],
}

// Макет для страниц-списков (теги, папки)
export const defaultListPageLayout: PageLayout = {
  ...sharedPageComponents,
  beforeBody: [
    Component.Breadcrumbs(breadcrumbsConfig),
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
  ],
  
  left: [
    CustomComponent.PageTitle({ 
      logo: "/static/thistle.png",
      title: "Asteralog"
    }),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer(explorerConfig)),
  ],
  
  right: [],
}