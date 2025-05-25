import React, { useMemo } from 'react';
import { PieChart, BarChart, Container as ChartContainer, BarChart as ChartLegend, BarChart as ChartTitle, BarChart as ChartTooltip, FilePenLine as LinePlot, LandPlot as AreaPlot } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { useAuth } from '../context/AuthContext';
import Card from '../components/UI/Card';

const AnalyticsPage: React.FC = () => {
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

  const statusCounts = useMemo(() => {
    const counts = {
      available: 0,
      low: 0,
      'out-of-stock': 0,
    };
    
    departmentItems.forEach(item => {
      counts[item.status]++;
    });
    
    return counts;
  }, [departmentItems]);
  
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    departmentItems.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [departmentItems]);
  
  const departmentDistribution = useMemo(() => {
    if (!currentUser?.isAdmin) return [];
    
    const counts: Record<string, number> = {};
    
    inventoryItems.forEach(item => {
      counts[item.department] = (counts[item.department] || 0) + 1;
    });
    
    return Object.entries(counts);
  }, [inventoryItems, currentUser]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          {currentUser?.isAdmin 
            ? 'System-wide inventory statistics and analytics' 
            : `${currentUser?.department} department inventory analytics`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Inventory Status">
          <div className="h-64 flex items-center justify-center">
            <div className="w-48 h-48 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full overflow-hidden flex">
                  <div 
                    className="bg-green-500 h-48" 
                    style={{ 
                      width: `${(statusCounts.available / departmentItems.length) * 48}px` 
                    }} 
                  />
                  <div 
                    className="bg-amber-500 h-48" 
                    style={{ 
                      width: `${(statusCounts.low / departmentItems.length) * 48}px` 
                    }} 
                  />
                  <div 
                    className="bg-red-500 h-48" 
                    style={{ 
                      width: `${(statusCounts['out-of-stock'] / departmentItems.length) * 48}px` 
                    }} 
                  />
                </div>
              </div>
              <PieChart className="w-full h-full text-gray-300" />
            </div>
          </div>
          <div className="flex justify-center mt-4 space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Available ({statusCounts.available})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Low Stock ({statusCounts.low})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Out of Stock ({statusCounts['out-of-stock']})</span>
            </div>
          </div>
        </Card>

        <Card title="Top Categories">
          <div className="h-64 flex items-center justify-center">
            <div className="w-full h-48 relative">
              <div className="absolute inset-0 flex flex-col justify-end space-y-2">
                {categoryCounts.map(([category, count], index) => (
                  <div key={category} className="flex items-center">
                    <span className="text-xs w-24 truncate">{category}</span>
                    <div className="h-6 bg-blue-500 rounded" style={{ 
                      width: `${(count / departmentItems.length) * 100}%`,
                      opacity: 1 - (index * 0.15)
                    }}></div>
                    <span className="ml-2 text-xs">{count}</span>
                  </div>
                ))}
              </div>
              <BarChart className="w-full h-full text-gray-300" />
            </div>
          </div>
        </Card>

        {currentUser?.isAdmin && (
          <Card title="Department Distribution" className="lg:col-span-2">
            <div className="h-64 flex items-center justify-center">
              <div className="w-full h-48 relative">
                <div className="absolute inset-0 flex justify-around items-end">
                  {departmentDistribution.map(([department, count]) => (
                    <div key={department} className="flex flex-col items-center">
                      <div 
                        className="w-16 bg-blue-600 rounded-t" 
                        style={{ 
                          height: `${(count / inventoryItems.length) * 100}%`,
                          opacity: department === 'IT' ? 1 : department === 'HR' ? 0.9 : department === 'Sales' ? 0.8 : department === 'Support' ? 0.7 : department === 'Clerks' ? 0.6 : 0.5
                        }}
                      ></div>
                      <span className="mt-2 text-xs font-medium">{department}</span>
                      <span className="text-xs text-gray-500">{count} items</span>
                    </div>
                  ))}
                </div>
                <ChartContainer className="w-full h-full text-gray-300" />
              </div>
            </div>
          </Card>
        )}

        <Card title="Monthly Inventory Trends" className={currentUser?.isAdmin ? '' : 'lg:col-span-2'}>
          <div className="h-64 flex items-center justify-center">
            <div className="w-full h-48 relative">
              <div className="absolute inset-0 flex items-end">
                <div className="w-full h-full flex items-end">
                  <svg viewBox="0 0 100 50" className="w-full h-full">
                    <path 
                      d="M0,50 L10,45 L20,47 L30,40 L40,38 L50,35 L60,30 L70,28 L80,25 L90,20 L100,15" 
                      fill="none" 
                      stroke="#3b82f6" 
                      strokeWidth="2"
                    />
                    <path 
                      d="M0,50 L10,45 L20,47 L30,40 L40,38 L50,35 L60,30 L70,28 L80,25 L90,20 L100,15 L100,50 L0,50" 
                      fill="rgba(59, 130, 246, 0.1)" 
                    />
                  </svg>
                </div>
              </div>
              <LinePlot className="w-full h-full text-gray-300" />
            </div>
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-500">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;