import type { NextPage } from 'next'
import Link from 'next/link'

const MessagePage: NextPage = () => {

  return (
    <div style={{ height: '100%' }}>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1, padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link href="/">X</Link>
          </div>
          <div style={{ padding: '100px', textAlign: 'center' }}>
            message List(message ID from redux state)
          </div>
        </div>
        <div style={{ flexGrow: 0, width: '375px', borderLeft: 'solid 1px #000' }}>
          message target profile(data from redux state)
        </div>
      </div>
    </div>
  )
}

export default MessagePage
