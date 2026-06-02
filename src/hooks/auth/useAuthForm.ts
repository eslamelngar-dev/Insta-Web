"use client";

import { useState, useCallback } from "react";

interface FieldErrors {
  [key: string]: string | undefined;
}

export function useAuthForm<T extends Record<string, string>>(
  initialValues: T,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const setValue = useCallback((field: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field as string];
      return next;
    });
    setGeneralError(null);
  }, []);

  const markTouched = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
    setGeneralError(null);
  }, []);

  const getFieldProps = useCallback(
    (field: keyof T) => ({
      value: values[field],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setValue(field, e.target.value),
      onBlur: () => markTouched(field as string),
    }),
    [values, setValue, markTouched],
  );

  return {
    values,
    errors,
    touched,
    loading,
    generalError,
    setValue,
    setErrors,
    setLoading,
    setGeneralError,
    markTouched,
    clearErrors,
    getFieldProps,
  };
}
