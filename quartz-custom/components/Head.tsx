import { QuartzComponent, QuartzComponentConstructor } from "../../quartz/components/types"

export default (() => {
  const Head: QuartzComponent = () => {
    return (
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                // Принудительно устанавливаем тёмную тему до загрузки CSS
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('saved-theme', theme);
              } catch (e) {
                document.documentElement.setAttribute('saved-theme', 'dark');
              }
            })();
          `
        }} />
      </head>
    )
  }
  return Head
}) satisfies QuartzComponentConstructor