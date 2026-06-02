# GUIDE.md – AI Development Instructions for Clinic IMS Frontend ## Core Rule: Use shadcn/ui Components Only You are building the frontend for the Clinic IMS. The project has **shadcn/ui** already installed and configured. You **MUST** follow these rules strictly. ### 1. Component Usage Rules - **Do NOT write custom UI components** from scratch (e.g., no hand‑built buttons, modals, inputs, tabs, tables, dropdowns, date pickers). - **Do NOT import from other UI libraries** (Material UI, Ant Design, Chakra, Bootstrap, etc.). - **Always use shadcn components** by importing from `@/components/ui
/[component-name]`. - **Follow shadcn design patterns** for layout, spacing, and theming. - **Use shadcn’s built-in variants and props** to achieve the desired look and behavior. - **Refer to the shadcn documentation** for component usage examples and best practices.
### 2. If a Component Is Missing

If you need a component that is not currently in the project (check `@/components/ui/` first):

1. **Do not create it manually.**
2. **Add it via the shadcn CLI** using the appropriate command:

```bash
npx shadcn@latest add [component-name]


┌─────────────────────────────────────────────────────────┐ │ Top Bar (Header) │ │ - Clinic name / logo │ │ - Page title (dynamic) │ │ - User menu (avatar, name, role, logout) │ ├──────────────┬──────────────────────────────────────────┤ │ │ │ │ Sidebar │ Main Content Area │ │ (Collapsible)│ - Page specific components │ │ │ - Uses shadcn Card / Table / Form etc. │ │ - Nav links │ │ │ • Dashboard│ │ │ • Patients│ │ │ • Appointments │ │ • Billing │ │ │ • Reports │ │ │ • Admin │ (visible only to admins) │ │ • Settings│ │ │ │ │ └──────────────┴──────────────────────────────────────────┘



What You Must NOT Do ❌ Write <button className="bg-blue-500 px-4 py-2 rounded">– use <Button>instead. ❌ Write a custom modal with position: fixed – use <Dialog>. ❌ Write a custom table with border-collapse – use <Table>. ❌ Write npm install @mui/material – forbidden. ❌ Create a new file src/components/ui/MyCustomButton.tsx – forbidden. ❌ Ignore the sidebar structure and put navigation elsewhere.

When in Doubt Check shadcn documentation: https: //ui.shadcn.com/docs/components

If a required component does not exist,
install it via the CLI as shown above. The dashboard layout (sidebar + header + main) must be consistent across all authenticated pages. Use a shared Layout component that wraps every page. These rules are non‑negotiable for the Clinic IMS frontend codebase


EXAMPLE CODE STRUCTURE

// pages/admin/users.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
}

from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
}

from "@/components/ui/table"

import {
  Button
}

from "@/components/ui/button"

import {
  UserPlus
}

from "lucide-react"

export default function UsersPage() {
  return (<div className="flex flex-col gap-4 p-4 md:p-6" > <div className="flex items-center justify-between" > <h1 className="text-2xl font-bold" >Users</h1> <Button> <UserPlus className="mr-2 h-4 w-4" /> Add User </Button> </div> <Card> <CardHeader> <CardTitle>All Users</CardTitle> </CardHeader> <CardContent> <Table> <TableHeader> <TableRow> <TableHead>Name</TableHead> <TableHead>Email</TableHead> <TableHead>Role</TableHead> </TableRow> </TableHeader> <TableBody> {
      /* map over users */
    }

    </TableBody> </Table> </CardContent> </Card> </div>)
}


Implementation Details 4.1 Sidebar Use shadcn Sidebar component (installed via npx shadcn add sidebar). Must be collapsible (icon-only mode). Active link highlighting based on current route. Admin-only menu items must be conditionally rendered based on user role (provided via auth context). 4.2 Top Bar / Header Use shadcn Card or custom div with flex layout (but still using Tailwind). Breadcrumbs optional but encouraged. User dropdown: shadcn DropdownMenu. 4.3 Main Content Area Use shadcn Card components to group content. For lists/tables: shadcn Table component (with TableHeader, TableBody, TableRow, TableCell). For forms: shadcn Form component (with react-hook-form integration),
Input,
Select,
Button. For modals: shadcn Dialog. For date/time: shadcn Calendar+Popover (or shadcn date picker if available). 4.4 Responsive Behavior Sidebar collapses to bottom navigation on mobile (use shadcn’s responsive sidebar patterns). Main content uses padding and grid where appropriate.