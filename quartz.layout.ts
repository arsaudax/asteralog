import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { FileTrieNode } from "./quartz/components/scripts/spa"
import { SimpleSlug } from "./quartz/util/path"

const tagsToRemove = [
  "graph-exclude", 
  "explorer-exclude", 
  "backlinks-exclude", 
  "recents-exclude", 
  "search-exclude"
]

const graphConfig = {
  localGraph: {
    showTags: false,
    excludeTags: tagsToRemove
  },
  globalGraph: {
    showTags: false,
    excludeTags: [...tagsToRemove, "slurp"]
  }
}

const backlinksConfig = {
  excludeTags: tagsToRemove,
  hideWhenEmpty: true
}

const tagListConfig = { 
  excludeTags: tagsToRemove
}

const explorerConfig = {
  filterFn: (node: FileTrieNode) => {
    const omit = new Set(["tags"]);
    const hasExcludedTag = node.data?.tags?.includes("explorer-exclude") === true;
    const isOmitted = omit.has(node.displayName?.toLowerCase());
    return !hasExcludedTag && !isOmitted;
  },
  mapFn: (node: FileTrieNode) => {
    // dont change name of root node
    if (!node.isFolder) {
      // set emoji for file/folder      
        node.displayName = "⊹ " + node.displayName
    }
  },
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
      Asteragram: "https://www.instagram.com/al.bogat",
      Behance: "https://www.behance.net/arsaudax"
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(breadcrumbsConfig),
    Component.ArticleTitle(),
    Component.ContentMeta({showReadingTime: true}),
    Component.TagList(tagListConfig),
  ],
  left: [
    Component.PageTitle(),
    Component.Search(),
    Component.Darkmode(),
    Component.Explorer(explorerConfig)
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Graph(graphConfig),
    Component.Backlinks(backlinksConfig),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(breadcrumbsConfig), 
    Component.ArticleTitle(), 
    Component.ContentMeta({showReadingTime: true})
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.ReaderMode(),
    Component.Spacer(),
    Component.Explorer(explorerConfig),
  ],
  right: [],
}