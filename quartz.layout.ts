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
// ОБЩИЕ КОМПОНЕНТЫ (рендерятся отдельно от колонок)
// ==================================================
export const sharedPageComponents: SharedLayout = {
  // head: CustomComponent.Head(),                  // [1] КАСТОМНЫЙ HEAD
  head: Component.Head(),                           // [1] СТАНДАРТНЫЙ HEAD (временная замена)
  
  header: [
    // CustomComponent.ScrollBehavior(),            // [2] КАСТОМНЫЙ СКРОЛЛ
  ],
  
  afterBody: [],
  
  // footer: CustomComponent.Footer({                // [3] КАСТОМНЫЙ ФУТЕР
  //   links: {
  //     Telegram: "https://t.me/asteralog",
  //     Instagram: "https://www.instagram.com/al.bogat",
  //     Behance: "https://www.behance.net/arsaudax",
  //   },
  // }),
  footer: Component.Footer(),                        // [3] СТАНДАРТНЫЙ ФУТЕР (временная замена)
}

// ==================================================
// БАЗОВЫЙ МАКЕТ (для всех страниц)
// ==================================================
const baseLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(breadcrumbsConfig),
    Component.ArticleTitle(),
    // CustomComponent.ContentMeta({ showReadingTime: true }),  // [4] КАСТОМНЫЙ CONTENT META
    Component.ContentMeta(),                                   // [4] СТАНДАРТНЫЙ CONTENT META
    // Component.TagList(),                                     // [5] СТАНДАРТНЫЙ TAGLIST
    // CustomComponent.TagList(),                               // [5] КАСТОМНЫЙ TAGLIST (закомментирован)
  ],
  
  left: [
    // CustomComponent.PageTitle({                             // [6] КАСТОМНЫЙ PAGE TITLE
    //   logo: "/static/thistle.png", 
    //   title: "Asteralog" 
    // }),
    Component.PageTitle(),                                     // [6] СТАНДАРТНЫЙ PAGE TITLE
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer(explorerConfig)),
  ],
  
  right: [
    Component.DesktopOnly(Component.Graph(graphConfig)),
    Component.DesktopOnly(Component.TableOfContents()),
    // CustomComponent.TagList(),                               // [7] КАСТОМНЫЙ TAGLIST
    // CustomComponent.ArchiveLink({                            // [8] КАСТОМНЫЙ ARCHIVE LINK
    //   sidebar: true, 
    //   emoji: "after",
    //   hideIfEmpty: true 
    // }),
    Component.Backlinks(backlinksConfig),
  ],
  
  afterBody: [],
}

// ==================================================
// LAYOUT ДЛЯ САДА
// ==================================================
export const gardenLayout: PageLayout = {
  ...baseLayout,
  // здесь можно добавить специфичные для сада компоненты
}

// ==================================================
// LAYOUT ДЛЯ БЛОГА
// ==================================================
export const blogLayout: PageLayout = {
  ...baseLayout,
  left: [
    // CustomComponent.PageTitle({ 
    //   logo: "/static/thistle.png", 
    //   title: "Asteralog" 
    // }),
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    // без Explorer для блога
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    // CustomComponent.TagList(),
    // CustomComponent.ArchiveLink({ 
    //   sidebar: true, 
    //   emoji: "after",
    //   hideIfEmpty: true 
    // }),
    Component.Backlinks(backlinksConfig),
  ],
}

// ==================================================
// LAYOUT ДЛЯ ГЛАВНОЙ СТРАНИЦЫ БЛОГА
// ==================================================
export const blogHomeLayout: PageLayout = {
  beforeBody: [
    // CustomComponent.BlogIndex(),  // [9] КАСТОМНЫЙ BLOG INDEX
  ],
  
  left: [
    // CustomComponent.PageTitle({ 
    //   logo: "/static/thistle.png", 
    //   title: "Asteralog" 
    // }),
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
  ],
  
  right: [
    // CustomComponent.TagList(),
    // CustomComponent.ArchiveLink({ 
    //   sidebar: true, 
    //   emoji: "after",
    //   hideIfEmpty: true 
    // }),
  ],
  
  afterBody: [],
}

// ==================================================
// LAYOUT ДЛЯ СТРАНИЦ-СПИСКОВ (теги, папки)
// ==================================================
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(breadcrumbsConfig),
    Component.ArticleTitle(),
  ],
  
  left: [
    // CustomComponent.PageTitle({ 
    //   logo: "/static/thistle.png", 
    //   title: "Asteralog" 
    // }),
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer(explorerConfig)),
  ],
  
  right: [],
  
  afterBody: [],
}

// ==================================================
// LAYOUT ДЛЯ 404 СТРАНИЦЫ
// ==================================================
export const notFoundLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
  ],
  
  left: [
    // CustomComponent.PageTitle({ 
    //   logo: "/static/thistle.png", 
    //   title: "Asteralog" 
    // }),
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
  ],
  
  right: [],
  
  afterBody: [],
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

export default defaultContentPageLayout