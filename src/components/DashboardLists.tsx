import React from 'react';
import { DashboardData } from '@/utils/type';
import { Users, Package, Phone, Box, User } from 'lucide-react';

interface ListProps {
  customers: DashboardData['newCustomers'];
  items: DashboardData['newItems'];
}

export const NewCustomersList: React.FC<{ customers: ListProps['customers'] }> = ({ customers }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Customers</h3>
        </div>
        <span className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
          Recent  Customers
        </span>
      </div>
      
      <div className="space-y-4">
        {customers.map((customer) => (
          <div 
            key={customer._id} 
            className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-full">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">{customer.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <p className="text-sm text-gray-500">{customer.mobile}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
                New
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {customers.length === 0 && (
        <div className="text-center py-6">
          <p className="text-gray-500">No new customers yet</p>
        </div>
      )}
    </div>
  );
};

export const NewInventoryList: React.FC<{ items: ListProps['items'] }> = ({ items }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Package className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Inventory</h3>
        </div>
        <span className="bg-purple-50 text-purple-700 text-xs font-medium px-3 py-1 rounded-full">
          Recent Items
        </span>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div 
            key={item._id} 
            className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-full">
                <Box className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <Box className="w-3 h-3 text-gray-400" />
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-gray-500">₹ {item.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                New
              </span>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-6">
          <p className="text-gray-500">No new inventory items</p>
        </div>
      )}
    </div>
  );
};