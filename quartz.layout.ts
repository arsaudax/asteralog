// quartz.layout.ts
import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import * as CustomComponent from "./quartz-custom/components"

// Обязательный shared компонент
export const sharedPageComponents: SharedLayout = {
  head: CustomComponent.Head(),
  header: [],
  afterBody: [],
  footer: CustomComponent.Footer({
    links: {
      Telegram: "https://t.me/asteralog",
      Instagram: "https://www.instagram.com/al.bogat",
      Behance: "https://www.behance.net/arsaudax",
    },
  }),
}

// Основной layout для страниц контента
export const defaultContentPageLayout: PageLayout = {
  // Верхняя часть перед контентом
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
    Component.TagList(),
  ],
  
  // Левая боковая панель
  left: [
    CustomComponent.PageTitle({ 
      logo: "/static/thistle.png",
      title: "Asteralog"
    }),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer()),
  ],
  
  // Правая боковая панель
  right: [
    Component.DesktopOnly(Component.Graph()),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
  
  // После контента
  afterBody: [],
}

// Layout для страниц-списков (теги, папки)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
  ],
  
  left: [
    CustomComponent.PageTitle({ 
      logo: "/static/thistle.png",
      title: "Asteralog"
    }),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer()),
  ],
  
  right: [],
  
  afterBody: [],
}