import React from "react";

/**
 * Props for the CustomInput component.
 */
export interface CustomInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * The type of the input field.
   */
  type: string;

  /**
   * The placeholder text for the input field.
   */
  placeholder?: string;

  /**
   * Boolean to disable the input field.
   */
  disabled?: boolean;

  /**
   * The value of the input field.
   */
  value: string;

  /**
   * The label text for the input field.
   */
  label?: string;

  /**
   * Event handler for the input change.
   */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
