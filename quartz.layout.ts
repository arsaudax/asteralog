// quartz.layout.ts
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

// ==================================================
// КОНФИГУРАЦИИ КОМПОНЕНТОВ
// ==================================================

// Конфигурация проводника (только на десктопе)
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
  useSavedState: true, // Сохраняем состояние папок
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

// ==================================================
// КОМПОНЕНТЫ ДЛЯ ВЕРХНЕЙ ПАНЕЛИ (HEADER)
// ==================================================
const headerComponents = [
  CustomComponent.PageTitle({ 
    logo: "/static/thistle.png",
    logoAlt: "Логотип",
    title: "Asteralog"
  }),
  Component.Search(),
  Component.Darkmode(),
]

// ==================================================
// БАЗОВЫЕ КОМПОНЕНТЫ (общие для всех layout)
// ==================================================
export const sharedPageComponents: SharedLayout = {
  head: CustomComponent.Head(),      // Только мета и скрипты
  header: headerComponents,           // ✅ ГОРИЗОНТАЛЬНАЯ ПАНЕЛЬ
  afterBody: [
    CustomComponent.ScrollBehavior(), // 🔥 Добавлен компонент скролла
  ],
  footer: CustomComponent.Footer({
    links: {
      Telegram: "https://t.me/asteralog",
      Instagram: "https://www.instagram.com/al.bogat",
      Behance: "https://www.behance.net/arsaudax",
    },
  }),
}

// ==================================================
// GARDEN LAYOUTS
// ==================================================
export const gardenContentPageLayout: PageLayout = {
  ...sharedPageComponents,
  beforeBody: [
    Component.ArticleTitle(),
    Component.ConditionalRender({
      component: CustomComponent.ContentMeta({ showReadingTime: true }),
      condition: (props: QuartzComponentProps) => props.fileData.slug !== 'index'
    }),
    Component.TagList(),
  ],
  left: [
    Component.DesktopOnly(Component.Explorer(explorerConfig)), // ✅ ТОЛЬКО НА ДЕСКТОПЕ
  ],
  right: [
    Component.DesktopOnly(Component.Graph(graphConfig)),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(backlinksConfig),
    CustomTagList(),
  ],
}

export const gardenListPageLayout: PageLayout = {
  ...sharedPageComponents,
  beforeBody: [
    Component.ArticleTitle(),
    Component.ConditionalRender({
      component: CustomComponent.ContentMeta({ showReadingTime: true }),
      condition: (props: QuartzComponentProps) => props.fileData.slug !== 'index'
    }),
  ],
  left: [
    Component.DesktopOnly(Component.Explorer(explorerConfig)),
  ],
  right: [],
}

// ==================================================
// BLOG LAYOUTS
// ==================================================
export const blogContentPageLayout: PageLayout = {
  ...sharedPageComponents,
  beforeBody: [
    Component.ArticleTitle(),
    Component.ConditionalRender({
      component: CustomComponent.ContentMeta({ showReadingTime: true }),
      condition: (props: QuartzComponentProps) => 
        props.fileData.slug !== 'index' && props.fileData.slug !== 'archive'
    }),
    Component.TagList(),
  ],
  left: [], // В блоге левая панель пустая
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
      condition: (props: QuartzComponentProps) => 
        props.fileData.slug !== 'index' && props.fileData.slug !== 'archive'
    }),
    Component.ConditionalRender({
      component: CustomComponent.ArchiveLink({ 
        sidebar: true,
        text: "Все записи →📚",
        emoji: "none"
      }),
      condition: (props: QuartzComponentProps) => 
        props.fileData.slug !== 'index' && props.fileData.slug !== 'archive'
    }),
    // 🔥 Добавлен RSS для главной страницы блога
    Component.ConditionalRender({
      component: Component.Rss({ limit: 10 }),
      condition: (props: QuartzComponentProps) => props.fileData.slug === 'index'
    }),
  ],
  afterBody: [
    Component.ConditionalRender({
      component: CustomComponent.BlogIndex({ limit: 5, filter: blogFilter }),
      condition: (props: QuartzComponentProps) => props.fileData.slug === 'index'
    }),
    Component.ConditionalRender({
      component: CustomComponent.ArchiveLink({ text: "Все записи →📚", emoji: "none" }),
      condition: (props: QuartzComponentProps) => props.fileData.slug === 'index'
    }),
    Component.ConditionalRender({
      component: CustomComponent.BlogIndex({ limit: 1000, filter: () => true }),
      condition: (props: QuartzComponentProps) => props.fileData.slug === 'archive'
    }),
  ],
}

export const blogListPageLayout: PageLayout = {
  ...sharedPageComponents,
  beforeBody: [Component.ArticleTitle()],
  left: [],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.ConditionalRender({
      component: CustomComponent.ArchiveLink({ 
        sidebar: true,
        text: "Все записи →📚",
        emoji: "none"
      }),
      condition: (props: QuartzComponentProps) => props.fileData.slug?.startsWith('tags/') || false
    }),
  ],
}

// ==================================================
// DEFAULT LAYOUT SELECTORS
// ==================================================
export const defaultContentPageLayout: PageLayout =
  siteType === 'garden' ? gardenContentPageLayout : blogContentPageLayout

export const defaultListPageLayout: PageLayout =
  siteType === 'garden' ? gardenListPageLayout : blogListPageLayout