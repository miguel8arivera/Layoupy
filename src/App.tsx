import { Box } from '@mui/material'
import { useState, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ElementFactory from './components/ElementFactory'
import Renderer from './components/Renderer'
import type { FormElement } from './types/elements'

const STORAGE_KEY = 'layoupy-elements'

function App() {
  const [isFactoryVisible, setIsFactoryVisible] = useState(true)
  const [rendererElements, setRendererElements] = useState<FormElement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })

  // Guardar en localStorage cuando cambien los elementos
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rendererElements))
  }, [rendererElements])

  const toggleFactory = () => {
    setIsFactoryVisible(!isFactoryVisible)
  }

  const handleRemoveFromRenderer = (elementId: string) => {
    setRendererElements(rendererElements.filter(el => el.id !== elementId))
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Box sx={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        display: 'flex',
      }}>
        <ElementFactory
          isVisible={isFactoryVisible}
          onToggle={toggleFactory}
          onRemoveFromRenderer={handleRemoveFromRenderer}
        />
        <Renderer
          elements={rendererElements}
          onElementsChange={setRendererElements}
        />
      </Box>
    </>
  )
}

export default App
