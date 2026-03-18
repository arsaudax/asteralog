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
              if (window.innerWidth > 800) return;  // Не применяем на десктопе
              
              const header = document.querySelector('.left.sidebar');
              if (!header) return;
              
              initialized = true;
              
              let lastScroll = 0;
              const delta = 5;
              const headerHeight = 120;  // Высота панели
              
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
            initScrollBehavior();
            
            // Реинициализация после SPA-переходов
            document.addEventListener('nav', () => {
              initialized = false;
              initScrollBehavior();
            });
          })();
        `
      }}
    />
  )
}

export default (() => ScrollBehavior) satisfies QuartzComponentConstructor