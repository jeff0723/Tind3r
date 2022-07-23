import { Message } from '@xmtp/xmtp-js'
import { useCallback, useReducer } from 'react'
import { MessageStoreEvent } from 'contexts/xmtp'

type MessageDeduper = (message: Message) => boolean
type MessageStore = { [address: string]: Message[] }

const buildMessageDeduper = (state: Message[]): MessageDeduper => {
  const existingMessageKeys = state.map((msg) => msg.id)

  return (msg: Message) => existingMessageKeys.indexOf(msg.id) === -1
}

const useMessageStore = () => {
  const [messageStore, dispatchMessages] = useReducer(
    (state: MessageStore, { peerAddress, messages }: MessageStoreEvent) => {
      const existing = state[peerAddress] || []
      const newMessages = messages.filter(buildMessageDeduper(existing))
      if (!newMessages.length) {
        return state
      }

      return {
        ...state,
        [peerAddress]: existing.concat(newMessages),
      }
    },
    {}
  )

  const getMessages = useCallback(
    (peerAddress: string) => messageStore[peerAddress] || [],
    [messageStore]
  )

  return {
    getMessages,
    dispatchMessages,
  }
}

export const getLastMessage = (
  messages: Record<string, Message>
): Message | null => {
  const messagesList = Object.values(messages);
  if (messagesList.length === 0) return null;
  return messagesList.reduce((currentMostRecent, nextMessage) => {
    const tCurrent = currentMostRecent.sent?.getTime() || -Infinity;
    const tNext = nextMessage.sent?.getTime() || -Infinity;
    if (tCurrent > tNext) {
      return currentMostRecent;
    } else {
      return nextMessage;
    }
  });
};
export default useMessageStore
