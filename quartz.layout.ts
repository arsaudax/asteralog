import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import * as CustomComponent from "./quartz-custom/components"
import { FileTrieNode } from "./quartz/components/scripts/spa"
import { QuartzComponentProps } from "./quartz/components/types"
import {
  gardenFilter,
  blogFilter,
  gardenExplorerFilter,
  blogRecentsFilter,
  blogArchiveFilter,
  blogBacklinksFilter,
  recentNotesFilter,
  backlinksFilter
} from "./quartz-custom/utils/filter"

// Определяем тип сайта
const siteType = typeof process !== 'undefined' 
  ? (process.env?.BASE_URL?.includes('blog') ? 'blog' : 'garden')
  : 'garden'

// Базовая левая панель
const baseLeftPanel = [
  CustomComponent.PageTitle({ 
    logo: "/static/thistle.png",
    logoAlt: "Логотип"
  }),
  Component.MobileOnly(Component.Spacer()),
  Component.Search(),
  Component.Darkmode(),
]

// Конфигурация проводника (для сада)
const explorerConfig = {
  filterFn: gardenExplorerFilter,
  mapFn: (node: FileTrieNode) => {
    if (!node.isFolder) {
      node.displayName = "⊹ " + node.displayName
    }
  },
  title: "Сад",
  folderDefaultState: "collapsed",
  useSavedState: true,
}

// Конфигурация графа (используем filterFn для надёжности)
const graphConfig = {
  localGraph: {
    showTags: false,
    filterFn: (node: any) => {
      const tags = node.tags || []
      return !tags.includes("garden-graph-exclude")
    },
  },
  globalGraph: {
    showTags: false,
    filterFn: (node: any) => {
      const tags = node.tags || []
      return !tags.includes("garden-graph-exclude")
    },
  },
}

// Конфигурация обратных ссылок
const backlinksConfig = {
  hideWhenEmpty: true,
  filter: (file: any) => backlinksFilter(file, siteType),
}

// Общие компоненты
export const sharedPageComponents: SharedLayout = {
  head: CustomComponent.Head(),
  header: [CustomComponent.ScrollBehavior()],
  afterBody: [],
  footer: CustomComponent.Footer({
    links: {
      Telegram: "https://t.me/asteralog",
      Asteragram: "https://www.instagram.com/al.bogat",
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
    CustomComponent.TagList(),
  ],
  left: [
    ...baseLeftPanel,
    Component.ConditionalRender({
      component: Component.Explorer(explorerConfig),
      condition: () => {
        if (typeof window === 'undefined') return true;
        return window.innerWidth > 800;
      }
    }),
  ],
  right: [
    Component.DesktopOnly(Component.Graph(graphConfig)),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(backlinksConfig),
    CustomComponent.TagList(),
  ],
  afterBody: [],
}

export const gardenListPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
  ],
  left: [
    ...baseLeftPanel,
    Component.ConditionalRender({
      component: Component.Explorer(explorerConfig),
      condition: () => {
        if (typeof window === 'undefined') return true;
        return window.innerWidth > 800;
      }
    }),
  ],
  right: [],
  afterBody: [],
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
    CustomComponent.TagList(),
  ],
  left: baseLeftPanel,
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(backlinksConfig),
    CustomComponent.TagList(),
    Component.ConditionalRender({
      component: Component.RecentNotes({
        limit: 5,
        showTags: true,
        filter: blogRecentsFilter,
        title: "Недавние записи"
      }),
      condition: (props: QuartzComponentProps) => {
        return props.fileData.slug !== 'index' && props.fileData.slug !== 'archive'
      }
    }),
    Component.ConditionalRender({
      component: CustomComponent.ArchiveLink({ 
        sidebar: true,
        text: "Все записи →📚",
        emoji: "none"
      }),
      condition: (props: QuartzComponentProps) => {
        return props.fileData.slug !== 'index' && props.fileData.slug !== 'archive'
      }
    }),
  ],
  afterBody: [
    Component.ConditionalRender({
      component: CustomComponent.BlogIndex({
        limit: 5,
        filter: blogRecentsFilter
      }),
      condition: (props: QuartzComponentProps) => {
        return props.fileData.slug === 'index'
      }
    }),
    Component.ConditionalRender({
      component: CustomComponent.ArchiveLink({ 
        text: "Все записи →📚",
        emoji: "none"
      }),
      condition: (props: QuartzComponentProps) => {
        return props.fileData.slug === 'index'
      }
    }),
    Component.ConditionalRender({
      component: CustomComponent.BlogIndex({
        limit: 1000,
        filter: blogArchiveFilter
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
    Component.ConditionalRender({
      component: CustomComponent.ArchiveLink({ 
        sidebar: true,
        text: "Все записи →📚",
        emoji: "none"
      }),
      condition: (props: QuartzComponentProps) => {
        return props.fileData.slug?.startsWith('tags/') || false
      }
    }),
  ],
  afterBody: [],
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

export default defaultContentPageLayout