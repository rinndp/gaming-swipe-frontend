import React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { AppColors } from '../theme/AppTheme';
import { useTheme } from '../provider/ThemeProvider';

export const CustomText = ({ children, ...props }: TextProps) => {
    const { colors } = useTheme();
    return (
        <RNText {...props} allowFontScaling={false} style={[{ color: colors.white }, props.style]}>
            {children}
        </RNText>
    );
};

// Export as Text for easy replacement
export const Text = CustomText;
export default CustomText;