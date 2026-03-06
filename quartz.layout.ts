import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { gardenFilter, blogFilter, topicFilter } from "./quartz-custom/utils/filter"
import * as CustomComponent from "./quartz-custom/components"
import TagList from "./quartz-custom/components/TagList"
import BlogIndex from "./quartz-custom/components/BlogIndex"
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
    TagList(),
  ],
}

// Макет для страниц блога (кроме главной)
export const blogPostPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(breadcrumbsConfig),
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
    Component.TagList(),
  ],
  left: [],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    TagList(),
    Component.Backlinks(backlinksConfig),
  ],
}

// Макет для главной страницы блога с лентой постов
export const blogIndexPageLayout: PageLayout = {
  beforeBody: [
    BlogIndex, // ← ВАЖНО: просто компонент, без JSX
  ],
  left: [],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
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

// УСЛОВНЫЙ ЭКСПОРТ — выбираем макет в зависимости от сайта и страницы
export const defaultContentPageLayout = (() => {
  const baseUrl = typeof process !== 'undefined' ? process.env?.BASE_URL : ''
  const isBlog = baseUrl?.includes('blog')
  
  // Возвращаем функцию, которая будет вызвана для каждой страницы
  return (props: any) => {
    // Для блога используем разную логику в зависимости от страницы
    if (isBlog) {
      // Для главной страницы блога используем специальный макет
      if (props.fileData.slug === 'index') {
        return blogIndexPageLayout
      }
      // Для остальных страниц блога используем обычный макет
      return blogPostPageLayout
    }
    
    // Для сада используем обычный макет
    return gardenContentPageLayout
  }
})()