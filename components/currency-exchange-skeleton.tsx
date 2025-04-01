import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function CurrencyExchangeSkeleton() {
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
                  <div className="h-10 w-10 rounded-full bg-blue-200 dark:bg-slate-700 mr-3"></div>
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

