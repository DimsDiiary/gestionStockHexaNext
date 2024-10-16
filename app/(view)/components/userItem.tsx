'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface User {
  firstName: string
  lastName: string
  email: string
}

const fetchUser = async (): Promise<User | null> => {
  try {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.user
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return null
  }
}

export default function UserItem() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      if (status === 'authenticated') {
        try {
          const userData = await fetchUser()
          setUser(userData)
        } catch (err) {
          console.error('Error fetching user:', err)
          setError('Failed to fetch user data')
        }
      }
    }

    getUser()
  }, [status])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated') {
    return <div>Not authenticated</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!user) {
    return <div>Loading user data...</div>
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-[10px] p-2">
      <div className="rounded-full min-h-12 min-w-12 bg-emerald-400 text-white font-[700] flex items-center justify-center">
        {user.firstName.charAt(0)}
      </div>
      <div className="grow">
        <p className="text-[16px] font-bold">{user.firstName} {user.lastName}</p>
        <p className="text-[10px] text-neutral-400">{user.email}</p>
      </div>
    </div>
  )
}