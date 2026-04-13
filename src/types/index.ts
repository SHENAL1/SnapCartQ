export interface ShoppingList {
  id: string;
  name: string;
  budget: number | null;
  created_at: string;
}

export interface Item {
  id: string;
  list_id: string;
  name: string;
  price: number | null;
  weight: string | null;
  quantity: number;
  created_at: string;
}

export interface ExtractedProduct {
  name: string;
  price: number | null;
  weight: string | null;
}
