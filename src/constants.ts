import { Service } from './types';

export const SERVICES: Service[] = [
  {
    id: 'bank-report',
    name: 'Bank Project Report',
    description: 'Professional project reports for bank loan applications.',
    price: 1500,
    icon: 'FileText',
    fields: [
      { name: 'businessName', label: 'Business Name', type: 'text', required: true },
      { name: 'promoterName', label: 'Promoter Name', type: 'text', required: true },
      { name: 'sector', label: 'Industry/Sector', type: 'text', required: true },
      { name: 'businessType', label: 'Business Type (Manufacturing/Service/Trading)', type: 'text', required: true },
      { name: 'location', label: 'Location', type: 'text', required: true },
      { name: 'totalProjectCost', label: 'Total Project Cost (₹)', type: 'number', required: true },
      { name: 'equity', label: 'Promoter Contribution (Equity) (₹)', type: 'number', required: true },
      { name: 'loanAmount', label: 'Bank Loan Amount (₹)', type: 'number', required: true },
      { name: 'productsServicesDescription', label: 'Products/Services Description', type: 'text', required: true },
      { name: 'capacity', label: 'Production/Service Capacity', type: 'text', required: true },
      { name: 'sellingPrice', label: 'Expected Selling Price per Unit (₹)', type: 'number', required: true },
      { name: 'salesVolume', label: 'Estimated Monthly/Annual Sales Volume', type: 'text', required: true },
      { name: 'rawMaterialCost', label: 'Raw Material Cost (₹)', type: 'number', required: true },
      { name: 'operatingExpenses', label: 'Operating Expenses (Monthly) (₹)', type: 'number', required: true },
      { name: 'employeeCost', label: 'Employee Details & Salaries (₹)', type: 'text', required: true },
      { name: 'interestRate', label: 'Loan Interest Rate (%)', type: 'number', required: true },
      { name: 'tenureYears', label: 'Loan Tenure (Years)', type: 'number', required: true },
      { name: 'customAssumptions', label: 'Custom Assumptions (Optional)', type: 'text', required: false },
    ]
  },
  {
    id: 'udyam',
    name: 'UDYAM Registration',
    description: 'MSME registration for small and medium enterprises.',
    price: 500,
    icon: 'Briefcase',
    fields: [
      { name: 'aadhaarNumber', label: 'Aadhaar Number', type: 'text', required: true },
      { name: 'panNumber', label: 'PAN Number', type: 'text', required: true },
      { name: 'mobileNumber', label: 'Mobile Number', type: 'tel', required: true },
    ]
  },
  {
    id: 'vehicle-extract',
    name: 'Vehicle B Extract',
    description: 'Get detailed vehicle information and history.',
    price: 300,
    icon: 'Car',
    fields: [
      { name: 'vehicleNumber', label: 'Vehicle Registration Number', type: 'text', required: true },
      { name: 'chassisNumber', label: 'Chassis Number (Last 5 digits)', type: 'text', required: true },
    ]
  },
  {
    id: 'pan-card',
    name: 'PAN Card Registration',
    description: 'New PAN card application or correction.',
    price: 250,
    icon: 'CreditCard',
    fields: [
      { name: 'fullName', label: 'Full Name', type: 'text', required: true },
      { name: 'dob', label: 'Date of Birth', type: 'text', required: true },
      { name: 'fatherName', label: 'Father\'s Name', type: 'text', required: true },
    ]
  },
  {
    id: 'fssai',
    name: 'FSSAI License',
    description: 'Food safety license for food-related businesses.',
    price: 2000,
    icon: 'Utensils',
    fields: [
      { name: 'businessName', label: 'Business Name', type: 'text', required: true },
      { name: 'foodCategory', label: 'Food Category', type: 'text', required: true },
      { name: 'address', label: 'Premises Address', type: 'text', required: true },
    ]
  },
  {
    id: 'gst-reg',
    name: 'GST Registration',
    description: 'New GST registration for businesses.',
    price: 1000,
    icon: 'FileCheck',
    fields: [
      { name: 'businessName', label: 'Business Name', type: 'text', required: true },
      { name: 'panNumber', label: 'PAN Number', type: 'text', required: true },
      { name: 'businessNature', label: 'Nature of Business', type: 'text', required: true },
    ]
  },
  {
    id: 'gst-filing',
    name: 'GST Filing',
    description: 'Monthly or quarterly GST return filing.',
    price: 750,
    icon: 'ClipboardList',
    fields: [
      { name: 'gstin', label: 'GSTIN', type: 'text', required: true },
      { name: 'period', label: 'Filing Period', type: 'text', required: true },
    ]
  },
  {
    id: 'loan-app',
    name: 'Loan Application',
    description: 'Apply for various types of loans.',
    price: 0,
    icon: 'Banknote',
    fields: [
      { name: 'loanType', label: 'Loan Type', type: 'text', required: true },
      { name: 'amount', label: 'Loan Amount', type: 'number', required: true },
      { name: 'income', label: 'Annual Income', type: 'number', required: true },
    ]
  }
];
