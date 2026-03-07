import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"

const BlogIndex: QuartzComponent = (props: QuartzComponentProps) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'red',
      color: 'white',
      padding: '20px',
      fontSize: '24px',
      textAlign: 'center',
      zIndex: 9999
    }}>
      🔴🔴🔴 TEST: BlogIndex is working! 🔴🔴🔴
    </div>
  )
}

export default (() => BlogIndex) satisfies QuartzComponentConstructor