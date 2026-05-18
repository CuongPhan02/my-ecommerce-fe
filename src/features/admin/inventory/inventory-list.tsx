'use client'
import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/core/table'
import { Badge } from '~/components/ui/core/badge'
import { Input } from '~/components/ui/core/input'
import { Button } from '~/components/ui/core/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '~/components/ui/core/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/core/select'
import { 
  Search, 
  Filter, 
  Edit, 
  PackagePlus, 
  CheckCircle2, 
  AlertTriangle, 
  Package, 
  Plus, 
  Minus,
  ClipboardList,
  Building2,
  FileSpreadsheet,
  Layers,
  ArrowUpDown
} from 'lucide-react'

interface InventoryItem {
  id: string
  productName: string
  sku: string
  category: string
  quantity: number
  status: 'Còn hàng' | 'Sắp hết' | 'Hết hàng'
  lastUpdated: string
}

const initialInventory: InventoryItem[] = [
  {
    id: 'INV-1001',
    productName: 'Áo thun cotton cao cấp nam',
    sku: 'TS-COT-M-BLK',
    category: 'Quần áo',
    quantity: 150,
    status: 'Còn hàng',
    lastUpdated: '2023-10-25 10:00',
  },
  {
    id: 'INV-1002',
    productName: 'Giày thể thao nữ RunStar',
    sku: 'SNK-W-38-WHT',
    category: 'Giày dép',
    quantity: 12,
    status: 'Sắp hết',
    lastUpdated: '2023-10-24 15:30',
  },
  {
    id: 'INV-1003',
    productName: 'Tai nghe chụp tai Bluetooth Aura',
    sku: 'EAR-BT-BLK',
    category: 'Điện tử',
    quantity: 0,
    status: 'Hết hàng',
    lastUpdated: '2023-10-20 09:15',
  },
  {
    id: 'INV-1004',
    productName: 'Balo đựng laptop 15.6 inch Chống nước',
    sku: 'BP-15-GRY',
    category: 'Phụ kiện',
    quantity: 45,
    status: 'Còn hàng',
    lastUpdated: '2023-10-22 14:20',
  },
]

