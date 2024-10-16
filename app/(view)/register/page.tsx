'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Role, User } from '@prisma/client';
import { TextInput, Select, Button, Alert, Label, Table, Pagination } from 'flowbite-react';
import { Edit, Trash } from 'lucide-react';

export default function RegisterForm() {
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
  }>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: Role.GESTIONNAIRE,
  });
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [isEditing, setIsEditing] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(isEditing ? `/api/users/${editUserId}` : '/api/users', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editUserId, // Assurez-vous que l'ID est inclus dans le corps de la requête
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
        }),
      });

      if (res.ok) {
        router.push('/');
        fetchUsers();
        setIsEditing(false);
        setEditUserId(null);
        setFormData({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          role: Role.GESTIONNAIRE,
        });
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (error) {
      console.error('An unexpected error happened:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleEdit = (user: User) => {
    setFormData({
      email: user.email,
      password: '',
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as Role,
    });
    setIsEditing(true);
    setEditUserId(user.id);
  };

  const handleDelete = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchUsers();
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      setError('Failed to delete user');
    }
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const onPageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 bg-gray-100">
      <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md">
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 text-center">
          {isEditing ? 'Modifier l\'utilisateur' : 'Enregistrement d\'utilisateur'}
        </h5>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="email" value="Adresse e-mail" className="text-sm font-medium" />
            <TextInput
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nom@entreprise.com"
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="firstName" value="Prénom" className="text-sm font-medium" />
              <TextInput
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="lastName" value="Nom" className="text-sm font-medium" />
              <TextInput
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="password" value="Mot de passe" className="text-sm font-medium" />
            <TextInput
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="role" value="Rôle" className="text-sm font-medium" />
            <Select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              {Object.values(Role).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit" className="mt-4">{isEditing ? 'Modifier' : 'Enregistrer'}</Button>
          {error && <Alert color="failure" className="mt-4 text-sm">{error}</Alert>}
        </form>
      </div>

      <div className="w-full md:w-1/2">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Nom</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Rôle</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {currentUsers.map((user) => (
              <Table.Row key={user.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>{user.role}</Table.Cell>
                <Table.Cell className="flex gap-2">
                  <Button size="xs" className="bg-transparent hover:bg-transparent" onClick={() => handleEdit(user)}>
                    <Edit className="h-4 w-4 text-black" />
                  </Button>
                  <Button size="xs" color="failure" className="bg-transparent hover:bg-transparent" onClick={() => handleDelete(user.id)}>
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        {totalPages > 1 && (
          <div className="flex overflow-x-auto sm:justify-center mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              showIcons
            />
          </div>
        )}
      </div>
    </div>
  );
}
