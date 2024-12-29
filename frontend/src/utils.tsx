export function normalizeValue(count: number): number {
  if(count < 10) return count

  const n = count.toString()
  let divisor = parseInt(n[0]) + 1
  
  while(count % divisor !== 0) {
    divisor++
  }

  return count / divisor 
}

export function getSecretCode(grid: string[][]) {
  if(grid[0][0] === "") return 0 

  const seconds = new Date().getSeconds().toString().padStart(2, "0")

  const i = parseInt(seconds[0])
  const j = parseInt(seconds[1])
  
  const firstLetter: string = grid[i][j]
  const secondLetter: string = grid[j][i]

  let firstLetterCount = 0
  let secondLetterCount = 0

  grid.forEach((row: string[]) => {
    row.forEach((letter: string)=> {
      if(letter === firstLetter)  return firstLetterCount++
      if(letter === secondLetter) return secondLetterCount++
    })
  })

  firstLetterCount = normalizeValue(firstLetterCount) 
  secondLetterCount = normalizeValue(secondLetterCount) 

  return firstLetterCount * 10 + secondLetterCount
}

export function generateEmptyGrid(): string[][] {
  return new Array(10).fill(new Array(10).fill(""))
}
