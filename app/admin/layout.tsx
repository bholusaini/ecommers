import React, { FC } from 'react'
import AdminLayout from '../../components/admin/Layout'
import ChildrenInterface from '../../interface/Children.interface'

const layout :FC <ChildrenInterface> = ({children}) => {
  return (
    <div>
     
     <AdminLayout>
        {children}
     </AdminLayout>
    </div>
  )
}

export default layout