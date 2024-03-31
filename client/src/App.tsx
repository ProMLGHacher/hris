import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import PushAlert from './components/PushAlert'
import { Outlet } from 'react-router-dom'

function App() {

  const [onConfirm, setOnConfirm] = useState(() => {
    return () => {}
  })

  return (
    <>
      <Header />
      <PushAlert onConfirm={onConfirm} />
      <Outlet />
    </>
  )
}

export default App
