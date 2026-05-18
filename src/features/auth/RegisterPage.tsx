import { useState } from 'react'
import type { SubmitEventHandler } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthCard } from '../../components/ui/AuthCard'
import { FormInput } from '../../components/ui/FormInput'
import { PrimaryButton } from '../../components/ui/PrimaryButton'
import { supabase } from '../../lib/supabase'

export function RegisterPage() {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    setErrorMessage('')
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setLoading(false)
      setErrorMessage(error.message)
      return
    }

    const userId = data.user?.id

    if (!userId) {
      setLoading(false)
      setErrorMessage('Account created. Please confirm your email before logging in.')
      return
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      full_name: fullName,
      role: 'owner',
    })

    setLoading(false)

    if (profileError) {
      setErrorMessage(profileError.message)
      return
    }

    navigate('/business-setup')
  }

  return (
    <AuthCard
      title="Create account"
      subtitle="Start managing your fleet, bookings, customers, payments, and reports."
    >
      <form onSubmit={handleRegister} className="space-y-4">
        {errorMessage && (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <FormInput
          label="Full name"
          value={fullName}
          required
          placeholder="Juan Dela Cruz"
          onChange={setFullName}
        />

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
          placeholder="Minimum 6 characters"
          onChange={setPassword}
        />

        <PrimaryButton type="submit" loading={loading}>
          Create Account
        </PrimaryButton>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-[#1f3d32]">
          Login
        </Link>
      </p>
    </AuthCard>
  )
}