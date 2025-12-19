import { render, screen, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { onAuthStateChanged } from 'firebase/auth'
import { authService } from '@/features/auth/services/auth.service'

// Mock Firebase
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
  getAuth: jest.fn(),
}))

jest.mock('@/lib/firebase', () => ({
  auth: {},
}))

// Mock AuthService
jest.mock('@/features/auth/services/auth.service', () => ({
  authService: {
    signInWithGoogle: jest.fn(),
    signInWithEmail: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  },
}))

// Test Component to consume context
const TestComponent = () => {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  return <div>{user ? `User: ${user.email}` : 'No User'}</div>
}

describe('AuthContext', () => {
  it('shows loading initially', () => {
    // onAuthStateChanged returns unsubscribe
    ;(onAuthStateChanged as jest.Mock).mockReturnValue(() => {})
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('updates state when onAuthStateChanged triggers with user', () => {
    // Mock implementation to trigger callback immediately
    ;(onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback({ email: 'test@test.com' })
      return () => {}
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByText('User: test@test.com')).toBeInTheDocument()
  })

  it('updates state when onAuthStateChanged triggers with null', () => {
    ;(onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(null)
      return () => {}
    })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByText('No User')).toBeInTheDocument()
  })
})
