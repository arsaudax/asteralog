// quartz.layout.ts
import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// Shared компоненты (рендерятся отдельно от колонок)
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer(),  // footer будет после всех колонок
}

// Основной layout для страниц контента
export const defaultContentPageLayout: PageLayout = {
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
  // footer НЕ УКАЗЫВАЕМ здесь — он берётся из shared
}

// Layout для страниц-списков
export const defaultListPageLayout: PageLayout = {
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
  // footer НЕ УКАЗЫВАЕМ здесь
}