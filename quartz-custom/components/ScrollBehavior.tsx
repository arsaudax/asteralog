// quartz-custom/components/ScrollBehavior.tsx
import { QuartzComponent, QuartzComponentConstructor } from "../../quartz/components/types"

const ScrollBehavior: QuartzComponent = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            let initialized = false;
            
            function initScrollBehavior() {
              if (initialized) return;
              
              const header = document.querySelector('.page-header');
              if (!header) return;
              
              initialized = true;
              
              let lastScroll = 0;
              const delta = 5;
              const headerHeight = 70;
              
              function handleScroll() {
                const current = window.scrollY;
                
                if (Math.abs(current - lastScroll) <= delta) return;
                
                if (current > lastScroll && current > headerHeight) {
                  header.classList.add('hidden');
                } else {
                  header.classList.remove('hidden');
                }
                
                if (current < 10) header.classList.remove('hidden');
                lastScroll = current;
              }
              
              window.addEventListener('scroll', handleScroll, { passive: true });
            }
            
            // Только для мобильных устройств
            if (window.innerWidth <= 800) {
              initScrollBehavior();
            }
            
            // Реинициализация после SPA-переходов
            document.addEventListener('nav', () => {
              initialized = false;
              if (window.innerWidth <= 800) {
                initScrollBehavior();
              }
            });
          })();
        `
      }}
    />
  )
}

export default (() => ScrollBehavior) satisfies QuartzComponentConstructor