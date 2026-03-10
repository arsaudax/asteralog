/**
 * Скрипт для восстановления темы после SPA-навигации Quartz
 * Предотвращает мигание светлой темы при переходах между страницами
 */

export function restoreTheme(): void {
  // Проверяем, что мы в браузере
  if (typeof document === 'undefined') return;
  
  const theme = localStorage.getItem("saved-theme");
  if (theme) {
    document.documentElement.setAttribute("saved-theme", theme);
    
    // Опционально: убираем inline-стили, если они ещё есть
    document.documentElement.style.backgroundColor = "";
    document.documentElement.style.color = "";
  }
}

// Автоматически подключаем обработчики при загрузке
if (typeof document !== 'undefined') {
  // Восстанавливаем тему после каждого SPA-перехода
  document.addEventListener("nav", restoreTheme);
  
  // При навигации через историю
  window.addEventListener("popstate", restoreTheme);
  
  // При загрузке страницы (если вдруг не сработало)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', restoreTheme);
  } else {
    restoreTheme();
  }
}

// Экспортируем для использования в layout
export default restoreTheme;