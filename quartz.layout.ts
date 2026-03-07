import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import BlogIndex from "./quartz-custom/components/BlogIndex"

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer(),
}

export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    BlogIndex, // Только BlogIndex, ничего больше!
  ],
  left: [],
  right: [],
}

export const defaultListPageLayout: PageLayout = {
  beforeBody: [],
  left: [],
  right: [],
}