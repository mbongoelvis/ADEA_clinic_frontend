import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"
import {
  Activity,
  Bell,
  Box,
  DollarSign,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  Shield,
  ShoppingCart,
  TrendingUp,
  User,
  Users,
  Warehouse,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const NAV_GROUPS = [
  {
    label: "Admin",
    items: [
      { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/admin/users", label: "Users", icon: Users },
      { to: "/admin/roles", label: "Roles & Permissions", icon: Shield },
      { to: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
  {
    label: "Payroll",
    items: [
      {
        to: "/admin/payroll/dashboard",
        label: "Payroll Overview",
        icon: DollarSign,
      },
      { to: "/admin/payroll/employees", label: "Employees", icon: Users },
      { to: "/admin/payroll/run", label: "Run Payroll", icon: TrendingUp },
    ],
  },
  {
    label: "Inventory",
    items: [
      {
        to: "/admin/inventory/dashboard",
        label: "Inventory Overview",
        icon: Warehouse,
      },
      { to: "/admin/inventory/items", label: "Stock Items", icon: Box },
      {
        to: "/admin/inventory/transactions",
        label: "Stock Movements",
        icon: Package,
      },
      {
        to: "/admin/inventory/purchase-orders",
        label: "Purchase Orders",
        icon: ShoppingCart,
      },
    ],
  },
  {
    label: "Clinical",
    items: [
      {
        to: "/clinical/nursing-assessments",
        label: "Nursing Assessments",
        icon: HeartPulse,
      },
    ],
  },
]

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
    isActive
      ? "bg-primary/10 text-primary"
      : "text-muted-foreground hover:bg-muted"
  )

function SidebarNav() {
  return (
    <nav className="flex flex-col gap-4">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="mb-1 px-3 text-xs font-semibold tracking-wider text-muted-foreground/60 uppercase">
            {group.label}
          </p>
          <div className="flex flex-col gap-0.5">
            {group.items.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={navLinkClass}>
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}

function getInitials(name?: string) {
  if (!name) return "??"
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr]">
      {/* Desktop Sidebar */}
      <aside className="hidden border-r bg-muted/40 md:flex md:flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <NavLink
            to="/admin/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <Activity className="h-5 w-5 text-primary" />
            <span>Clinic IMS</span>
          </NavLink>
        </div>
        <ScrollArea className="flex-1 px-3 py-4">
          <SidebarNav />
        </ScrollArea>
        <Separator />
        <div className="p-3">
          <NavLink to="/admin/profile" className={navLinkClass}>
            <User className="h-4 w-4 shrink-0" />
            My Profile
          </NavLink>
        </div>
      </aside>

      <div className="flex flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          {/* Mobile hamburger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-14 items-center border-b px-4">
                <span className="font-semibold">Clinic IMS</span>
              </div>
              <div className="p-3">
                <SidebarNav />
                <Separator className="my-3" />
                <NavLink to="/admin/profile" className={navLinkClass}>
                  <User className="h-4 w-4 shrink-0" />
                  My Profile
                </NavLink>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1" />

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                </Avatar>
                <div className="hidden text-left lg:block">
                  <p className="text-sm leading-none font-medium">
                    {user?.name ?? ""}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user?.role ?? ""}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <NavLink to="/admin/profile">
                  <User className="mr-2 h-4 w-4" /> Profile
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink to="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page content */}
        <main className="flex flex-1 flex-col gap-4 overflow-auto p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
