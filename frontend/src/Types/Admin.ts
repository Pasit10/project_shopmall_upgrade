type Admin = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
};

export default Admin;
