import { useState } from 'react'
import type { SubmitEventHandler } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthCard } from '../../components/ui/AuthCard'
import { FormInput } from '../../components/ui/FormInput'
import { PrimaryButton } from '../../components/ui/PrimaryButton'
import { supabase } from '../../lib/supabase'

import { getUserAccessInfo, resolveAccessRedirect } from './accessApi'

export function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    setErrorMessage('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    const access = await getUserAccessInfo()
    const redirectTo = resolveAccessRedirect(access)

    navigate(redirectTo, { replace: true })
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Login to manage your car rental business."
    >
      <form onSubmit={handleLogin} className="space-y-4">
        {errorMessage && (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <FormInput
          label="Email address"
          type="email"
          value={email}
          required
          placeholder="you@example.com"
          onChange={setEmail}
        />

        <FormInput
          label="Password"
          type="password"
          value={password}
          required
          placeholder="Enter your password"
          onChange={setPassword}
        />

        <PrimaryButton type="submit" loading={loading}>
          Login
        </PrimaryButton>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        No account yet?{' '}
        <Link to="/register" className="font-bold text-[#1f3d32]">
          Create account
        </Link>
      </p>
    </AuthCard>
  )
}