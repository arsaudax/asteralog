import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "Test",
    baseUrl: "test.local",
  },
  plugins: {
    transformers: [Plugin.FrontMatter()],
    filters: [
      Plugin.ExplicitPublish({ field: "garden" })
    ],
    emitters: [Plugin.Assets()],
  },
}

export default config