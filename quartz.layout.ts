import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import * as CustomComponent from "./quartz-custom/components"
import { FileTrieNode } from "./quartz/components/scripts/spa"

// ==================================================
// ОПРЕДЕЛЕНИЕ ТИПА САЙТА
// ==================================================
const siteType = (process.env?.SITE_TYPE as 'garden' | 'blog') || 'garden'

// ==================================================
// КОНФИГУРАЦИЯ КОМПОНЕНТОВ
// ==================================================

// Конфигурация проводника
const explorerConfig = {
  filterFn: (node: FileTrieNode) => {
    const hasExcludedTag = node.data?.frontmatter?.tags?.includes("explorer-exclude") === true
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
    excludeTags: ["graph-exclude"] 
  },
  globalGraph: { 
    showTags: false, 
    excludeTags: ["graph-exclude"] 
  },
}

// Конфигурация обратных ссылок
const backlinksConfig = {
  hideWhenEmpty: true
}

// Конфигурация хлебных крошек
const breadcrumbsConfig = {
  rootName: "🏠"
}

// ==================================================
// ОБЩИЕ КОМПОНЕНТЫ
// ==================================================
export const sharedPageComponents: SharedLayout = {
  head: CustomComponent.Head(),
  header: [CustomComponent.ScrollBehavior()], // Добавляем скролл-поведение
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
// LAYOUT ДЛЯ САДА
// ==================================================
export const gardenLayout: PageLayout = {
  head: CustomComponent.Head(),
  
  beforeBody: [
    Component.Breadcrumbs(breadcrumbsConfig),
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
    Component.TagList(),
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
  
  right: [
    Component.DesktopOnly(Component.Graph(graphConfig)),
    Component.DesktopOnly(Component.TableOfContents()),
    CustomComponent.TagList(), // Дублируется? Проверить
    Component.Backlinks(backlinksConfig),
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
// LAYOUT ДЛЯ БЛОГА
// ==================================================
export const blogLayout: PageLayout = {
  head: CustomComponent.Head(),
  
  beforeBody: [
    Component.Breadcrumbs(breadcrumbsConfig),
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
    Component.TagList(),
  ],
  
  left: [
    CustomComponent.PageTitle({ 
      logo: "/static/thistle.png", 
      title: "Asteralog" 
    }),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    // Без Explorer для блога
  ],
  
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    CustomComponent.TagList(),
    CustomComponent.ArchiveLink({ 
      sidebar: true, 
      emoji: "after",
      hideIfEmpty: true 
    }),
    Component.Backlinks(backlinksConfig),
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
// LAYOUT ДЛЯ ГЛАВНОЙ СТРАНИЦЫ БЛОГА
// ==================================================
export const blogHomeLayout: PageLayout = {
  head: CustomComponent.Head(),
  
  beforeBody: [
    CustomComponent.BlogIndex(), // Список постов только на главной
  ],
  
  left: [
    CustomComponent.PageTitle({ 
      logo: "/static/thistle.png", 
      title: "Asteralog" 
    }),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
  ],
  
  right: [
    CustomComponent.TagList(),
    CustomComponent.ArchiveLink({ 
      sidebar: true, 
      emoji: "after",
      hideIfEmpty: true 
    }),
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
// LAYOUT ДЛЯ СТРАНИЦ-СПИСКОВ (теги, папки)
// ==================================================
export const defaultListPageLayout: PageLayout = {
  head: CustomComponent.Head(),
  
  beforeBody: [
    Component.Breadcrumbs(breadcrumbsConfig),
    Component.ArticleTitle(),
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
  
  footer: CustomComponent.Footer({
    links: {
      Telegram: "https://t.me/asteralog",
      Instagram: "https://www.instagram.com/al.bogat",
      Behance: "https://www.behance.net/arsaudax",
    },
  }),
}

// ==================================================
// LAYOUT ДЛЯ 404 СТРАНИЦЫ
// ==================================================
export const notFoundLayout: PageLayout = {
  head: CustomComponent.Head(),
  
  beforeBody: [
    Component.ArticleTitle(),
  ],
  
  left: [
    CustomComponent.PageTitle({ 
      logo: "/static/thistle.png", 
      title: "Asteralog" 
    }),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
  ],
  
  right: [],
  
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
// ВЫБОР LAYOUT В ЗАВИСИМОСТИ ОТ ТИПА САЙТА И СТРАНИЦЫ
// ==================================================
export const defaultContentPageLayout: PageLayout = (props) => {
  const isBlog = siteType === 'blog'
  const isHomePage = props.fileData.slug === 'index'
  
  if (isBlog && isHomePage) {
    return blogHomeLayout
  } else if (isBlog) {
    return blogLayout
  } else {
    return gardenLayout
  }
}

// Для обратной совместимости
export default defaultContentPageLayout