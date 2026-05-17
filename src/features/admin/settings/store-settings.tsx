'use client'
import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/ui/core/tabs'
import { Input } from '~/components/ui/core/input'
import { Label } from '~/components/ui/core/label'
import { Textarea } from '~/components/ui/core/textarea'
import { Button } from '~/components/ui/core/button'
import { Switch } from '~/components/ui/core/switch'

export function StoreSettings() {
  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>Cài đặt cửa hàng</h1>
        <p className='text-muted-foreground'>
          Quản lý các thông tin và cấu hình chung cho toàn bộ hệ thống e-commerce.
        </p>
      </div>

      <Tabs defaultValue='general' className='w-full'>
        <TabsList className='grid w-full grid-cols-2 lg:w-[400px]'>
          <TabsTrigger value='general'>Thông tin chung</TabsTrigger>
          <TabsTrigger value='advanced'>Nâng cao & SEO</TabsTrigger>
        </TabsList>

        <TabsContent value='general' className='space-y-4 mt-4'>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>
                Tên cửa hàng, địa chỉ và thông tin liên hệ hiển thị với khách hàng.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='storeName'>Tên cửa hàng</Label>
                <Input id='storeName' defaultValue='My E-commerce' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='storeEmail'>Email liên hệ</Label>
                <Input id='storeEmail' type='email' defaultValue='contact@myecommerce.com' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='storePhone'>Số điện thoại</Label>
                <Input id='storePhone' defaultValue='0123 456 789' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='storeAddress'>Địa chỉ</Label>
                <Textarea
                  id='storeAddress'
                  defaultValue='123 Đường ABC, Quận X, TP.HCM'
                  className='min-h-[80px]'
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Lưu thông tin</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mạng xã hội</CardTitle>
              <CardDescription>Liên kết đến các kênh truyền thông của cửa hàng.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='facebook'>Facebook</Label>
                <Input id='facebook' placeholder='https://facebook.com/...' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='instagram'>Instagram</Label>
                <Input id='instagram' placeholder='https://instagram.com/...' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='tiktok'>TikTok</Label>
                <Input id='tiktok' placeholder='https://tiktok.com/@...' />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Lưu liên kết</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value='advanced' className='space-y-4 mt-4'>
          <Card>
            <CardHeader>
              <CardTitle>SEO Meta Tags</CardTitle>
              <CardDescription>
                Cấu hình thông tin chuẩn SEO cho trang chủ.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='metaTitle'>Meta Title</Label>
                <Input id='metaTitle' defaultValue='My E-commerce - Mua sắm trực tuyến' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='metaDesc'>Meta Description</Label>
                <Textarea
                  id='metaDesc'
                  defaultValue='Nền tảng mua sắm trực tuyến hàng đầu với đa dạng sản phẩm chất lượng cao.'
                  className='min-h-[80px]'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='keywords'>Meta Keywords</Label>
                <Input id='keywords' defaultValue='mua sắm, online, ecommerce, quần áo, giày dép' />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Lưu SEO</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cấu hình hệ thống</CardTitle>
              <CardDescription>Các cài đặt kỹ thuật và trạng thái bảo trì.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between rounded-lg border p-4'>
                <div className='space-y-0.5'>
                  <Label className='text-base'>Chế độ bảo trì</Label>
                  <p className='text-muted-foreground text-sm'>
                    Tạm dừng mọi giao dịch và hiển thị thông báo bảo trì.
                  </p>
                </div>
                <Switch />
              </div>
              <div className='flex items-center justify-between rounded-lg border p-4'>
                <div className='space-y-0.5'>
                  <Label className='text-base'>Bật xác thực Email</Label>
                  <p className='text-muted-foreground text-sm'>
                    Yêu cầu khách hàng xác thực email khi đăng ký mới.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
