'use client'
import { useState } from 'react'
import { CollectionList } from './components/collection-list'
import { CollectionDetailForm } from './components/collection-details-form'
import { CollectionProducts } from './components/collection-products'
import { AddProductToCollection } from './components/add-product-to-collection'
import { _collectionService } from './collection.query'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/ui/core/tabs'
import { Button } from '~/components/ui/core/button'
import {
  Trash2,
  AlertCircle,
  Loader2,
  Package,
  Settings,
  PlusSquare,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/core/alert'

export default function CollectionWorkspace() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const {
    data: collectionRes,
    isLoading,
    refetch,
  } = _collectionService.useCollection(selectedId || '')
  const deleteMutation = _collectionService.useDeleteCollection()
  const updateMutation = _collectionService.useUpdateCollection()

  const collection = collectionRes?.result

  const handleDelete = async () => {
    if (
      selectedId &&
      confirm('Are you sure you want to delete this collection?')
    ) {
      await deleteMutation.mutateAsync(selectedId)
      setSelectedId(null)
    }
  }

  const handleRemoveProduct = async (productId: string) => {
    if (collection && confirm('Remove this product from collection?')) {
      const remainingIds = (collection as any).products
        .filter((p: any) => p.id !== productId)
        .map((p: any) => p.id)

      await updateMutation.mutateAsync({
        id: collection.id,
        data: { productIds: remainingIds },
      })
    }
  }

  return (
    <div className='flex min-h-[calc(100vh-120px)] overflow-hidden bg-muted/30 rounded-3xl  border'>
      <div className='w-80 flex-shrink-0 flex flex-col border-r border'>
        <CollectionList
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id)
            setIsAdding(false)
          }}
          onAdd={() => {
            setSelectedId(null)
            setIsAdding(true)
          }}
        />
      </div>

      <div className='flex-1 p-8 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950'>
        {isAdding ? (
          <div className='max-w-4xl mx-auto space-y-6'>
            <div className='flex justify-between items-center bg-muted rounded-2xl border backdrop-blur-xl p-4'>
              <h1 className='text-3xl font-black   tracking-tighter'>
                NEW COLLECTION
              </h1>
              <Button onClick={() => setIsAdding(false)}>CANCEL</Button>
            </div>
            <div className='bg-muted p-8 rounded-3xl border  backdrop-blur-xl'>
              <CollectionDetailForm onSuccess={() => setIsAdding(false)} />
            </div>
          </div>
        ) : selectedId === null ? (
          <div className='h-full flex flex-col items-center justify-center space-y-2'>
            <div className='h-32 w-32 rounded-full bg-muted border flex items-center justify-center relative'>
              <Package size={56} className='text-white' />
              <div className='absolute -top-1 -right-1 h-6 w-6 bg-primary rounded-full animate-pulse' />
            </div>
            <div className='text-center space-y-2'>
              <p className='text-2xl font-black tracking-tight'>
                CHỌN MỘT BỘ SƯU TẬP
              </p>
              <p className='text-slate-500 max-w-[250px] mx-auto'>
                Chọn từ danh sách hoặc tạo một kiệt tác mới.
              </p>
            </div>
            <Button
              onClick={() => setIsAdding(true)}
              className='mt-4 rounded-full px-10 h-12 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform'
            >
              + TẠO MỚI
            </Button>
          </div>
        ) : isLoading ? (
          <div className='h-full flex items-center justify-center'>
            <div className='relative'>
              <Loader2 className='animate-spin h-12 w-12 text-primary' />
              <div className='absolute inset-0 blur-xl bg-primary/20' />
            </div>
          </div>
        ) : collection ? (
          <div className='max-w-6xl mx-auto space-y-8'>
            <div className='flex justify-between items-end gap-6 bg-muted p-10 rounded-[2.5rem] border  backdrop-blur-xl relative overflow-hidden group'>
              <div className='relative z-10'>
                <div className='flex items-center gap-2 mb-3'>
                  <div className='h-2 w-2 bg-primary rounded-full animate-pulse' />
                  <p className='text-primary font-black text-xs uppercase tracking-[0.3em]'>
                    COLLECTION WORKSPACE
                  </p>
                </div>
                <h1 className='text-6xl font-black leading-none tracking-tighter'>
                  {collection.name}
                </h1>
                <div className='flex items-center gap-4 mt-4'>
                  <p className='text-xs bg-muted px-3 py-1 rounded-full border'>
                    ID: {collection.id}
                  </p>
                  <p className='text-xs bg-muted px-3 py-1 rounded-full border'>
                    SLUG: {collection.slug}
                  </p>
                  {collection.isHomeActive ? (
                    <p className='text-xs bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider'>
                      Hiện Trang Chủ
                    </p>
                  ) : (
                    <p className='text-xs bg-muted text-slate-400 px-3 py-1 rounded-full border'>
                      Không hiện trang chủ
                    </p>
                  )}
                </div>
              </div>

              <div className='flex gap-3 relative z-10'>
                <Button
                  variant='destructive'
                  size='icon'
                  onClick={handleDelete}
                >
                  <Trash2 size={24} />
                </Button>
              </div>

              <div className='absolute right-[-40px] top-[-40px] opacity-[0.05] group-hover:opacity-[0.08] transition-opacity -rotate-12'>
                <Package size={300} />
              </div>
            </div>

            <Tabs defaultValue='settings' className='w-full'>
              <TabsList className='bg-muted p-1.5 rounded-2xl border  h-16 w-fit mb-8 backdrop-blur-md'>
                <TabsTrigger
                  value='settings'
                  className='px-8 h-12 rounded-xl text-xs font-black tracking-widest data-[state=active]:bg-primary data-[state=active] transition-all uppercase'
                >
                  <Settings size={16} className='mr-2' /> SETTINGS
                </TabsTrigger>
                <TabsTrigger
                  value='products'
                  className='px-8 h-12 rounded-xl text-xs font-black tracking-widest data-[state=active]:bg-primary data-[state=active] transition-all uppercase'
                >
                  <Package size={16} className='mr-2' /> PRODUCTS (
                  {(collection as any).products?.length || 0})
                </TabsTrigger>
                <TabsTrigger
                  value='add'
                  className='px-8 h-12 rounded-xl text-xs font-black tracking-widest data-[state=active]:bg-primary data-[state=active] transition-all uppercase'
                >
                  <PlusSquare size={16} className='mr-2' /> EXPLORE & ADD
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value='settings'
                className='focus:outline-none animate-in fade-in slide-in-from-bottom-4 duration-500'
              >
                <div className='bg-muted p-8 rounded-3xl border  backdrop-blur-xl'>
                  <CollectionDetailForm
                    collection={collection}
                    onSuccess={refetch}
                  />
                </div>
              </TabsContent>

              <TabsContent
                value='products'
                className='focus:outline-none animate-in fade-in slide-in-from-bottom-4 duration-500'
              >
                <CollectionProducts
                  products={(collection as any).products || []}
                  onRemove={handleRemoveProduct}
                />
              </TabsContent>

              <TabsContent
                value='add'
                className='focus:outline-none animate-in fade-in slide-in-from-bottom-4 duration-500'
              >
                <AddProductToCollection
                  collectionId={collection.id}
                  existingProductIds={
                    (collection as any).products?.map((p: any) => p.id) || []
                  }
                  onSuccess={refetch}
                />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <Alert
            variant='destructive'
            className='bg-red-500/10 border-red-500/50 text-red-500'
          >
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load collection details. Please try again.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
