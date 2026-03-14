// quartz.layout.ts
import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// Quartz требует этот экспорт (даже пустой)
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer(),  // footer здесь
}

// Основной layout
export const defaultContentPageLayout: PageLayout = {
  head: Component.Head(),
  
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  
  left: [
    Component.PageTitle(),
    Component.Search(),
    Component.Darkmode(),
    Component.Explorer(),
  ],
  
  right: [
    Component.Graph(),
    Component.TableOfContents(),
    Component.Backlinks(),
  ],
  
  afterBody: [],
  
  // Здесь НЕ добавляем footer — он уже в sharedPageComponents
}

// Layout для страниц-списков
export const defaultListPageLayout: PageLayout = {
  head: Component.Head(),
  
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
  ],
  
  left: [
    Component.PageTitle(),
    Component.Search(),
    Component.Darkmode(),
    Component.Explorer(),
  ],
  
  right: [],
  
  afterBody: [],
}