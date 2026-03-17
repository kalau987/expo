'use client'

import { useState, useRef } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Upload,
  FileText,
  FileSpreadsheet,
  Image,
  Search,
  Trash2,
  Eye,
  Download,
  Bot,
  Clock,
} from 'lucide-react'

interface Document {
  id: string
  name: string
  type: 'pdf' | 'xls' | 'image'
  size: string
  uploadedAt: string
  analyzed: boolean
  analysisResult?: string
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Facture_Pacific_Import_2026.pdf',
      type: 'pdf',
      size: '245 KB',
      uploadedAt: '2026-03-15',
      analyzed: true,
      analysisResult: 'Codes SH identifiés: 6204.62.00, 4202.22.00',
    },
    {
      id: '2',
      name: 'Liste_colisage_ARANUI5.xls',
      type: 'xls',
      size: '128 KB',
      uploadedAt: '2026-03-14',
      analyzed: true,
      analysisResult: '15 articles, 3 codes SH différents',
    },
    {
      id: '3',
      name: 'Photo_marchandise.jpg',
      type: 'image',
      size: '1.2 MB',
      uploadedAt: '2026-03-16',
      analyzed: false,
    },
  ])
  const [search, setSearch] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  )

  const getFileIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />
      case 'xls':
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />
      case 'image':
        return <Image className="h-5 w-5 text-blue-500" />
    }
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setIsUploading(true)

    Array.from(files).forEach(file => {
      const type = file.name.endsWith('.pdf')
        ? 'pdf'
        : file.name.endsWith('.xls') || file.name.endsWith('.xlsx')
        ? 'xls'
        : 'image'

      const newDoc: Document = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        uploadedAt: new Date().toISOString().split('T')[0],
        analyzed: false,
      }

      setDocuments(prev => [newDoc, ...prev])
    })

    setTimeout(() => setIsUploading(false), 1000)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const analyzeDocument = (id: string) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === id
          ? {
              ...doc,
              analyzed: true,
              analysisResult: 'Analyse terminée - Codes SH identifiés',
            }
          : doc
      )
    )
  }

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
  }

  const stats = {
    total: documents.length,
    pdf: documents.filter(d => d.type === 'pdf').length,
    xls: documents.filter(d => d.type === 'xls').length,
    image: documents.filter(d => d.type === 'image').length,
    analyzed: documents.filter(d => d.analyzed).length,
  }

  return (
    <DashboardLayout title="Documents">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <FileText className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-xl font-bold">{stats.pdf}</p>
                <p className="text-xs text-muted-foreground">PDF</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <FileSpreadsheet className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-xl font-bold">{stats.xls}</p>
                <p className="text-xs text-muted-foreground">Excel</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Image className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xl font-bold">{stats.image}</p>
                <p className="text-xs text-muted-foreground">Images</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                <Bot className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xl font-bold">{stats.analyzed}</p>
                <p className="text-xs text-muted-foreground">Analysés</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload zone */}
        <Card>
          <CardContent className="p-6">
            <div
              className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/50"
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault()
                const files = e.dataTransfer.files
                if (files.length > 0 && fileInputRef.current) {
                  const dt = new DataTransfer()
                  Array.from(files).forEach(f => dt.items.add(f))
                  fileInputRef.current.files = dt.files
                  fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }))
                }
              }}
            >
              <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">
                Glissez vos fichiers ici
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                ou cliquez pour sélectionner (PDF, XLS, JPG, PNG)
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                accept=".pdf,.xls,.xlsx,.jpg,.jpeg,.png"
                multiple
                className="hidden"
              />
              <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                {isUploading ? 'Upload en cours...' : 'Sélectionner des fichiers'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Documents list */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Documents importés</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Taille</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Analyse IA</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map(doc => (
                  <TableRow key={doc.id}>
                    <TableCell>{getFileIcon(doc.type)}</TableCell>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell>{doc.size}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {new Date(doc.uploadedAt).toLocaleDateString('fr-FR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {doc.analyzed ? (
                        <div>
                          <Badge variant="secondary" className="mb-1">
                            Analysé
                          </Badge>
                          {doc.analysisResult && (
                            <p className="text-xs text-muted-foreground">
                              {doc.analysisResult}
                            </p>
                          )}
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => analyzeDocument(doc.id)}
                        >
                          <Bot className="mr-2 h-4 w-4" />
                          Analyser
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteDocument(doc.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
