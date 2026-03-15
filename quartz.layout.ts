import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import * as CustomComponent from "./quartz-custom/components"

// Минимальные общие компоненты
export const sharedPageComponents: SharedLayout = {
  head: CustomComponent.Head(),
  header: [],
  afterBody: [],
  footer: CustomComponent.Footer({
    links: {
      Telegram: "https://t.me/asteralog",
    },
  }),
}

// Минимальный макет для всех страниц
const baseLayout: PageLayout = {
  beforeBody: [], // ПУСТОЙ МАССИВ - важно!
  left: [
    Component.PageTitle(),
  ],
  right: [],
}

// Обязательные экспорты для Quartz
export const defaultContentPageLayout: PageLayout = baseLayout
export const defaultListPageLayout: PageLayout = baseLayout
export default defaultContentPageLayout