import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Index from './common/routes/Index'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Index />
    </BrowserRouter>
  )
}

export default App
