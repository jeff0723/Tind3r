import ChatApp from 'components/Chat'
import Conversation from 'components/Conversation'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

const MessagePage: NextPage = () => {
  const router = useRouter()
  const messageId = router.query.messageId as string

  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      <div style={{ width: '25vw', minWidth: '390px', maxWidth: '400px' }}>
        <ChatApp />
      </div>
      <div>
        <Conversation peerAddress={messageId} />
      </div>
      <div>

      </div>
    </div>
  )
}

export default MessagePage
