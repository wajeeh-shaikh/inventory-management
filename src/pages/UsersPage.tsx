import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, ShieldCheck, Shield } from 'lucide-react';
import { users as mockUsers } from '../data/mockData';
import { User } from '../types';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import Badge from '../components/UI/Badge';
import Modal from '../components/UI/Modal';
import Card from '../components/UI/Card';
import UserForm from '../components/User/UserForm';
import Input from '../components/UI/Input';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleAddUser = () => {
    setIsAddModalOpen(true);
  };
  
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };
  
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };
  
  const createUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username || '',
      password: userData.password || '',
      name: userData.name || '',
      department: userData.department || 'IT',
      isAdmin: userData.isAdmin || false,
      permissions: userData.permissions || ['view'],
      email: userData.email || '',
      createdAt: new Date().toISOString(),
    };
    
    setUsers([...users, newUser]);
    setIsAddModalOpen(false);
  };
  
  const updateUser = (userData: Partial<User>) => {
    if (!selectedUser) return;
    
    setUsers(
      users.map((user) => {
        if (user.id === selectedUser.id) {
          return {
            ...user,
            ...userData,
            password: userData.password?.trim() ? userData.password : user.password,
          };
        }
        return user;
      })
    );
    
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };
  
  const deleteUser = () => {
    if (!selectedUser) return;
    
    setUsers(users.filter((user) => user.id !== selectedUser.id));
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };
  
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    
    const term = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.department.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);
  
  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Username', accessor: 'username' },
    { header: 'Email', accessor: 'email' },
    { header: 'Department', accessor: 'department' },
    {
      header: 'Role',
      accessor: 'isAdmin',
      cell: (value: boolean) => (
        <div className="flex items-center">
          {value ? (
            <>
              <ShieldCheck size={16} className="text-blue-600 mr-1" />
              <span>Administrator</span>
            </>
          ) : (
            <>
              <Shield size={16} className="text-gray-500 mr-1" />
              <span>Employee</span>
            </>
          )}
        </div>
      ),
    },
    {
      header: 'Permissions',
      accessor: 'permissions',
      cell: (permissions: string[]) => (
        <div className="flex flex-wrap gap-1">
          {permissions.map((permission) => (
            <Badge
              key={permission}
              variant={
                permission === 'view'
                  ? 'info'
                  : permission === 'edit'
                  ? 'primary'
                  : permission === 'add'
                  ? 'success'
                  : 'warning'
              }
            >
              {permission}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (_, row: User) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEditUser(row)}
            aria-label="Edit"
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteUser(row)}
            aria-label="Delete"
            disabled={row.isAdmin && row.id === '1'} // Prevent deleting main admin
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage system users and their permissions
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleAddUser}
          className="flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
        </div>
        <Table columns={columns} data={filteredUsers} />
      </Card>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add User"
        size="lg"
      >
        <UserForm
          onSubmit={createUser}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
        size="lg"
      >
        {selectedUser && (
          <UserForm
            user={selectedUser}
            onSubmit={updateUser}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <p>
            Are you sure you want to delete user{' '}
            <span className="font-semibold">{selectedUser?.name}</span>?
          </p>
          <p className="text-sm text-red-600">
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={deleteUser}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;