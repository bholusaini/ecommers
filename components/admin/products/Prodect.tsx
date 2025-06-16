'use client'
import {  ArrowRightOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Card, Divider, Form, Input, InputNumber, message, Modal, Result, Skeleton, Tag, Upload } from 'antd'
import React, { useState } from 'react'
import Image from 'next/image'
import '@ant-design/v5-patch-for-react-19';
import ClientCatchError from '../../../Lib/client-catch-error'
import axios from 'axios'
import useSWR from 'swr'
import fetecher from '../../../Lib/fetecher'

const Products = () => {
  
  const [open, setOpen] = useState(false)

  const onSearch = (values: any)=>{
    console.log(values)
  }

  const [productForm] = Form.useForm()
  
  const handleClose = ()=>{
    setOpen(false)
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
    message.success("product create success fully")
    handleClose()

    }
    catch(err)
    {
     
     ClientCatchError(err)
    
    }

  }
  
   const {data,error,isLoading} =useSWR("/api/product",fetecher)

   if(isLoading){
    return <Skeleton active/>
   }

   if(error){
    return <Result
      status="error"
      title={error.message}
    />

   }

  return (
    <div className='flex flex-col gap-8'>
      <Skeleton active />
      <div className='flex justify-between items-center'>
        <Form onFinish={onSearch}>
          <Form.Item name="search" rules={[{required: true}]} className='!mb-0'>
            <Input 
              placeholder='Search this site' 
              suffix={<Button htmlType='submit' type="text" icon={<SearchOutlined />} />} 
              className='!w-[350px]'
            />
          </Form.Item>
        </Form>
        <Button onClick={()=>setOpen(true)} type='primary' size='large' icon={<PlusOutlined />} className='!bg-indigo-500'>Add product</Button>
      </div>

      <div className='grid grid-cols-4 gap-8'>
        {
          data.map((item:any, index:any)=>(
            <Card 
              key={index}
              hoverable
              cover={
                <div className='relative w-full h-[180px]'>
                  <Image src={item.image} layout="fill" alt={`product-${index}`} objectFit='cover' className='rounded-t-lg'/>
                </div>
              }
              actions={[
                <EditOutlined key="edit" className='!text-green-400' />,
                <DeleteOutlined key="delete" className='!text-rose-400' />
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
      <Modal open={open} width={720} centered footer={null} onCancel={handleClose} maskClosable={false}>
        <h1 className='text-lg font-medium'>Add a new product</h1>
        <Divider />
        <Form layout='vertical' form={productForm} onFinish={createProduct} >
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

          <Form.Item name="image" rules={[{required: true}]}>
            <Upload   fileList={[]} >
              <Button size="large" icon={<UploadOutlined />}>Upload a product image</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button htmlType='submit' size='large' type='primary' icon={<ArrowRightOutlined />}>Add now</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Products