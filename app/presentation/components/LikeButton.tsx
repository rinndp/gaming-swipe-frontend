import {Image, TouchableOpacity,StyleSheet} from "react-native";
import {AppColors} from "../theme/AppTheme";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import {Shadow} from "react-native-shadow-2";
import { useTheme } from "../theme/ThemeContext";

interface Props {
    onPress: () => void;
}

export const LikeButton=({onPress}: Props)=>{
    const { colors } = useTheme();
    const styleL = stylesLikeButton(colors);
    return (
        <Shadow startColor={"rgba(4,121,255,0.10)"}>
            <TouchableOpacity style={styleL.cont} onPress={onPress}>
                <Image source={require("../../../assets/x-icon.png")} style={styleL.likeButton}></Image>
            </TouchableOpacity>
        </Shadow>
    )
}

export const stylesLikeButton = (colors: any) => StyleSheet.create({
    likeButton:{
        height:hp("2.5%"),
        width:hp("2.5%"),
        tintColor:colors.like,
    },
    cont:{
        backgroundColor:colors.buttonBackground,
        borderRadius:40,
        height:hp("7%"),
        width:hp("7%"),
        alignItems:"center",
        justifyContent:"center",
        elevation: 3,
    }
});
