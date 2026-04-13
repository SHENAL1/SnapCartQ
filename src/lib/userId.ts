const KEY = 'snapcartq_user_id'

function generateId(): string {
  return crypto.randomUUID()
}

export function getUserId(): string {
  let id = localStorage.getItem(KEY)
  if (!id) {
    id = generateId()
    localStorage.setItem(KEY, id)
  }
  return id
}
