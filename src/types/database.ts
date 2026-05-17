export type Profile = {
  id: string
  full_name: string | null
  role: 'owner' | 'staff'
  created_at: string
}

export type Business = {
  id: string
  owner_id: string
  business_name: string
  logo_url: string | null
  phone: string | null
  email: string | null
  address: string | null
  created_at: string
}

export type Car = {
  id: string
  business_id: string
  car_name: string
  brand: string | null
  model: string | null
  plate_number: string
  year: number | null
  transmission: string | null
  fuel_type: string | null
  seats: number | null
  daily_rate: number
  status: CarStatus
  photo_url: string | null
  registration_file_url: string | null
  notes: string | null
  created_at: string
  deleted_at: string | null
}

export type CarFormData = {
  car_name: string
  brand: string
  model: string
  plate_number: string
  year: string
  transmission: string
  fuel_type: string
  seats: string
  daily_rate: string
  status: CarStatus
  notes: string
}

export type Customer = {
  id: string
  business_id: string
  full_name: string
  phone: string | null
  email: string | null
  address: string | null
  driver_license_url: string | null
  valid_id_url: string | null
  emergency_contact: string | null
  notes: string | null
  created_at: string
  deleted_at: string | null
}

export type CustomerFormData = {
  full_name: string
  phone: string
  email: string
  address: string
  emergency_contact: string
  notes: string
}

export type Booking = {
  id: string
  business_id: string
  car_id: string
  customer_id: string
  pickup_date: string
  return_date: string
  daily_rate: number
  total_amount: number
  down_payment: number
  balance: number
  booking_status: BookingStatus
  payment_status: PaymentStatus
  notes: string | null
  created_at: string
  deleted_at: string | null
  cars?: Car | null
  customers?: Customer | null
}

export type BookingFormData = {
  car_id: string
  customer_id: string
  pickup_date: string
  return_date: string
  daily_rate: string
  down_payment: string
  booking_status: BookingStatus
  payment_status: PaymentStatus
  notes: string
}

export type Payment = {
  id: string
  business_id: string
  booking_id: string
  amount: number
  payment_method: string | null
  payment_date: string
  receipt_url: string | null
  notes: string | null
  created_at: string
  deleted_at: string | null
  bookings?: Booking | null
}

export type PaymentFormData = {
  booking_id: string
  amount: string
  payment_method: string
  payment_date: string
  notes: string
}

export type Expense = {
  id: string
  business_id: string
  car_id: string | null
  title: string
  category: string | null
  amount: number
  expense_date: string
  receipt_url: string | null
  notes: string | null
  created_at: string
  deleted_at: string | null
  cars?: Car | null
}

export type ExpenseFormData = {
  car_id: string
  title: string
  category: string
  amount: string
  expense_date: string
  notes: string
}

export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed'

export type Maintenance = {
  id: string
  business_id: string
  car_id: string
  maintenance_type: string | null
  description: string | null
  cost: number
  service_date: string | null
  next_service_date: string | null
  status: MaintenanceStatus
  receipt_url: string | null
  created_at: string
  deleted_at: string | null
  cars?: Car | null
}

export type MaintenanceFormData = {
  car_id: string
  maintenance_type: string
  description: string
  cost: string
  service_date: string
  next_service_date: string
  status: MaintenanceStatus
}

export type CarStatus = 'available' | 'reserved' | 'rented' | 'maintenance' | 'inactive'

export type BookingStatus = 'pending' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled'

export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded'