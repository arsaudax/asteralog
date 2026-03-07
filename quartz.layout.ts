import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { gardenFilter, blogFilter } from "./quartz-custom/utils/filter"
import * as CustomComponent from "./quartz-custom/components"
import TagList from "./quartz-custom/components/TagList"
import { FileTrieNode } from "./quartz/components/scripts/spa"
import { QuartzComponentProps } from "./quartz/components/types"

// Определяем тип сайта по BASE_URL (на уровне модуля!)
const siteType = typeof process !== 'undefined' 
  ? (process.env?.BASE_URL?.includes('blog') ? 'blog' : 'garden')
  : 'garden'

// Добавляем отладку (будет видно при сборке)
console.log(`\n🔧 Layout: Building for ${siteType === 'blog' ? '📝 Blog' : '🌱 Garden'}`)

// Конфигурация проводника
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

// Конфигурация хлебных крошек
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
// МАКЕТ САДА
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
      filter: gardenFilter,
      title: "Недавние заметки",
    }),
    TagList(),
  ],
}

// ==============================
// МАКЕТ БЛОГА (отдельная страница)
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
      filter: blogFilter,
      title: "Последние записи",
    }),
    TagList(),
  ],
}

// ==============================
// МАКЕТ ГЛАВНОЙ СТРАНИЦЫ БЛОГА
// ==============================
export const blogIndexPageLayout: PageLayout = {
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
      filter: blogFilter,
      title: "Недавние записи",
    }),
    TagList(),
    Component.Backlinks(backlinksConfig),
  ],
  afterBody: [
    Component.PageList({
      limit: 100,
      sort: "created",
      reverse: true,
      filter: blogFilter,
    }),
  ],
}

// ==============================
// МАКЕТ ДЛЯ СПИСКОВ (теги, папки)
// ==============================
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
  right: [],
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
      filter: blogFilter,
    }),
  ],
}

// ==============================
// ВЫБОР МАКЕТА ПО ТИПУ САЙТА И СТРАНИЦЕ
// ==============================
export const defaultContentPageLayout = (() => {
  // Для сада возвращаем просто макет
  if (siteType === 'garden') {
    return gardenContentPageLayout
  }
  
  // Для блога возвращаем функцию, которая выберет макет по slug
  return (props: QuartzComponentProps) => {
    const slug = props?.fileData?.slug
    
    // Отладка (будет видно при сборке)
    if (process.env.NODE_ENV === 'development') {
      console.log(`  📄 Page: ${slug}, layout: ${slug === 'index' ? 'index' : 'content'}`)
    }
    
    if (slug === 'index') {
      return blogIndexPageLayout
    }
    return blogContentPageLayout
  }
})()

// Макет для страниц-списков (теги, папки)
export const defaultListPageLayout = (() => {
  if (siteType === 'garden') {
    return gardenListPageLayout
  }
  return blogListPageLayout
})()