import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

type TxType = "Stock-in" | "Stock-out" | "Adjustment" | "Return"

interface Transaction {
  id: string
  date: string
  item: string
  type: TxType
  qty: number
  reference: string
  user: string
  note?: string
}

const MOCK_TX: Transaction[] = [
  {
    id: "TX001",
    date: "Jun 22, 2026",
    item: "Flu Vaccine",
    type: "Stock-in",
    qty: 50,
    reference: "PO-0042",
    user: "Admin",
    note: "Received full order",
  },
  {
    id: "TX002",
    date: "Jun 22, 2026",
    item: "Nitrile Gloves (M)",
    type: "Stock-out",
    qty: 4,
    reference: "APT-0918",
    user: "Dr. Johnson",
    note: "Used during procedures",
  },
  {
    id: "TX003",
    date: "Jun 21, 2026",
    item: "COVID-19 Test Kit",
    type: "Adjustment",
    qty: -2,
    reference: "ADJ-006",
    user: "Admin",
    note: "Damaged in storage",
  },
  {
    id: "TX004",
    date: "Jun 20, 2026",
    item: "Alcohol Swabs",
    type: "Stock-in",
    qty: 200,
    reference: "PO-0041",
    user: "Admin",
  },
  {
    id: "TX005",
    date: "Jun 19, 2026",
    item: "Disposable Syringes",
    type: "Return",
    qty: 10,
    reference: "RET-003",
    user: "Rina Patel",
    note: "Unused, restock",
  },
  {
    id: "TX006",
    date: "Jun 18, 2026",
    item: "Epinephrine Auto-Injector",
    type: "Stock-out",
    qty: 1,
    reference: "APT-0901",
    user: "Dr. Johnson",
    note: "Administered to patient",
  },
]

const TX_VARIANTS: Record<
  TxType,
  "default" | "secondary" | "outline" | "destructive"
> = {
  "Stock-in": "default",
  "Stock-out": "secondary",
  Adjustment: "outline",
  Return: "outline",
}

export default function StockMovementsPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [addOpen, setAddOpen] = useState(false)
  const [txType, setTxType] = useState<TxType>("Stock-in")
  const [adjReason, setAdjReason] = useState("")

  const filtered = MOCK_TX.filter((t) => {
    const matchSearch =
      t.item.toLowerCase().includes(search.toLowerCase()) ||
      t.reference.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === "all" || t.type === typeFilter
    return matchSearch && matchType
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Stock Movements</h1>
          <p className="text-muted-foreground">
            Record and review all inventory transactions
          </p>
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <Tabs defaultValue="log">
        <TabsList>
          <TabsTrigger value="log">Transaction Log</TabsTrigger>
          <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
        </TabsList>

        <TabsContent value="log" className="flex flex-col gap-4">
          {/* Filters */}
          <Card>
            <CardContent className="flex flex-wrap gap-3 pt-4">
              <div className="relative min-w-45 flex-1">
                <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search item or reference…"
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Stock-in">Stock-in</SelectItem>
                  <SelectItem value="Stock-out">Stock-out</SelectItem>
                  <SelectItem value="Adjustment">Adjustment</SelectItem>
                  <SelectItem value="Return">Return</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="text-sm text-muted-foreground">
                        {t.date}
                      </TableCell>
                      <TableCell className="font-medium">{t.item}</TableCell>
                      <TableCell>
                        <Badge variant={TX_VARIANTS[t.type]}>{t.type}</Badge>
                      </TableCell>
                      <TableCell
                        className={`text-right font-semibold ${t.qty < 0 ? "text-destructive" : ""}`}
                      >
                        {t.qty > 0 ? `+${t.qty}` : t.qty}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {t.reference}
                      </TableCell>
                      <TableCell className="text-sm">{t.user}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {t.note ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Separator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiring">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Items Expiring Within 30 Days
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Qty Remaining</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Epinephrine Auto-Injector
                    </TableCell>
                    <TableCell>4</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Jul 2026</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        Mark as Waste
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Hepatitis B Vaccine
                    </TableCell>
                    <TableCell>6</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Jul 2026</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        Mark as Waste
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Transaction Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label>Transaction Type</Label>
              <Select
                value={txType}
                onValueChange={(v) => setTxType(v as TxType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Stock-in">Stock-in (Receive)</SelectItem>
                  <SelectItem value="Stock-out">Stock-out (Usage)</SelectItem>
                  <SelectItem value="Adjustment">Adjustment</SelectItem>
                  <SelectItem value="Return">Return</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Item</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select item…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flu-vac">Flu Vaccine</SelectItem>
                  <SelectItem value="gloves">Nitrile Gloves (M)</SelectItem>
                  <SelectItem value="syringes">Disposable Syringes</SelectItem>
                  <SelectItem value="swabs">Alcohol Swabs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Quantity</Label>
              <Input type="number" min={1} placeholder="10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Reference (PO #, Appointment ID, etc.)</Label>
              <Input placeholder="PO-0043" />
            </div>
            {txType === "Adjustment" && (
              <div className="flex flex-col gap-1.5">
                <Label>Reason for Adjustment</Label>
                <Select value={adjReason} onValueChange={setAdjReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="damaged">Damaged</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                    <SelectItem value="count-correction">
                      Count Correction
                    </SelectItem>
                    <SelectItem value="expired">Expired/Waste</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <Label>Notes (optional)</Label>
              <Textarea placeholder="Additional details…" rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAddOpen(false)}>Save Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
