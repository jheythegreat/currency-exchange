"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

async function getCurrencyRates() {
  try {
    // Add browser-like headers to avoid being blocked
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Cache-Control": "max-age=0",
    }

    // Fetch data from BCV website with headers
    const response = await fetch("https://www.bcv.org.ve/", {
      headers,
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!response.ok) {
      console.error(`Failed to fetch with status: ${response.status}`)
      throw new Error(`Failed to fetch currency rates: ${response.status}`)
    }

    const html = await response.text()

    // For debugging
    if (html.length < 100) {
      console.error("Received unusually short response:", html)
      throw new Error("Invalid response from server")
    }

    // Extract currency rates using regex
    const usdMatch = html.match(/USD<\/span>\s*<span[^>]*>([\d,.]+)<\/span>/i)
    const eurMatch = html.match(/EUR<\/span>\s*<span[^>]*>([\d,.]+)<\/span>/i)
    const cnyMatch = html.match(/CNY<\/span>\s*<span[^>]*>([\d,.]+)<\/span>/i)
    const tryMatch = html.match(/TRY<\/span>\s*<span[^>]*>([\d,.]+)<\/span>/i)
    const rubMatch = html.match(/RUB<\/span>\s*<span[^>]*>([\d,.]+)<\/span>/i)

    // Parse the rates
    const usdRate = usdMatch ? Number.parseFloat(usdMatch[1].replace(/\./g, "").replace(",", ".")) : null
    const eurRate = eurMatch ? Number.parseFloat(eurMatch[1].replace(/\./g, "").replace(",", ".")) : null
    const cnyRate = cnyMatch ? Number.parseFloat(cnyMatch[1].replace(/\./g, "").replace(",", ".")) : null
    const tryRate = tryMatch ? Number.parseFloat(tryMatch[1].replace(/\./g, "").replace(",", ".")) : null
    const rubRate = rubMatch ? Number.parseFloat(rubMatch[1].replace(/\./g, "").replace(",", ".")) : null

    // Check if we got at least some rates
    if (!usdRate && !eurRate && !cnyRate && !tryRate && !rubRate) {
      console.error("Failed to extract any currency rates from HTML")
      throw new Error("Could not find currency rates in the response")
    }

    // Get the current date
    const now = new Date()
    const formattedDate = now.toLocaleDateString("es-VE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    return {
      usd: usdRate,
      eur: eurRate,
      cny: cnyRate,
      try: tryRate,
      rub: rubRate,
      lastUpdated: formattedDate,
    }
  } catch (error) {
    console.error("Error fetching currency rates:", error)

    // Provide fallback data when fetch fails
    return {
      error: "Failed to fetch currency rates. Using fallback data.",
      usd: 36.31,
      eur: 39.42,
      cny: 5.01,
      try: 1.13,
      rub: 0.4,
      lastUpdated: "Fallback data (not current)",
      isFallback: true,
    }
  }
}

export async function CurrencyExchangeRates() {
  const rates = await getCurrencyRates()

  if (rates.error && !rates.isFallback) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Currency Exchange Rates</CardTitle>
          <CardDescription>Last attempted: {rates.lastUpdated}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <p className="text-red-500">{rates.error}</p>
          </div>
          <div className="flex justify-center mt-4">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Currency Exchange Rates</CardTitle>
        <CardDescription>
          {rates.isFallback && (
            <div className="text-amber-500 mb-2">Note: Using fallback data. Live rates could not be fetched.</div>
          )}
          Last updated: {rates.lastUpdated}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <CurrencyCard name="US Dollar (USD)" value={rates.usd} flag="🇺🇸" />
          <CurrencyCard name="Euro (EUR)" value={rates.eur} flag="🇪🇺" />
          <CurrencyCard name="Chinese Yuan (CNY)" value={rates.cny} flag="🇨🇳" />
          <CurrencyCard name="Turkish Lira (TRY)" value={rates.try} flag="🇹🇷" />
          <CurrencyCard name="Russian Ruble (RUB)" value={rates.rub} flag="🇷🇺" />
        </div>
        <div className="flex justify-center mt-6">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh Rates
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function CurrencyCard({ name, value, flag }: { name: string; value: number | null; flag: string }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center">
        <span className="text-2xl mr-3">{flag}</span>
        <span className="font-medium">{name}</span>
      </div>
      <div className="text-xl font-bold">{value ? formatCurrency(value, "VES") : "N/A"}</div>
    </div>
  )
}

