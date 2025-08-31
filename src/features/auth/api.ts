import api from '../../shared/api/api';
type Role = 'customer'|'organizer'|'admin'|'scan-point';

export async function login(role: Role, payload: {email:string; password:string}) {
  const url = `/${role}/login`;
  const { data } = await api.post(url, payload);
  return data.data; // { user, token }
}
export async function logout(role: Role){
  await api.post(`/${role}/logout`);
}
export async function registerCustomer(payload: any){
  const { data } = await api.post('/customer/register', payload);
  return data.data;
}
