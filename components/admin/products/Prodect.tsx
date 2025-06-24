'use client'
import {  ArrowRightOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SafetyOutlined, SaveOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Card, Divider, Form, Input, InputNumber, message, Modal, Pagination, Popconfirm, Result, Skeleton, Tag, Upload } from 'antd'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import '@ant-design/v5-patch-for-react-19';
import ClientCatchError from '../../../Lib/client-catch-error'
import axios from 'axios'
import useSWR, { mutate } from 'swr'
import fetecher from '../../../Lib/fetecher'
import {debounce} from "lodash"

const Products = () => {
  const [editId, setEditId] = useState <string|null>(null)
  const [open, setOpen] = useState(false)
  const [page,setPage] = useState(1)
  const [limit, setLimit] = useState(16)
   const {data,error,isLoading} =useSWR(`/api/product/?page=${page}&limit=${limit}`,fetecher)
   const [product,setProduct] = useState({data:[],total:0})

   useEffect(()=>{
    if(data){
      setProduct(data)
    }
   },[data])
  
  const onSearch = (values: any)=>{
    console.log(values)
  }

  const [productForm] = Form.useForm()
  
  const handleClose = ()=>{
    setOpen(false)
    setEditId(null)
    productForm.resetFields()
  }

  const createProduct = async (values: any)=>{
    try{
 
      values.image = values.image.file.originFileObj

      const formData = new FormData()  

      for(let key in values){
      formData.append(key,values[key]) 
      }

     await axios.post("/api/product",formData)
     mutate(`/api/product/?page=${page}&limit=${limit}`)
    message.success("product create success fully")
    handleClose()

    }
    catch(err)
    {
     
     ClientCatchError(err)
    
    }

  }
  
   const onPaginate = (page:number,limit:number)=>{
    
      setPage(page)
      setLimit(limit)
    }

  

   if(isLoading){
    return <Skeleton active/>
   }

   if(error){
    return <Result
      status="error"
      title={error.message}
    />

   }

  

   const deleteProduct = async (id:string)=>{
    try{
      await axios.delete(`/api/product/${id}`)
      mutate(`/api/product/?page=${page}&limit=${limit}`)
    }
    catch(err)
    {
      ClientCatchError(err)
    }
   }

   const editProduct = async (item:any)=>{
     setEditId(item._id )
     setOpen(true)
     productForm.setFieldsValue(item)
     
   }

  const saveProduct = async (values:any)=>{
    try{
      await axios.put(`/api/product/${editId}`,values)
      handleClose()
      message.success("product update success fully")
       mutate(`/api/product/?page=${page}&limit=${limit}`)
    }
    catch(err)
    {
      ClientCatchError(err)
    }
  }
 
  const changeImage = (id:string)=>{
    try{
      const input = document.createElement("input")
      input.type= "file"
      input.accept = "image/*"
      input.click()
      
      input.onchange  = async()=>{
        if(!input.files)
          return message.error("File not slectet")

        const file = input.files[0]
        input.remove()

        const formData = new FormData()
        formData.append("id",id)
        formData.append("image",file)

        await axios.put("/api/product/change-image",formData)
        mutate(`/api/product/?page=${page}&limit=${limit}`)
      }
    }
    catch(err)
    {
      return ClientCatchError(err)
    }
  }

  const onChange = debounce(async(e:any)=>{
   try{
    const value = e.target.value.trim()
    const {data} = await axios.get(`/api/product?search=${value}`)
    setProduct(data)
   }
   catch(err)
   {
    return ClientCatchError
   }
  },2000)
   
  return (
    <div className='flex flex-col gap-8'>
      <Skeleton active />
      <div className='flex justify-between items-center'>
        <Form onFinish={onSearch}>
          <Form.Item name="search" rules={[{required: true}]} className='!mb-0'>
            <Input 
              placeholder='Search this site'              
              className='!w-[350px]'
              onChange={onChange}
            />
          </Form.Item>

        </Form>
        <Button htmlType='submit' size='large' type='primary' onClick={()=>setOpen(true)} icon={<ArrowRightOutlined />}>Add product</Button>

      </div>

      <div className='grid grid-cols-4 gap-8'>
        {
          product.data.map((item:any, index:any)=>(
            <Card 
              key={index}
              hoverable
              cover={
                <div className='relative w-full h-[180px]'>
                  <Popconfirm title="do you want to change image" onConfirm={()=>changeImage(item._id)}>

                  <Image src={item.image} layout="fill" alt={`product-${index}`} objectFit='cover' className='rounded-t-lg'/>
                  </Popconfirm>
                </div>
              }
              actions={[
                <EditOutlined key="edit" className='!text-green-400' onClick={() => editProduct(item)} />,

                <DeleteOutlined key="delete" className='!text-rose-400' onClick={() => { deleteProduct(item._id)}}/>
              ]}
            >
              <Card.Meta 
                title={item.title}
                description={
                  <div className='flex gap-2'>
                    <label>&#8377;{item.price}</label>
                    <del>&#8377;{item.price}</del>
                    <label>{item.discount}</label>
          
                  </div>
                }
              />
              <Tag className='!mt-5' color="cyan">{item.quantity}</Tag>
            </Card>
          ))
        }
      </div>
        
        <div className='flex justify-end w-full bg-blue-300'>
          <Pagination
          total={data.total}
          onChange={onPaginate}
          current={page}
          pageSizeOptions={[16,32,64,100]}
          defaultPageSize={limit}
          />
        </div>

      <Modal open={open} width={720} centered footer={null} onCancel={handleClose} maskClosable={false}>
        <h1 className='text-lg font-medium'>Add a new product</h1>
        <Divider />
        <Form layout='vertical' form={productForm} onFinish={editId ? saveProduct: createProduct} >
          <Form.Item
            label="Product name"
            name="title"
            rules={[{required: true}]}
          >
            <Input 
              size='large'
              placeholder='Enter product name'
            />
          </Form.Item>

          <div className='grid grid-cols-3 gap-6'>
            <Form.Item
              label="Price"
              name="price"
              rules={[{required: true, type: "number"}]}
            >
              <InputNumber
                size='large'
                placeholder='00.00'
                className='!w-full'
              />
            </Form.Item>

            <Form.Item
              label="Discount"
              name="discount"
              rules={[{required: true, type: "number"}]}
            >
              <InputNumber
                size='large'
                placeholder='20'
                className='!w-full'
              />
            </Form.Item>

            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[{required: true, type: "number"}]}
            >
              <InputNumber
                size='large'
                placeholder='20'
                className='!w-full'
              />
            </Form.Item>
          </div>

          <Form.Item label="Description" rules={[{required: true}]} name="description">
            <Input.TextArea rows={5} placeholder='Description' />
          </Form.Item>
            
            {
              !editId && 
                <Form.Item name="image" rules={[{required: true}]}>
                  <Upload   fileList={[]} >
                    <Button size="large" icon={<UploadOutlined />}>Upload a product image</Button>
                  </Upload>
                </Form.Item>
            }
          

          <Form.Item>
             {
            editId ?
            <Button htmlType='submit' type='primary' danger size='large' icon={<SaveOutlined/>} className='!bg-indigo-500'>Save Changes </Button>
            :
            <Button htmlType='submit' type='primary' size='large' icon={<PlusOutlined />} className='!bg-indigo-500'>Add now</Button>

          }
            
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Products