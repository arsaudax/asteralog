// quartz-custom/components/Head.tsx
import { QuartzComponent, QuartzComponentConstructor } from "../../quartz/components/types"
import { i18n } from "../../quartz/i18n"
import { QuartzComponentProps } from "../../quartz/components/types"

export default (() => {
  const Head: QuartzComponent = ({ cfg, fileData }: QuartzComponentProps) => {
    const title = (fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title) +
      (cfg.pageTitleSuffix ?? "")

    return (
      <head>
        {/* МИНИМАЛЬНЫЕ META */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <meta name="color-scheme" content="dark light" />
        <title>{title}</title>
        <meta name="description" content={fileData.frontmatter?.description ?? ""} />
        <link rel="icon" href="/static/icon.png" />

        {/* ТОЛЬКО ИНИЦИАЛИЗАЦИЯ ТЕМЫ */}
        <script
          blocking="render"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const html = document.documentElement;
                const stored = localStorage.getItem("theme");
                html.setAttribute("data-theme", stored || "dark");
              })();
            `
          }}
        />
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor