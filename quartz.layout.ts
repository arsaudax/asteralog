import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { gardenFilter, blogFilter } from "./quartz-custom/utils/filter"
import * as CustomComponent from "./quartz-custom/components"
import TagList from "./quartz-custom/components/TagList"
import BlogIndex from "./quartz-custom/components/BlogIndex"
import { FileTrieNode } from "./quartz/components/scripts/spa"

// ... все конфигурации остаются ...

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

// Макет для сада
export const gardenContentPageLayout: PageLayout = { ... }

// Макет для главной страницы блога
export const blogIndexPageLayout: PageLayout = {
  beforeBody: [BlogIndex],
  left: [],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    TagList(),
    Component.Backlinks(backlinksConfig),
  ],
}

// Макет для обычных страниц блога
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

// Макет для страниц-списков
export const defaultListPageLayout: PageLayout = { ... }

// ===== ВАЖНО: Два отдельных экспорта для разных типов сайтов =====

// Для сада - просто макет
export const gardenLayout = gardenContentPageLayout

// Для блога - функция выбора
export const blogLayoutSelector = (props: any) => {
  if (props.fileData.slug === 'index') {
    return blogIndexPageLayout
  }
  return blogPostPageLayout
}

// Основной экспорт - выбираем в зависимости от сайта
export const defaultContentPageLayout = (() => {
  const siteType = getSiteType()
  
  if (siteType === 'garden') {
    return gardenContentPageLayout
  }
  
  return blogLayoutSelector
})()