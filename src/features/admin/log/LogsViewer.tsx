/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/core/accordion'
import { Button } from '~/components/ui/core/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import { ScrollArea } from '~/components/ui/core/scroll-area'
import https from '~/config/https'
import { cn } from '~/lib/utils'
import { ApiResponse } from '~/types/apiConfig'

const LogsViewer = () => {
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [logs, setLogs] = useState<any>([])
  const [loading, setLoading] = useState(false)

  const fetchFiles = () => {
    https.get<ApiResponse<any>>('/logs/files').then((res) => {
      setFiles((res.data as any).result)
    })
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  useEffect(() => {
    if (!selectedFile) return
    setLoading(true)
    https
      .get<ApiResponse<any>>(`/logs/view/${selectedFile}`)
      .then((res) => setLogs((res.data as any).result))
      .finally(() => setLoading(false))
  }, [selectedFile])

  const handleDelete = async (file: string) => {
    if (!confirm(`Are you remove file ${file}?`)) return
    try {
      await https.delete<ApiResponse<null>>(`/logs/delete/${file}`)

      fetchFiles()
      if (selectedFile === file) {
        setSelectedFile(null)
        setLogs([])
      }
    } catch (err: any) {
      alert(`Remove fail: ${err.message}`)
    }
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>List file logs</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-2'>
          {files.length === 0 ? (
            <p>No data file log</p>
          ) : (
            files.map((file) => (
              <div
                key={file}
                className={cn(
                  'flex items-center justify-between rounded border p-2',
                  selectedFile === file ? 'bg-muted' : ''
                )}
              >
                <Button
                  variant='link'
                  className='p-0 text-left'
                  onClick={() => setSelectedFile(file)}
                >
                  {file}
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => handleDelete(file)}
                >
                  <Trash2 className='h-4 w-4 text-red-500' />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {selectedFile && (
        <Card>
          <CardHeader>
            <CardTitle>Chi tiết log: {selectedFile}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Đang tải...</p>
            ) : logs.length === 0 ? (
              <p>Không có log</p>
            ) : (
              <ScrollArea className='h-fit w-full rounded border p-2'>
                <Accordion type='multiple' className='w-full'>
                  {logs.map((log: any, i: any) => (
                    <AccordionItem key={i} value={`log-${i}`}>
                      <AccordionTrigger>
                        {log.timestamp} - {log.level.toUpperCase()}
                      </AccordionTrigger>
                      <AccordionContent>
                        <pre className='text-sm whitespace-pre-wrap break-words'>
                          {JSON.stringify(log, null, 2)}
                        </pre>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default LogsViewer
