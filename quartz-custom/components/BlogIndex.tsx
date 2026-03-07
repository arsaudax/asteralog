import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { classNames } from "../../quartz/util/lang"

const BlogIndex: QuartzComponent = (props: QuartzComponentProps) => {
  const { displayClass } = props

  return (
    <div class={classNames(displayClass, "blog-index-debug")} style={{background: 'lime', color: 'black', padding: '3rem', fontSize: '2rem', textAlign: 'center', border: '10px solid red'}}>
      <h1>🟢🟢🟢 DEBUG: BLOGINDEX РЕНДЕРИТСЯ! 🟢🟢🟢</h1>
      <p>Если вы видите это сообщение, компонент вызван и работает!</p>
    </div>
  )
}

BlogIndex.css = `
.blog-index-debug {
  margin: 2rem 0;
}
`

export default (() => BlogIndex) satisfies QuartzComponentConstructor