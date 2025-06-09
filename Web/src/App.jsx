import Routes from './Routes';
import { useEffect } from 'react'
import { isWalletConnected } from './lib/provider'
// import AuthenticatedRoutes from './utils/AuthenticatedRoutes'
// import Authenticate from './pages/Authenticate'
import { useGlobalState } from './lib/store'

function App() {
  const [connectedAccount] = useGlobalState('connectedAccount')
  useEffect(() => {
    isWalletConnected()
  }, [connectedAccount])

  return (
        <Routes />
  );
}

export default App;