import { generateEmptyGrid } from "./utils.tsx"

export async function setBias(bias: string) {
  try {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/bias`, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ bias })
    }) 

  } catch(e) {
    console.error(e)
  }
}

export async function getGrid() {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/grid`) 
    const result = await response.json()

    return JSON.parse(result)
  } catch(e) {
    console.error(e)
    return generateEmptyGrid()
  }
}

export async function getSecretCode() {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/code`) 
    const result = await response.json()

    return JSON.parse(result)
  } catch(e) {
    console.error(e)
    return generateEmptyGrid()
  }
}
