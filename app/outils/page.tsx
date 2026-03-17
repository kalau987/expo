'use client'

import { useState, useCallback } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import {
  FileSpreadsheet,
  FileText,
  ImageIcon,
  Upload,
  Download,
  ArrowRight,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileImage,
  File,
  X,
} from 'lucide-react'

type FileType = 'xls' | 'xlsx' | 'csv' | 'pdf' | 'image'
type ConversionTarget = 'pdf' | 'xlsx' | 'csv' | 'png' | 'jpg' | 'webp'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: FileType
  file: File
  status: 'pending' | 'converting' | 'done' | 'error'
  progress: number
  outputUrl?: string
  outputName?: string
}

const FILE_ICONS: Record<FileType, typeof FileText> = {
  xls: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  csv: FileSpreadsheet,
  pdf: FileText,
  image: ImageIcon,
}

const CONVERSION_OPTIONS: Record<FileType, ConversionTarget[]> = {
  xls: ['pdf', 'xlsx', 'csv'],
  xlsx: ['pdf', 'csv'],
  csv: ['pdf', 'xlsx'],
  pdf: ['png', 'jpg', 'xlsx'],
  image: ['pdf', 'png', 'jpg', 'webp'],
}

function getFileType(file: File): FileType {
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (ext === 'xls') return 'xls'
  if (ext === 'xlsx') return 'xlsx'
  if (ext === 'csv') return 'csv'
  if (ext === 'pdf') return 'pdf'
  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp'].includes(ext || '')) return 'image'
  return 'pdf'
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function OutilsPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [targetFormat, setTargetFormat] = useState<ConversionTarget>('pdf')
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    addFiles(droppedFiles)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files))
    }
  }, [])

  const addFiles = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: getFileType(file),
      file,
      status: 'pending',
      progress: 0,
    }))
    setFiles(prev => [...prev, ...uploadedFiles])
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const clearAll = () => {
    setFiles([])
  }

  const simulateConversion = async (file: UploadedFile) => {
    // Update status to converting
    setFiles(prev => prev.map(f => 
      f.id === file.id ? { ...f, status: 'converting', progress: 0 } : f
    ))

    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 150))
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, progress: i } : f
      ))
    }

    // Mark as done
    const outputName = file.name.replace(/\.[^.]+$/, `.${targetFormat}`)
    setFiles(prev => prev.map(f => 
      f.id === file.id ? { 
        ...f, 
        status: 'done', 
        progress: 100,
        outputName,
        outputUrl: URL.createObjectURL(file.file) // In real app, this would be the converted file
      } : f
    ))
  }

  const convertAll = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending')
    for (const file of pendingFiles) {
      await simulateConversion(file)
    }
  }

  const convertSingle = async (file: UploadedFile) => {
    await simulateConversion(file)
  }

  const downloadFile = (file: UploadedFile) => {
    if (file.outputUrl && file.outputName) {
      const a = document.createElement('a')
      a.href = file.outputUrl
      a.download = file.outputName
      a.click()
    }
  }

  const availableTargets = files.length > 0 
    ? CONVERSION_OPTIONS[files[0].type] || ['pdf']
    : ['pdf', 'xlsx', 'csv', 'png', 'jpg']

  const pendingCount = files.filter(f => f.status === 'pending').length
  const doneCount = files.filter(f => f.status === 'done').length

  return (
    <DashboardLayout title="Boîte à outils">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Conversion de fichiers</h1>
            <p className="text-muted-foreground">
              Convertissez vos fichiers XLS, PDF et images
            </p>
          </div>
          {files.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">{files.length} fichier(s)</Badge>
              <Button variant="ghost" size="sm" onClick={clearAll}>
                <Trash2 className="mr-2 h-4 w-4" />
                Tout effacer
              </Button>
            </div>
          )}
        </div>

        <Tabs defaultValue="convert" className="space-y-6">
          <TabsList>
            <TabsTrigger value="convert">Conversion</TabsTrigger>
            <TabsTrigger value="merge">Fusion PDF</TabsTrigger>
            <TabsTrigger value="compress">Compression</TabsTrigger>
          </TabsList>

          <TabsContent value="convert" className="space-y-6">
            {/* Upload zone */}
            <Card>
              <CardContent className="p-6">
                <div
                  className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                    isDragging 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    accept=".xls,.xlsx,.csv,.pdf,.png,.jpg,.jpeg,.webp,.gif,.bmp"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                  <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="mb-2 text-lg font-medium">
                    Glissez vos fichiers ici
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ou cliquez pour sélectionner
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <Badge variant="secondary">XLS / XLSX</Badge>
                    <Badge variant="secondary">CSV</Badge>
                    <Badge variant="secondary">PDF</Badge>
                    <Badge variant="secondary">PNG / JPG / WEBP</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conversion settings */}
            {files.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Paramètres de conversion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">Convertir en:</span>
                      <Select value={targetFormat} onValueChange={(v) => setTargetFormat(v as ConversionTarget)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTargets.map(format => (
                            <SelectItem key={format} value={format}>
                              {format.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1" />
                    <Button 
                      onClick={convertAll} 
                      disabled={pendingCount === 0}
                      className="w-full sm:w-auto"
                    >
                      Convertir tout ({pendingCount})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* File list */}
            {files.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <span>Fichiers ({files.length})</span>
                    {doneCount > 0 && (
                      <Badge variant="default" className="bg-green-600">
                        {doneCount} terminé(s)
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {files.map((file) => {
                    const Icon = FILE_ICONS[file.type]
                    return (
                      <div
                        key={file.id}
                        className="flex items-center gap-4 rounded-lg border border-border p-4"
                      >
                        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                          file.type === 'pdf' ? 'bg-red-100' :
                          file.type === 'image' ? 'bg-purple-100' :
                          'bg-green-100'
                        }`}>
                          <Icon className={`h-6 w-6 ${
                            file.type === 'pdf' ? 'text-red-600' :
                            file.type === 'image' ? 'text-purple-600' :
                            'text-green-600'
                          }`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate font-medium">{file.name}</p>
                            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <Badge variant="outline">{targetFormat.toUpperCase()}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                          {file.status === 'converting' && (
                            <Progress value={file.progress} className="mt-2 h-1.5" />
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {file.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => convertSingle(file)}
                              >
                                Convertir
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => removeFile(file.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {file.status === 'converting' && (
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          )}
                          {file.status === 'done' && (
                            <>
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <Button
                                size="sm"
                                onClick={() => downloadFile(file)}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Télécharger
                              </Button>
                            </>
                          )}
                          {file.status === 'error' && (
                            <AlertCircle className="h-5 w-5 text-destructive" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            )}

            {/* Supported formats info */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileSpreadsheet className="h-5 w-5 text-green-600" />
                    Tableurs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    XLS, XLSX, CSV vers PDF, autres formats tableur
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-5 w-5 text-red-600" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    PDF vers images, extraction de données vers XLSX
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ImageIcon className="h-5 w-5 text-purple-600" />
                    Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG, WEBP vers PDF ou autres formats image
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="merge" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fusion de PDF</CardTitle>
                <CardDescription>
                  Combinez plusieurs fichiers PDF en un seul document
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border">
                  <File className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Glissez vos fichiers PDF ici
                  </p>
                  <Button variant="outline" className="mt-4">
                    <Upload className="mr-2 h-4 w-4" />
                    Sélectionner des PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compression de fichiers</CardTitle>
                <CardDescription>
                  Réduisez la taille de vos PDF et images
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border">
                  <FileImage className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Glissez vos fichiers à compresser
                  </p>
                  <Button variant="outline" className="mt-4">
                    <Upload className="mr-2 h-4 w-4" />
                    Sélectionner des fichiers
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
