import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SIZES } from '../constants';

const Button = ({
  title,
  onPress,
  variant = 'primary', // primary, secondary, outline, ghost
  size = 'medium', // small, medium, large
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  ...props
}) => {
  const buttonStyles = [
    styles.button,
    styles[variant],
    styles[`size_${size}`],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.textDisabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? COLORS.white : COLORS.primary} />
      ) : (
        <>
          {icon && icon}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    gap: 8,
  },
  // Variants
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.gray[200],
  },
  outline: {
    backgroundColor: COLORS.transparent,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
  },
  ghost: {
    backgroundColor: COLORS.transparent,
  },
  disabled: {
    opacity: 0.5,
  },
  // Sizes
  size_small: {
    height: 40,
    paddingHorizontal: 12,
  },
  size_medium: {
    height: 48,
    paddingHorizontal: 16,
  },
  size_large: {
    height: 56,
    paddingHorizontal: 20,
  },
  // Text styles
  text: {
    fontWeight: 'bold',
  },
  text_primary: {
    color: COLORS.white,
  },
  text_secondary: {
    color: COLORS.gray[800],
  },
  text_outline: {
    color: COLORS.gray[800],
  },
  text_ghost: {
    color: COLORS.gray[500],
  },
  text_small: {
    fontSize: SIZES.body3,
  },
  text_medium: {
    fontSize: SIZES.body2,
  },
  text_large: {
    fontSize: SIZES.body1,
  },
  textDisabled: {
    opacity: 0.7,
  },
});

export default Button;

