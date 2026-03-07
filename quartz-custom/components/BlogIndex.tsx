import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"

const BlogIndex: QuartzComponent = (props: QuartzComponentProps) => {
  return (
    <div style={{
      background: 'red',
      color: 'white',
      padding: '20px',
      margin: '20px',
      fontSize: '24px',
      textAlign: 'center',
      border: '5px solid yellow'
    }}>
      🔴🔴🔴 TEST: BlogIndex component is rendering! 🔴🔴🔴
    </div>
  )
}

export default BlogIndex