import { useState } from "react"
import { Download, MoreHorizontal, Plus } from "lucide-react"
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

type POStatus = "Draft" | "Sent" | "Received" | "Cancelled"

interface PurchaseOrder {
  id: string
  poNumber: string
  supplier: string
  date: string
  total: number
  status: POStatus
  items: number
}

interface Supplier {
  id: string
  name: string
  contact: string
  email: string
  terms: string
  shipping: string
}

const MOCK_POS: PurchaseOrder[] = [
  {
    id: "PO001",
    poNumber: "PO-0042",
    supplier: "MedSupply Co.",
    date: "Jun 20, 2026",
    total: 1280.5,
    status: "Received",
    items: 3,
  },
  {
    id: "PO002",
    poNumber: "PO-0043",
    supplier: "SafeGuard Inc.",
    date: "Jun 22, 2026",
    total: 460.0,
    status: "Sent",
    items: 2,
  },
  {
    id: "PO003",
    poNumber: "PO-0044",
    supplier: "PharmaDirect",
    date: "Jun 24, 2026",
    total: 744.0,
    status: "Draft",
    items: 1,
  },
  {
    id: "PO004",
    poNumber: "PO-0041",
    supplier: "LabTech Distributors",
    date: "Jun 15, 2026",
    total: 350.0,
    status: "Received",
    items: 2,
  },
  {
    id: "PO005",
    poNumber: "PO-0040",
    supplier: "OfficeWorld",
    date: "Jun 10, 2026",
    total: 135.0,
    status: "Cancelled",
    items: 4,
  },
]

const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: "S001",
    name: "MedSupply Co.",
    contact: "Jenny Walsh",
    email: "jenny@medsupply.com",
    terms: "Net 30",
    shipping: "FedEx 2-day",
  },
  {
    id: "S002",
    name: "SafeGuard Inc.",
    contact: "Tom Park",
    email: "tom@safeguard.com",
    terms: "Net 15",
    shipping: "UPS Ground",
  },
  {
    id: "S003",
    name: "PharmaDirect",
    contact: "Angela Brown",
    email: "angela@pharmadirect.com",
    terms: "Net 45",
    shipping: "USPS Priority",
  },
  {
    id: "S004",
    name: "LabTech Distributors",
    contact: "David Chen",
    email: "david@labtech.com",
    terms: "Net 30",
    shipping: "FedEx Ground",
  },
]

const STATUS_VARIANTS: Record<
  POStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  Draft: "secondary",
  Sent: "outline",
  Received: "default",
  Cancelled: "destructive",
}

export default function PurchaseOrdersPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [receiveId, setReceiveId] = useState<string | null>(null)
  const [supDialogOpen, setSupDialogOpen] = useState(false)

  const receivingPO = MOCK_POS.find((p) => p.id === receiveId)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Purchase Orders</h1>
          <p className="text-muted-foreground">
            Create, send, and receive supplier orders
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSupDialogOpen(true)}
          >
            Manage Suppliers
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create PO
          </Button>
        </div>
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>

        {/* PO List */}
        <TabsContent value="orders">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO #</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_POS.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-mono font-medium">
                        {po.poNumber}
                      </TableCell>
                      <TableCell>{po.supplier}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {po.date}
                      </TableCell>
                      <TableCell className="text-center">{po.items}</TableCell>
                      <TableCell className="text-right">
                        ${po.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANTS[po.status]}>
                          {po.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </DropdownMenuItem>
                            {po.status === "Sent" && (
                              <DropdownMenuItem
                                onClick={() => setReceiveId(po.id)}
                              >
                                Receive Order
                              </DropdownMenuItem>
                            )}
                            {po.status === "Draft" && (
                              <>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>
                                  Mark as Sent
                                </DropdownMenuItem>
                              </>
                            )}
                            {po.status !== "Received" &&
                              po.status !== "Cancelled" && (
                                <DropdownMenuItem className="text-destructive">
                                  Cancel PO
                                </DropdownMenuItem>
                              )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Separator />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suppliers */}
        <TabsContent value="suppliers">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Payment Terms</TableHead>
                    <TableHead>Shipping</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_SUPPLIERS.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.contact}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {s.email}
                      </TableCell>
                      <TableCell>{s.terms}</TableCell>
                      <TableCell>{s.shipping}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create PO Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label>Supplier</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier…" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_SUPPLIERS.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Expected Delivery Date</Label>
              <Input type="date" />
            </div>
            <Separator />
            <CardHeader className="p-0">
              <CardTitle className="text-sm">Order Items</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground">
              <span>Item</span>
              <span>Qty</span>
              <span>Unit Price</span>
            </div>
            {[0, 1].map((i) => (
              <div key={i} className="grid grid-cols-3 gap-2">
                <Select>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Item…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flu">Flu Vaccine</SelectItem>
                    <SelectItem value="gloves">Nitrile Gloves</SelectItem>
                    <SelectItem value="syringes">Syringes</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="number" placeholder="10" className="text-sm" />
                <Input
                  type="number"
                  placeholder="$0.00"
                  step="0.01"
                  className="text-sm"
                />
              </div>
            ))}
            <Button variant="outline" size="sm" className="self-start">
              <Plus className="mr-2 h-3 w-3" />
              Add Line
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setCreateOpen(false)}>Create PO</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receive PO Dialog */}
      <Dialog open={!!receiveId} onOpenChange={() => setReceiveId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Receive Order — {receivingPO?.poNumber}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <p className="text-sm text-muted-foreground">
              Confirm quantities received. Partial receipt is allowed —
              remaining will stay on open order.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm">Flu Vaccine</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Ordered: 50
                  </span>
                  <Input
                    type="number"
                    defaultValue={50}
                    className="h-8 w-20 text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm">Alcohol Swabs</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Ordered: 200
                  </span>
                  <Input
                    type="number"
                    defaultValue={200}
                    className="h-8 w-20 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReceiveId(null)}>
              Cancel
            </Button>
            <Button onClick={() => setReceiveId(null)}>
              Confirm Receipt & Update Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
