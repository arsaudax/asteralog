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

// Конфигурация проводника (с эмодзи ⊹ перед файлами)
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
  title: "Сад", // Единый стиль заголовка без эмодзи
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
  title: "Граф", // Единый стиль заголовка
}

// Конфигурация обратных ссылок
const backlinksConfig = {
  hideWhenEmpty: true,
  title: "Обратные ссылки", // Единый стиль заголовка
}

// Конфигурация хлебных крошек (не используются)
const breadcrumbsConfig = {
  rootName: "🏡",
  showCurrentPage: true,
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
    CustomComponent.ContentMeta({ showReadingTime: true }),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(), // ← Кнопка переключения темы (под поиском)
    Component.DesktopOnly(Component.Explorer(explorerConfig)),
  ],
  right: [
    Component.DesktopOnly(Component.Graph(graphConfig)),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(backlinksConfig),
    TagList(),
  ],
}

export const gardenListPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(), // ← Кнопка переключения темы (под поиском)
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
    // ContentMeta только НЕ на главной
    Component.ConditionalRender({
      component: CustomComponent.ContentMeta({ showReadingTime: true }),
      condition: (props: QuartzComponentProps) => {
        return props.fileData.slug !== 'index'
      }
    }),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(), // ← Кнопка переключения темы (под поиском)
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(backlinksConfig),
    TagList(),
    // RecentNotes только НЕ на главной странице
    Component.ConditionalRender({
      component: Component.RecentNotes({
        limit: 5,
        showTags: true,
        filter: blogFilter,
        title: "Недавние записи"
      }),
      condition: (props: QuartzComponentProps) => {
        return props.fileData.slug !== 'index'
      }
    })
  ],
  // BlogIndex только на главной странице
  afterBody: [
    Component.ConditionalRender({
      component: CustomComponent.BlogIndex({
        limit: 100,
        filter: blogFilter
      }),
      condition: (props: QuartzComponentProps) => {
        return props.fileData.slug === 'index'
      }
    })
  ],
}

export const blogListPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(), // ← Кнопка переключения темы (под поиском)
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
  ],
}

// ==============================
// DEFAULT LAYOUT SELECTORS
// ==============================

// Для контентных страниц
export const defaultContentPageLayout: PageLayout =
  siteType === 'garden' 
    ? gardenContentPageLayout 
    : blogContentPageLayout

// Для страниц-списков
export const defaultListPageLayout: PageLayout =
  siteType === 'garden'
    ? gardenListPageLayout
    : blogListPageLayout