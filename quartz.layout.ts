import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { gardenFilter, blogFilter } from "./quartz-custom/utils/filter"
import * as CustomComponent from "./quartz-custom/components"
import CustomTagList from "./quartz-custom/components/TagList"
import { FileTrieNode } from "./quartz/components/scripts/spa"
import { QuartzComponentProps } from "./quartz/components/types"

// Определяем тип сайта
const siteType = typeof process !== 'undefined' 
  ? (process.env?.BASE_URL?.includes('blog') ? 'blog' : 'garden')
  : 'garden'

// Базовая левая панель (общая для всех layout)
const baseLeftPanel = [
  CustomComponent.PageTitle({ 
    logo: "/static/thistle.png",
    logoAlt: "Логотип"
  }),
  Component.MobileOnly(Component.Spacer()),
  Component.Search(),
  Component.Darkmode(),
]

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
  title: "Сад",
  folderDefaultState: "collapsed",
  sort: (a, b) => {
    if (a.isFolder && !b.isFolder) return -1
    if (!a.isFolder && b.isFolder) return 1
    return (a.displayName || '').localeCompare(b.displayName || '')
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
  title: "Граф",
}

// Конфигурация обратных ссылок
const backlinksConfig = {
  hideWhenEmpty: true,
  title: "Обратные ссылки",
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
// GARDEN LAYOUTS
// ==============================
export const gardenContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
    Component.ConditionalRender({
      component: CustomComponent.ContentMeta({ showReadingTime: true }),
      condition: (props: QuartzComponentProps) => {
        return props.fileData.slug !== 'index'
      }
    }),
    Component.TagList(),
  ],
  left: [
    ...baseLeftPanel,
    Component.DesktopOnly(Component.Explorer(explorerConfig)),
  ],
  right: [
    Component.DesktopOnly(Component.Graph(graphConfig)),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(backlinksConfig),
    CustomTagList(),
  ],
}

export const gardenListPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
    Component.ConditionalRender({
      component: CustomComponent.ContentMeta({ showReadingTime: true }),
      condition: (props: QuartzComponentProps) => {
        return props.fileData.slug !== 'index'
      }
    }),
  ],
  left: [
    ...baseLeftPanel,
    Component.DesktopOnly(Component.Explorer(explorerConfig)),
  ],
  right: [],
}

// ==============================
// BLOG LAYOUTS
// ==============================
export const blogContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
    Component.ConditionalRender({
      component: CustomComponent.ContentMeta({ showReadingTime: true }),
      condition: (props: QuartzComponentProps) => {
        return props.fileData.slug !== 'index' && props.fileData.slug !== 'archive'
      }
    }),
    Component.TagList(),
  ],
  left: baseLeftPanel,
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(backlinksConfig),
    CustomTagList(),
    Component.ConditionalRender({
      component: Component.RecentNotes({
        limit: 5,
        showTags: true,
        filter: blogFilter,
        title: "Недавние записи"
      }),
      condition: (props: QuartzComponentProps) => {
        return props.fileData.slug !== 'index' && props.fileData.slug !== 'archive'
      }
    }),
    // Ссылка на архив - только на страницах постов (без эмодзи)
    Component.ConditionalRender({
      component: CustomComponent.ArchiveLink({ 
        sidebar: true,
        emoji: "none"
      }),
      condition: (props: QuartzComponentProps) => {
        return props.fileData.slug !== 'index' && props.fileData.slug !== 'archive'
      }
    }),
  ],
  afterBody: [
    // Главная страница - 5 последних постов
    Component.ConditionalRender({
      component: CustomComponent.BlogIndex({
        limit: 5,
        filter: blogFilter
      }),
      condition: (props: QuartzComponentProps) => {
        return props.fileData.slug === 'index'
      }
    }),
    // Ссылка на архив под лентой на главной
    Component.ConditionalRender({
      component: CustomComponent.ArchiveLink({ 
        text: "Все записи →",
        emoji: "none"
      }),
      condition: (props: QuartzComponentProps) => {
        return props.fileData.slug === 'index'
      }
    }),
    // Архив - все посты
    Component.ConditionalRender({
      component: CustomComponent.BlogIndex({
        limit: 1000,
        filter: () => true
      }),
      condition: (props: QuartzComponentProps) => {
        return props.fileData.slug === 'archive'
      }
    }),
  ],
}

export const blogListPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
  ],
  left: baseLeftPanel,
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    // Ссылка на архив в списках тегов (без эмодзи)
    Component.ConditionalRender({
      component: CustomComponent.ArchiveLink({ 
        sidebar: true,
        emoji: "none"
      }),
      condition: (props: QuartzComponentProps) => {
        return props.fileData.slug?.startsWith('tags/') || false
      }
    }),
  ],
}

// ==============================
// DEFAULT LAYOUT SELECTORS
// ==============================

export const defaultContentPageLayout: PageLayout =
  siteType === 'garden' 
    ? gardenContentPageLayout 
    : blogContentPageLayout

export const defaultListPageLayout: PageLayout =
  siteType === 'garden'
    ? gardenListPageLayout
    : blogListPageLayout