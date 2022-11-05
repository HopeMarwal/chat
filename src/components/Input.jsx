export default function Input(props) {
  return (
    <>
      <input
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
      />
      {
        props.error
          ? <span className='error'>{props.error}</span>
          : ''
      }
    </>
  )
}
