import { Navigate, Route, Routes } from "react-router-dom"
import Layout from "./components/shared/Layout"
import PatientLayout from "./components/shared/PatientLayout"
import ProtectedRoute from "./components/shared/ProtectedRoute"
import LoginPage from "./pages/auth/LoginPage"
import MfaPage from "./pages/auth/MfaPage"
import OtpPage from "./pages/auth/OtpPage"
import AdminDashboardPage from "./pages/admin/AdminDashboardPage"
import UsersPage from "./pages/admin/UsersPage"
import RolesPage from "./pages/admin/RolesPage"
import SettingsPage from "./pages/admin/SettingsPage"
import ProfilePage from "./pages/admin/ProfilePage"
import PayrollDashboardPage from "./pages/admin/payroll/PayrollDashboardPage"
import PayrollEmployeesPage from "./pages/admin/payroll/PayrollEmployeesPage"
import PayrollRunPage from "./pages/admin/payroll/PayrollRunPage"
import InventoryDashboardPage from "./pages/admin/inventory/InventoryDashboardPage"
import StockItemsPage from "./pages/admin/inventory/StockItemsPage"
import StockMovementsPage from "./pages/admin/inventory/StockMovementsPage"
import PurchaseOrdersPage from "./pages/admin/inventory/PurchaseOrdersPage"
import NursingAssessmentsPage from "./pages/admin/clinical/NursingAssessmentsPage"
import PatientDashboardPage from "./pages/patient/PatientDashboardPage"
import PreNursingIntakePage from "./pages/patient/PreNursingIntakePage"
import PatientRequestsPage from "./pages/patient/PatientRequestsPage"
import PatientProfilePage from "./pages/patient/PatientProfilePage"

function App() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/mfa" element={<MfaPage />} />
      <Route path="/auth/otp" element={<OtpPage />} />

      {/* Protected patient routes */}
      <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
        <Route path="/patient" element={<PatientLayout />}>
          <Route index element={<Navigate to="/patient/dashboard" replace />} />
          <Route path="dashboard" element={<PatientDashboardPage />} />
          <Route path="pre-nursing-intake" element={<PreNursingIntakePage />} />
          <Route path="requests" element={<PatientRequestsPage />} />
          <Route path="profile" element={<PatientProfilePage />} />
        </Route>
      </Route>

      {/* Protected admin routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="admin">
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="roles" element={<RolesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            {/* Payroll */}
            <Route path="payroll">
              <Route
                index
                element={<Navigate to="/admin/payroll/dashboard" replace />}
              />
              <Route path="dashboard" element={<PayrollDashboardPage />} />
              <Route path="employees" element={<PayrollEmployeesPage />} />
              <Route path="run" element={<PayrollRunPage />} />
            </Route>
            {/* Inventory */}
            <Route path="inventory">
              <Route
                index
                element={<Navigate to="/admin/inventory/dashboard" replace />}
              />
              <Route path="dashboard" element={<InventoryDashboardPage />} />
              <Route path="items" element={<StockItemsPage />} />
              <Route path="transactions" element={<StockMovementsPage />} />
              <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
            </Route>
          </Route>

          {/* Clinical routes (under same Layout) */}
          <Route path="clinical">
            <Route
              index
              element={<Navigate to="/clinical/nursing-assessments" replace />}
            />
            <Route
              path="nursing-assessments"
              element={<NursingAssessmentsPage />}
            />
          </Route>
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
