import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../quartz/components/types"

const BlogIndex: QuartzComponent = (props: QuartzComponentProps) => {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'red',
      color: 'white',
      padding: '40px',
      fontSize: '32px',
      zIndex: 9999,
      textAlign: 'center',
      border: '10px solid yellow'
    }}>
      🔴🔴🔴 BLOGINDEX WORKS! 🔴🔴🔴
      <br/>
      <span style={{fontSize: '18px'}}>
        slug: {props.fileData.slug}
      </span>
    </div>
  )
}

export default (() => BlogIndex) satisfies QuartzComponentConstructor