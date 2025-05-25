import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Filter } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { useAuth } from '../context/AuthContext';
import { InventoryItem } from '../types';
import Button from '../components/UI/Button';
import Table from '../components/UI/Table';
import Badge from '../components/UI/Badge';
import Modal from '../components/UI/Modal';
import Card from '../components/UI/Card';
import InventoryItemForm from '../components/InventoryItem/InventoryItemForm';
import Select from '../components/UI/Select';
import Input from '../components/UI/Input';

const InventoryPage: React.FC = () => {
  const { inventoryItems, deleteItem } = useInventory();
  const { currentUser } = useAuth();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  const handleAddItem = () => {
    setIsAddModalOpen(true);
  };
  
  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };
  
  const handleDeleteItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (selectedItem) {
      deleteItem(selectedItem.id);
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    }
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStatusFilter('');
    setIsFilterModalOpen(false);
  };
  
  const departmentItems = useMemo(() => {
    if (!currentUser) return [];
    
    let items = currentUser.isAdmin
      ? inventoryItems
      : inventoryItems.filter((item) => item.department === currentUser.department);
      
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term) ||
          item.location.toLowerCase().includes(term)
      );
    }
    
    if (categoryFilter) {
      items = items.filter((item) => item.category === categoryFilter);
    }
    
    if (statusFilter) {
      items = items.filter((item) => item.status === statusFilter);
    }
    
    return items;
  }, [inventoryItems, currentUser, searchTerm, categoryFilter, statusFilter]);
  
  const uniqueCategories = useMemo(() => {
    const categories = new Set(departmentItems.map((item) => item.category));
    return Array.from(categories).map((category) => ({
      value: category,
      label: category,
    }));
  }, [departmentItems]);
  
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'available', label: 'Available' },
    { value: 'low', label: 'Low Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' },
  ];
  
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...uniqueCategories,
  ];
  
  const canEdit = currentUser?.isAdmin || (currentUser?.permissions || []).includes('edit');
  const canAdd = currentUser?.isAdmin || (currentUser?.permissions || []).includes('add');
  const canDelete = currentUser?.isAdmin || (currentUser?.permissions || []).includes('delete');
  
  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Category', accessor: 'category' },
    { header: 'Department', accessor: 'department' },
    { header: 'Quantity', accessor: 'quantity' },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value: string) => {
        const variant =
          value === 'available'
            ? 'success'
            : value === 'low'
            ? 'warning'
            : 'danger';
        return <Badge variant={variant}>{value}</Badge>;
      },
    },
    { header: 'Location', accessor: 'location' },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (_, row: InventoryItem) => (
        <div className="flex space-x-2">
          {canEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleEditItem(row)}
              aria-label="Edit"
            >
              <Edit size={16} />
            </Button>
          )}
          {canDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDeleteItem(row)}
              aria-label="Delete"
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="mt-1 text-sm text-gray-500">
            {currentUser?.isAdmin
              ? 'Manage all department inventory items'
              : `Manage ${currentUser?.department} department inventory items`}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center"
          >
            <Filter size={16} className="mr-2" />
            Filter
          </Button>
          {canAdd && (
            <Button
              variant="primary"
              onClick={handleAddItem}
              className="flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Add Item
            </Button>
          )}
        </div>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
        </div>
        <Table columns={columns} data={departmentItems} />
      </Card>

      {/* Add Item Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Inventory Item"
        size="lg"
      >
        <InventoryItemForm
          onSubmit={() => setIsAddModalOpen(false)}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Inventory Item"
        size="lg"
      >
        {selectedItem && (
          <InventoryItemForm
            item={selectedItem}
            onSubmit={() => setIsEditModalOpen(false)}
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
            Are you sure you want to delete{' '}
            <span className="font-semibold">{selectedItem?.name}</span>?
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
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Filter Modal */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Inventory"
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="Category"
            options={categoryOptions}
            value={categoryFilter}
            onChange={(value) => setCategoryFilter(value)}
            fullWidth
          />
          <Select
            label="Status"
            options={statusOptions}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            fullWidth
          />
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={resetFilters}>
              Reset Filters
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsFilterModalOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InventoryPage;