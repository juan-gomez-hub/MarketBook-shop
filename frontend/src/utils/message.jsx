
export default function({ message, error }) {
  const messageClass = `p-2 
  ${message && (error ? "text-red-700 bg-red-100 border-red-500 border rounded-md "
      : "text-green-700 bg-green-100 border-green-500 border rounded-md ")}`
  return (
    <div class="">
      <h1 class={messageClass}>
        {
        //<strong>{message && (error ? 'Error: ' : 'Success: ')}</strong>
        }
        &nbsp;{message}
      </h1>
    </div>
  )
}
