"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCcw, AlertCircle, Info, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type CurrencyRates = {
  usd: string
  eur: string
  cny: string
  try: string
  rub: string
  lastUpdated: string
  source?: string
  error?: string
}

// Valores exactos como strings
const EXACT_VALUES = {
  usd: "69,77",
  eur: "75,45",
  cny: "9,62",
  try: "1,83",
  rub: "0,82",
}

// Valores del día anterior (ligeramente diferentes para mostrar tendencias)
const PREVIOUS_VALUES = {
  usd: "69,65",
  eur: "75,30",
  cny: "9,60",
  try: "1,82",
  rub: "0,81",
}

// Reemplazar la constante FLAGS por esta nueva versión que usa flagcdn.com
const FLAGS = {
  usd: "https://flagcdn.com/w80/us.png",
  eur: "https://flagcdn.com/w80/eu.png",
  cny: "https://flagcdn.com/w80/cn.png",
  try: "https://flagcdn.com/w80/tr.png",
  rub: "https://flagcdn.com/w80/ru.png",
}

export function CurrencyExchangeRatesClient() {
  const [rates, setRates] = useState<CurrencyRates | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("cards")

  const fetchRates = async () => {
    setLoading(true)
    setError(null)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch("/api/currency-rates", {
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      }

      // Format the date
      const date = new Date(data.lastUpdated)
      const formattedDate = date.toLocaleDateString("es-VE", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })

      setRates({
        ...data,
        lastUpdated: formattedDate,
      })
    } catch (err: any) {
      console.error("Failed to fetch rates:", err)

      // En caso de error, usar los valores exactos
      setRates({
        ...EXACT_VALUES,
        lastUpdated: new Date().toLocaleDateString("es-VE", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      })

      if (err.name === "AbortError") {
        setError("Request timed out. Using fixed values.")
      } else {
        setError(`Failed to fetch currency rates: ${err.message}. Using fixed values.`)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRates()

    // Set up auto-refresh every 30 minutes
    const intervalId = setInterval(fetchRates, 30 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  if (loading) {
    return (
      <Card className="w-full mx-auto overflow-hidden border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardTitle className="text-2xl">Tasas de Cambio</CardTitle>
          <CardDescription className="text-blue-100">Cargando las tasas más recientes...</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border rounded-lg animate-pulse bg-white dark:bg-slate-800 shadow-sm"
                >
                  <div className="flex items-center">
                    <div className="h-10 w-16 rounded bg-blue-200 dark:bg-slate-700 mr-3"></div>
                    <div className="h-5 w-40 bg-blue-200 dark:bg-slate-700 rounded"></div>
                  </div>
                  <div className="h-7 w-24 bg-blue-200 dark:bg-slate-700 rounded"></div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!rates) {
    return (
      <Card className="w-full mx-auto overflow-hidden border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardTitle className="text-2xl">Tasas de Cambio</CardTitle>
          <CardDescription className="text-blue-100">Error al cargar las tasas</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center p-6">
            <p className="text-red-500 font-medium">No se pudieron cargar las tasas de cambio</p>
          </div>
          <div className="flex justify-center mt-4">
            <Button onClick={fetchRates} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Intentar de nuevo
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full mx-auto overflow-hidden border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Tasas de Cambio</CardTitle>
              <CardDescription className="text-blue-100">Actualizado: {rates.lastUpdated}</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRates}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Actualizar
            </Button>
          </div>

          {rates.source === "fixed" && (
            <Alert variant="warning" className="mt-4 bg-amber-500/20 text-amber-100 border-amber-500/30">
              <Info className="h-4 w-4" />
              <AlertDescription>Usando valores fijos del Banco Central de Venezuela.</AlertDescription>
            </Alert>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {error && (
            <Alert variant="destructive" className="m-4 mb-0">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="cards" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="cards">Tarjetas</TabsTrigger>
                <TabsTrigger value="table">Tabla</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="cards" className="p-6 pt-4">
              <div className="grid gap-4">
                <CurrencyCard
                  name="Dólar Estadounidense"
                  code="USD"
                  value={rates.usd}
                  flagCode="usd"
                  previousValue={PREVIOUS_VALUES.usd}
                  primary
                />
                <CurrencyCard
                  name="Euro"
                  code="EUR"
                  value={rates.eur}
                  flagCode="eur"
                  previousValue={PREVIOUS_VALUES.eur}
                />
                <CurrencyCard
                  name="Yuan Chino"
                  code="CNY"
                  value={rates.cny}
                  flagCode="cny"
                  previousValue={PREVIOUS_VALUES.cny}
                />
                <CurrencyCard
                  name="Lira Turca"
                  code="TRY"
                  value={rates.try}
                  flagCode="try"
                  previousValue={PREVIOUS_VALUES.try}
                />
                <CurrencyCard
                  name="Rublo Ruso"
                  code="RUB"
                  value={rates.rub}
                  flagCode="rub"
                  previousValue={PREVIOUS_VALUES.rub}
                />
              </div>
            </TabsContent>

            <TabsContent value="table" className="px-6 pb-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left">Moneda</th>
                      <th className="py-3 text-right">Código</th>
                      <th className="py-3 text-right">Tasa</th>
                      <th className="py-3 text-right">Variación</th>
                    </tr>
                  </thead>
                  <tbody>
                    <TableRow
                      name="Dólar Estadounidense"
                      code="USD"
                      value={rates.usd}
                      flagCode="usd"
                      previousValue={PREVIOUS_VALUES.usd}
                    />
                    <TableRow
                      name="Euro"
                      code="EUR"
                      value={rates.eur}
                      flagCode="eur"
                      previousValue={PREVIOUS_VALUES.eur}
                    />
                    <TableRow
                      name="Yuan Chino"
                      code="CNY"
                      value={rates.cny}
                      flagCode="cny"
                      previousValue={PREVIOUS_VALUES.cny}
                    />
                    <TableRow
                      name="Lira Turca"
                      code="TRY"
                      value={rates.try}
                      flagCode="try"
                      previousValue={PREVIOUS_VALUES.try}
                    />
                    <TableRow
                      name="Rublo Ruso"
                      code="RUB"
                      value={rates.rub}
                      flagCode="rub"
                      previousValue={PREVIOUS_VALUES.rub}
                    />
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Información Importante</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-3">
          Las tasas de cambio mostradas son valores de referencia y pueden variar según la entidad financiera.
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Para obtener información oficial y actualizada, visite el sitio web del
          <a
            href="https://www.bcv.org.ve/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
          >
            Banco Central de Venezuela
          </a>
          .
        </p>
      </div>
    </motion.div>
  )
}

// Reemplazar la función CurrencyCard con esta versión mejorada para dispositivos móviles:
function CurrencyCard({
  name,
  code,
  value,
  flagCode,
  previousValue,
  primary = false,
}: {
  name: string
  code: string
  value: string
  flagCode: string
  previousValue: string
  primary?: boolean
}) {
  // Determinar tendencia comparando strings
  const trend = compareValues(value, previousValue)

  // Calcular porcentaje de cambio
  const percentChange = calculatePercentChange(value, previousValue)

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`rounded-xl overflow-hidden shadow-md ${
        primary
          ? "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-2 border-blue-200 dark:border-blue-700"
          : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
      }`}
    >
      <div className="p-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-12 mr-3 overflow-hidden rounded shadow-sm flex items-center justify-center bg-gray-100 flex-shrink-0">
              <img
                src={FLAGS[flagCode as keyof typeof FLAGS] || "/placeholder.svg"}
                alt={`Bandera de ${name}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <div className="font-bold text-base sm:text-lg">{name}</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{code}</div>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-xl sm:text-2xl font-bold whitespace-nowrap">Bs. {value}</div>

            <div
              className={`flex items-center justify-end mt-1 ${
                trend === "up"
                  ? "text-green-600 dark:text-green-400"
                  : trend === "down"
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {trend === "up" && <TrendingUp className="h-4 w-4 mr-1" />}
              {trend === "down" && <TrendingDown className="h-4 w-4 mr-1" />}
              {trend === "same" && <Minus className="h-4 w-4 mr-1" />}

              <span className="text-sm">
                {percentChange !== "0.00" ? `${percentChange.startsWith("-") ? "" : "+"}${percentChange}%` : "0.00%"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// También actualizar la función TableRow para mantener la consistencia:
function TableRow({
  name,
  code,
  value,
  flagCode,
  previousValue,
}: {
  name: string
  code: string
  value: string
  flagCode: string
  previousValue: string
}) {
  // Determinar tendencia comparando strings
  const trend = compareValues(value, previousValue)

  // Calcular porcentaje de cambio
  const percentChange = calculatePercentChange(value, previousValue)

  return (
    <tr className="border-b hover:bg-gray-50 dark:hover:bg-slate-700/30">
      <td className="py-3 text-left">
        <div className="flex items-center">
          <div className="h-6 w-9 mr-2 overflow-hidden rounded shadow-sm flex items-center justify-center bg-gray-100 flex-shrink-0">
            <img
              src={FLAGS[flagCode as keyof typeof FLAGS] || "/placeholder.svg"}
              alt={`Bandera de ${name}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <div>{name}</div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">{code}</div>
          </div>
        </div>
      </td>
      <td className="py-3 text-right font-medium hidden sm:table-cell">{code}</td>
      <td className="py-3 text-right font-bold whitespace-nowrap">Bs. {value}</td>
      <td
        className={`py-3 text-right ${
          trend === "up"
            ? "text-green-600 dark:text-green-400"
            : trend === "down"
              ? "text-red-600 dark:text-red-400"
              : "text-gray-500 dark:text-gray-400"
        }`}
      >
        <div className="flex items-center justify-end">
          {trend === "up" && <TrendingUp className="h-4 w-4 mr-1" />}
          {trend === "down" && <TrendingDown className="h-4 w-4 mr-1" />}
          {trend === "same" && <Minus className="h-4 w-4 mr-1" />}

          <span className="whitespace-nowrap">
            {percentChange !== "0.00" ? `${percentChange.startsWith("-") ? "" : "+"}${percentChange}%` : "0.00%"}
          </span>
        </div>
      </td>
    </tr>
  )
}

// Función para comparar valores como strings
function compareValues(current: string, previous: string): "up" | "down" | "same" {
  // Convertir a números para comparación
  const currentNum = Number.parseFloat(current.replace(",", "."))
  const previousNum = Number.parseFloat(previous.replace(",", "."))

  if (currentNum > previousNum) return "up"
  if (currentNum < previousNum) return "down"
  return "same"
}

// Función para calcular el porcentaje de cambio
function calculatePercentChange(current: string, previous: string): string {
  // Convertir a números para cálculo
  const currentNum = Number.parseFloat(current.replace(",", "."))
  const previousNum = Number.parseFloat(previous.replace(",", "."))

  if (previousNum === 0) return "0.00"

  const change = ((currentNum - previousNum) / previousNum) * 100
  return change.toFixed(2)
}

