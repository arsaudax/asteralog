import { QuartzComponent, QuartzComponentConstructor } from "../../quartz/components/types"

const ThemeRestoreScript: QuartzComponent = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            function restoreTheme() {
              const theme = localStorage.getItem("saved-theme");
              if (theme) {
                document.documentElement.setAttribute("saved-theme", theme);
              }
            }
            
            document.addEventListener("nav", restoreTheme);
            window.addEventListener("popstate", restoreTheme);
            
            if (document.readyState === "loading") {
              document.addEventListener("DOMContentLoaded", restoreTheme);
            } else {
              restoreTheme();
            }
          })();
        `
      }}
    />
  )
}

export default (() => ThemeRestoreScript) satisfies QuartzComponentConstructor