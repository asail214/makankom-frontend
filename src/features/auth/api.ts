import api from '../../shared/api/api';

type Role = 'customer' | 'organizer' | 'admin' | 'scan-point';

export async function login(role: Role, payload: { email: string; password: string }) {
  const url = `/${role}/login`;
  const { data } = await api.post(url, payload);
  return data.data; // { user, token }
}

export async function logout(role: Role) {
  await api.post(`/${role}/logout`);
}

export async function registerCustomer(payload: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female';
}) {
  const { data } = await api.post('/customer/register', payload);
  return data.data;
}

export async function registerOrganizer(payload: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  type: 'individual' | 'company' | 'government' | 'ngo';
  phone?: string;
  cr_number?: string;
}) {
  const { data } = await api.post('/organizer/register', payload);
  return data.data;
}