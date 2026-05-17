import { getBookings } from '../bookings/bookingsApi'
import { getCars } from '../cars/carsApi'
import { getCustomers } from '../customers/customersApi'
import { getExpenses } from '../expenses/expensesApi'
import { getMaintenanceRecords } from '../maintenance/maintenanceApi'
import { getPayments } from '../payments/paymentsApi'
import { getCurrentBusiness } from '../../lib/business'

function todayDate() {
  return new Date().toISOString().slice(0, 10)
}

function addDays(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

export async function getDashboardData() {
  const [business, cars, customers, bookings, payments, expenses, maintenanceRecords] =
    await Promise.all([
      getCurrentBusiness(),
      getCars(),
      getCustomers(),
      getBookings(),
      getPayments(),
      getExpenses(),
      getMaintenanceRecords(),
    ])

  const today = todayDate()
  const nextSevenDays = addDays(7)

  const activeBookings = bookings.filter(
    (booking) => booking.booking_status !== 'cancelled',
  )

  const ongoingBookings = bookings.filter(
    (booking) => booking.booking_status === 'ongoing',
  )

  const pendingBookings = bookings.filter(
    (booking) => booking.booking_status === 'pending',
  )

  const confirmedBookings = bookings.filter(
    (booking) => booking.booking_status === 'confirmed',
  )

  const completedBookings = bookings.filter(
    (booking) => booking.booking_status === 'completed',
  )

  const cancelledBookings = bookings.filter(
    (booking) => booking.booking_status === 'cancelled',
  )

  const upcomingReturns = bookings
    .filter((booking) => {
      return (
        ['confirmed', 'ongoing'].includes(booking.booking_status) &&
        booking.return_date >= today &&
        booking.return_date <= nextSevenDays
      )
    })
    .sort((a, b) => a.return_date.localeCompare(b.return_date))
    .slice(0, 5)

  const recentBookings = bookings
    .slice()
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5)

  const bookingsWithBalance = activeBookings
    .filter((booking) => Number(booking.balance) > 0)
    .sort((a, b) => Number(b.balance) - Number(a.balance))
    .slice(0, 5)

  const totalRevenue = activeBookings.reduce((sum, booking) => {
    return sum + Number(booking.total_amount)
  }, 0)

  const totalCollected = payments.reduce((sum, payment) => {
    return sum + Number(payment.amount)
  }, 0)

  const totalExpenses = expenses.reduce((sum, expense) => {
    return sum + Number(expense.amount)
  }, 0)

  const maintenanceCost = maintenanceRecords.reduce((sum, record) => {
    return sum + Number(record.cost)
  }, 0)

  const pendingBalance = activeBookings.reduce((sum, booking) => {
    return sum + Number(booking.balance)
  }, 0)

  const netProfit = totalCollected - totalExpenses - maintenanceCost

  const availableCars = cars.filter((car) => car.status === 'available')
  const rentedCars = cars.filter((car) => car.status === 'rented')
  const reservedCars = cars.filter((car) => car.status === 'reserved')
  const maintenanceCars = cars.filter((car) => car.status === 'maintenance')
  const inactiveCars = cars.filter((car) => car.status === 'inactive')

  const utilizationRate =
    cars.length > 0
      ? Math.round(((rentedCars.length + reservedCars.length) / cars.length) * 100)
      : 0

  const collectionRate =
    totalRevenue > 0 ? Math.round((totalCollected / totalRevenue) * 100) : 0

  const topCars = cars
    .map((car) => {
      const carBookings = activeBookings.filter(
        (booking) => booking.car_id === car.id,
      )

      const revenue = carBookings.reduce((sum, booking) => {
        return sum + Number(booking.total_amount)
      }, 0)

      return {
        car,
        bookings: carBookings.length,
        revenue,
      }
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  const activeMaintenance = maintenanceRecords.filter((record) =>
    ['scheduled', 'in_progress'].includes(record.status),
  )

  return {
    business,
    cars,
    customers,
    bookings,
    payments,
    expenses,
    maintenanceRecords,

    totalCars: cars.length,
    totalCustomers: customers.length,
    totalBookings: bookings.length,

    availableCars: availableCars.length,
    rentedCars: rentedCars.length,
    reservedCars: reservedCars.length,
    maintenanceCars: maintenanceCars.length,
    inactiveCars: inactiveCars.length,

    pendingBookings: pendingBookings.length,
    confirmedBookings: confirmedBookings.length,
    ongoingBookings: ongoingBookings.length,
    completedBookings: completedBookings.length,
    cancelledBookings: cancelledBookings.length,

    totalRevenue,
    totalCollected,
    totalExpenses,
    maintenanceCost,
    pendingBalance,
    netProfit,

    utilizationRate,
    collectionRate,

    upcomingReturns,
    recentBookings,
    bookingsWithBalance,
    topCars,
    activeMaintenance,
  }
}