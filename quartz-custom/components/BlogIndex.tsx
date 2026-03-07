import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"

const BlogIndex: QuartzComponent = (props: QuartzComponentProps) => {
  const { fileData } = props
  
  // Проверяем, что мы на главной странице блога
  const baseUrl = typeof process !== 'undefined' ? process.env?.BASE_URL : ''
  const isBlog = baseUrl?.includes('blog')
  
  // Рендерим только на главной странице блога
  if (!isBlog || fileData.slug !== 'index') {
    return null
  }
  
  return (
    <div style={{
      background: 'red',
      color: 'white',
      padding: '20px',
      fontSize: '24px',
      textAlign: 'center',
      margin: '20px'
    }}>
      🔴 BlogIndex is rendering!
    </div>
  )
}

export default (() => BlogIndex) satisfies QuartzComponentConstructor