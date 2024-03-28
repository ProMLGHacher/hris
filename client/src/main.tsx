import ReactDOM from 'react-dom/client'
import './index.css'
import AppRouter from './app/router.tsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <AppRouter />
  </Provider>
)
