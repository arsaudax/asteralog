import { QuartzEmitterPlugin } from "../../quartz/plugins/types"
import { readFileSync } from "fs"
import path from "path"

export const CustomStyles: QuartzEmitterPlugin = () => {
  return {
    name: "CustomStyles",

    externalResources() {
      return {
        css: [{ content: "/custom.css" }],
      }
    },

    async emit(ctx) {
      const scssPath = path.join(process.cwd(), "quartz-custom/styles/custom.scss")

      return [
        {
          slug: "custom.css",
          content: readFileSync(scssPath),
        },
      ]
    },
  }
}