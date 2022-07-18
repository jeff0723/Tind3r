import styles from './ChatApp.module.css'
import Link from 'next/link'

type Props = {}

function ChatApp() {
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.avatar} />
        <div className={styles.name}>Jerry</div>
        <div className={styles.menu} />
      </div>
      <div className={styles.tabs}>
        <div className={styles.tab}>matches</div>
        <div className={styles.tab}>messages</div>
      </div>
      <Link href="/message/123">
        <div className={styles.message}>
          <div className={styles.avatar} />
          <div className={styles['message-content']}>
            <div>Hi</div>
            <div>跟我一樣Ｒ</div>
          </div>
        </div>
      </Link>
      <Link href="/message/456">
        <div className={styles.message}>
          <div className={styles.avatar} />
          <div className={styles['message-content']}>
            <div>Hi2</div>
            <div>跟我一樣Ｒ2</div>
          </div>
        </div>
      </Link>
    </div>

  )
}

export default ChatApp
