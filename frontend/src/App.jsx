import { Route, Routes, useLocation } from "react-router"
import Login from "./pages/Login.jsx"
import Registar from "./pages/Registar.jsx"
import ForgotPassword from "./pages/ForgotPassword.jsx"
import ResetPassword from "./pages/ResetPassword.jsx"
import Perfil from "./pages/Perfil.jsx"
import Home from "./pages/Home.jsx"
import Sobre from "./pages/Sobre.jsx"
import Termos from "./pages/Termos.jsx"
import Privacidade from "./pages/Privacidade.jsx"
import Rooms from "./pages/Rooms.jsx"
import RoomDetails from "./pages/RoomDetails.jsx"
import Reservations from "./pages/Reservations.jsx"
import Contact from "./pages/Contact.jsx"
// Páginas de gestão de quartos (admin)
import GestaoQuartos from "./pages/Quarto/GestaoQuartos.jsx"
import VerQuarto from "./pages/Quarto/VerQuarto.jsx"
import CriarQuarto from "./pages/Quarto/CriarQuarto.jsx"
import EditarQuarto from "./pages/Quarto/EditarQuarto.jsx"
// Área administrativa
import AdminDashboard from "./pages/admin/AdminDashboard.jsx"
import AdminRooms from "./pages/admin/AdminRooms.jsx"
import AdminReservations from "./pages/admin/AdminReservations.jsx"
import AdminClients from "./pages/admin/AdminClients.jsx"
import AdminPayments from "./pages/admin/AdminPayments.jsx"
import AdminReports from "./pages/admin/AdminReports.jsx"
import AdminProfile from "./pages/admin/AdminProfile.jsx"
import { AuthProvider } from "./context/AuthContext.jsx"
import PrivateRoute from "./components/PrivateRoute.jsx"
import AdministradorOnly from "./components/AdministadorOnly.jsx"
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"

function App() {
  const location = useLocation()
  // Não mostrar header/footer em login e registar
  const hideHeaderFooter = ["/login", "/registar", "/forgot", "/reset-password"].includes(location.pathname) || location.pathname.startsWith("/admin")

  return (
    <>
      <AuthProvider>
        {!hideHeaderFooter && <Header />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/termos" element={<Termos />} />
          <Route path="/privacidade" element={<Privacidade />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registar" element={<Registar />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/contact" element={<Contact />} />

          <Route
            path="/reservations"
            element={
              <PrivateRoute>
                <Reservations />
              </PrivateRoute>
            }
          />

          {/* So permite o acesso a utilizadores autenticados */}
          <Route
            path="/perfil"
            element={
              <PrivateRoute>
                <Perfil />
              </PrivateRoute>
            }
          />

          {/* So permite o acesso a administradores */}
          <Route
            path="/quartos"
            element={
              <AdministradorOnly>
                <GestaoQuartos />
              </AdministradorOnly>
            }
          />
          <Route
            path="/quartos/criar"
            element={
              <AdministradorOnly>
                <CriarQuarto />
              </AdministradorOnly>
            }
          />
          <Route
            path="/quartos/ver/:id"
            element={
              <AdministradorOnly>
                <VerQuarto />
              </AdministradorOnly>
            }
          />
          <Route
            path="/quartos/editar/:id"
            element={
              <AdministradorOnly>
                <EditarQuarto />
              </AdministradorOnly>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <AdministradorOnly>
                <AdminDashboard />
              </AdministradorOnly>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdministradorOnly>
                <AdminDashboard />
              </AdministradorOnly>
            }
          />
          <Route
            path="/admin/quartos"
            element={
              <AdministradorOnly>
                <AdminRooms />
              </AdministradorOnly>
            }
          />
          <Route
            path="/admin/reservas"
            element={
              <AdministradorOnly>
                <AdminReservations />
              </AdministradorOnly>
            }
          />
          <Route
            path="/admin/clientes"
            element={
              <AdministradorOnly>
                <AdminClients />
              </AdministradorOnly>
            }
          />
          <Route
            path="/admin/pagamentos"
            element={
              <AdministradorOnly>
                <AdminPayments />
              </AdministradorOnly>
            }
          />
          <Route
            path="/admin/relatorios"
            element={
              <AdministradorOnly>
                <AdminReports />
              </AdministradorOnly>
            }
          />
          <Route
            path="/admin/perfil"
            element={
              <AdministradorOnly>
                <AdminProfile />
              </AdministradorOnly>
            }
          />
        </Routes>
        {!hideHeaderFooter && <Footer />}
      </AuthProvider>
    </>
  )
}

export default App
