import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"
import { classNames } from "../../quartz/util/lang"
import { Date } from "../../quartz/components/Date"

const BlogIndex: QuartzComponent = (props: QuartzComponentProps) => {
  const { cfg, allFiles, displayClass } = props

  const blogPosts = allFiles
    .filter(file => {
      const tags = file.frontmatter?.tags
      return Array.isArray(tags) && tags.includes('blog') && file.slug !== 'index'
    })
    .sort((a, b) => {
      const dateA = a.dates?.created ? new Date(a.dates.created).getTime() : 0
      const dateB = b.dates?.created ? new Date(b.dates.created).getTime() : 0
      return dateB - dateA
    })

  return (
    <div class={classNames(displayClass, "blog-index")}>
      <h1>Блог</h1>
      <div class="blog-posts">
        {blogPosts.map(post => (
          <article class="blog-post" key={post.slug}>
            <h2><a href={`/${post.slug}`}>{post.frontmatter?.title || 'Без названия'}</a></h2>
            <div class="post-meta">
              {post.dates?.created && <Date date={post.dates.created} locale={cfg.locale} />}
              <div class="post-tags">
                {post.frontmatter?.tags
                  ?.filter(t => !['garden', 'blog'].includes(t))
                  .map(tag => (
                    <a href={`/tags/${tag}`} class="tag">{tag}</a>
                  ))
                }
              </div>
            </div>
            {post.frontmatter?.description && (
              <p class="post-description">{post.frontmatter.description}</p>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}

BlogIndex.css = `
.blog-index {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
.blog-posts {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.blog-post {
  border-bottom: 1px solid var(--lightgray);
  padding-bottom: 1.5rem;
}
.post-meta {
  display: flex;
  gap: 1rem;
  color: var(--gray);
  font-size: 0.9rem;
}
.post-tags {
  display: flex;
  gap: 0.5rem;
}
.tag {
  color: var(--secondary);
  border: 1px solid var(--gray);
  border-radius: 4px;
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
  text-decoration: none;
}
.tag:hover {
  background: var(--secondary);
  color: var(--light);
}
`

export default (() => BlogIndex) satisfies QuartzComponentConstructor