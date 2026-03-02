import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

const tagsToExclude = [
  "graph-exclude", 
  "explorer-exclude", 
  "backlinks-exclude", 
  "recents-exclude", 
  "search-exclude"
]

const graphConfig = {
  localGraph: {
    showTags: false,
    excludeTags: tagsToExclude
  },
  globalGraph: {
    showTags: false,
    excludeTags: [...tagsToExclude, "slurp"]
  }
}

const backlinksConfig = {
  excludeTags: tagsToExclude,
  hideWhenEmpty: true
}

const explorerConfig = {
  filterFn: (node) => {
    const hasExcludedTag = node.file?.frontmatter?.tags?.includes("explorer-exclude") === true
    return node.name !== "tags" && !hasExcludedTag
  }
}

const breadcrumbsConfig = {
  rootName: "🏡"
}

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      Telegram: "https://t.me/asteralog",
      Instagram: "https://www.instagram.com/al.bogat",
      Behance: "https://www.behance.net/arsaudax"
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(breadcrumbsConfig),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer(explorerConfig))
  
  ],
  right: [
    Component.Graph(graphConfig),
    Component.Backlinks(backlinksConfig),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(breadcrumbsConfig), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(explorerConfig),
  ],
  right: [],
}