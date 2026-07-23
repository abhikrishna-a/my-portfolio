import './globals.css'

export const metadata = {
  title: 'Abhikrishna A | Designer & Developer',
  description: 'Designer and Developer crafting digital products that solve problems and look beautiful.',
  keywords: ['Abhikrishna', 'Developer', 'Designer', 'React', 'Django', 'Portfolio'],
  openGraph: {
    title: 'Abhikrishna A | Designer & Developer',
    description: 'Crafting digital experiences that blend bold design with seamless functionality.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
