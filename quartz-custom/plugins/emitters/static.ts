import fs from "fs/promises"
import { dirname } from "path"
import { glob } from "../../../quartz/util/glob"
import { joinSegments } from "../../../quartz/util/path"
import { QuartzEmitterPlugin } from "../../../quartz/plugins/types"

const ROOT = "quartz-custom/static"

export const staticPlugin: QuartzEmitterPlugin = () => ({
  name: "CustomStatic",

  async *emit({ argv }) {
    try {
      await fs.access(ROOT)
    } catch {
      return
    }

    const files = await glob("**", ROOT)

    for (const file of files) {
      const src = joinSegments(ROOT, file)
      const dest = joinSegments(argv.output, "static", file)

      await fs.mkdir(dirname(dest), { recursive: true })
      await fs.copyFile(src, dest)

      yield dest
    }
  },
})