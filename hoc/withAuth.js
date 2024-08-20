import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'
import store from '../rtk/store/store'
import axios from '../utils/axios'

const withAuth = WrappedComponent => {
  return props => {
    if (typeof window !== 'undefined') {
      const router = useRouter()

      const [cookies] = useCookies(['type'])
      const [, , removeCookie] = useCookies(['type'])
      const Type1 = sessionStorage.getItem('type')
      const Type2 = cookies?.type
      //console.log(Type1, Type2);
      const pathnameSegments = router.pathname.split('/')
      const firstSegment = pathnameSegments[1]

      // if (Type1 == "ADMIN" || Type2 == "ADMIN") {
      //   if (firstSegment !== "admin") {
      //     sessionStorage.removeItem("type");
      //     removeCookie("type", { path: "/" });
      //     router.push("/");
      //     return null;
      //   }
      // } else if (Type1 == "FREELANCER" || Type2 == "FREELANCER") {
      //   if (firstSegment !== "editor") {
      //     sessionStorage.removeItem("type");
      //     removeCookie("type", { path: "/" });
      //     router.push("/");
      //     return null;
      //   }
      // } else if (Type1 == "BROKER" || Type2 == "BROKER") {
      //   if (firstSegment !== "broker") {
      //     sessionStorage.removeItem("type");
      //     removeCookie("type", { path: "/" });
      //     router.push("/");
      //     return null;
      //   }
      // } else if (!Type1 && !Type2) {
      //   sessionStorage.removeItem("type");
      //   removeCookie("type", { path: "/" });
      //   router.push("/");
      //   return null;
      // }
      if (Type1 == 'ADMIN' || Type2 == 'ADMIN') {
        if (firstSegment !== 'admin') {
          router.push('/')
          return null
        }
      } else if (Type1 == 'FREELANCER' || Type2 == 'FREELANCER') {
        if (firstSegment !== 'editor') {
          router.push('/')
          return null
        }
      } else if (Type1 == 'BROKER' || Type2 == 'BROKER') {
        if (firstSegment !== 'broker' && firstSegment !== 'process') {
          console.log("First-sagment",firstSegment)
          // router.push('/')
          return null
        }
      } else if (!Type1 && !Type2) {
        sessionStorage.removeItem('token')
        removeCookie('token', { path: '/' })
        router.push('/')
        return null
      }

      return <WrappedComponent {...props} />
    }

    // If we are on server, return null
    return null
  }
}

export default withAuth
