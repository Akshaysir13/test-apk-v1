// app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-gray-600">Welcome, {user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="p-6 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Available Tests</h3>
              <p className="text-3xl font-bold text-blue-600">12</p>
            </div>
            <div className="p-6 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Completed</h3>
              <p className="text-3xl font-bold text-green-600">5</p>
            </div>
            <div className="p-6 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Average Score</h3>
              <p className="text-3xl font-bold text-purple-600">78%</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Recent Tests</h2>
            <div className="space-y-2">
              <div className="p-4 border rounded-md hover:bg-gray-50">
                <p className="font-medium">Mathematics Mock Test 1</p>
                <p className="text-sm text-gray-600">Duration: 60 minutes</p>
              </div>
              <div className="p-4 border rounded-md hover:bg-gray-50">
                <p className="font-medium">Physics Mock Test 2</p>
                <p className="text-sm text-gray-600">Duration: 45 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}