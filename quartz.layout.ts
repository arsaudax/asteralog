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
// SHARED COMPONENTS — ТОЛЬКО ДЛЯ ГОЛОВЫ И ФУТЕРА
// ==================================================
export const sharedPageComponents: SharedLayout = {
  head: CustomComponent.Head(),
  header: [],  // оставляем пустым, так как PageTitle в левой панели
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
// ОСНОВНОЙ LAYOUT — БЕЗ ФУТЕРА В ПРАВОЙ ПАНЕЛИ
// ==================================================
export const defaultContentPageLayout: PageLayout = {
  // head и header из shared, но НЕ footer
  head: sharedPageComponents.head,
  header: sharedPageComponents.header,
  
  beforeBody: [
    Component.Breadcrumbs(breadcrumbsConfig),
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
    Component.TagList(),
  ],
  
  // Левая панель
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
    // Недавние заметки
    Component.RecentNotes({
      limit: siteType === 'blog' ? 8 : 5,
      showTags: siteType === 'blog',
      title: siteType === 'blog' ? "Последние записи" : "Недавние заметки",
      filter: siteType === 'blog' ? blogFilter : gardenFilter,
    }),
    CustomComponent.TagList(),
    Component.Backlinks(backlinksConfig),
  ],
  
  // afterBody — пусто
  afterBody: [],
  
  // footer — отдельно, после right
  footer: sharedPageComponents.footer,
}

// Макет для страниц-списков
export const defaultListPageLayout: PageLayout = {
  head: sharedPageComponents.head,
  header: sharedPageComponents.header,
  
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
  
  afterBody: [],
  
  footer: sharedPageComponents.footer,
}