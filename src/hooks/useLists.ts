import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { ShoppingList } from '../types'

export function useLists() {
  const [lists, setLists] = useState<ShoppingList[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLists = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('shopping_lists')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setLists(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchLists()
  }, [fetchLists])

  const createList = async (name: string, budget?: number | null): Promise<ShoppingList> => {
    const { data, error } = await supabase
      .from('shopping_lists')
      .insert({ name, budget: budget ?? null })
      .select()
      .single()

    if (error) throw new Error(error.message)
    setLists((prev) => [data as ShoppingList, ...prev])
    return data as ShoppingList
  }

  const updateListBudget = async (id: string, budget: number): Promise<void> => {
    const { error } = await supabase
      .from('shopping_lists')
      .update({ budget })
      .eq('id', id)

    if (error) throw new Error(error.message)
    setLists((prev) => prev.map((l) => (l.id === id ? { ...l, budget } : l)))
  }

  const deleteList = async (id: string): Promise<void> => {
    const { error } = await supabase.from('shopping_lists').delete().eq('id', id)
    if (error) throw new Error(error.message)
    setLists((prev) => prev.filter((l) => l.id !== id))
  }

  return { lists, loading, error, createList, updateListBudget, deleteList, refetch: fetchLists }
}
