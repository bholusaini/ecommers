import Slug from '@/components/Slug'
import SlugInterface from '@/interface/slug.interface'
import { FC } from 'react'

export const generateMetadata = async (context: SlugInterface)=>{
  const slugRes = await fetch(`${process.env.SERVER}/api/product/${context.params.slug}`)
  const data = slugRes.ok ? await slugRes.json() : null

  return {
    title: data ? `Ecom - ${data.title}` : 'Ecom',
    description: data ? data.description : 'Ecom',
    keywords: 'Ecom product',
    openGraph: {
      title: data ? `Ecom - ${data.title}` : 'Ecom',
      description: data ? data.description : 'Ecom',
      url: `${process.env.SERVER}/products/${context.params.slug}`,
      siteName: "Ecom",
      images: [
        {
          url: data ? data.image : "/images/logo.png"
        },
      ],
      locale: "en_US",
      type: "website"
    }
  }
}

const SlugRouter: FC<SlugInterface> = async ({params}) => {
  const slugRes = await fetch(`${process.env.SERVER}/api/product/${params.slug}`)
  const data = slugRes.ok ? await slugRes.json() : null

  return (
    <Slug data={data} title={params.slug} />
  )
}

export default SlugRouter

export const generateStaticParams = async ()=>{
  const res = await fetch(`${process.env.SERVER}/api/product?slug=true`)

  const slugList = await res.json()
  return slugList.map((slug: string)=>({
    slug: slug
  }))
}