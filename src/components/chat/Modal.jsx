import React from 'react'

export default function Modal({ onClick }) {
  return (
    <div className='modal_container'>
      <div className="modal_body">
        <span>Delete message</span>
        <p>Are you sure want to delete this message?</p>
        <button onClick={onClick} value="Yes">Yes</button>
        <button onClick={onClick} value="Cancel">Cancel</button>
      </div>
    </div>
  )
}
