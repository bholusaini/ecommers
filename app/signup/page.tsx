import Signup from '@/components/Signup'

export const metadata = {
  title: `Signup - Ecom`,
  description: 'Sigup or register your new ecom account',
  keywords: "ecom login, ecom signin, ecom account login, ecom signup, ecom register, ecom new account",
  openGraph: {
    title: `Signup - Ecom`,
    description: 'Sigup or register your new ecom account',
    url: `${process.env.SERVER}/signup`,
    siteName: "Ecom",
    images: [
      {
        url: "/images/logo.png"
      },
    ],
    locale: "en_US",
    type: "website"
  }
}

const SignupRouter = () => {
  return (
    <Signup />
  )
}

export default SignupRouter