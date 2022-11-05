import { AiOutlineEdit } from "react-icons/ai";

export default function ButtonEdit(props) {
  return (
    <button
      onClick={props.onClick}
      className="edit_btn"
      disabled={props.disabled ? false : true}
    >
      <AiOutlineEdit />
    </button>
  )
}
