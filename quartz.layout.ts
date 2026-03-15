import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import * as CustomComponent from "./quartz-custom/components"
import { FileTrieNode } from "./quartz/components/scripts/spa"

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
  }
}

// Конфигурация обратных ссылок
const backlinksConfig = {
  hideWhenEmpty: true
}

// Конфигурация хлебных крошек
const breadcrumbsConfig = {
  rootName: "🏠"
}

// Общие компоненты для всех страниц
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: CustomComponent.Footer({
    links: {
      Telegram: "https://t.me/asteralog",
      Instagram: "https://www.instagram.com/al.bogat",
      Behance: "https://www.behance.net/arsaudax"
    },
  }),
}

// Макет для страниц сада (с Explorer)
const gardenPageLayout: PageLayout = {
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
  right: [
    Component.DesktopOnly(Component.Graph(graphConfig)),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.RecentNotes({ 
      limit: 5,
      title: "Недавние заметки",
    }),
    CustomComponent.TagList(),
    Component.Backlinks(backlinksConfig),
  ],
}

// Макет для страниц блога (без Explorer)
const blogPageLayout: PageLayout = {
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
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    CustomComponent.TagList(),
    Component.Backlinks(backlinksConfig),
  ],
}

// Макет для главной страницы блога (со списком постов)
const blogHomeLayout: PageLayout = {
  beforeBody: [
    CustomComponent.BlogIndex(), // BlogIndex только на главной
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
  ],
  right: [
    CustomComponent.TagList(),
  ],
}

// Макет для страниц-списков (теги, папки) - ЭТОТ ЭКСПОРТ НУЖЕН QUARTZ
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(breadcrumbsConfig),
    Component.ArticleTitle(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer(explorerConfig)),
  ],
  right: [],
}

// Основной макет для страниц контента
export const defaultContentPageLayout: PageLayout = (props) => {
  const baseUrl = typeof window === 'undefined' 
    ? process.env?.BASE_URL || ''
    : window.location.hostname
  
  const isBlog = baseUrl.includes('blog')
  const isHomePage = props.fileData.slug === 'index'
  
  if (isBlog && isHomePage) {
    return blogHomeLayout
  } else if (isBlog) {
    return blogPageLayout
  } else {
    return gardenPageLayout
  }
}

// Экспорты, которые ожидает Quartz
export { defaultContentPageLayout as default } // для обратной совместимости