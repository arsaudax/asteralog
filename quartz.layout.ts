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

// Макет для блога с отладкой фильтра
export const blogContentPageLayout: PageLayout = {
  beforeBody: [
    // Отладочный блок для проверки фильтра
    (props) => {
      const files = props.allFiles
      const blogFiles = files.filter(f => {
        const tags = f.frontmatter?.tags
        return Array.isArray(tags) && tags.includes('blog')
      })
      const nonIndexFiles = blogFiles.filter(f => f.slug !== 'index')
      
      console.log('=== RecentNotes Debug ===')
      console.log('Total files:', files.length)
      console.log('Blog files:', blogFiles.length)
      console.log('Non-index blog files:', nonIndexFiles.length)
      console.log('Files:', nonIndexFiles.map(f => ({
        slug: f.slug,
        title: f.frontmatter?.title,
        tags: f.frontmatter?.tags
      })))
      
      return (
        <div style={{
          background: '#ff0',
          padding: '1rem',
          margin: '1rem 0',
          border: '2px solid #f00'
        }}>
          <h3>🔍 Отладка RecentNotes</h3>
          <p>Всего файлов: {files.length}</p>
          <p>Файлов с тегом blog: {blogFiles.length}</p>
          <p>Файлов для ленты (кроме index): {nonIndexFiles.length}</p>
          <ul>
            {nonIndexFiles.map(f => (
              <li key={f.slug}>
                <strong>{f.frontmatter?.title || 'Без названия'}</strong><br/>
                Slug: {f.slug}<br/>
                Теги: {f.frontmatter?.tags?.join(', ')}
              </li>
            ))}
          </ul>
        </div>
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