import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// Минимальные общие компоненты
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer(),
}

// Минимальный макет для всех страниц
const baseLayout: PageLayout = {
  beforeBody: [],  // Пустой массив
  left: [
    Component.PageTitle(),
  ],
  right: [],
}

// Обязательные экспорты
export const defaultContentPageLayout: PageLayout = baseLayout
export const defaultListPageLayout: PageLayout = baseLayout
export default defaultContentPageLayout