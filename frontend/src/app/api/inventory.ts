export async function fetchInventory(token: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inventory`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!res.ok) {
      throw new Error('Failed to fetch inventory data');
    }
  
    return res.json();
  }
  
  export async function adjustStock(productId: number, adjustment: number, token: string) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inventory/${productId}/adjust`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ stockAdjustment: adjustment }),
    });
  }
  
  export async function reorderStock(productId: number, token: string) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inventory/${productId}/reorder`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
  }
  
  export async function downloadReport(token: string) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inventory/report`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  