import {Image, TouchableOpacity,StyleSheet} from "react-native";
import {AppColors} from "../theme/AppTheme";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import {Shadow} from "react-native-shadow-2";
import { useTheme } from "../theme/ThemeContext";

interface Props {
    onPress: () => void;
}

export const RewindButton=({onPress}: Props)=>{
    const { colors } = useTheme();
    const styleR = styles(colors);
    return (
        <Shadow startColor={"rgba(255,138,4,0.05)"}>
            <TouchableOpacity style={styleR.container} onPress={onPress}>
                <Image source={require("../../../assets/rewind-arrow.png")} style={styleR.button}></Image>
            </TouchableOpacity>
        </Shadow>
    )
}

const styles = (colors: any) => StyleSheet.create({
    button:{
        height:hp("3%"),
        width:hp("3%"),
        tintColor: colors.orange,
    },
    container:{
        backgroundColor:colors.buttonBackground,
        borderRadius:40,
        height:hp("7%"),
        width:hp("7%"),
        alignItems:"center",
        justifyContent:"center",
        elevation:3,
    }
});
