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
  ArrowUpDown,
  Loader2,
  MessageSquare,
  Trash2
} from 'lucide-react'
import { _inventoryService } from './inventory.query'
import { _categoryService } from '~/features/admin/category/category.query'
import { cn } from '~/lib/utils'
import { toast } from 'react-toastify'
import { InventoryStockItem } from './types'
import { InventoryTransactions } from './inventory-transactions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/core/tabs'
import { Category } from '~/features/admin/category/types'

export function InventoryList() {
  const [activeTab, setActiveTab] = useState('stock')
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Filter States
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_STOCK'>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [sortBy, setSortBy] = useState<'desc' | 'asc'>('desc')

  // Queries
  const { data: stockRes, isLoading, isError } = _inventoryService.useStockList({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    category: categoryFilter === 'ALL' ? undefined : categoryFilter,
    sort: sortBy,
  })

  const { data: categoriesRes } = _categoryService.useCategories()

  // Reset page khi filter thay đổi
  React.useEffect(() => { setPage(1) }, [statusFilter, categoryFilter, sortBy])
  
  // Mutations
  const importStockMutation = _inventoryService.useImportStock()
  const adjustStockMutation = _inventoryService.useAdjustStock()
  const exportStockMutation = _inventoryService.useExportStock()

  const inventory = stockRes?.result?.data || []
  const totalItems = stockRes?.result?.total || 0
  const totalPages = stockRes?.result?.totalPages || 1
  const pageSize = 10
  const categories = categoriesRes?.result?.data || []

  // Edit / Adjust Modal State
  const [selectedItem, setSelectedItem] = useState<InventoryStockItem | null>(null)
  const [adjustmentTargetQty, setAdjustmentTargetQty] = useState<number>(0)
  const [adjustmentReason, setAdjustmentReason] = useState<string>('STOCK_TAKE')

  // Restock Receipt Modal State (Nhập hàng loạt)
  const [isRestockOpen, setIsRestockOpen] = useState(false)
  const [restockProductId, setRestockProductId] = useState<string>('')
  const [restockQty, setRestockQty] = useState<number>(50)
  const [restockSupplier, setRestockSupplier] = useState<string>('')
  const [restockUnitCost, setRestockUnitCost] = useState<number>(0)

  // Export Receipt Modal State (Xuất kho bán hàng)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [exportItems, setExportItems] = useState<{ id: string; quantity: number }[]>([])
  const [exportReason, setExportReason] = useState<string>('Xuất kho bán hàng')

  // Handle Debounce Search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Handle Edit/Adjustment Click
  const handleOpenEdit = (item: InventoryStockItem) => {
    setSelectedItem(item)
    setAdjustmentTargetQty(item.stockQuantity)
    setAdjustmentReason('STOCK_TAKE')
  }

  // Submit Inventory Adjustment
  const handleSaveAdjustment = async () => {
    if (!selectedItem) return

    try {
      await adjustStockMutation.mutateAsync({
        productVariantId: selectedItem.id,
        quantity: adjustmentTargetQty,
        reason: adjustmentReason === 'STOCK_TAKE' 
          ? 'Kiểm kê định kỳ (Cân đối số lượng thực tế)' 
          : adjustmentReason === 'CUSTOMER_RETURN'
          ? 'Hàng hoàn trả từ khách (Nhập lại kho)'
          : adjustmentReason === 'DAMAGED'
          ? 'Hàng lỗi kỹ thuật / Rách hỏng (Hao hụt)'
          : 'Sản phẩm làm hàng mẫu / Showroom'
      })
      toast.success(`Đã cập nhật kho cho sản phẩm ${selectedItem.sku} thành công!`)
      setSelectedItem(null)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Không thể cập nhật kho')
    }
  }

  // Submit Restock Receipt
  const handleSaveRestock = async () => {
    if (!restockProductId) return

    try {
      await importStockMutation.mutateAsync({
        productVariantId: restockProductId,
        quantity: restockQty,
        purchasePrice: restockUnitCost,
        supplier: restockSupplier,
      })
      toast.success(`Nhập kho thành công cho sản phẩm!`)
      setIsRestockOpen(false)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Không thể nhập kho')
    }
  }

  // Submit Export Receipt
  const handleSaveExport = async () => {
    const validItems = exportItems.filter(item => item.id && item.quantity > 0)
    if (validItems.length === 0) {
      toast.warning('Vui lòng chọn ít nhất 1 sản phẩm và nhập số lượng hợp lệ!')
      return
    }

    try {
      await exportStockMutation.mutateAsync({
        items: validItems.map(item => ({ productVariantId: item.id, quantity: item.quantity })),
        reason: exportReason,
      })
      toast.success(`Xuất kho thành công cho ${validItems.length} mặt hàng!`)
      setIsExportOpen(false)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Không thể xuất kho')
    }
  }

  const getStatusBadge = (item: InventoryStockItem) => {
    if (item.stockQuantity === 0) {
      return (
        <Badge className="bg-rose-50 text-rose-700 border-rose-200 rounded-full px-3 py-1 text-xs font-bold shadow-sm">
          Hết hàng
        </Badge>
      )
    }
    if (item.stockQuantity <= item.lowStockQuantity) {
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200 rounded-full px-3 py-1 text-xs font-bold shadow-sm">
          Sắp hết
        </Badge>
      )
    }
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 rounded-full px-3 py-1 text-xs font-bold shadow-sm">
        Còn hàng
      </Badge>
    )
  }

  return (
    <div className='flex flex-col gap-4 relative'>
      <div className='flex items-center justify-between'>
        <div className="flex flex-col gap-1">
          <h1 className='text-3xl font-black uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600'>Quản lý kho hàng</h1>
          <p className="text-muted-foreground text-sm font-medium">Kiểm kho sản phẩm, theo dõi SKU và lên phiếu nhập hàng loạt.</p>
        </div>
        {activeTab === 'stock' && (
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                setExportItems([{ id: inventory[0]?.id || '', quantity: 1 }])
                setExportReason('Xuất kho bán hàng')
                setIsExportOpen(true)
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/10 flex items-center gap-2"
            >
              <Minus className='h-4 w-4' />
              Tạo Phiếu Xuất
            </Button>
            <Button 
              onClick={() => {
                setRestockProductId(inventory[0]?.id || '')
                setRestockQty(50)
                setRestockSupplier('')
                setRestockUnitCost(0)
                setIsRestockOpen(true)
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/10 flex items-center gap-2"
            >
              <PackagePlus className='h-4 w-4' />
              Tạo Phiếu Nhập
            </Button>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-fit grid-cols-2 mb-4 bg-gray-100/50 p-1 rounded-xl">
          <TabsTrigger value="stock" className="rounded-lg font-bold text-xs uppercase tracking-widest px-8">Tồn kho hiện tại</TabsTrigger>
          <TabsTrigger value="transactions" className="rounded-lg font-bold text-xs uppercase tracking-widest px-8">Lịch sử giao dịch</TabsTrigger>
        </TabsList>

        <TabsContent value="stock" className="mt-0 outline-none">
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
                      placeholder='Tìm sản phẩm, SKU...'
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
                    <Select value={statusFilter} onValueChange={(v: 'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_STOCK') => setStatusFilter(v)}>
                      <SelectTrigger className="w-full rounded-xl border-gray-200 text-xs font-semibold h-10 bg-white">
                        <SelectValue placeholder="Trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Tất cả tình trạng</SelectItem>
                        <SelectItem value="IN_STOCK">Còn hàng (Tốt)</SelectItem>
                        <SelectItem value="LOW_STOCK">Sắp hết hàng</SelectItem>
                        <SelectItem value="OUT_STOCK">Đã hết hàng (0)</SelectItem>
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
                        {categories.map((cat: Category) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sorting Filter */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sắp xếp theo SKU</label>
                    <Select value={sortBy} onValueChange={(v: 'desc' | 'asc') => setSortBy(v)}>
                      <SelectTrigger className="w-full rounded-xl border-gray-200 text-xs font-semibold h-10 bg-white">
                        <SelectValue placeholder="Sắp xếp" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">Mới nhất (SKU desc)</SelectItem>
                        <SelectItem value="asc">Cũ nhất (SKU asc)</SelectItem>
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
                    <TableHead className="w-[200px] font-bold text-gray-600 pl-6">Sản phẩm</TableHead>
                    <TableHead className="font-bold text-gray-600">Mã SKU</TableHead>
                    <TableHead className="font-bold text-gray-600">Danh mục</TableHead>
                    <TableHead className='text-right font-bold text-gray-600'>Giá nhập</TableHead>
                    <TableHead className='text-right font-bold text-gray-600'>Tồn kho</TableHead>
                    <TableHead className="font-bold text-gray-600 pl-8">Trạng thái</TableHead>
                    <TableHead className={cn(
                      'text-right font-bold text-gray-600 pr-6 sticky right-0 z-20 bg-gray-50/80 shadow-[-4px_0_8px_rgba(0,0,0,0.05)]'
                    )}>
                      Điều phối
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Đang tải dữ liệu...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : inventory.length > 0 ? (
                    inventory.map((item) => (
                      <TableRow key={item.id} className="group hover:bg-gray-50/30 border-b border-gray-100 transition-colors">
                        <TableCell className="font-bold text-gray-800 text-sm pl-6">{item.product.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono bg-gray-50 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded border-gray-200">
                            {item.sku}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500 font-semibold text-xs">{item.category.name}</TableCell>
                        <TableCell className='text-right font-bold text-gray-500 text-xs'>{item.purchasePriceFormatted}</TableCell>
                        <TableCell className='text-right font-extrabold text-gray-800 text-sm'>{item.stockQuantity}</TableCell>
                        <TableCell className="pl-8">
                          {getStatusBadge(item)}
                        </TableCell>
                        <TableCell className={cn(
                          'text-right pr-6 sticky right-0 z-10 bg-white dark:bg-slate-950 group-hover:bg-gray-50/30 transition-colors shadow-[-4px_0_8px_rgba(0,0,0,0.05)]'
                        )}>
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
                      <TableCell colSpan={7} className="text-center py-12 text-gray-400 font-semibold">
                        Không tìm thấy sản phẩm nào trong kho phù hợp.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-1 py-2">
              <span className="text-xs font-semibold text-gray-400">
                Hiển thị {(page - 1) * pageSize + 1} – {Math.min(page * pageSize, totalItems)} trên {totalItems} sản phẩm
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="rounded-lg h-8 text-xs font-bold border-gray-200 hover:bg-gray-50"
                >
                  Trước
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...')
                      acc.push(p)
                      return acc
                    }, [])
                    .map((p, idx) =>
                      p === '...' ? (
                        <span key={`dots-${idx}`} className="px-1.5 text-xs font-bold text-gray-300">…</span>
                      ) : (
                        <Button
                          key={p}
                          variant={page === p ? 'default' : 'ghost'}
                          size="icon"
                          onClick={() => setPage(p as number)}
                          className={`h-8 w-8 rounded-lg text-xs font-bold ${
                            page === p
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {p}
                        </Button>
                      )
                    )
                  }
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="rounded-lg h-8 text-xs font-bold border-gray-200 hover:bg-gray-50"
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="transactions" className="mt-0 outline-none">
          <InventoryTransactions />
        </TabsContent>
      </Tabs>

      {/* Adjust Inventory Modal */}
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
                    Điều chỉnh số lượng tồn kho thực tế cho {selectedItem.sku}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="my-5 space-y-4 pt-3 border-t border-gray-100 min-w-0">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-700 space-y-2">
                <div className="flex justify-between items-center gap-4">
                  <span className="font-semibold text-gray-500 shrink-0">Sản phẩm:</span>
                  <span className="font-bold text-gray-800 truncate text-right">{selectedItem.product.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-500">SKU:</span>
                  <span className="font-mono font-bold text-gray-700">{selectedItem.sku}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-gray-200/50">
                  <span className="font-semibold text-gray-500">Hiện tại:</span>
                  <span className="font-extrabold text-indigo-600 text-base">{selectedItem.stockQuantity} cái</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Số lượng thực tế mới *</label>
                <Input
                  type="number"
                  min={0}
                  value={adjustmentTargetQty}
                  onChange={(e) => setAdjustmentTargetQty(Math.max(0, parseInt(e.target.value) || 0))}
                  className="rounded-xl border-gray-200 h-10 text-sm font-bold bg-white"
                />
              </div>

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
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setSelectedItem(null)} className="rounded-xl border-gray-200 font-bold text-sm h-10.5 hover:bg-gray-50">Hủy</Button>
              <Button
                onClick={handleSaveAdjustment}
                disabled={adjustStockMutation.isPending}
                className="rounded-xl font-bold text-sm h-10.5 text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/10"
              >
                {adjustStockMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Xác nhận lưu'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Restock Receipt Dialog */}
      {isRestockOpen && (
        <Dialog open={isRestockOpen} onOpenChange={() => setIsRestockOpen(false)}>
          <DialogContent className="max-w-lg rounded-2xl border border-gray-100 bg-white/95 backdrop-blur-xl shadow-2xl p-6">
            <DialogHeader className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/50">
                  <PackagePlus className="w-6 h-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-black text-gray-800">Lập Phiếu Nhập Hàng Mới</DialogTitle>
                  <DialogDescription className="text-sm font-medium text-gray-400">Thêm hàng tồn từ nhà phân phối vào kho hệ thống</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="my-5 space-y-4 pt-3 border-t border-gray-100 min-w-0">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mặt hàng cần nhập *</label>
                <Select value={restockProductId} onValueChange={setRestockProductId}>
                  <SelectTrigger className="w-full rounded-xl border-gray-200 text-xs font-bold h-10.5 bg-white">
                    <SelectValue placeholder="Chọn sản phẩm" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventory.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.product.name} ({item.sku})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Giá nhập đơn vị (VNĐ) *</label>
                  <Input
                    type="number"
                    value={restockUnitCost}
                    onChange={(e) => setRestockUnitCost(parseFloat(e.target.value) || 0)}
                    className="rounded-xl border-gray-200 h-10 text-sm font-bold bg-white"
                  />
                </div>
              </div>

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
              <Button variant="outline" onClick={() => setIsRestockOpen(false)} className="rounded-xl border-gray-200 font-bold text-sm h-10.5 hover:bg-gray-50">Hủy</Button>
              <Button
                onClick={handleSaveRestock}
                disabled={importStockMutation.isPending || !restockProductId || restockQty <= 0 || !restockSupplier}
                className="rounded-xl font-bold text-sm h-10.5 text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/10"
              >
                {importStockMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Xác nhận Nhập Hàng'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Export Receipt Dialog */}
      {isExportOpen && (
        <Dialog open={isExportOpen} onOpenChange={() => setIsExportOpen(false)}>
          <DialogContent className="max-w-lg rounded-2xl border border-gray-100 bg-white/95 backdrop-blur-xl shadow-2xl p-6">
            <DialogHeader className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-orange-50 text-orange-600 border border-orange-200/50">
                  <Minus className="w-6 h-6" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-black text-gray-800">Lập Phiếu Xuất Kho</DialogTitle>
                  <DialogDescription className="text-sm font-medium text-gray-400">Xuất hàng ra khỏi kho để bán hoặc phân phối</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="my-5 space-y-4 pt-3 border-t border-gray-100 min-w-0">
              <div className="space-y-3 max-h-[350px] overflow-y-auto">
                {exportItems.map((exportItem, index) => (
                  <div key={index} className="space-y-3 p-4 rounded-xl bg-gray-50/70 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400">Mặt hàng #{index + 1}</span>
                      {exportItems.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newItems = exportItems.filter((_, i) => i !== index)
                            setExportItems(newItems)
                          }}
                          className="h-7 px-2 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" />
                          Xóa
                        </Button>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mặt hàng cần xuất *</label>
                      <Select 
                        value={exportItem.id} 
                        onValueChange={(val) => {
                          const newItems = [...exportItems]
                          newItems[index].id = val
                          setExportItems(newItems)
                        }}
                      >
                        <SelectTrigger className="w-full rounded-xl border-gray-200 text-xs font-bold h-10.5 bg-white">
                          <SelectValue placeholder="Chọn sản phẩm" className="truncate min-w-0" />
                        </SelectTrigger>
                        <SelectContent>
                          {inventory.map((item) => (
                            <SelectItem key={item.id} value={item.id} disabled={item.stockQuantity === 0}>
                              {item.product.name} ({item.sku}) - Tồn: {item.stockQuantity}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Số lượng xuất *</label>
                      <Input
                        type="number"
                        min={1}
                        value={exportItem.quantity}
                        onChange={(e) => {
                          const newItems = [...exportItems]
                          newItems[index].quantity = Math.max(1, parseInt(e.target.value) || 0)
                          setExportItems(newItems)
                        }}
                        className="rounded-xl border-gray-200 h-10 text-sm font-bold bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setExportItems([...exportItems, { id: inventory[0]?.id || '', quantity: 1 }])}
                className="w-full border-dashed border-2 border-gray-200 text-gray-500 hover:text-orange-600 hover:border-orange-300 hover:bg-orange-50 font-bold h-10 rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm mặt hàng khác
              </Button>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lý do xuất kho</label>
                <div className="relative">
                  <ClipboardList className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-400" />
                  <Input
                    type="text"
                    value={exportReason}
                    onChange={(e) => setExportReason(e.target.value)}
                    placeholder="VD: Xuất kho bán lẻ, xuất cho khách VIP..."
                    className="pl-9 rounded-xl border-gray-200 h-10.5 text-sm font-semibold bg-white"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsExportOpen(false)} className="rounded-xl border-gray-200 font-bold text-sm h-10.5 hover:bg-gray-50">Hủy</Button>
              <Button
                onClick={handleSaveExport}
                disabled={exportStockMutation.isPending || exportItems.length === 0}
                className="rounded-xl font-bold text-sm h-10.5 text-white bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/10"
              >
                {exportStockMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Xác nhận Xuất Hàng'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

