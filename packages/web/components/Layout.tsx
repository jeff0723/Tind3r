import styles from './Layout.module.css'
import ChatApp from './ChatApp'

type AppProps = {
  children?: React.ReactNode
}


function Layout({ children }: AppProps) {
  return (
    <div className={styles.container}>
      <div className={styles['chat-app']}>
        <ChatApp />
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>

  )
}

export default Layout
