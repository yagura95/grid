import "./UpdateMessage.css"

interface Props {
  update: boolean
}

const UpdateMessage = ({ update }: Props) => {
  if(!update) {
    return <div className="message"></div>
  }

  return <div className="message">Updating payments</div>
}

export default UpdateMessage
