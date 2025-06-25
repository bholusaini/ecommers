import { FC } from "react"

interface ErrorInterFace {
    message?:string
}

const Errors:FC<ErrorInterFace> = ({message = "Faild to fetche data retryng "})=>{
     return <h1 className='text-rose-500 font-medium'>{message}</h1>
}

export default Errors