import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { FormField } from '../common/FormField';
import { Button } from '../common/Button';

const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Human Resources',
  'Finance',
  'Sales',
  'Operations'
];

const INITIAL_FORM_STATE = {
  name: '',
  email: '',
  department: '',
  designation: '',
  status: 'Active'
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EmployeeFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false
}) => {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        department: initialData.department || '',
        designation: initialData.designation || '',
        status: initialData.status || 'Active'
      });
    } else {
      setFormData(INITIAL_FORM_STATE);
    }
    setErrors({});
    setTouched({});
  }, [initialData, isOpen]);

  const validate = (values) => {
    const errs = {};

    if (!values.name || !values.name.trim()) {
      errs.name = 'Full name is required';
    } else if (values.name.trim().length < 2) {
      errs.name = 'Full name must be at least 2 characters';
    }

    if (!values.email || !values.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!EMAIL_REGEX.test(values.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!values.department) {
      errs.department = 'Please select a department';
    }

    if (!values.designation || !values.designation.trim()) {
      errs.designation = 'Designation is required';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    if (touched[name]) {
      const currentErrors = validate(updated);
      setErrors((prev) => ({
        ...prev,
        [name]: currentErrors[name] || undefined
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const currentErrors = validate(formData);
    if (currentErrors[name]) {
      setErrors((prev) => ({ ...prev, [name]: currentErrors[name] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      await onSubmit(formData);
    } catch {
    }
  };

  const inputClass = (hasError) =>
    `w-full px-3 py-2 bg-white border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-all ${
      hasError
        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/20'
        : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
    }`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      title={isEditing ? 'Edit Employee' : 'Add Employee'}
      subtitle={
        isEditing
          ? `Update details for ${initialData?.name || 'employee'}`
          : 'Enter employee details to add to the directory.'
      }
      maxWidth="max-w-lg"
    >
      <div className="relative">
        {isSubmitting && (
          <div className="absolute inset-0 -m-6 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center z-20 rounded-xl">
            <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-2" />
            <span className="text-sm font-medium text-gray-700">
              {isEditing ? 'Saving changes...' : 'Adding employee...'}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormField
            label="Full Name"
            id="name"
            required
            error={touched.name ? errors.name : undefined}
          >
            <input
              id="name"
              name="name"
              type="text"
              className={inputClass(Boolean(touched.name && errors.name))}
              placeholder="e.g. Alex Morgan"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
            />
          </FormField>

          <FormField
            label="Email"
            id="email"
            required
            error={touched.email ? errors.email : undefined}
          >
            <input
              id="email"
              name="email"
              type="email"
              className={inputClass(Boolean(touched.email && errors.email))}
              placeholder="e.g. alex.morgan@acme.corp"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
            />
          </FormField>

          <FormField
            label="Department"
            id="department"
            required
            error={touched.department ? errors.department : undefined}
          >
            <select
              id="department"
              name="department"
              className={inputClass(Boolean(touched.department && errors.department))}
              value={formData.department}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Designation"
            id="designation"
            required
            error={touched.designation ? errors.designation : undefined}
          >
            <input
              id="designation"
              name="designation"
              type="text"
              className={inputClass(Boolean(touched.designation && errors.designation))}
              placeholder="e.g. Frontend Engineer"
              value={formData.designation}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
            />
          </FormField>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  formData.status === 'Active'
                    ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={formData.status === 'Active'}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-gray-900">Active</span>
              </label>

              <label
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  formData.status === 'Inactive'
                    ? 'border-gray-500 bg-gray-50 ring-1 ring-gray-400'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={formData.status === 'Inactive'}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-4 h-4 text-gray-600 focus:ring-gray-500"
                />
                <span className="text-sm font-medium text-gray-900">Inactive</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
            >
              {isSubmitting
                ? (isEditing ? 'Saving...' : 'Adding...')
                : (isEditing ? 'Save Changes' : 'Add Employee')}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
