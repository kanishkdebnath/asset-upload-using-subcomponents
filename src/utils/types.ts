type ValidationRule<T> = {
  value: T;
  errorMessage: string;
};

export type ValidationObject = {
  maxSize: ValidationRule<number>;
  accepted: ValidationRule<string[]>;
  customValidation?: (files: File[] | File | string[]) => string | undefined;
};