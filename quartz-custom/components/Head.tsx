// quartz-custom/components/Head.tsx
import { QuartzComponent, QuartzComponentConstructor } from "../../quartz/components/types"

export default (() => {
  const Head: QuartzComponent = () => {
    return (
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <title>Asteralog</title>
        <link rel="stylesheet" href="/index.css" />
      </head>
    )
  }
  return Head
}) satisfies QuartzComponentConstructor