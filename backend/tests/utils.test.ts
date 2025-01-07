import { generateEmptyGrid, generateGrid, getSecretCode, normalizeValue } from "../src/utils/generic"

describe("Test generic utils", () => {
  const rows = parseInt(process.env.GRID_ROWS!)
  const cols = parseInt(process.env.GRID_COLUMNS!)

  test("Empty grid generation", () => {
    const grid = generateEmptyGrid()
    expect(grid.length).toBe(rows) 
    expect(grid[0]!.length).toBe(cols) 
  })

  test("Random grid generation size, no bias", () => {
    const grid = generateGrid("") 

    expect(grid.length).toBe(rows) 
    expect(grid[0]!.length).toBe(cols) 
  })

  test("Random grid generation size, with bias", () => {
    const grid = generateGrid("h") 

    expect(grid.length).toBe(rows) 
    expect(grid[0]!.length).toBe(cols) 
  })

  test("Random grid generation elements, no bias", () => {
    const grid = generateGrid("") 

    const elements = grid.flat()
    expect(elements.every((el) => el.match("^[a-z]$"))).toBe(true)
    expect(elements.every((el) => el.match("^[A-Z]$"))).toBe(false)
  })

  test("Random grid generation, with bias", () => {
    const bias = "y"
    const grid = generateGrid(bias) 

    const elements = grid.flat()
    expect(elements.every((el) => el.match("^[a-z]$"))).toBe(true)
    expect(elements.every((el) => el.match("^[A-Z]$"))).toBe(false)
    expect(elements.filter((el) => el === bias).length).toBe(20)
  })

  test("Normalize value", () => {
    const below10 = normalizeValue(9) 
    const int = normalizeValue(10) 
    const float = normalizeValue(15) 
    const prime = normalizeValue(13)

    expect(below10).toBe(9)
    expect(int).toBe(5)
    expect(float).toBe(5)
    expect(prime).toBe(1)
  })

  test("Secret code", () => {
     
  })
})
