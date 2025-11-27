import {Image, TouchableOpacity,StyleSheet} from "react-native";
import {AppColors} from "../theme/AppTheme";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import {Shadow} from "react-native-shadow-2";

interface Props {
    onPress: () => void;
}

export const RewindButton=({onPress}: Props)=>{
    return (
        <Shadow startColor={"rgba(255,138,4,0.05)"}>
            <TouchableOpacity style={styles.container} onPress={onPress}>
                <Image source={require("../../../assets/rewind-arrow.png")} style={styles.button}></Image>
            </TouchableOpacity>
        </Shadow>
    )
}

const styles = StyleSheet.create({
    button:{
        height:hp("3%"),
        width:hp("3%"),
        tintColor: AppColors.orange,
    },
    container:{
        backgroundColor:AppColors.buttonBackground,
        borderRadius:40,
        height:hp("7%"),
        width:hp("7%"),
        alignItems:"center",
        justifyContent:"center",
        elevation:10,
    }
});
