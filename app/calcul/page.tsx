'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calculator, DollarSign, Percent, FileText, Download } from 'lucide-react'
import type { TaxCalculation } from '@/lib/types'

const DEVISES = [
  { code: 'USD', name: 'Dollar US', taux: 109.5 },
  { code: 'EUR', name: 'Euro', taux: 119.33 },
  { code: 'NZD', name: 'Dollar NZ', taux: 65.2 },
  { code: 'AUD', name: 'Dollar AU', taux: 71.5 },
  { code: 'JPY', name: 'Yen', taux: 0.73 },
  { code: 'CNY', name: 'Yuan', taux: 15.1 },
]

const TAUX_DROITS: Record<string, { droit: number; description: string }> = {
  '0000.00.00': { droit: 0, description: 'Franchise' },
  '0402.10.00': { droit: 6, description: 'Lait et crème de lait' },
  '1806.32.00': { droit: 10, description: 'Chocolat et préparations' },
  '2203.00.00': { droit: 30, description: 'Bières de malt' },
  '2204.21.00': { droit: 25, description: 'Vins' },
  '6403.99.00': { droit: 17, description: 'Chaussures' },
  '8471.30.00': { droit: 0, description: 'Ordinateurs portables' },
  '8517.13.00': { droit: 0, description: 'Smartphones' },
  '8703.23.90': { droit: 17, description: 'Véhicules automobiles' },
  '9403.60.00': { droit: 10, description: 'Meubles en bois' },
}

const TVA_RATE = 16 // 16% TVA en Polynésie

export default function CalculPage() {
  const [devise, setDevise] = useState('USD')
  const [valeurFOB, setValeurFOB] = useState('')
  const [fret, setFret] = useState('')
  const [assurance, setAssurance] = useState('')
  const [codeSH, setCodeSH] = useState('')
  const [result, setResult] = useState<TaxCalculation | null>(null)

  const selectedDevise = DEVISES.find(d => d.code === devise) || DEVISES[0]
  const selectedTaux = TAUX_DROITS[codeSH] || { droit: 10, description: 'Taux standard' }

  const calculate = () => {
    const fobXPF = parseFloat(valeurFOB) * selectedDevise.taux
    const fretXPF = parseFloat(fret || '0') * selectedDevise.taux
    const assuranceXPF = parseFloat(assurance || '0') * selectedDevise.taux

    const valeurCAF = fobXPF + fretXPF + assuranceXPF
    const droitDouane = valeurCAF * (selectedTaux.droit / 100)
    const baseTVA = valeurCAF + droitDouane
    const tva = baseTVA * (TVA_RATE / 100)
    const total = valeurCAF + droitDouane + tva

    setResult({
      devise,
      tauxChange: selectedDevise.taux,
      valeurFOB: fobXPF,
      fret: fretXPF,
      assurance: assuranceXPF,
      valeurCAF,
      codeSH: codeSH || 'N/A',
      tauxDroit: selectedTaux.droit,
      droitDouane,
      tva,
      total,
    })
  }

  const formatXPF = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value) + ' XPF'
  }

  const exportResult = () => {
    if (!result) return
    const text = `
CALCUL DROITS ET TAXES - KARAMEL SH
====================================
Date: ${new Date().toLocaleDateString('fr-FR')}

VALEURS D'IMPORTATION
---------------------
Devise: ${result.devise}
Taux de change: 1 ${result.devise} = ${result.tauxChange} XPF

Valeur FOB: ${formatXPF(result.valeurFOB)}
Fret: ${formatXPF(result.fret)}
Assurance: ${formatXPF(result.assurance)}
-----------------------
Valeur CAF: ${formatXPF(result.valeurCAF)}

DROITS ET TAXES
---------------
Code SH: ${result.codeSH}
Taux droit de douane: ${result.tauxDroit}%
Droit de douane: ${formatXPF(result.droitDouane)}

TVA (${TVA_RATE}%): ${formatXPF(result.tva)}

====================================
TOTAL A PAYER: ${formatXPF(result.total)}
====================================
    `.trim()

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `calcul-droits-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <DashboardLayout title="Calcul Droits et Taxes">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Valeurs d'importation
              </CardTitle>
              <CardDescription>
                Saisissez les valeurs dans la devise d'origine
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Devise</Label>
                <Select value={devise} onValueChange={setDevise}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEVISES.map(d => (
                      <SelectItem key={d.code} value={d.code}>
                        {d.code} - {d.name} (1 = {d.taux} XPF)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Valeur FOB (Coût marchandise)</Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={valeurFOB}
                    onChange={e => setValeurFOB(e.target.value)}
                    placeholder="0.00"
                    className="pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {devise}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Fret (Transport)</Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={fret}
                    onChange={e => setFret(e.target.value)}
                    placeholder="0.00"
                    className="pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {devise}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Assurance</Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={assurance}
                    onChange={e => setAssurance(e.target.value)}
                    placeholder="0.00"
                    className="pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {devise}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5" />
                Code douanier
              </CardTitle>
              <CardDescription>
                Sélectionnez ou saisissez le code SH pour appliquer le taux
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Code SH</Label>
                <Select value={codeSH} onValueChange={setCodeSH}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un code SH" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TAUX_DROITS).map(([code, info]) => (
                      <SelectItem key={code} value={code}>
                        {code} - {info.description} ({info.droit}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {codeSH && (
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm font-medium">{selectedTaux.description}</p>
                  <p className="text-sm text-muted-foreground">
                    Taux droit de douane: {selectedTaux.droit}%
                  </p>
                </div>
              )}

              <Button onClick={calculate} className="w-full" size="lg">
                <Calculator className="mr-2 h-5 w-5" />
                Calculer
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Result */}
        <div>
          <Card className={result ? 'border-primary' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Résultat du calcul
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  {/* Conversion */}
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                      Taux de change appliqué
                    </h4>
                    <p className="text-lg">
                      1 {result.devise} = {result.tauxChange} XPF
                    </p>
                  </div>

                  {/* Valeur CAF */}
                  <div className="rounded-lg bg-muted p-4">
                    <h4 className="mb-3 font-medium">Valeur CAF</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Valeur FOB</span>
                        <span>{formatXPF(result.valeurFOB)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fret</span>
                        <span>{formatXPF(result.fret)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Assurance</span>
                        <span>{formatXPF(result.assurance)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-medium">
                        <span>Total CAF</span>
                        <span>{formatXPF(result.valeurCAF)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Droits et taxes */}
                  <div className="rounded-lg bg-muted p-4">
                    <h4 className="mb-3 font-medium">Droits et taxes</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Code SH</span>
                        <span className="font-mono">{result.codeSH}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Droit de douane ({result.tauxDroit}%)</span>
                        <span>{formatXPF(result.droitDouane)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TVA ({TVA_RATE}%)</span>
                        <span>{formatXPF(result.tva)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="rounded-lg bg-primary p-4 text-primary-foreground">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium">TOTAL A PAYER</span>
                      <span className="text-2xl font-bold">{formatXPF(result.total)}</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" onClick={exportResult}>
                    <Download className="mr-2 h-4 w-4" />
                    Exporter le résultat
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <Calculator className="mb-4 h-12 w-12 opacity-50" />
                  <p>Saisissez les valeurs et cliquez sur Calculer</p>
                  <p className="mt-1 text-sm">
                    Le résultat apparaîtra ici
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm">Informations</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li>- Les taux de change sont indicatifs (TAPAS 2026)</li>
                <li>- TVA Polynésie Française: 16%</li>
                <li>- Certains produits peuvent avoir des taxes additionnelles</li>
                <li>- Consultez le module IA pour les réglementations</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
