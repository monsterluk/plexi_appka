import React, { useState } from 'react';
import styles from './CustomerForm.module.css';

export interface CustomerData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  nip?: string;
  address?: string;
  notes?: string;
}

interface CustomerFormProps {
  onSubmit: (data: CustomerData) => void;
  initialData?: Partial<CustomerData>;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<CustomerData>({
    companyName: initialData?.companyName || '',
    contactPerson: initialData?.contactPerson || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    nip: initialData?.nip || '',
    address: initialData?.address || '',
    notes: initialData?.notes || ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerData, string>> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Nazwa firmy jest wymagana';
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Osoba kontaktowa jest wymagana';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email jest wymagany';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Nieprawidłowy format email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon jest wymagany';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Nieprawidłowy format telefonu';
    }

    if (formData.nip && !/^\d{10}$/.test(formData.nip.replace(/[\s\-]/g, ''))) {
      newErrors.nip = 'NIP powinien zawierać 10 cyfr';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof CustomerData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3 className={styles.title}>Dane klienta</h3>
      
      <div className={styles.grid}>
        <div className={styles.field}>
          <label htmlFor="companyName">Nazwa firmy *</label>
          <input
            id="companyName"
            type="text"
            value={formData.companyName}
            onChange={handleChange('companyName')}
            className={errors.companyName ? styles.error : ''}
          />
          {errors.companyName && (
            <span className={styles.errorMessage}>{errors.companyName}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="contactPerson">Osoba kontaktowa *</label>
          <input
            id="contactPerson"
            type="text"
            value={formData.contactPerson}
            onChange={handleChange('contactPerson')}
            className={errors.contactPerson ? styles.error : ''}
          />
          {errors.contactPerson && (
            <span className={styles.errorMessage}>{errors.contactPerson}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            className={errors.email ? styles.error : ''}
          />
          {errors.email && (
            <span className={styles.errorMessage}>{errors.email}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="phone">Telefon *</label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange('phone')}
            className={errors.phone ? styles.error : ''}
          />
          {errors.phone && (
            <span className={styles.errorMessage}>{errors.phone}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="nip">NIP</label>
          <input
            id="nip"
            type="text"
            value={formData.nip}
            onChange={handleChange('nip')}
            className={errors.nip ? styles.error : ''}
            placeholder="0000000000"
          />
          {errors.nip && (
            <span className={styles.errorMessage}>{errors.nip}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="address">Adres</label>
          <input
            id="address"
            type="text"
            value={formData.address}
            onChange={handleChange('address')}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="notes">Uwagi</label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={handleChange('notes')}
          rows={3}
          placeholder="Dodatkowe informacje..."
        />
      </div>

      <button type="submit" className={styles.submitButton}>
        Zapisz dane klienta
      </button>
    </form>
  );
};