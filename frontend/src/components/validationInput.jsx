
export default function ValidationInput({ error, placeholder, onChange = () => { }, type, title = "",value }) {
  //const inputclass = ` appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500+${error && " border-red-600"}`

  const inputclass = ` appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 +${error && " border-red-600 focus:border-red-600"}`
  return (
    <div class="">
      <h1 class="font-bold text-sm">{title}</h1>
      <input type={type}
        value={value}
        class={inputclass}
        onChange={(e) => { onChange(e.target.value) }}
        placeholder={placeholder} />
      <h1 class="font-thin text-sm text-red-900" ><span class="select-none">&nbsp;</span>{error}</h1>
    </div>
  )
}
export function ValidationTextArea({ error, placeholder, onChange = () => { }, type, title = "", clase = "",value }) {


  //const inputclass = `flex-1 appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 text-start resize-none+`

  const inputclass = `flex-1 appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 resize-none +${error && " border-red-600 focus:border-red-600"} ${clase&&" "+clase+" "}`
  const areaclass= `+`
  return (
    <div class="flex flex-col flex-1">
      <h1 class="font-bold text-sm">{title}</h1>
      <textarea
        value={value}
        class={inputclass}
        onChange={(e) => { onChange(e.target.value) }}
        placeholder={placeholder} />
      <h1 class="font-thin text-sm text-red-900" >&nbsp;{error}</h1>
    </div>
  )
}
export function ValidationInputWithOutTitle({ error, placeholder, classname, onChange = () => { }, type, value }) {
  //const inputclass = ` appearance-none border-2 border-gray-200 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500+${error && " border-red-600"}`

  return (
    <div class="">
      <input type={type}
        value={value}
        class={classname}
        onChange={(e) => { onChange(e.target.value) }}
        placeholder={placeholder} />
      <h1 class="font-thin text-sm text-red-900" >&nbsp;{error}</h1>
    </div>
  )
}
