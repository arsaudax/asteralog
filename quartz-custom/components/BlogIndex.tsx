import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"

const BlogIndex: QuartzComponent = (props: QuartzComponentProps) => {
  const { allFiles, fileData } = props

  // Считаем файлы с тегом blog
  const blogFiles = allFiles.filter(file => {
    const tags = file.frontmatter?.tags
    return Array.isArray(tags) && tags.includes('blog')
  })

  const blogPosts = blogFiles.filter(file => file.slug !== 'index')
  const indexFile = blogFiles.find(file => file.slug === 'index')

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ background: '#ff0', padding: '1rem', marginBottom: '2rem' }}>
        <h2>🔍 Отладка BlogIndex</h2>
        <p><strong>Текущая страница:</strong> {fileData.slug}</p>
        <p><strong>Всего файлов:</strong> {allFiles.length}</p>
        <p><strong>Файлов с тегом blog:</strong> {blogFiles.length}</p>
        {indexFile && (
          <p><strong>index.md:</strong> {indexFile.slug} - теги: {indexFile.frontmatter?.tags?.join(', ')}</p>
        )}
        <p><strong>Постов для ленты (кроме index):</strong> {blogPosts.length}</p>
        <h3>Все файлы с тегом blog:</h3>
        <ul>
          {blogFiles.map(file => (
            <li key={file.slug}>
              <strong>{file.slug}</strong> - теги: {file.frontmatter?.tags?.join(', ')}
            </li>
          ))}
        </ul>
      </div>
      
      <h1>Блог</h1>
      {blogPosts.length === 0 ? (
        <p>Пока нет записей</p>
      ) : (
        <ul>
          {blogPosts.map(post => (
            <li key={post.slug}>
              <a href={`/${post.slug}`}>{post.frontmatter?.title || post.slug}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default (() => BlogIndex) satisfies QuartzComponentConstructor