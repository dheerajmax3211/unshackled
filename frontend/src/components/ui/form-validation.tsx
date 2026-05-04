"use client";

import React, { useState, useCallback, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ValidationState = "idle" | "valid" | "invalid" | "warning";

interface ValidationResult {
  state: ValidationState;
  message?: string;
  icon?: ReactNode;
}

interface UseFormFieldProps {
  initialValue?: string;
  validate?: (value: string) => ValidationResult;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export function useFormField({
  initialValue = "",
  validate,
  validateOnChange = false,
  validateOnBlur = true,
}: UseFormFieldProps = {}) {
  const [value, setValue] = useState(initialValue);
  const [validation, setValidation] = useState<ValidationResult>({ state: "idle" });
  const [touched, setTouched] = useState(false);

  const validateValue = useCallback(
    (val: string): ValidationResult => {
      if (!validate) return { state: "idle" };
      return validate(val);
    },
    [validate]
  );

  const handleChange = useCallback(
    (newValue: string) => {
      setValue(newValue);
      if (validateOnChange && touched) {
        setValidation(validateValue(newValue));
      }
    },
    [validateOnChange, touched, validateValue]
  );

  const handleBlur = useCallback(() => {
    setTouched(true);
    if (validateOnBlur) {
      setValidation(validateValue(value));
    }
  }, [validateOnBlur, validateValue, value]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setValidation({ state: "idle" });
    setTouched(false);
  }, [initialValue]);

  return {
    value,
    setValue: handleChange,
    validation,
    touched,
    handleBlur,
    reset,
    isValid: validation.state === "valid",
    isInvalid: validation.state === "invalid",
  };
}

interface FormFieldProps {
  children: (props: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur: () => void;
    invalid: boolean;
    valid: boolean;
  }) => ReactNode;
  validate?: (value: string) => ValidationResult;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  className?: string;
}

export function FormField({
  children,
  validate,
  validateOnChange = false,
  validateOnBlur = true,
  className,
}: FormFieldProps) {
  const [value, setValue] = useState("");
  const [validation, setValidation] = useState<ValidationResult>({ state: "idle" });
  const [touched, setTouched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (validateOnChange && touched && validate) {
      setValidation(validate(newValue));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    if (validateOnBlur && validate) {
      setValidation(validate(value));
    }
  };

  return (
    <div className={cn("relative", className)}>
      {children({
        value,
        onChange: handleChange,
        onBlur: handleBlur,
        invalid: touched && validation.state === "invalid",
        valid: touched && validation.state === "valid",
      })}
      <ValidationFeedback validation={validation} show={touched} />
    </div>
  );
}

interface ValidationFeedbackProps {
  validation: ValidationResult;
  show: boolean;
  className?: string;
}

export function ValidationFeedback({
  validation,
  show,
  className,
}: ValidationFeedbackProps) {
  if (!show) return null;

  const icons = {
    valid: <CheckCircle className="w-4 h-4 text-brand-green" />,
    invalid: <XCircle className="w-4 h-4 text-brand-rose" />,
    warning: <AlertCircle className="w-4 h-4 text-brand-amber" />,
    idle: null,
  };

  const colors = {
    valid: "text-brand-green",
    invalid: "text-brand-rose",
    warning: "text-brand-amber",
    idle: "text-text-muted",
  };

  return (
    <AnimatePresence mode="wait">
      {validation.state !== "idle" && (
        <motion.div
          initial={{ opacity: 0, y: -5, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -5, height: 0 }}
          className={cn("flex items-center gap-1.5 mt-1.5", colors[validation.state], className)}
        >
          {icons[validation.state]}
          {validation.message && (
            <span className="text-caption">{validation.message}</span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  validation?: ValidationResult;
  showPasswordToggle?: boolean;
  isLoading?: boolean;
  error?: string;
  hint?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ validation, showPasswordToggle, isLoading, error, hint, className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = type === "password" && showPassword ? "text" : type;
    const showError = !!error || validation?.state === "invalid";
    const showSuccess = validation?.state === "valid";

    return (
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          className={cn(
            "w-full bg-white/[0.04] border rounded-lg px-4 py-3 text-body-sm text-text-primary",
            "placeholder:text-text-subtle",
            "focus:outline-none focus:ring-2 focus:ring-brand-amber/30 focus:border-brand-amber/50",
            "transition-all duration-300",
            showError && "border-brand-rose/50 bg-brand-rose/5",
            showSuccess && "border-brand-green/50 bg-brand-green/5",
            !showError && !showSuccess && "border-white/[0.08]",
            isLoading && "pr-10",
            className
          )}
          {...props}
        />

        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-4 h-4 text-text-muted animate-spin" />
          </div>
        )}

        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}

        {(showError || showSuccess) && !isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {showError ? (
              <XCircle className="w-4 h-4 text-brand-rose" />
            ) : (
              <CheckCircle className="w-4 h-4 text-brand-green" />
            )}
          </div>
        )}

        {(error || validation?.message || hint) && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "text-caption mt-1.5",
              showError ? "text-brand-rose" : "text-text-muted"
            )}
          >
            {error || validation?.message || hint}
          </motion.p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";