export function InventoryList() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory)
  const [searchQuery, setSearchQuery] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Filter States
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [sortBy, setSortBy] = useState<string>('QTY_DESC')

  // Edit / Adjust Modal State
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [adjustmentQty, setAdjustmentQty] = useState<number>(0)
  const [adjustmentType, setAdjustmentType] = useState<'ADD' | 'SUBTRACT'>('ADD')
  const [adjustmentReason, setAdjustmentReason] = useState<string>('STOCK_TAKE')
  const [adjustmentNote, setAdjustmentNote] = useState<string>('')

  // Restock Receipt Modal State (Nhập hàng loạt)
  const [isRestockOpen, setIsRestockOpen] = useState(false)
  const [restockProductId, setRestockProductId] = useState<string>('')
  const [restockQty, setRestockQty] = useState<number>(50)
  const [restockSupplier, setRestockSupplier] = useState<string>('Aura Garment Co.')
  const [restockUnitCost, setRestockUnitCost] = useState<string>('12.50')

  // Helpers to calculate status automatically from quantity
  const getCalculatedStatus = (qty: number): InventoryItem['status'] => {
    if (qty === 0) return 'Hết hàng'
    if (qty <= 20) return 'Sắp hết'
    return 'Còn hàng'
  }

  // Handle Edit/Adjustment Click
  const handleOpenEdit = (item: InventoryItem) => {
    setSelectedItem(item)
    setAdjustmentQty(0)
    setAdjustmentType('ADD')
    setAdjustmentReason('STOCK_TAKE')
    setAdjustmentNote('')
  }

  // Submit Inventory Adjustment
  const handleSaveAdjustment = () => {
    if (!selectedItem) return

    let quantityChange = adjustmentQty
    if (adjustmentType === 'SUBTRACT') {
      quantityChange = -adjustmentQty
    }

    const updatedQty = Math.max(0, selectedItem.quantity + quantityChange)
    const updatedStatus = getCalculatedStatus(updatedQty)

    const updatedInventory = inventory.map((item) => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          quantity: updatedQty,
          status: updatedStatus,
          lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16)
        }
      }
      return item
    })

    setInventory(updatedInventory)
    setToastMessage(`Đã cập nhật kho cho phiếu ${selectedItem.id} thành công!`)
    setTimeout(() => setToastMessage(null), 3000)

    setSelectedItem(null)
  }

  // Submit Restock Receipt
  const handleSaveRestock = () => {
    if (!restockProductId) return

    const selectedProduct = inventory.find(i => i.id === restockProductId)
    if (!selectedProduct) return

    const updatedQty = selectedProduct.quantity + restockQty
    const updatedStatus = getCalculatedStatus(updatedQty)

    const updatedInventory = inventory.map((item) => {
      if (item.id === restockProductId) {
        return {
          ...item,
          quantity: updatedQty,
          status: updatedStatus,
          lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16)
        }
      }
      return item
    })

    setInventory(updatedInventory)
    setToastMessage(`Phiếu Nhập Hàng: Nhập thành công +${restockQty} sản phẩm ${selectedProduct.productName}!`)
    setTimeout(() => setToastMessage(null), 3000)

    setIsRestockOpen(false)
  }

  // Filter and sort items logic
  const filteredItems = inventory
    .filter((item) => {
      const matchesSearch = 
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter
      const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'QTY_DESC') return b.quantity - a.quantity
      if (sortBy === 'QTY_ASC') return a.quantity - b.quantity
      if (sortBy === 'NAME_ASC') return a.productName.localeCompare(b.productName)
      if (sortBy === 'LAST_UPDATED') {
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      }
      return 0
    })

  return (
    <div className='flex flex-col gap-4 relative'>
      {/* Premium Toast Success Message */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-200 flex items-center gap-3 bg-indigo-600 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-indigo-400/30 animate-in fade-in slide-in-from-top-3 duration-300 font-bold text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className='flex items-center justify-between'>
        <div className="flex flex-col gap-1">
          <h1 className='text-3xl font-black uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600'>Quản lý kho hàng</h1>
          <p className="text-muted-foreground text-sm font-medium">Kiểm kho sản phẩm, theo dõi SKU và lên phiếu nhập hàng loạt.</p>
        </div>
        <Button 
          onClick={() => {
            setRestockProductId(inventory[0]?.id || '')
            setRestockQty(50)
            setRestockSupplier('Aura Garment Co.')
            setRestockUnitCost('12.50')
            setIsRestockOpen(true)
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/10 flex items-center gap-2"
        >
          <PackagePlus className='h-4 w-4' />
          Tạo Phiếu Nhập
        </Button>
      </div>

      <Card className="border-gray-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className='pb-4 border-b border-gray-100 bg-gray-50/50'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div>
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-500" />
                Tồn kho sản phẩm
              </CardTitle>
              <CardDescription className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Theo dõi định mức tồn kho và chỉnh sửa trực quan
              </CardDescription>
            </div>
            <div className='flex items-center gap-3'>
              <div className='relative w-full md:w-[280px]'>
                <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                <Input
                  type='search'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Tìm sản phẩm, SKU, mã số...'
                  className='pl-9 w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 placeholder-gray-400 h-10 text-sm font-medium'
                />
              </div>
              <Button 
                variant={showFilters ? 'default' : 'outline'} 
                size='icon' 
                onClick={() => setShowFilters(!showFilters)}
                className={`rounded-xl h-10 w-10 transition-all ${
                  showFilters ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Filter className='h-4 w-4' />
              </Button>
            </div>
          </div>

          {/* Expandable Filter Grid */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Status Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tình trạng hàng</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full rounded-xl border-gray-200 text-xs font-semibold h-10 bg-white">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả tình trạng</SelectItem>
                    <SelectItem value="Còn hàng">Còn hàng (Tốt)</SelectItem>
                    <SelectItem value="Sắp hết">Sắp hết hàng (&le; 20)</SelectItem>
                    <SelectItem value="Hết hàng">Đã hết hàng (0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Danh mục sản phẩm</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full rounded-xl border-gray-200 text-xs font-semibold h-10 bg-white">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tất cả danh mục</SelectItem>
                    <SelectItem value="Quần áo">Quần áo</SelectItem>
                    <SelectItem value="Giày dép">Giày dép</SelectItem>
                    <SelectItem value="Điện tử">Điện tử</SelectItem>
                    <SelectItem value="Phụ kiện">Phụ kiện</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sorting Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sắp xếp theo</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full rounded-xl border-gray-200 text-xs font-semibold h-10 bg-white">
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="QTY_DESC">Số lượng: Giảm dần</SelectItem>
                    <SelectItem value="QTY_ASC">Số lượng: Tăng dần</SelectItem>
                    <SelectItem value="NAME_ASC">Tên sản phẩm: A - Z</SelectItem>
                    <SelectItem value="LAST_UPDATED">Mới cập nhật nhất</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/80">
              <TableRow className="hover:bg-transparent border-b border-gray-100">
                <TableHead className="w-[120px] font-bold text-gray-600 pl-6">Mã SKU</TableHead>
                <TableHead className="font-bold text-gray-600">Sản phẩm</TableHead>
                <TableHead className="font-bold text-gray-600">Mã định danh SKU</TableHead>
                <TableHead className="font-bold text-gray-600">Danh mục</TableHead>
                <TableHead className='text-right font-bold text-gray-600'>Số lượng</TableHead>
                <TableHead className="font-bold text-gray-600">Trạng thái</TableHead>
                <TableHead className="font-bold text-gray-600">Cập nhật lúc</TableHead>
                <TableHead className='text-right font-bold text-gray-600 pr-6'>Điều phối</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50/30 border-b border-gray-100 transition-colors">
                    <TableCell className='font-bold text-indigo-600 pl-6 text-sm'>{item.id}</TableCell>
                    <TableCell className="font-bold text-gray-800 text-sm">{item.productName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono bg-gray-50 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded border-gray-200">
                        {item.sku}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 font-semibold text-xs">{item.category}</TableCell>
                    <TableCell className='text-right font-extrabold text-gray-800 text-sm pl-4'>{item.quantity}</TableCell>
                    <TableCell>
                      <Badge
                        className={`rounded-full px-3 py-1 text-xs font-bold shadow-sm transition-all border ${
                          item.status === 'Còn hàng'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.status === 'Sắp hết'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 text-xs font-semibold">{item.lastUpdated}</TableCell>
                    <TableCell className='text-right pr-6'>
                      <Button 
                        variant='outline' 
                        size='sm'
                        onClick={() => handleOpenEdit(item)}
                        className="text-indigo-600 hover:text-white hover:bg-indigo-600 border-indigo-200 font-bold text-xs h-8 px-3 rounded-lg flex items-center gap-1.5 transition-all ml-auto"
                      >
                        <Edit className='h-3.5 w-3.5' />
                        Cân đối kho
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-gray-400 font-semibold">
                    Không tìm thấy sản phẩm nào trong kho phù hợp.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Adjust Inventory / Balance Stock Form Dialog */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-lg rounded-2xl border border-gray-100 bg-white/95 backdrop-blur-xl shadow-2xl p-6">
            <DialogHeader className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/50">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-black text-gray-800">
                    Cân đối kho hàng thủ công
                  </DialogTitle>
                  <DialogDescription className="text-sm font-medium text-gray-400">
                    Phiếu điều chỉnh tồn kho cho mặt hàng {selectedItem.id}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="my-5 space-y-4 pt-3 border-t border-gray-100">
              {/* Product Info Block */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-700 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-500">Sản phẩm:</span>
                  <span className="font-bold text-gray-800">{selectedItem.productName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-500">SKU:</span>
                  <span className="font-mono font-bold text-gray-700">{selectedItem.sku}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-gray-200/50">
                  <span className="font-semibold text-gray-500">Số lượng hiện tại trong kho:</span>
                  <span className="font-extrabold text-indigo-600 text-base">{selectedItem.quantity} cái</span>
                </div>
              </div>

              {/* Adjustment Type / Math Selector */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={adjustmentType === 'ADD' ? 'default' : 'outline'}
                  onClick={() => setAdjustmentType('ADD')}
                  className={`rounded-xl font-bold text-xs h-10 ${
                    adjustmentType === 'ADD' 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm' 
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  } flex items-center justify-center gap-1.5`}
                >
                  <Plus className="w-4 h-4" />
                  Cộng thêm hàng
                </Button>
                <Button
                  type="button"
                  variant={adjustmentType === 'SUBTRACT' ? 'default' : 'outline'}
                  onClick={() => setAdjustmentType('SUBTRACT')}
                  className={`rounded-xl font-bold text-xs h-10 ${
                    adjustmentType === 'SUBTRACT' 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm' 
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  } flex items-center justify-center gap-1.5`}
                >
                  <Minus className="w-4 h-4" />
                  Trừ bớt hàng
                </Button>
              </div>

              {/* Adjustment Quantity Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Số lượng điều chỉnh *</label>
                <Input
                  type="number"
                  min={0}
                  value={adjustmentQty === 0 ? '' : adjustmentQty}
                  onChange={(e) => setAdjustmentQty(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="Nhập số lượng..."
                  className="rounded-xl border-gray-200 h-10 text-sm font-bold bg-white"
                />
              </div>

              {/* Reason Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lý do điều phối kho</label>
                <Select value={adjustmentReason} onValueChange={setAdjustmentReason}>
                  <SelectTrigger className="w-full rounded-xl border-gray-200 text-xs font-bold h-10.5 bg-white">
                    <SelectValue placeholder="Chọn lý do" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STOCK_TAKE">Kiểm kê định kỳ (Cân đối số lượng thực tế)</SelectItem>
                    <SelectItem value="CUSTOMER_RETURN">Hàng hoàn trả từ khách (Nhập lại kho)</SelectItem>
                    <SelectItem value="DAMAGED">Hàng lỗi kỹ thuật / Rách hỏng (Hao hụt)</SelectItem>
                    <SelectItem value="SAMPLE">Sản phẩm làm hàng mẫu / Showroom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Adjustment Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ghi chú chi tiết</label>
                <textarea
                  rows={2}
                  value={adjustmentNote}
                  onChange={(e) => setAdjustmentNote(e.target.value)}
                  placeholder="Ví dụ: Phát hiện 2 sản phẩm bị bám bẩn trong lúc kiểm đếm..."
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 font-medium placeholder-gray-400 bg-white"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                variant="outline" 
                onClick={() => setSelectedItem(null)}
                className="rounded-xl border-gray-200 font-bold text-sm h-10.5 hover:bg-gray-50"
              >
                Hủy bỏ
              </Button>
              <Button
                onClick={handleSaveAdjustment}
                disabled={adjustmentQty <= 0}
                className="rounded-xl font-bold text-sm h-10.5 text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/10"
              >
                Xác nhận lưu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Restock Receipt Dialog (Tạo Phiếu Nhập) */}
      {isRestockOpen && (
        <Dialog open={isRestockOpen} onOpenChange={() => setIsRestockOpen(false)}>
          <DialogContent className="max-w-lg rounded-2xl border border-gray-100 bg-white/95 backdrop-blur-xl shadow-2xl p-6">
            <DialogHeader className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/50">
                  <PackagePlus className="w-6 h-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-black text-gray-800">
                    Lập Phiếu Nhập Hàng Mới
                  </DialogTitle>
                  <DialogDescription className="text-sm font-medium text-gray-400">
                    Thêm hàng tồn từ nhà phân phối vào kho hệ thống
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="my-5 space-y-4 pt-3 border-t border-gray-100">
              {/* Product Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mặt hàng cần nhập *</label>
                <Select value={restockProductId} onValueChange={setRestockProductId}>
                  <SelectTrigger className="w-full rounded-xl border-gray-200 text-xs font-bold h-10.5 bg-white">
                    <SelectValue placeholder="Chọn sản phẩm" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventory.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.productName} ({item.sku})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Restock Qty */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Số lượng nhập *</label>
                  <Input
                    type="number"
                    min={1}
                    value={restockQty}
                    onChange={(e) => setRestockQty(Math.max(1, parseInt(e.target.value) || 0))}
                    className="rounded-xl border-gray-200 h-10 text-sm font-bold bg-white"
                  />
                </div>

                {/* Restock Cost */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Giá nhập đơn vị ($) *</label>
                  <Input
                    type="text"
                    value={restockUnitCost}
                    onChange={(e) => setRestockUnitCost(e.target.value)}
                    className="rounded-xl border-gray-200 h-10 text-sm font-bold bg-white"
                  />
                </div>
              </div>

              {/* Supplier Info */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nhà cung cấp / Xưởng may</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-400" />
                  <Input
                    type="text"
                    value={restockSupplier}
                    onChange={(e) => setRestockSupplier(e.target.value)}
                    placeholder="Tên nhà cung cấp..."
                    className="pl-9 rounded-xl border-gray-200 h-10.5 text-sm font-semibold bg-white"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                variant="outline" 
                onClick={() => setIsRestockOpen(false)}
                className="rounded-xl border-gray-200 font-bold text-sm h-10.5 hover:bg-gray-50"
              >
                Hủy bỏ
              </Button>
              <Button
                onClick={handleSaveRestock}
                disabled={!restockProductId || restockQty <= 0}
                className="rounded-xl font-bold text-sm h-10.5 text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/10"
              >
                Xác nhận Nhập Hàng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
