/** Admin user */
export interface User {
  uid: string
  firstName: string
  lastName: string
  email: string
  role?: 'admin' | 'superAdmin'
}
