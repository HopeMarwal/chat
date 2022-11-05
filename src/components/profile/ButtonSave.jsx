import LoaderCircle from '../loadingbars/LoaderCircle';
import { AiOutlineCheck, AiOutlineSave } from "react-icons/ai";

export default function ButtonEdit(props) {
  return (
    <button
      className="edit_btn"
      onClick={props.handleEdit}
      disabled={props.disabled ? false : true}
    >
      {props.uploadStatus === 'none'
        ? <AiOutlineSave />
        : props.uploadStatus === 'loading'
          ? <LoaderCircle />
          : <AiOutlineCheck style={{ color: '#1e742a' }} />
      }
    </button>
  )
}
