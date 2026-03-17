'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Mail,
  FileText,
  StickyNote,
  Send,
  Copy,
  Inbox,
  PenLine,
  Plus,
  Trash2,
  Download,
} from 'lucide-react'

const MAIL_TEMPLATES = {
  demande_info: {
    subject: 'Demande d\'informations - Dossier [NUMERO]',
    body: `Bonjour,

Je me permets de vous contacter concernant le dossier [NUMERO].

Pourriez-vous me transmettre les informations suivantes :
- [INFORMATION 1]
- [INFORMATION 2]

Je vous remercie par avance pour votre retour.

Cordialement,
[SIGNATURE]`,
  },
  relance_client: {
    subject: 'Relance - Documents manquants dossier [NUMERO]',
    body: `Bonjour,

Je reviens vers vous concernant votre dossier [NUMERO].

Nous sommes toujours en attente des documents suivants :
- [DOCUMENT 1]
- [DOCUMENT 2]

Merci de nous les transmettre dans les meilleurs délais.

Cordialement,
[SIGNATURE]`,
  },
  confirmation: {
    subject: 'Confirmation dédouanement - Dossier [NUMERO]',
    body: `Bonjour,

Je vous confirme que le dédouanement de votre marchandise (dossier [NUMERO]) a été effectué.

Détails :
- Date de dédouanement : [DATE]
- Navire/Vol : [NAVIRE]
- Montant droits et taxes : [MONTANT] XPF

Votre marchandise est disponible pour enlèvement.

Cordialement,
[SIGNATURE]`,
  },
  retour_client: {
    subject: 'Retour sur votre demande - [OBJET]',
    body: `Bonjour,

Suite à votre demande concernant [OBJET], je vous informe que :

[REPONSE]

N'hésitez pas à revenir vers moi pour toute question.

Cordialement,
[SIGNATURE]`,
  },
}

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
}

