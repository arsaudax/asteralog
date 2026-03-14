import { QuartzComponent, QuartzComponentConstructor } from "../types"

export default (() => {
  const Head: QuartzComponent = ({ cfg }) => {
    return (
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />

        <title>{cfg.pageTitle}</title>

        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              const theme = localStorage.getItem("theme") || "dark";
              document.documentElement.dataset.theme = theme;
            })();
          `,
          }}
        />
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor