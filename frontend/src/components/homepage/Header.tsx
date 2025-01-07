import "./Header.css"

interface Props {
  updateChar: (e: React.ChangeEvent<HTMLInputElement>) => void,
  generate: () => void,
  char: string,
}

const Header = ({ updateChar, generate, char }: Props) => {
  
  return (
    <header>
      <div className="header-item">
        <label id="secret-code-label" htmlFor="char">CHARACTER</label>
        <input id="secret-code-input" maxLength={1} placeholder="Character" name="char" type="text" onChange={updateChar} value={char}/>
      </div>
      <div className="header-item">
        <img alt="clock" id="clock" src="/clock.svg" />
      </div>
      <div className="header-item">
        <button id="generate-btn" onPointerUp={generate}>GENERATE 2D GRID</button>
      </div>
    </header>
  ) 
}

export default Header
