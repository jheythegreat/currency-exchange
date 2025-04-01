import { NextResponse } from "next/server"

// Valores exactos como strings para evitar cualquier manipulación de punto flotante
const EXACT_VALUES = {
  usd: "69,77",
  eur: "75,45",
  cny: "9,62",
  try: "1,83",
  rub: "0,82",
}

export async function GET() {
  try {
    // Devolver siempre los valores exactos
    return NextResponse.json({
      ...EXACT_VALUES,
      lastUpdated: new Date().toISOString(),
      source: "fixed",
    })
  } catch (error) {
    console.error("API Error:", error)

    // En caso de error, devolver los mismos valores exactos
    return NextResponse.json({
      ...EXACT_VALUES,
      lastUpdated: new Date().toISOString(),
      source: "fixed",
      error: "Error en la API, usando valores fijos.",
    })
  }
}

