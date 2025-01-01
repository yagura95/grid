import "./Grid.css"

interface Props {
  grid: string[][]
}

const Grid = ({ grid }: Props) => {
    return (<div className="grid">
      {grid.map((row) => {
        return row.map((letter, i) => {
          return <div key={i} className="grid-item">{letter}</div> 
        })
      })}
    </div>)
}

export default Grid

