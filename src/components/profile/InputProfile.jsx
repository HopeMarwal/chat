import React from 'react'

export default function InputProfile(props) {
  return (
    <input
      type="text"
      className={`${props.isChange ? 'active' : ''} value`}
      readOnly={!props.isChange}
      value={props.value}
      onChange={props.onChange}
      onClick={props.onClick}
    />
  )
}
