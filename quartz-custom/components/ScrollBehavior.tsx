import { QuartzComponent, QuartzComponentConstructor } from "../types"

const ScrollBehavior: QuartzComponent = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
        (function() {

          let lastScroll = 0;
          let handler;

          function init() {

            const header = document.querySelector('.page-header');
            if (!header) return;

            if (handler) {
              window.removeEventListener('scroll', handler);
            }

            handler = function() {

              const current = window.scrollY;

              if (current > lastScroll && current > 80) {
                header.classList.add('hidden');
              } else {
                header.classList.remove('hidden');
              }

              lastScroll = current;

            };

            window.addEventListener('scroll', handler, { passive: true });

          }

          init();

          document.addEventListener('nav', init);

        })();
        `,
      }}
    />
  )
}

export default (() => ScrollBehavior) satisfies QuartzComponentConstructor