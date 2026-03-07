import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { gardenFilter, blogFilter, topicFilter } from "./quartz-custom/utils/filter"
import * as CustomComponent from "./quartz-custom/components"
import TagList from "./quartz-custom/components/TagList"
import BlogIndex from "./quartz-custom/components/BlogIndex"
import { FileTrieNode } from "./quartz/components/scripts/spa"

// ... все конфигурации остаются без изменений ...

// Макет для блога (лента на главной)
export const blogIndexPageLayout: PageLayout = {
  beforeBody: [BlogIndex],
  left: [],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    TagList(),
    Component.Backlinks(backlinksConfig),
  ],
}

// Макет для обычных страниц блога (посты)
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

// УСЛОВНЫЙ ЭКСПОРТ
export const defaultContentPageLayout = (() => {
  const siteType = getSiteType()
  
  if (siteType === 'garden') {
    return gardenContentPageLayout
  }
  
  // Для блога возвращаем функцию выбора
  return (props: any) => {
    if (props.fileData.slug === 'index') {
      return blogIndexPageLayout
    }
    return blogPostPageLayout
  }
})()