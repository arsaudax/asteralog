import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import * as CustomComponent from "./quartz-custom/components" 

// Минимальные общие компоненты
export const sharedPageComponents: SharedLayout = {
  head: CustomComponent.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer(),  // стандартный футер Quartz
}

// Минимальный макет
const baseLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
  ],
  left: [
    Component.PageTitle(),
    Component.Search(),
    Component.Darkmode(),
  ],
  right: [],
}

// Экспорты для Quartz
export const defaultContentPageLayout: PageLayout = baseLayout
export const defaultListPageLayout: PageLayout = baseLayout
export default defaultContentPageLayout