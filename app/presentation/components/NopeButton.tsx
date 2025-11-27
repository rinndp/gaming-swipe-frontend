import {Image, TouchableOpacity,StyleSheet} from "react-native";
import {AppColors} from "../theme/AppTheme";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import {Shadow} from "react-native-shadow-2";


interface Props {
    onPress: () => void;
}

export const NopeButton=({onPress}:Props)=>{
    return (
        <Shadow startColor={"rgba(255,4,4,0.08)"}>
            <TouchableOpacity style={stylesNopeButton.cont} onPress={onPress}>
                <Image source={require("../../../assets/circle-icon.png")} style={stylesNopeButton.nopeButton}></Image>
            </TouchableOpacity>
        </Shadow>
    )
}

export const stylesNopeButton = StyleSheet.create({
    nopeButton:{
        height:hp("3%"),
        width:hp("3%"),
        tintColor:AppColors.nope,
    },
    cont:{
        backgroundColor:AppColors.buttonBackground,
        borderRadius:40,
        height:hp("7%"),
        width:hp("7%"),
        alignItems:"center",
        justifyContent:"center",
        elevation: 20,
    }
});
