import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import * as CustomComponent from "./quartz-custom/components"
import { gardenFilter, blogFilter } from "./quartz-custom/utils/filter"
import { FileTrieNode } from "./quartz/components/scripts/spa"

const getSiteType = () => {
  if (typeof process === 'undefined') return 'garden'
  const baseUrl = process.env?.BASE_URL || ''
  return baseUrl.includes('blog') ? 'blog' : 'garden'
}

// Общие компоненты для всех страниц
export const sharedPageComponents: SharedLayout = {
  head: CustomComponent.Head(),
  header: [CustomComponent.ScrollBehavior()],
  afterBody: [],
  footer: CustomComponent.Footer({
    links: {
      Telegram: "https://t.me/asteralog",
      Instagram: "https://www.instagram.com/al.bogat",
      Behance: "https://www.behance.net/arsaudax",
    },
  }),
}

// Единый макет для всех страниц
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs({ rootName: "🏡" }),
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
    Component.TagList(),
    Component.ConditionalRender({
      component: CustomComponent.BlogIndex,
      condition: (props) => getSiteType() === 'blog' && props.fileData.slug === 'index'
    }),
  ],
  
  left: [
    CustomComponent.PageTitle({ logo: "/static/thistle.png", title: "Asteralog" }),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.ConditionalRender({
      component: Component.DesktopOnly(Component.Explorer({
        filterFn: (node: FileTrieNode) => {
          const hasExcludedTag = node.data?.frontmatter?.tags?.includes("explorer-exclude") === true
          return !hasExcludedTag
        },
        mapFn: (node: FileTrieNode) => {
          if (!node.isFolder) {
            node.displayName = "⊹ " + node.displayName
          }
        },
        title: getSiteType() === 'garden' ? "Сад" : "Блог",
        folderDefaultState: "collapsed",
        useSavedState: true,
      })),
      condition: () => getSiteType() === 'garden'
    }),
  ],
  
  right: [
    Component.ConditionalRender({
      component: Component.DesktopOnly(Component.Graph({
        localGraph: { 
          showTags: false, 
          excludeTags: ["graph-exclude"] 
        },
        globalGraph: { 
          showTags: false, 
          excludeTags: ["graph-exclude"] 
        },
      })),
      condition: () => getSiteType() === 'garden'
    }),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.RecentNotes({
      limit: (props) => getSiteType() === 'blog' ? 8 : 5,
      showTags: (props) => getSiteType() === 'blog',
      title: (props) => getSiteType() === 'blog' ? "Последние записи" : "Недавние заметки",
      filter: (file) => getSiteType() === 'blog' ? blogFilter(file) : gardenFilter(file)
    }),
    CustomComponent.TagList(),
    Component.ConditionalRender({
      component: CustomComponent.ArchiveLink({ 
        sidebar: true, 
        emoji: "after",
        hideIfEmpty: true 
      }),
      condition: () => getSiteType() === 'blog'
    }),
    Component.Backlinks({ hideWhenEmpty: true }),
  ],
}

// Макет для страниц-списков (теги, папки)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs({ rootName: "🏡" }),
    Component.ArticleTitle(),
  ],
  
  left: [
    CustomComponent.PageTitle({ logo: "/static/thistle.png", title: "Asteralog" }),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer({
      filterFn: (node: FileTrieNode) => {
        const hasExcludedTag = node.data?.frontmatter?.tags?.includes("explorer-exclude") === true
        return !hasExcludedTag
      },
      mapFn: (node: FileTrieNode) => {
        if (!node.isFolder) {
          node.displayName = "⊹ " + node.displayName
        }
      },
    })),
  ],
  
  right: [],
}

// Макет для 404 страницы
export const notFoundLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
  ],
  
  left: [
    CustomComponent.PageTitle({ logo: "/static/thistle.png", title: "Asteralog" }),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
  ],
  
  right: [],
}

export default defaultContentPageLayout