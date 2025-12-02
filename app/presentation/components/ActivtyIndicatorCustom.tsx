import stylesHome from "../views/home/StyleHome";
import {ActivityIndicator, View} from "react-native";
import styleHome from "../views/home/StyleHome";
import React from "react";
import {AppColors} from "../theme/AppTheme";

interface Props {
    showLoading: boolean;
}

export const ActivtyIndicatorCustom = ({showLoading}: Props) => {
    return (
        <View style={stylesHome.loadingIconContainer}>
            <ActivityIndicator style={styleHome.loading} size="small" color={AppColors.white} animating={showLoading} />
        </View>
    )
}