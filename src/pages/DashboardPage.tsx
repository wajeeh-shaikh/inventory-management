import React, { useMemo } from 'react';
import { Activity, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { useAuth } from '../context/AuthContext';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import { departmentSummaries } from '../data/mockData';
import { DepartmentSummary } from '../types';

const StatsCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: string;
}> = ({ title, value, icon, trend, trendValue, color = 'bg-blue-500' }) => {
  return (
    <Card className="h-full">
      <div className="flex items-center">
        <div className={`${color} p-3 rounded-md`}>
          {icon}
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-center">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {trend && (
              <span className="ml-2 flex items-center text-sm font-medium">
                {trend === 'up' ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">{trendValue}</span>
                  </>
                ) : trend === 'down' ? (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-red-600">{trendValue}</span>
                  </>
                ) : (
                  <span className="text-gray-500">{trendValue}</span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

const DashboardPage: React.FC = () => {
  const { inventoryItems } = useInventory();
  const { currentUser } = useAuth();
  
  const departmentItems = useMemo(() => {
    if (currentUser?.isAdmin) {
      return inventoryItems;
    }
    return currentUser
      ? inventoryItems.filter(item => item.department === currentUser.department)
      : [];
  }, [inventoryItems, currentUser]);
  
  const lowStockItems = useMemo(() => {
    return departmentItems.filter(item => item.status === 'low');
  }, [departmentItems]);
  
  const outOfStockItems = useMemo(() => {
    return departmentItems.filter(item => item.status === 'out-of-stock');
  }, [departmentItems]);
  
  const departmentSummary = useMemo((): DepartmentSummary | undefined => {
    if (!currentUser) return undefined;
    
    if (currentUser.isAdmin) {
      return {
        department: 'IT', 
        totalItems: inventoryItems.length,
        availableItems: inventoryItems.filter(item => item.status === 'available').length,
        lowStockItems: inventoryItems.filter(item => item.status === 'low').length,
        outOfStockItems: inventoryItems.filter(item => item.status === 'out-of-stock').length,
      };
    }
    
    return departmentSummaries.find(
      summary => summary.department === currentUser.department
    );
  }, [currentUser, inventoryItems]);
  
  const recentItems = useMemo(() => {
    return [...departmentItems]
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, 5);
  }, [departmentItems]);

  if (!currentUser || !departmentSummary) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {currentUser.isAdmin ? 'System Overview' : `${currentUser.department} Department Dashboard`}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Items"
          value={departmentSummary.totalItems}
          icon={<Activity className="h-6 w-6 text-white" />}
          trend="up"
          trendValue="4% from last month"
          color="bg-blue-500"
        />
        <StatsCard
          title="Available Items"
          value={departmentSummary.availableItems}
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          trend="neutral"
          trendValue="No change"
          color="bg-green-500"
        />
        <StatsCard
          title="Low Stock Items"
          value={departmentSummary.lowStockItems}
          icon={<AlertTriangle className="h-6 w-6 text-white" />}
          trend="up"
          trendValue="2 new items"
          color="bg-amber-500"
        />
        <StatsCard
          title="Out of Stock"
          value={departmentSummary.outOfStockItems}
          icon={<TrendingDown className="h-6 w-6 text-white" />}
          trend="down"
          trendValue="3 less than last week"
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Activity">
          <div className="space-y-4">
            {recentItems.length > 0 ? (
              recentItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.description.length > 60
                        ? `${item.description.substring(0, 60)}...`
                        : item.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge
                      variant={
                        item.status === 'available'
                          ? 'success'
                          : item.status === 'low'
                          ? 'warning'
                          : 'danger'
                      }
                    >
                      {item.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(item.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No recent items found.</p>
            )}
          </div>
        </Card>

        <Card title="Inventory Alerts">
          {lowStockItems.length === 0 && outOfStockItems.length === 0 ? (
            <p className="text-gray-500">No alerts at this time.</p>
          ) : (
            <div className="space-y-4">
              {outOfStockItems.map((item) => (
                <div key={item.id} className="flex items-center p-3 bg-red-50 rounded-md">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                  <div>
                    <p className="font-medium text-red-800">Out of Stock: {item.name}</p>
                    <p className="text-sm text-red-700">
                      Location: {item.location}
                    </p>
                  </div>
                </div>
              ))}
              
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center p-3 bg-amber-50 rounded-md">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-3" />
                  <div>
                    <p className="font-medium text-amber-800">
                      Low Stock: {item.name} (Qty: {item.quantity})
                    </p>
                    <p className="text-sm text-amber-700">
                      Location: {item.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;