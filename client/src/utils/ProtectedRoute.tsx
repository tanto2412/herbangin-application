// ProtectedRoute.tsx
import { Navigate } from 'react-router-dom'
import { useUserContext } from '../components/UserContext'

export type ProtectedRouteProps = {
  redirectTo: string
  outlet: JSX.Element
}

export function ProtectedRoute({ redirectTo, outlet }: ProtectedRouteProps) {
  const { username } = useUserContext()
  if (username) {
    return outlet
  } else {
    return <Navigate to={{ pathname: redirectTo }} />
  }
}

export function UnprotectedRoute({ redirectTo, outlet }: ProtectedRouteProps) {
  const { username } = useUserContext()
  if (!username) {
    return outlet
  } else {
    return <Navigate to={{ pathname: redirectTo }} />
  }
}
