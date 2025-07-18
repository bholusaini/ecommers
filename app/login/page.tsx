import Login from '@/components/Login'

export const metadata = {
  title: `Login - Ecom`,
  description: 'Sigin or login with your ecom account',
  keywords: "ecom login, ecom signin, ecom account login",
  openGraph: {
    title: `Login - Ecom`,
    description: 'Sigin or login with your ecom account',
    url: `${process.env.SERVER}/login`,
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

const LoginRouter = () => {
  return (
    <Login />
  )
}

export default LoginRouter