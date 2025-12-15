import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../constants';
import { Ionicons } from '@expo/vector-icons';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  error,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  labelColor,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle, labelColor && { color: labelColor }]}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            error && styles.inputError,
            (secureTextEntry || rightIcon) && styles.inputWithIcon,
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray[400] || '#A0AEC0'}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          maxLength={maxLength}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        )}
        {rightIcon && !secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={onRightIconPress}
            activeOpacity={0.7}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {maxLength && (
        <Text style={styles.charCount}>
          {value?.length || 0}/{maxLength}
        </Text>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.padding,
  },
  label: {
    fontSize: SIZES.body1 || 16,
    fontWeight: '600',
    color: COLORS.textLight || '#F0F0F0',
    marginBottom: 8,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    height: 56,
    backgroundColor: 'rgba(148, 163, 184, 0.05)', // Semi-transparent for better dark mode
    borderWidth: 1,
    borderColor: COLORS.gray[700] || 'rgba(148, 163, 184, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 16, // Better vertical alignment for text
    fontSize: SIZES.body1 || 16,
    color: COLORS.textLight || '#F0F0F0',
  },
  inputWithIcon: {
    paddingRight: 56,
  },
  multilineInput: {
    height: 120,
    paddingTop: 16, // Consistent top padding
    paddingBottom: 16,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  rightIconContainer: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  charCount: {
    fontSize: SIZES.body3,
    color: COLORS.gray[400],
    textAlign: 'right',
    marginTop: 4,
  },
  errorText: {
    fontSize: SIZES.body3,
    color: '#ef4444',
    marginTop: 4,
  },
});

export default Input;