export default function OfficePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof MAIL_TEMPLATES | ''>('')
  const [mailSubject, setMailSubject] = useState('')
  const [mailBody, setMailBody] = useState('')
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Rappel réglementation',
      content: 'Vérifier les nouvelles circulaires DGAE sur les produits alimentaires',
      createdAt: '2026-03-15',
    },
    {
      id: '2',
      title: 'Client Pacific Import',
      content: 'Attente certificat phytosanitaire pour dossier DOS-2026-001',
      createdAt: '2026-03-16',
    },
  ])
  const [newNoteTitle, setNewNoteTitle] = useState('')
  const [newNoteContent, setNewNoteContent] = useState('')
  const [formData, setFormData] = useState({
    client: '',
    objet: '',
    description: '',
  })

  const handleTemplateSelect = (template: keyof typeof MAIL_TEMPLATES) => {
    setSelectedTemplate(template)
    setMailSubject(MAIL_TEMPLATES[template].subject)
    setMailBody(MAIL_TEMPLATES[template].body)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copié dans le presse-papier!')
  }

  const addNote = () => {
    if (!newNoteTitle.trim()) return
    const note: Note = {
      id: Date.now().toString(),
      title: newNoteTitle,
      content: newNoteContent,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setNotes([note, ...notes])
    setNewNoteTitle('')
    setNewNoteContent('')
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id))
  }

  const exportForm = () => {
    const text = `
FORMULAIRE DE DEMANDE
=====================
Date: ${new Date().toLocaleDateString('fr-FR')}

Client: ${formData.client}
Objet: ${formData.objet}

Description:
${formData.description}
    `.trim()

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `demande-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <DashboardLayout title="Office / Bureau">
      <Tabs defaultValue="mail" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none">
          <TabsTrigger value="mail" className="gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Mails</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2">
            <StickyNote className="h-4 w-4" />
            <span className="hidden sm:inline">Notes</span>
          </TabsTrigger>
          <TabsTrigger value="formulaire" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Formulaires</span>
          </TabsTrigger>
        </TabsList>

        {/* Mails Tab */}
        <TabsContent value="mail">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Inbox className="h-5 w-5" />
                  Templates de mail
                </CardTitle>
                <CardDescription>
                  Sélectionnez un modèle pré-rempli
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <Select
                    value={selectedTemplate}
                    onValueChange={(v: keyof typeof MAIL_TEMPLATES) => handleTemplateSelect(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un modèle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="demande_info">Demande d'informations</SelectItem>
                      <SelectItem value="relance_client">Relance client</SelectItem>
                      <SelectItem value="confirmation">Confirmation dédouanement</SelectItem>
                      <SelectItem value="retour_client">Retour client</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Objet</Label>
                  <Input
                    value={mailSubject}
                    onChange={e => setMailSubject(e.target.value)}
                    placeholder="Objet du mail"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Corps du message</Label>
                  <Textarea
                    value={mailBody}
                    onChange={e => setMailBody(e.target.value)}
                    placeholder="Contenu du mail..."
                    className="min-h-[250px] font-mono text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => copyToClipboard(`Objet: ${mailSubject}\n\n${mailBody}`)}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copier
                  </Button>
                  <Button className="flex-1">
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p className="mb-4">
                  Remplacez les éléments entre crochets [...] par vos informations:
                </p>
                <ul className="space-y-2">
                  <li><code className="rounded bg-muted px-1">[NUMERO]</code> - Numéro de dossier</li>
                  <li><code className="rounded bg-muted px-1">[DOCUMENT]</code> - Nom du document</li>
                  <li><code className="rounded bg-muted px-1">[DATE]</code> - Date concernée</li>
                  <li><code className="rounded bg-muted px-1">[NAVIRE]</code> - Nom du navire/vol</li>
                  <li><code className="rounded bg-muted px-1">[MONTANT]</code> - Montant en XPF</li>
                  <li><code className="rounded bg-muted px-1">[SIGNATURE]</code> - Votre signature</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenLine className="h-5 w-5" />
                  Nouvelle note
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input
                    value={newNoteTitle}
                    onChange={e => setNewNoteTitle(e.target.value)}
                    placeholder="Titre de la note"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contenu</Label>
                  <Textarea
                    value={newNoteContent}
                    onChange={e => setNewNoteContent(e.target.value)}
                    placeholder="Contenu de la note..."
                    className="min-h-[100px]"
                  />
                </div>
                <Button onClick={addNote} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4 lg:col-span-2">
              {notes.map(note => (
                <Card key={note.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{note.title}</h4>
                        <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                          {note.content}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {new Date(note.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteNote(note.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {notes.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <StickyNote className="mb-4 h-12 w-12 opacity-50" />
                    <p>Aucune note</p>
                    <p className="text-sm">Ajoutez votre première note</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Formulaires Tab */}
        <TabsContent value="formulaire">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Formulaire de demande
                </CardTitle>
                <CardDescription>
                  Créez un formulaire pour vos demandes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Client</Label>
                  <Input
                    value={formData.client}
                    onChange={e => setFormData({ ...formData, client: e.target.value })}
                    placeholder="Nom du client"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Objet de la demande</Label>
                  <Input
                    value={formData.objet}
                    onChange={e => setFormData({ ...formData, objet: e.target.value })}
                    placeholder="Objet"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Décrivez votre demande en détail..."
                    className="min-h-[150px]"
                  />
                </div>
                <Button onClick={exportForm} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Liens utiles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <a
                    href="https://service-public.pf/douane"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-primary hover:underline"
                  >
                    Formulaires Douane PF
                  </a>
                  <a
                    href="https://service-public.pf/dgae"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-primary hover:underline"
                  >
                    Formulaires DGAE
                  </a>
                  <a
                    href="https://service-public.pf/biosecurite"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-primary hover:underline"
                  >
                    Formulaires Biosécurité
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Types de formulaires</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <ul className="space-y-1">
                    <li>- Demande de dédouanement</li>
                    <li>- Demande d'autorisation DGAE</li>
                    <li>- Déclaration biosécurité</li>
                    <li>- Certificat d'origine</li>
                    <li>- Demande de franchise</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
