import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { gardenFilter, blogFilter } from "./quartz-custom/utils/filter"
import * as CustomComponent from "./quartz-custom/components"
import TagList from "./quartz-custom/components/TagList"
import { FileTrieNode } from "./quartz/components/scripts/spa"
import { QuartzComponentProps } from "./quartz/components/types"

// Определяем тип сайта
const siteType = typeof process !== 'undefined' 
  ? (process.env?.BASE_URL?.includes('blog') ? 'blog' : 'garden')
  : 'garden'

console.log(`\n🔧 Layout: Building for ${siteType === 'blog' ? '📝 Blog' : '🌱 Garden'}`)

// Конфигурации
const explorerConfig = {
  filterFn: (node: FileTrieNode) => {
    const hasExcludedTag = node.data?.tags?.includes("explorer-exclude") === true
    return !hasExcludedTag
  },
  mapFn: (node: FileTrieNode) => {
    if (!node.isFolder) {
      node.displayName = "⊹ " + node.displayName
    }
  },
  title: "⊹ Сад",
}

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

const backlinksConfig = {
  hideWhenEmpty: true,
}

const breadcrumbsConfig = {
  rootName: "🏡",
  showCurrentPage: true,
}

// ==============================
// SHARED COMPONENTS
// ==============================
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
    Component.Breadcrumbs(breadcrumbsConfig),
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer(explorerConfig)),
  ],
  right: [
    Component.DesktopOnly(Component.Graph(graphConfig)),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(backlinksConfig),
    Component.RecentNotes({
      limit: 5,
      showTags: false,
      // filter: gardenFilter,  // УБРАЛИ
      title: "Недавние заметки",
    }),
    TagList(),
  ],
}

export const gardenListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(breadcrumbsConfig),
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer(explorerConfig)),
  ],
  right: [], // Явно пустой массив
}

// ==============================
// BLOG LAYOUTS
// ==============================
export const blogContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(breadcrumbsConfig),
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(backlinksConfig),
    Component.RecentNotes({
      limit: 8,
      showTags: true,
      // filter: blogFilter,  // УБРАЛИ
      title: "Последние записи",
    }),
    TagList(),
  ],
  // Условный afterBody для главной страницы блога
  afterBody: [
    Component.ConditionalRender({
      component: CustomComponent.BlogIndex({
        limit: 100,
        // filter: blogFilter  // УБРАЛИ
      }),
      condition: (props: QuartzComponentProps) => {
        return props.fileData.slug === 'index'
      }
    })
  ],
}

// Для совместимости оставляем, но не используем напрямую
const blogIndexPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(breadcrumbsConfig),
    Component.ArticleTitle(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.RecentNotes({
      limit: 10,
      showTags: true,
      // filter: blogFilter,  // УБРАЛИ
      title: "Недавние записи",
    }),
    TagList(),
    Component.Backlinks(backlinksConfig),
  ],
  afterBody: [
    CustomComponent.BlogIndex({
      limit: 100,
      // filter: blogFilter  // УБРАЛИ
    })
  ],
}

export const blogListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(breadcrumbsConfig),
    Component.ArticleTitle(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.RecentNotes({
      limit: 10,
      showTags: true,
      // filter: blogFilter,  // УБРАЛИ
    }),
  ],
}

// ==============================
// DEFAULT LAYOUT SELECTORS
// ==============================

// Для контентных страниц возвращаем ТОЛЬКО объект PageLayout
export const defaultContentPageLayout: PageLayout =
  siteType === 'garden' 
    ? gardenContentPageLayout 
    : blogContentPageLayout

// Для страниц-списков
export const defaultListPageLayout: PageLayout =
  siteType === 'garden'
    ? gardenListPageLayout
    : blogListPageLayout