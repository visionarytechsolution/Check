import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'
import store from '../rtk/store/store'
import { useSelector } from 'react-redux'

const withPublic = WrappedComponent => {
  return props => {
    // checks whether we are on client / browser or server.
    if (typeof window !== 'undefined') {
      const router = useRouter()

      const [cookies] = useCookies(['type'])
      const Type1 = cookies.type
      const Type2 = sessionStorage.getItem('type')

      //console.log(Type1 , Type2)

      if (Type1 || Type2) {
        if (Type1 == 'ADMIN') {
          router.push('/admin/dashboard')
        } else if (Type1 == 'BROKER') {
          router.push('/broker/dashboard')
        } else if (Type1 == 'FREELANCER') {
          router.push('/editor/dashboard')
        } else if (Type2 == 'ADMIN') {
          router.push('/admin/dashboard')
        } else if (Type2 == 'BROKER') {
          router.push('/broker/dashboard')
        } else if (Type2 == 'FREELANCER') {
          router.push('/editor/dashboard')
        }

        return null
      }

      return <WrappedComponent {...props} />
    }

    return null
  }
}

export default withPublic
