import {
    Alert,
    Modal, Platform,
    SafeAreaView, StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {Text} from "../../components/Text";
import {Image} from "expo-image";
import styleAccount from "./StyleAccount";
import viewModel, {accountViewModel} from "./ViewModel";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {PropsStackNavigation} from "../../interfaces/StackNav";
import React, {useCallback, useEffect, useState} from "react";
import {CustomTextInput} from "../../components/CustomTextInput";
import {UseUserLocalStorage} from "../../hooks/UseUserLocalStorage";
import {UpdateUserDTO} from "../../../domain/entities/User";
import Toast from "react-native-toast-message";
import * as ImagePickerExpo from "expo-image-picker";
import {API_BASE_URL} from "../../../data/sources/remote/api/ApiDelivery";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import Animated, {FadeInDown, FadeInLeft} from "react-native-reanimated";
import {ActivtyIndicatorCustom} from "../../components/ActivtyIndicatorCustom";
import {showCustomToast} from "../../utils/ShowCustomToast";
import Constants from "expo-constants";
import { checkIfUsernameRegisteredUseCase } from "../../../domain/usesCases/auth/RegisterAuth";
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "../../theme/ThemeContext";


export function Account({navigation = useNavigation(), route}: PropsStackNavigation){

    const [modalUpdateUsernameVisible, setModalUpdateUsernameVisible] = useState(false);
    const { colors } = useTheme();
    const style = styleAccount(colors);
    const stylesPP = stylesProfilePicture(colors);
    const {user} = UseUserLocalStorage()
    const {
        userDB,
        getUserDB,
        showLoading,
        setShowLoading,
        updateUserDetails,
        errorMessage,
        setErrorMessage,
    } =accountViewModel();

    const [updatedUsername, setUpdateUsername] = useState("");

    useFocusEffect(
        useCallback(() => {
            if(user?.slug != undefined){
                getUserDB(user?.slug)
                if (userDB != undefined){
                    setUpdateUsername(userDB.username)
                }
                setTimeout(() => {
                    setShowLoading(false)
                }, 700)
            }
        }, [user?.slug, JSON.stringify(userDB)])
    )

    useEffect(() => {
        if (errorMessage != "") {
            showCustomToast(errorMessage);
            setErrorMessage("")
        }
    }, [errorMessage]);

    const selectImage =async () => {
        const { status } = await ImagePickerExpo.requestMediaLibraryPermissionsAsync()

        if (status !== "granted") {
            alert("Permission denied")
            return;
        }

        let result = await ImagePickerExpo.launchImageLibraryAsync({
            mediaTypes:['images'],
            allowsEditing: true,
            aspect:[1,1],
            quality:1
        });

        console.log("result", result);
        if (!result.canceled) {
            if (userDB != undefined) {
                const selectedAsset = result.assets[0]
                let path = selectedAsset.uri;
                if (Platform.OS === "ios") {
                    path = "~" + path.substring(path.indexOf("/Documents"));
                }
                if (!selectedAsset.fileName) selectedAsset.fileName = path.split("/").pop();

                const formData = new FormData();
                formData.append('image', {
                    uri: selectedAsset.uri,
                    name: selectedAsset.fileName,
                    type: selectedAsset.mimeType,
                } as any);
                console.log(formData);

                if(user?.slug != undefined){
                    await updateUserDetails(user?.slug, formData)
                    await getUserDB(user?.slug)
                    console.log("aaaa")
                }
            }
        }
    }

    return (
            <View style={{width: '100%', height: '100%', backgroundColor: colors.backgroundColor}}>
                {!showLoading ? (
                    <>
                    <View style={{paddingHorizontal:wp("10%")}}>
                        <View style={{marginTop: hp("5%")}}>
                            <TouchableOpacity style={{position: "absolute", alignSelf: "flex-end", marginTop: hp("2.5%")}}
                             onPress={() => navigation.navigate("SettingsScreen")}>
                                <Ionicons name="settings-outline" size={33} color={colors.white} />
                            </TouchableOpacity>
                            <Text style={style.title}>
                                Account details
                            </Text>
                        </View>
                        <Animated.View
                            entering={FadeInLeft.duration(800)}
                            style={style.containerEmail}>
                            <Text style={style.textEmail}>{userDB?.email}</Text>
                        </Animated.View>
                        <View style={style.containerPhoto}>
                            <View style={stylesPP.container}>
                                <View style={stylesPP.containerPhoto}>
                                    <Image
                                        priority={"high"}
                                        contentFit="cover"
                                        transition={500}
                                        style={stylesPP.photo}  
                                        source={userDB?.image ? {uri: `${userDB?.image}`} : require("../../../../assets/account-image.jpg")}
                                    />
                                </View>
                                <TouchableOpacity style={stylesPP.changePhotoButton} onPress={selectImage}>
                                    <Text style={stylesPP.changePhotoButtonText}>Change photo</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Animated.View
                            entering={FadeInDown.duration(800)}
                            style={style.containerInfo}>
                            <Text style={style.labelName}>Username</Text>
                            <View style={style.containerEditName}>
                                <Text style={style.Name}>{userDB?.username}</Text>
                                <View>
                                    <Modal
                                        animationType="fade"
                                        transparent={true}
                                        visible={modalUpdateUsernameVisible}
                                        onRequestClose={() => {
                                            setModalUpdateUsernameVisible(!modalUpdateUsernameVisible);
                                        }}
                                    >
                                        <View style={style.centeredView}>
                                            <View style={style.modalView}>
                                                <CustomTextInput
                                                    label={"Username (Max. 30 characters)"}
                                                    keyboardType={"default"}
                                                    maxLenght={30}
                                                    autoFocus={true}
                                                    value={userDB?.username}
                                                    secureTextEntry={false}
                                                    onChangeText={(text) => setUpdateUsername(text)}
                                                />
                                                <View style={style.containerButton}>
                                                    <TouchableOpacity
                                                        style={style.modalCancelButton}
                                                        onPress={() => setModalUpdateUsernameVisible(!modalUpdateUsernameVisible)}
                                                    >
                                                        <Text style={style.modalButtonTextStyle}>Cancel</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={style.modalAcceptButton}
                                                        onPress={async () => {
                                                            if(userDB != undefined) {
                                                                if (updatedUsername === "") {
                                                                    setErrorMessage("Empty fields are not allowed")
                                                                } else if (userDB.username === updatedUsername) {
                                                                    setModalUpdateUsernameVisible(!modalUpdateUsernameVisible)
                                                                } 
                                                                
                                                                const checkUsername = await checkIfUsernameRegisteredUseCase({username: updatedUsername})
                                                                if (checkUsername.error && userDB.username !== updatedUsername) {
                                                                    setErrorMessage("Username already registered")
                                                                } else {
                                                                    const data: UpdateUserDTO = {
                                                                        username: updatedUsername
                                                                    }
                                                                    if (user?.slug !== undefined) {
                                                                        updateUserDetails(user?.slug, data).then(() => {
                                                                                setModalUpdateUsernameVisible(!modalUpdateUsernameVisible)
                                                                                userDB.username = updatedUsername
                                                                                setUpdateUsername(updatedUsername)
                                                                        })
                                                                    }
                                                                }
                                                            }}
                                                        }
                                                    >
                                                        <Text style={style.modalButtonTextStyle}>Accept</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                        <Toast/>
                                    </Modal>
                                    <TouchableOpacity
                                        onPress={() => setModalUpdateUsernameVisible(true)}>
                                        <Image source={require('../../../../assets/edit.png')} style={style.editButton}/>
                                    </TouchableOpacity>

                                </View>
                            </View>
                        </Animated.View>
                        </View>
                    </>
                ) : (
                    <>
                        <ActivtyIndicatorCustom showLoading={showLoading}/>
                    </>
                )}
            </View>
    );
}

export const stylesProfilePicture = (colors: any) => StyleSheet.create({
    container:{
        flex: 1,
        alignItems:"center",
    },
    containerPhoto:{
        alignItems:"center",

    },
    photo:{
        width:wp("25%"),
        height:wp("25%"),
        borderRadius:50,
        alignItems:"center",
    },
    changePhotoButton:{
        backgroundColor: colors.changePhotoButton,
        width:wp("30%"),
        height:hp("3.7%"),
        justifyContent:"center",
        borderRadius:25,
        marginTop:hp("3%"),
        elevation: 2,
    },
    changePhotoButtonText:{
        fontFamily:"zen_kaku_regular",
        alignSelf:"center",
    }
})