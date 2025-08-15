import { Routes, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import Create from '@/pages/Create'
import Practice from '@/pages/Practice'
import Progress from '@/pages/Progress'
import Tools from '@/pages/Tools'
import NotFound from '@/pages/NotFound'

function App() {
  return (
    <ThemeProvider>
      <Helmet>
        <title>TuneMem - Remember Better with Music</title>
        <meta name="description" content="Transform text into catchy tunes for enhanced memory retention" />
      </Helmet>
      
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="create" element={<Create />} />
          <Route path="practice" element={<Practice />} />
          <Route path="progress" element={<Progress />} />
          <Route path="tools" element={<Tools />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App
