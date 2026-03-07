import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { gardenFilter, blogFilter } from "./quartz-custom/utils/filter"
import * as CustomComponent from "./quartz-custom/components"
import TagList from "./quartz-custom/components/TagList"
import { FileTrieNode } from "./quartz/components/scripts/spa"

// Функция для определения типа сайта
const getSiteType = () => {
  if (typeof process === 'undefined') return 'garden'
  const baseUrl = process.env?.BASE_URL || ''
  return baseUrl.includes('blog') ? 'blog' : 'garden'
}

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

const graphConfig = {
  localGraph: { showTags: false, excludeTags: ["graph-exclude"] },
  globalGraph: { showTags: false, excludeTags: ["graph-exclude"] }
}

const backlinksConfig = { hideWhenEmpty: true }
const breadcrumbsConfig = { rootName: "🏡" }

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
    Component.RecentNotes({ limit: 5, showTags: false, filter: gardenFilter }),
    TagList(),
  ],
}

/// Макет для блога с отладкой фильтра
export const blogContentPageLayout: PageLayout = {
  beforeBody: [
    // Отладочный блок (только один!)
    (props) => {
      const files = props.allFiles
      const blogFiles = files.filter(f => {
        const tags = f.frontmatter?.tags
        return Array.isArray(tags) && tags.includes('blog')
      })
      const nonIndexFiles = blogFiles.filter(f => f.slug !== 'index')
      
      return React.createElement('div', { 
        style: { 
          background: '#ff0', 
          padding: '1rem', 
          margin: '1rem 0', 
          border: '2px solid #f00' 
        } 
      },
        React.createElement('h3', null, '🔍 Отладка блога'),
        React.createElement('p', null, `Всего файлов с тегом blog: ${blogFiles.length}`),
        React.createElement('p', null, `Файлов для ленты (исключая index): ${nonIndexFiles.length}`),
        React.createElement('ul', null, 
          nonIndexFiles.map(f => 
            React.createElement('li', { key: f.slug },
              React.createElement('strong', null, f.frontmatter?.title || 'Без названия'),
              React.createElement('br'),
              `Slug: ${f.slug}`,
              React.createElement('br'),
              `Теги: ${f.frontmatter?.tags?.join(', ')}`
            )
          )
        )
      )
    },
    Component.Breadcrumbs(breadcrumbsConfig),
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
    Component.TagList(),
  ],
  left: [],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.RecentNotes({ 
      title: "Последние записи",
      limit: 20,
      showTags: true,
      filter: blogFilter 
    }),
    TagList(),
    Component.Backlinks(backlinksConfig),
  ],
}

// Условный макет (теперь blogContentPageLayout уже определён)
export const defaultContentPageLayout: PageLayout = (() => {
  const siteType = getSiteType()
  
  if (siteType === 'blog') {
    return blogContentPageLayout
  }
  
  return gardenContentPageLayout
})()

// Макет для страниц-списков
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