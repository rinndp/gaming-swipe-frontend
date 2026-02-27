import stylesHome from "../views/home/StyleHome";
import {ActivityIndicator, View} from "react-native";
import styleHome from "../views/home/StyleHome";
import React from "react";
import {AppColors} from "../theme/AppTheme";
import { useTheme } from "../provider/ThemeProvider";

interface Props {
    showLoading: boolean;
}

export const ActivtyIndicatorCustom = ({showLoading}: Props) => {
    const { colors } = useTheme();
    return (
        <View style={stylesHome(colors).loadingIconContainer}>
            <ActivityIndicator style={stylesHome(colors).loading} size="small" color={colors.white} animating={showLoading} />
        </View>
    )
}