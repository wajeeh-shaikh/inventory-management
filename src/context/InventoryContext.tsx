import React, { createContext, useContext, useState, useEffect } from 'react';
import { InventoryItem, Department } from '../types';
import { inventoryItems as mockInventoryItems } from '../data/mockData';

interface InventoryContextType {
  inventoryItems: InventoryItem[];
  addItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
  updateItem: (id: string, updatedItem: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  getItemsByDepartment: (department: Department) => InventoryItem[];
  getItemById: (id: string) => InventoryItem | undefined;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(mockInventoryItems);

  useEffect(() => {
    setInventoryItems(mockInventoryItems);
  }, []);

  const addItem = (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString(),
      status: item.quantity > 5 ? 'available' : item.quantity > 0 ? 'low' : 'out-of-stock',
    };
    setInventoryItems([...inventoryItems, newItem]);
  };

  const updateItem = (id: string, updatedItem: Partial<InventoryItem>) => {
    setInventoryItems(
      inventoryItems.map((item) => {
        if (item.id === id) {
          const updatedQuantity = updatedItem.quantity !== undefined ? updatedItem.quantity : item.quantity;
          const status = updatedQuantity > 5 ? 'available' : updatedQuantity > 0 ? 'low' : 'out-of-stock';
          
          return {
            ...item,
            ...updatedItem,
            status,
            lastUpdated: new Date().toISOString(),
          };
        }
        return item;
      })
    );
  };

  const deleteItem = (id: string) => {
    setInventoryItems(inventoryItems.filter((item) => item.id !== id));
  };

  const getItemsByDepartment = (department: Department) => {
    return inventoryItems.filter((item) => item.department === department);
  };

  const getItemById = (id: string) => {
    return inventoryItems.find((item) => item.id === id);
  };

  return (
    <InventoryContext.Provider
      value={{
        inventoryItems,
        addItem,
        updateItem,
        deleteItem,
        getItemsByDepartment,
        getItemById,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};