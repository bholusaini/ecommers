import Slug from '@/components/Slug'

import { FC } from 'react'
import SlugInterface from '../../../interface/Slug.interface'

const SlugRouter: FC<SlugInterface> = async ({params}) => {
  const slugRes = await fetch(`${process.env.SERVER}/api/product/${params.slug}`)
  const data = slugRes.ok ? await slugRes.json() : null

  return (
    <Slug data={data} title={params.slug} />
  )
}

export default SlugRouter