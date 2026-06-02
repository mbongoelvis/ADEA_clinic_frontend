import { useState } from "react"
import { Download, MoreHorizontal, Plus, Search, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface StockItem {
  id: string
  name: string
  sku: string
  category: "Vaccine" | "Medication" | "PPE" | "Office" | "Lab" | "Supply"
  qty: number
  reorderLevel: number
  unit: string
  unitCost: number
  supplier: string
  expiry?: string
}

const MOCK_ITEMS: StockItem[] = [
  {
    id: "I001",
    name: "Flu Vaccine",
    sku: "VAC-FLU-001",
    category: "Vaccine",
    qty: 8,
    reorderLevel: 20,
    unit: "vial",
    unitCost: 18.5,
    supplier: "MedSupply Co.",
    expiry: "Oct 2026",
  },
  {
    id: "I002",
    name: "Nitrile Gloves (M)",
    sku: "PPE-GLV-002",
    category: "PPE",
    qty: 3,
    reorderLevel: 10,
    unit: "box",
    unitCost: 12.0,
    supplier: "SafeGuard Inc.",
  },
  {
    id: "I003",
    name: "Disposable Syringes 3mL",
    sku: "SUP-SYR-003",
    category: "Supply",
    qty: 45,
    reorderLevel: 50,
    unit: "pcs",
    unitCost: 0.35,
    supplier: "MedSupply Co.",
  },
  {
    id: "I004",
    name: "Alcohol Swabs",
    sku: "SUP-SWB-004",
    category: "Supply",
    qty: 120,
    reorderLevel: 100,
    unit: "pcs",
    unitCost: 0.05,
    supplier: "SafeGuard Inc.",
  },
  {
    id: "I005",
    name: "COVID-19 Test Kit",
    sku: "LAB-CVD-005",
    category: "Lab",
    qty: 22,
    reorderLevel: 15,
    unit: "kit",
    unitCost: 8.75,
    supplier: "LabTech Distributors",
    expiry: "Aug 2026",
  },
  {
    id: "I006",
    name: "Epinephrine Auto-Injector",
    sku: "MED-EPI-006",
    category: "Medication",
    qty: 4,
    reorderLevel: 5,
    unit: "each",
    unitCost: 124.0,
    supplier: "PharmaDirect",
    expiry: "Jul 2026",
  },
  {
    id: "I007",
    name: "Printer Paper (ream)",
    sku: "OFF-PPR-007",
    category: "Office",
    qty: 30,
    reorderLevel: 10,
    unit: "ream",
    unitCost: 4.5,
    supplier: "OfficeWorld",
  },
]

const BLANK: Partial<StockItem> = {
  name: "",
  sku: "",
  category: "Supply",
  qty: 0,
  reorderLevel: 0,
  unit: "each",
  unitCost: 0,
  supplier: "",
}

export default function StockItemsPage() {
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState<Partial<StockItem>>(BLANK)

  const filtered = MOCK_ITEMS.filter((i) => {
    const matchSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.sku.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === "all" || i.category === catFilter
    const matchStock =
      stockFilter === "all" ||
      (stockFilter === "low" && i.qty <= i.reorderLevel) ||
      (stockFilter === "ok" && i.qty > i.reorderLevel)
    return matchSearch && matchCat && matchStock
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stock Items</h1>
          <p className="text-muted-foreground">
            Catalog of all inventory items
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Bulk Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setForm(BLANK)
              setDialogOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap gap-3 pt-4">
          <div className="relative min-w-45 flex-1">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items or SKU…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={catFilter} onValueChange={setCatFilter}>
            <SelectTrigger className="w-37.5">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Vaccine">Vaccine</SelectItem>
              <SelectItem value="Medication">Medication</SelectItem>
              <SelectItem value="PPE">PPE</SelectItem>
              <SelectItem value="Lab">Lab</SelectItem>
              <SelectItem value="Supply">Supply</SelectItem>
              <SelectItem value="Office">Office</SelectItem>
            </SelectContent>
          </Select>
          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-32.5">
              <SelectValue placeholder="Stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="ok">Adequate</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">
                  <Checkbox />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Reorder At</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Unit Cost</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const isLow = item.qty <= item.reorderLevel
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {item.sku}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right font-semibold ${isLow ? "text-destructive" : ""}`}
                    >
                      {item.qty}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {item.reorderLevel}
                    </TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell className="text-right">
                      ${item.unitCost.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-sm">{item.supplier}</TableCell>
                    <TableCell
                      className={`text-sm ${item.expiry ? "text-amber-600" : "text-muted-foreground"}`}
                    >
                      {item.expiry ?? "—"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setForm(item)
                              setDialogOpen(true)
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>Add Stock</DropdownMenuItem>
                          <DropdownMenuItem>Print Barcode</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {form.id ? "Edit Item" : "Add Stock Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label>Item Name</Label>
              <Input
                value={form.name ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Flu Vaccine"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>SKU</Label>
              <Input
                value={form.sku ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sku: e.target.value }))
                }
                placeholder="VAC-FLU-001"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    category: v as StockItem["category"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vaccine">Vaccine</SelectItem>
                  <SelectItem value="Medication">Medication</SelectItem>
                  <SelectItem value="PPE">PPE</SelectItem>
                  <SelectItem value="Lab">Lab</SelectItem>
                  <SelectItem value="Supply">Supply</SelectItem>
                  <SelectItem value="Office">Office</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Current Quantity</Label>
              <Input
                type="number"
                value={form.qty ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, qty: parseInt(e.target.value) || 0 }))
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Reorder Level</Label>
              <Input
                type="number"
                value={form.reorderLevel ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    reorderLevel: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Unit</Label>
              <Input
                value={form.unit ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, unit: e.target.value }))
                }
                placeholder="box, vial, each…"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Unit Cost ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.unitCost ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    unitCost: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label>Supplier</Label>
              <Input
                value={form.supplier ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, supplier: e.target.value }))
                }
                placeholder="Supplier name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Expiration Date (optional)</Label>
              <Input
                type="month"
                value={form.expiry ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, expiry: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setDialogOpen(false)}>Save Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
