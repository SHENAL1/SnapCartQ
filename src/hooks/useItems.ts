import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { parseWeightToKg } from '../lib/weight'
import type { Item } from '../types'

type NewItem = { name: string; price: number | null; weight: string | null; quantity: number }
type ItemUpdates = { name?: string; price?: number | null; weight?: string | null; quantity?: number }

export function useItems(listId: string) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('list_id', listId)
      .order('created_at', { ascending: true })

    if (error) setError(error.message)
    else setItems(data || [])
    setLoading(false)
  }, [listId])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const addItem = async (item: NewItem): Promise<Item> => {
    const { data, error } = await supabase
      .from('items')
      .insert({ ...item, list_id: listId })
      .select()
      .single()

    if (error) throw new Error(error.message)
    setItems((prev) => [...prev, data as Item])
    return data as Item
  }

  const updateItem = async (id: string, updates: ItemUpdates): Promise<Item> => {
    const { data, error } = await supabase
      .from('items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    setItems((prev) => prev.map((item) => (item.id === id ? (data as Item) : item)))
    return data as Item
  }

  const deleteItem = async (id: string): Promise<void> => {
    const { error } = await supabase.from('items').delete().eq('id', id)
    if (error) throw new Error(error.message)
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const totalPrice = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)

  const totalWeightKg = items.reduce((sum, item) => {
    const kg = parseWeightToKg(item.weight)
    if (kg == null) return sum
    return sum + kg * item.quantity
  }, 0)

  return { items, loading, error, addItem, updateItem, deleteItem, totalPrice, totalWeightKg, refetch: fetchItems }
}
