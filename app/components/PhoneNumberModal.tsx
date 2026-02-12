'use client';

import { useState } from 'react';
import styles from './PhoneNumberModal.module.css';

interface PhoneNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phoneNumber: string) => Promise<void>;
  isLoading?: boolean;
}

export function PhoneNumberModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: PhoneNumberModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number');
      return;
    }

    if (!/^\d{10,15}$/.test(phoneNumber.replace(/[^\d]/g, ''))) {
      setError('Please enter a valid phone number (10-15 digits)');
      return;
    }

    try {
      await onSubmit(phoneNumber);
      setPhoneNumber('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to submit enquiry'
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Send Enquiry</h2>
          <button
            onClick={onClose}
            className={styles.closeBtn}
            aria-label="Close modal"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setError('');
              }}
              disabled={isLoading}
              className={error ? styles.inputError : ''}
            />
            {error && <span className={styles.error}>{error}</span>}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Send Enquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
