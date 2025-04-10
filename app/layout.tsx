import './global.css'
import { Navbar } from './components/nav'
import Footer from './components/footer'
 

const cx = (...classes) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cx(
        'text-black bg-white dark:text-white dark:bg-black',

      )}
    >
     <body className="antialiased"> 
        <main className="max-w-screen-xl mx-auto px-4 lg:px-8">  
          <Navbar />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  )
}
