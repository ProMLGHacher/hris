import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import PushAlert from './components/PushAlert'

function App() {

  const [onConfirm, setOnConfirm] = useState(() => {
    return () => {}
  })

  return (
    <>
      <Header />
      <PushAlert onConfirm={onConfirm} />
      <button
        className="button"
        onClick={() => {
          setOnConfirm(() => {
            return () => {
              alert('ХУЙ')
            }
          })
        }}
      >
        remove
      </button>
    </>
  )
}

export default App
