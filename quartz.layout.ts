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
  title: "Сад",
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

// Общие компоненты
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

// ==============================
// GARDEN LAYOUTS
// ==============================
export const gardenContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
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
  afterBody: [],
}

export const gardenListPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
  ],
  left: [
    ...baseLeftPanel,
    Component.DesktopOnly(Component.Explorer(explorerConfig)),
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
    CustomComponent.ContentMeta({ showReadingTime: true }),
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
        filter: blogFilter
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