const BASE_URL = 'http://192.168.1.xx:5000'; // Replace with your local IP or server URL

// export const login = async (email: string, password: string) => {
//   const res = await fetch(`${BASE_URL}/auth/login`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ email, password }),
//   });

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.message || 'Login failed');
//   }

//   return await res.json();
// };
