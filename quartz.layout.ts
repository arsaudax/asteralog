import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { gardenFilter, blogFilter, topicFilter } from "./quartz-custom/utils/filter"
import * as CustomComponent from "./quartz-custom/components"
import TagCloud from "./quartz-custom/components/TagCloud"
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

// Макет для сада (garden.asteralog.ru)
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
      filter: gardenFilter 
    }),
    TagCloud(), // Добавляем облако тегов и в сад для единообразия
  ],
}

// Макет для блога (blog.asteralog.ru) — УЛУЧШЕННАЯ ВЕРСИЯ
export const blogContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(breadcrumbsConfig),
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
    Component.TagList(),
  ],
  left: [], // Левая колонка отсутствует — фокус на контенте
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.RecentNotes({ 
      title: "📝 Последние записи", // Добавляем заголовок
      limit: 8, // Больше записей для блога
      showTags: true, // Показываем теги в списке
      filter: blogFilter 
    }),
    TagCloud(), // Облако тегов после последних записей
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

// УСЛОВНЫЙ ЭКСПОРТ — выбираем макет в зависимости от сайта
export const defaultContentPageLayout = (() => {
  // Определяем, какой сайт собирается по переменной окружения
  // В GitHub Actions эта переменная установлена как BASE_URL
  const baseUrl = typeof process !== 'undefined' ? process.env?.BASE_URL : ''
  
  // Для блога используем blogContentPageLayout, для сада — gardenContentPageLayout
  return baseUrl?.includes('blog') ? blogContentPageLayout : gardenContentPageLayout
})()