import { Route, Routes } from 'react-router'
import Login from './pages/Login.jsx'
import Registar from './pages/Registar.jsx'
import Perfil from './pages/Perfil.jsx'
import Home from './pages/Home.jsx'
import GestaoQuartos from './pages/Quarto/GestaoQuartos.jsx'
import VerQuarto from './pages/Quarto/VerQuarto.jsx'
import CriarQuarto from './pages/Quarto/CriarQuarto.jsx'
import EditarQuarto from './pages/Quarto/EditarQuarto.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import AdministradorOnly from './components/AdministadorOnly.jsx'

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registar" element={<Registar />} />

          {/* So permite o acesso a utilizadores autenticados */}
          <Route path="/perfil"
            element={
              <PrivateRoute>
                <Perfil />
              </PrivateRoute>
            }
          />

          {/* So permite o acesso a administradores */}
          <Route path="/quartos"
            element={
              <AdministradorOnly>
                <GestaoQuartos />
              </AdministradorOnly>
            }
          />
          <Route path="/quartos/criar"
            element={
              <AdministradorOnly>
                <CriarQuarto />
              </AdministradorOnly>
            }
          />
          <Route path="/quartos/ver/:id"
            element={
              <AdministradorOnly>
                <VerQuarto />
              </AdministradorOnly>
            }
            />
          <Route path="/quartos/editar/:id"
            element={
              <AdministradorOnly>
                <EditarQuarto />
              </AdministradorOnly>
            }
          />
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App