import React from 'react';
import { Button } from '../common/Button';

export const Navbar = ({ onAddEmployee }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900 tracking-tight">
          Employee Management System
        </h1>

        <Button
          variant="primary"
          onClick={onAddEmployee}
          id="btn-add-employee-top"
        >
          Add Employee
        </Button>
      </div>
    </header>
  );
};
