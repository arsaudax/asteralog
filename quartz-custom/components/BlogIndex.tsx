import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { classNames } from "../../quartz/util/lang"
import { Date } from "../../quartz/components/Date"
import { i18n } from "../../quartz/i18n"
import style from "./styles/blogIndex.scss"

const BlogIndex: QuartzComponent = (props: QuartzComponentProps) => {
  const { cfg, allFiles, displayClass } = props
  
  // Фильтруем только файлы с тегом blog, исключая служебные страницы
  const blogPosts = allFiles
    .filter(file => {
      const tags = file.frontmatter?.tags
      return Array.isArray(tags) && 
             tags.includes('blog') && 
             file.slug !== 'index' && 
             file.slug !== 'archive' &&
             !tags.includes('recents-exclude')
    })
    .sort((a, b) => {
      const dateA = a.dates?.created ? new Date(a.dates.created).getTime() : 0
      const dateB = b.dates?.created ? new Date(b.dates.created).getTime() : 0
      return dateB - dateA
    })
  
  return (
    <div class={classNames(displayClass, "blog-index")}>
      <div class="blog-header">
        <h1>{i18n(cfg.locale).components.recentNotes.title}</h1>
        <div class="author-info">
          <div class="author-avatar-placeholder">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="38" stroke="var(--secondary)" stroke-width="2" fill="var(--highlight)"/>
              <path d="M40 45C46.5 45 51.5 40 51.5 33.5C51.5 27 46.5 22 40 22C33.5 22 28.5 27 28.5 33.5C28.5 40 33.5 45 40 45Z" fill="var(--secondary)"/>
              <path d="M60 62C60 54 52 48 40 48C28 48 20 54 20 62" stroke="var(--secondary)" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="author-bio">
            <p>
              <strong>Художник и исследователь</strong>, живущий на стыке 
              традиционного искусства и цифровых практик. В этом блоге я делюсь 
              мыслями о творчестве, ремесле и внутренней эмиграции.
            </p>
            <div class="author-links">
              <a href="https://t.me/asteralog" target="_blank" rel="noopener noreferrer">Telegram</a>
              <a href="https://www.instagram.com/al.bogat" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://www.behance.net/arsaudax" target="_blank" rel="noopener noreferrer">Behance</a>
            </div>
          </div>
        </div>
      </div>
      
      <div class="blog-posts">
        {blogPosts.map(post => (
          <article class="blog-post" key={post.slug}>
            <h2 class="post-title">
              <a href={`/${post.slug}`}>{post.frontmatter?.title || i18n(cfg.locale).propertyDefaults.title}</a>
            </h2>
            
            <div class="post-meta">
              {post.dates?.created && (
                <Date date={post.dates.created} locale={cfg.locale} />
              )}
              
              <div class="post-tags">
                {post.frontmatter?.tags
                  ?.filter((t: string) => !['garden', 'blog', 'graph-exclude', 'explorer-exclude', 'backlinks-exclude', 'recents-exclude'].includes(t))
                  .map((tag: string) => (
                    <a href={`/tags/${tag}`} class="post-tag" key={tag}>
                      {tag}
                    </a>
                  ))
                }
              </div>
            </div>
            
            {post.frontmatter?.description && (
              <p class="post-description">{post.frontmatter.description}</p>
            )}
            
            <a href={`/${post.slug}`} class="read-more">
              {i18n(cfg.locale).components.recentNotes.readMore} →
            </a>
          </article>
        ))}
        
        {blogPosts.length === 0 && (
          <p class="no-posts">{i18n(cfg.locale).components.recentNotes.noNotes}</p>
        )}
      </div>
    </div>
  )
}

BlogIndex.css = style

export default (() => BlogIndex) satisfies QuartzComponentConstructor