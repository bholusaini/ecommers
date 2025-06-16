import { message } from "antd"
import { isAxiosError } from "axios"

const ClientCatchError = (err:unknown)=>{
    if(isAxiosError(err))
        {
            message.error(err.response?.data.message)
        }

    if(err instanceof Error){
        message.error(err.message)
      }
}

export default ClientCatchError