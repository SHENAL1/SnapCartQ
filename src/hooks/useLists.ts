import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getUserId } from '../lib/userId'
import type { ShoppingList } from '../types'

type ListUpdates = {
  name?: string
  budget?: number | null
  currency?: string
  weight_limit?: number | null
}

export function useLists() {
  const [lists, setLists] = useState<ShoppingList[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLists = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('shopping_lists')
      .select('*')
      .eq('user_id', getUserId())
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setLists(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchLists()
  }, [fetchLists])

  const createList = async (
    name: string,
    budget?: number | null,
    currency = 'MYR',
    weightLimit?: number | null
  ): Promise<ShoppingList> => {
    const { data, error } = await supabase
      .from('shopping_lists')
      .insert({
        name,
        budget: budget ?? null,
        currency,
        weight_limit: weightLimit ?? null,
        user_id: getUserId(),
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    setLists((prev) => [data as ShoppingList, ...prev])
    return data as ShoppingList
  }

  const updateList = async (id: string, updates: ListUpdates): Promise<void> => {
    const { error } = await supabase
      .from('shopping_lists')
      .update(updates)
      .eq('id', id)
      .eq('user_id', getUserId())

    if (error) throw new Error(error.message)
    setLists((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)))
  }

  const duplicateList = async (id: string): Promise<ShoppingList> => {
    const original = lists.find((l) => l.id === id)
    if (!original) throw new Error('List not found')

    const { data, error } = await supabase
      .from('shopping_lists')
      .insert({
        name: `${original.name} (Copy)`,
        budget: original.budget,
        currency: original.currency,
        weight_limit: original.weight_limit,
        user_id: getUserId(),
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    setLists((prev) => [data as ShoppingList, ...prev])
    return data as ShoppingList
  }

  const deleteList = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('shopping_lists')
      .delete()
      .eq('id', id)
      .eq('user_id', getUserId())

    if (error) throw new Error(error.message)
    setLists((prev) => prev.filter((l) => l.id !== id))
  }

  return { lists, loading, error, createList, updateList, duplicateList, deleteList, refetch: fetchLists }
}
