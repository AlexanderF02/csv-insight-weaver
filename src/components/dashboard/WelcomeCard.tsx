
import { useState, useEffect } from 'react';
import { DataItem } from '@/types';

interface WelcomeCardProps {
  data: DataItem[];
}

const WelcomeCard = ({ data }: WelcomeCardProps) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [uniqueCompanies, setUniqueCompanies] = useState(0);

  useEffect(() => {
    if (data && data.length > 0) {
      // Calculate total amount - look for common field names that might contain amount data
      const amountKeys = ['totalbelopp', 'amount', 'total', 'value', 'sum'];
      let amountKey = '';
      
      // Find the first key that exists in the data
      for (const key of amountKeys) {
        if (data[0][key] !== undefined) {
          amountKey = key;
          break;
        }
      }
      
      // Calculate totals
      if (amountKey) {
        const total = data.reduce((sum, item) => {
          const value = parseFloat(String(item[amountKey]));
          return sum + (isNaN(value) ? 0 : value);
        }, 0);
        setTotalAmount(total);
      }
      
      // Count total invoices
      setTotalInvoices(data.length);
      
      // Count unique companies
      const companyKeys = ['mottagare', 'company', 'recipient', 'customer'];
      let companyKey = '';
      
      for (const key of companyKeys) {
        if (data[0][key] !== undefined) {
          companyKey = key;
          break;
        }
      }
      
      if (companyKey) {
        const companies = new Set(data.map(item => String(item[companyKey])));
        setUniqueCompanies(companies.size);
      }
    }
  }, [data]);

  return (
    <div className="bg-teal-600 rounded-lg p-6 text-white">
      <div className="flex items-start">
        <div className="mr-6">
          <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold">e</span>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-1">Welcome!</h2>
          <p className="text-teal-100 mb-6">To your dashboard</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6 mt-4">
        <div>
          <div className="text-2xl font-bold mb-1">
            {totalAmount.toLocaleString()} SEK
          </div>
          <div className="text-sm text-teal-200">Total Amount</div>
        </div>
        <div>
          <div className="text-2xl font-bold mb-1">{totalInvoices}</div>
          <div className="text-sm text-teal-200">Invoices</div>
        </div>
        <div>
          <div className="text-2xl font-bold mb-1">{uniqueCompanies}</div>
          <div className="text-sm text-teal-200">Unique Companies</div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
