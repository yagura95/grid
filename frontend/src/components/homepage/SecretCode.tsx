import "./SecretCode.css"

interface Props {
  code: number
}

const SecretCode = ({ code }: Props) => {
  return (
    <div className="code-secret-container">
      <div id="live">
        <div id="red-ball"/>
        LIVE 
      </div>
      <div className="code-secret">
        <div id="code">YOUR CODE: <span>{code}</span></div>
      </div>
    </div>
  )
}

export default SecretCode
