import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { gardenFilter, blogFilter, topicFilter } from "./quartz-custom/utils/filter"
import * as CustomComponent from "./quartz-custom/components"
import TagList from "./quartz-custom/components/TagList"
import BlogIndex from "./quartz-custom/components/BlogIndex"  // ← ДОБАВЛЕНО
import { FileTrieNode } from "./quartz/components/scripts/spa"

// Конфигурация проводника с эмодзи
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
  rootName: "🏡"
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

// Функция для определения типа сайта
const getSiteType = () => {
  if (typeof process === 'undefined') return 'garden'
  const baseUrl = process.env?.BASE_URL || ''
  return baseUrl.includes('blog') ? 'blog' : 'garden'
}

// Единый макет для всех страниц
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(breadcrumbsConfig),
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
    Component.TagList(),
    // Показываем BlogIndex только на главной странице блога
    Component.ConditionalRender({
      component: BlogIndex,
      condition: (props) => {
        const siteType = getSiteType()
        return siteType === 'blog' && props.fileData.slug === 'index'
      }
    }),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    // Показываем проводник только в саду
    Component.ConditionalRender({
      component: Component.DesktopOnly(Component.Explorer(explorerConfig)),
      condition: () => getSiteType() === 'garden'
    }),
  ],
  right: [
    // Граф только в саду
    Component.ConditionalRender({
      component: Component.DesktopOnly(Component.Graph(graphConfig)),
      condition: () => getSiteType() === 'garden'
    }),
    Component.DesktopOnly(Component.TableOfContents()),
    // Недавние заметки с разными фильтрами и настройками
    Component.RecentNotes({ 
      limit: (props) => getSiteType() === 'blog' ? 8 : 5,
      showTags: (props) => getSiteType() === 'blog',
      title: (props) => getSiteType() === 'blog' ? "Последние записи" : "Недавние заметки",
      filter: (file) => {
        const siteType = getSiteType()
        return siteType === 'blog' ? blogFilter(file) : gardenFilter(file)
      }
    }),
    TagList(),
    Component.Backlinks(backlinksConfig),
  ],
}

// Макет для страниц-списков (теги, папки)
export const defaultListPageLayout: PageLayout = {
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