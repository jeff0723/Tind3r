import ChatApp from 'components/Chat'
import styles from './Layout.module.css'

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
