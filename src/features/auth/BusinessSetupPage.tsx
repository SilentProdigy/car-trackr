import { useState } from 'react'
import type { SubmitEventHandler } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormInput } from '../../components/ui/FormInput'
import { PrimaryButton } from '../../components/ui/PrimaryButton'
import { supabase } from '../../lib/supabase'

export function BusinessSetupPage() {
  const navigate = useNavigate()

  const [businessName, setBusinessName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreateBusiness: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    setErrorMessage('')
    setLoading(true)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setLoading(false)
      setErrorMessage('You must be logged in to create a business.')
      return
    }

    const { error } = await supabase.from('businesses').insert({
      owner_id: user.id,
      business_name: businessName,
      phone,
      email,
      address,
    })

    setLoading(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    navigate('/dashboard')
  }

  return (
    <main className="min-h-screen bg-[#f6f8f7] px-5 py-8">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#416b57]">
            Business Setup
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#10231c]">
            Add your rental business
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            This information will be used for your dashboard, bookings, reports,
            and receipts.
          </p>
        </div>

        <form
          onSubmit={handleCreateBusiness}
          className="space-y-4 rounded-[2rem] bg-white p-6 shadow-sm"
        >
          {errorMessage && (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <FormInput
            label="Business name"
            value={businessName}
            required
            placeholder="Example: Juan Car Rental"
            onChange={setBusinessName}
          />

          <FormInput
            label="Phone number"
            value={phone}
            placeholder="09XX XXX XXXX"
            onChange={setPhone}
          />

          <FormInput
            label="Business email"
            type="email"
            value={email}
            placeholder="business@example.com"
            onChange={setEmail}
          />

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#10231c]">
              Business address
            </span>

            <textarea
              value={address}
              placeholder="Complete address"
              onChange={(event) => setAddress(event.target.value)}
              className="min-h-28 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#416b57] focus:ring-2 focus:ring-[#416b57]/20"
            />
          </label>

          <PrimaryButton type="submit" loading={loading}>
            Save Business
          </PrimaryButton>
        </form>
      </div>
    </main>
  )
}