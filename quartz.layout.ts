// quartz.layout.ts
import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import * as CustomComponent from "./quartz-custom/components"

// Определяем тип сайта
const siteType = (process.env?.SITE_TYPE as 'garden' | 'blog') || 'garden'

// Shared компоненты
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

// ==================================================
// GARDEN LAYOUT (с графом и проводником)
// ==================================================
const gardenLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
    Component.TagList(),
  ],
  
  left: [
    CustomComponent.PageTitle({ 
      logo: "/static/thistle.png", 
      title: "Asteralog" 
    }),
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
}

// ==================================================
// BLOG LAYOUT (без графа, без проводника)
// ==================================================
const blogLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    CustomComponent.ContentMeta({ showReadingTime: true }),
    Component.TagList(),
  ],
  
  left: [
    CustomComponent.PageTitle({ 
      logo: "/static/thistle.png", 
      title: "Asteralog" 
    }),
    Component.Search(),
    Component.Darkmode(),
    // Component.Explorer() - НЕТ!
  ],
  
  right: [
    // Component.Graph() - НЕТ!
    Component.TableOfContents(),
    Component.Backlinks(),
  ],
  
  afterBody: [],
}

// ==================================================
// ВЫБОР LAYOUT В ЗАВИСИМОСТИ ОТ ТИПА САЙТА
// ==================================================
export const defaultContentPageLayout: PageLayout = 
  siteType === 'garden' ? gardenLayout : blogLayout

export const defaultListPageLayout: PageLayout = 
  siteType === 'garden' ? gardenLayout : blogLayout