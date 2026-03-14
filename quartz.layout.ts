// quartz.layout.ts
import { PageLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// Основной layout для страниц контента
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
  
  footer: Component.Footer(),  // ← футер отдельно, после всех колонок
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
  
  footer: Component.Footer(),  // ← и здесь тоже
}