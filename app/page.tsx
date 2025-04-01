import { Suspense } from "react"
import { CurrencyExchangeRatesClient } from "@/components/currency-exchange-rates-client"
import { CurrencyExchangeSkeleton } from "@/components/currency-exchange-skeleton"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900">
      <header className="bg-blue-600 dark:bg-blue-950 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center md:justify-start">
            <div className="bg-white dark:bg-slate-800 p-2 rounded-full mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-8 h-8 text-blue-600 dark:text-blue-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Monitor de Divisas</h1>
              <p className="text-sm md:text-base text-blue-100 dark:text-blue-200">Banco Central de Venezuela</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Suspense fallback={<CurrencyExchangeSkeleton />}>
            <CurrencyExchangeRatesClient />
          </Suspense>
        </div>
      </main>

      <footer className="bg-gray-100 dark:bg-slate-800 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300 text-sm">
          <p>© {new Date().getFullYear()} Monitor de Divisas. Información de referencia.</p>
          <p className="mt-2">Los datos mostrados son solo para fines informativos.</p>
        </div>
      </footer>
    </div>
  )
}

