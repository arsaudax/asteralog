import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { classNames } from "../../quartz/util/lang"
import { Date } from "../../quartz/components/Date"

const BlogIndex: QuartzComponent = (props: QuartzComponentProps) => {
  const { cfg, allFiles, displayClass } = props
  
  // Фильтруем только файлы с тегом blog, исключая сам индекс
  const blogPosts = allFiles
    .filter(file => {
      const tags = file.frontmatter?.tags
      return Array.isArray(tags) && 
             tags.includes('blog') && 
             file.slug !== 'index'
    })
    .sort((a, b) => {
      const dateA = a.dates?.created ? new Date(a.dates.created).getTime() : 0
      const dateB = b.dates?.created ? new Date(b.dates.created).getTime() : 0
      return dateB - dateA
    })
  
  return (
    <div class={classNames(displayClass, "blog-index")}>
      <div class="blog-header">
        <h1>Блог Asteralog</h1>
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
              <a href={`/${post.slug}`}>{post.frontmatter?.title || 'Без названия'}</a>
            </h2>
            
            <div class="post-meta">
              {post.dates?.created && (
                <Date date={post.dates.created} locale={cfg.locale} />
              )}
              
              <div class="post-tags">
                {post.frontmatter?.tags
                  ?.filter((t: string) => !['garden', 'blog', 'graph-exclude', 'explorer-exclude', 'backlinks-exclude'].includes(t))
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
            
            <a href={`/${post.slug}`} class="read-more">Читать далее →</a>
          </article>
        ))}
        
        {blogPosts.length === 0 && (
          <p class="no-posts">Пока нет записей в блоге</p>
        )}
      </div>
    </div>
  )
}

// Добавляем стили как статическое свойство
BlogIndex.css = `
.blog-index {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.blog-header {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid var(--secondary);
}

.blog-header h1 {
  color: var(--dark);
  margin-bottom: 1.5rem;
  font-size: 2.5rem;
}

.author-info {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  background: var(--highlight);
  padding: 1.5rem;
  border-radius: 12px;
}

.author-avatar-placeholder {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}

.author-avatar-placeholder svg {
  width: 100%;
  height: 100%;
}

.author-bio {
  flex: 1;
}

.author-bio p {
  margin: 0 0 1rem 0;
  color: var(--darkgray);
  line-height: 1.6;
  font-size: 0.95rem;
}

.author-bio strong {
  color: var(--secondary);
}

.author-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.author-links a {
  color: var(--secondary);
  text-decoration: none;
  font-size: 0.9rem;
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--gray);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.author-links a:hover {
  background: var(--secondary);
  color: var(--light);
  border-color: var(--secondary);
}

.blog-posts {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.blog-post {
  border-bottom: 1px solid var(--lightgray);
  padding-bottom: 2rem;
}

.blog-post:last-child {
  border-bottom: none;
}

.post-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
}

.post-title a {
  color: var(--dark);
  text-decoration: none;
  transition: color 0.2s ease;
}

.post-title a:hover {
  color: var(--secondary);
}

.post-meta {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  color: var(--gray);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.post-tag {
  color: var(--secondary);
  border: 1px solid var(--gray);
  border-radius: 6px;
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.post-tag:hover {
  background: var(--secondary);
  color: var(--light);
  border-color: var(--secondary);
}

.post-description {
  color: var(--darkgray);
  line-height: 1.7;
  margin-bottom: 1rem;
}

.read-more {
  color: var(--secondary);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: color 0.2s ease;
}

.read-more:hover {
  color: var(--tertiary);
  text-decoration: underline;
}

.no-posts {
  color: var(--gray);
  font-style: italic;
  text-align: center;
  padding: 3rem 0;
}

@media (max-width: 768px) {
  .blog-index {
    padding: 0.5rem;
  }
  
  .blog-header h1 {
    font-size: 2rem;
  }
  
  .author-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .author-links {
    justify-content: center;
  }
  
  .post-title {
    font-size: 1.5rem;
  }
  
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
`

export default (() => BlogIndex) satisfies QuartzComponentConstructor