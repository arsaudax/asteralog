import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { gardenFilter, blogFilter } from "./quartz-custom/utils/filter"
import * as CustomComponent from "./quartz-custom/components"
import CustomTagList from "./quartz-custom/components/TagList"
import { FileTrieNode } from "./quartz/components/scripts/spa"
import { QuartzComponentProps } from "./quartz/components/types"
import {
  gardenExplorerFilter,
  gardenGraphFilter,
  blogRecentsFilter,
  blogBacklinksFilter,
  blogArchiveFilter,
  searchFilter
} from "./quartz-custom/utils/filter"

// Определяем тип сайта
const siteType = typeof process !== 'undefined' 
  ? (process.env?.BASE_URL?.includes('blog') ? 'blog' : 'garden')
  : 'garden'

// Базовая левая панель (ЕДИНАЯ для всех)
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
  filterFn: gardenExplorerFilter,  // ← ИСПРАВЛЕНО: использует garden-explorer-exclude
  mapFn: (node: FileTrieNode) => {
    if (!node.isFolder) {
      node.displayName = "⊹ " + node.displayName
    }
  },
  title: "Сад",
  folderDefaultState: "collapsed",
  useSavedState: true,
}

// Конфигурация графа (для сада)
const graphConfig = {
  localGraph: {
    showTags: false,
    filterFn: gardenGraphFilter,  // ← ИСПРАВЛЕНО: использует garden-graph-exclude
  },
  globalGraph: {
    showTags: false,
    filterFn: gardenGraphFilter,  // ← ИСПРАВЛЕНО: использует garden-graph-exclude
  },
}

// Конфигурация обратных ссылок (с учётом типа сайта)
const backlinksConfig = {
  hideWhenEmpty: true,
  filter: (file: any) => {
    if (siteType === 'blog') {
      return blogBacklinksFilter(file)  // ← ИСПРАВЛЕНО: использует blog-backlinks-exclude
    }
    return true
  }
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
    // ContentMeta только если это НЕ главная страница
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
    // Эксплорер только на десктопе
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
    CustomTagList(),
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
    // ContentMeta только если это НЕ главная и НЕ архив
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
        filter: (file) => blogRecentsFilter(file),  // ← ИСПРАВЛЕНО: использует blog-recents-exclude
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
    // Главная страница - последние записи (с фильтром blog-recents-exclude)
    Component.ConditionalRender({
      component: CustomComponent.BlogIndex({
        limit: 5,
        filter: (file) => blogRecentsFilter(file)  // ← ИСПРАВЛЕНО: исключает blog-recents-exclude
      }),
      condition: (props: QuartzComponentProps) => {
        return props.fileData.slug === 'index'
      }
    }),
    // Ссылка на архив под лентой на главной
    Component.ConditionalRender({
      component: CustomComponent.ArchiveLink({ 
        text: "Все записи →📚",
        emoji: "none"
      }),
      condition: (props: QuartzComponentProps) => {
        return props.fileData.slug === 'index'
      }
    }),
    // Архив - все посты (с фильтром blog-archive-exclude)
    Component.ConditionalRender({
      component: CustomComponent.BlogIndex({
        limit: 1000,
        filter: (file) => blogArchiveFilter(file)  // ← НОВЫЙ ФИЛЬТР: исключает blog-archive-exclude
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