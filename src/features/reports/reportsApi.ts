import { getBookings } from '../bookings/bookingsApi'
import { getCars } from '../cars/carsApi'
import { getExpenses } from '../expenses/expensesApi'
import { getMaintenanceRecords } from '../maintenance/maintenanceApi'

export async function getReportsData() {
  const [bookings, cars, expenses, maintenanceRecords] = await Promise.all([
    getBookings(),
    getCars(),
    getExpenses(),
    getMaintenanceRecords(),
  ])

  const activeBookings = bookings.filter(
    (booking) => booking.booking_status !== 'cancelled',
  )

  const completedBookings = bookings.filter(
    (booking) => booking.booking_status === 'completed',
  )

  const ongoingBookings = bookings.filter(
    (booking) => booking.booking_status === 'ongoing',
  )

  const cancelledBookings = bookings.filter(
    (booking) => booking.booking_status === 'cancelled',
  )

  const totalRevenue = activeBookings.reduce((sum, booking) => {
    return sum + Number(booking.total_amount)
  }, 0)

  const totalCollected = activeBookings.reduce((sum, booking) => {
    return sum + Number(booking.down_payment)
  }, 0)

  const pendingBalance = activeBookings.reduce((sum, booking) => {
    return sum + Number(booking.balance)
  }, 0)

  const totalExpenses = expenses.reduce((sum, expense) => {
    return sum + Number(expense.amount)
  }, 0)

  const maintenanceCost = maintenanceRecords.reduce((sum, record) => {
    return sum + Number(record.cost)
  }, 0)

  const netProfit = totalCollected - totalExpenses - maintenanceCost

  const availableCars = cars.filter((car) => car.status === 'available').length
  const rentedCars = cars.filter((car) => car.status === 'rented').length
  const reservedCars = cars.filter((car) => car.status === 'reserved').length
  const maintenanceCars = cars.filter((car) => car.status === 'maintenance').length

  const mostRentedCars = cars
    .map((car) => {
      const carBookings = activeBookings.filter(
        (booking) => booking.car_id === car.id,
      )

      const carRevenue = carBookings.reduce((sum, booking) => {
        return sum + Number(booking.total_amount)
      }, 0)

      return {
        car,
        bookings: carBookings.length,
        revenue: carRevenue,
      }
    })
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5)

  return {
    cars,
    bookings,
    expenses,
    maintenanceRecords,
    totalRevenue,
    totalCollected,
    pendingBalance,
    totalExpenses,
    maintenanceCost,
    netProfit,
    completedBookings: completedBookings.length,
    ongoingBookings: ongoingBookings.length,
    cancelledBookings: cancelledBookings.length,
    availableCars,
    rentedCars,
    reservedCars,
    maintenanceCars,
    mostRentedCars,
  }
}