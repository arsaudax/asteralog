import { QuartzComponent, QuartzComponentConstructor } from "../../quartz/components/types"

function BlogIndex() {
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

BlogIndex.css = `
.test-block {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: red;
  color: white;
  padding: 20px;
  font-size: 24px;
  text-align: center;
  z-index: 9999;
}
`

export default (() => BlogIndex) satisfies QuartzComponentConstructor