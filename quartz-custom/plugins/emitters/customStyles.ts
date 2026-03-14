import { QuartzEmitterPlugin } from "../../../quartz/plugins/types"
import { BuildCtx } from "../../../quartz/util/ctx"
import { transform } from "lightningcss"
import fs from "fs/promises"
import path from "path"

async function writeFile(ctx: BuildCtx, name: string, content: string) {
  const filePath = path.join(ctx.argv.output, name)
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, content)
  return filePath
}

export const customStyles: QuartzEmitterPlugin = () => ({
  name: "CustomStyles",

  async *emit(ctx) {
    const root = process.cwd()

    const files = [
      "quartz-custom/styles/_variables.scss",
      "quartz-custom/styles/_overrides.scss",
      "quartz-custom/styles/custom.scss",
    ]

    let combined = ""

    for (const file of files) {
      try {
        const filePath = path.join(root, file)
        const content = await fs.readFile(filePath, "utf-8")

        const cleaned = content.replace(/@use .*;/g, "")

        combined += "\n" + cleaned
      } catch {
        console.warn(`⚠️ Style file missing: ${file}`)
      }
    }

    if (!combined) {
      console.warn("⚠️ No custom styles found")
      return
    }

    let css = combined

    try {
      const result = transform({
        filename: "custom.css",
        code: Buffer.from(combined),
        minify: true,
      })

      css = result.code.toString()
    } catch (e) {
      console.warn("⚠️ lightningcss failed, using raw CSS")
    }

    const filePath = await writeFile(ctx, "custom.css", css)

    yield filePath
  },

  externalResources() {
    return {
      css: [{ content: "/custom.css" }],
    }
  },
})