import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { h } from "preact"

const RightScrollArea: QuartzComponent = (props: QuartzComponentProps) => {
  const { children } = props
  return h("div", { class: "right-scroll-area" }, children)
}

export default (() => RightScrollArea) satisfies QuartzComponentConstructor