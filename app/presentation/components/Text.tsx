import React from 'react';
import { Text as RNText, TextProps } from 'react-native';

export const CustomText = ({ children, ...props }: TextProps) => {
    return (
        <RNText {...props} allowFontScaling={false}>
            {children}
        </RNText>
    );
};

// Export as Text for easy replacement
export const Text = CustomText;
export default CustomText;