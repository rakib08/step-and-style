export async function login(credentials: { username: string; password: string }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include', // Include cookies in the request
    });
  
    if (!res.ok) {
      throw new Error('Invalid username or password');
    }
  
    return res.json();
  }
  