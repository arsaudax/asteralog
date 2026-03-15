// Экспортируем все кастомные компоненты
export { default as Head } from "./Head"
export { default as PageTitle } from "./PageTitle"
export { default as ContentMeta } from "./ContentMeta"
export { default as Footer } from "./Footer"
export { default as TagList } from "./TagList"
export { default as BlogIndex } from "./BlogIndex"
export { default as ArchiveLink } from "./ArchiveLink"
export { default as ScrollBehavior } from "./ScrollBehavior"

// Для обратной совместимости - правильный синтаксис
export { ArchiveLink as ArchiveLinkComponent } from "./ArchiveLink"