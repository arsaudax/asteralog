import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer(),
}

export const defaultContentPageLayout: PageLayout = {
  beforeBody: [],
  left: [],
  right: [],
  afterBody: [],
}

export const defaultListPageLayout: PageLayout = {
  beforeBody: [],
  left: [],
  right: [],
  afterBody: [],
}

export default defaultContentPageLayout