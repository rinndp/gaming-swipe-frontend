import {
    Alert,
    Modal, Platform,
    SafeAreaView, StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
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
import {AppColors} from "../../theme/AppTheme";
import {API_BASE_URL} from "../../../data/sources/remote/api/ApiDelivery";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import Animated, {FadeInDown, FadeInLeft} from "react-native-reanimated";
import {ActivtyIndicatorCustom} from "../../components/ActivtyIndicatorCustom";
import {showCustomToast} from "../../utils/ShowCustomToast";
import Constants from "expo-constants";

export function Account({navigation = useNavigation(), route}: PropsStackNavigation){

    const [modalUpdateUsernameVisible, setModalUpdateUsernameVisible] = useState(false);

    const {user} = UseUserLocalStorage()
    const {
        deleteSession,
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
            <View style={{width: '100%', height: '100%', backgroundColor: AppColors.backgroundColor}}>
                {!showLoading ? (
                    <>
                    <View style={{paddingHorizontal:wp("10%")}}>
                        <View style={{marginTop: hp("4%")}}>
                            <Text style={styleAccount.title}>
                                Account details
                            </Text>
                        </View>
                        <Animated.View
                            entering={FadeInLeft.duration(800)}
                            style={styleAccount.containerEmail}>
                            <Text style={styleAccount.textEmail}>{userDB?.email}</Text>
                        </Animated.View>
                        <View style={styleAccount.containerPhoto}>
                            <View style={stylesProfilePicture.container}>
                                <View style={stylesProfilePicture.containerPhoto}>
                                    <Image
                                        priority={"high"}
                                        contentFit="cover"
                                        transition={500}
                                        style={stylesProfilePicture.photo}  
                                        source={userDB?.image ? {uri: `${userDB?.image}`} : require("../../../../assets/account-image.jpg")}
                                    />
                                </View>
                                <TouchableOpacity style={stylesProfilePicture.changePhotoButton} onPress={selectImage}>
                                    <Text style={stylesProfilePicture.changePhotoButtonText}>Change photo</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Animated.View
                            entering={FadeInDown.duration(800)}
                            style={styleAccount.containerInfo}>
                            <Text style={styleAccount.labelName}>Username</Text>
                            <View style={styleAccount.containerEditName}>
                                <Text style={styleAccount.Name}>{userDB?.username}</Text>
                                <View>
                                    <Modal
                                        animationType="fade"
                                        transparent={true}
                                        visible={modalUpdateUsernameVisible}
                                        onRequestClose={() => {
                                            setModalUpdateUsernameVisible(!modalUpdateUsernameVisible);
                                        }}
                                    >
                                        <View style={styleAccount.centeredView}>
                                            <View style={styleAccount.modalView}>
                                                <CustomTextInput
                                                    label={"Username (Max. 30 characters)"}
                                                    keyboardType={"default"}
                                                    maxLenght={30}
                                                    autoFocus={true}
                                                    value={userDB?.username}
                                                    secureTextEntry={false}
                                                    onChangeText={(text) => setUpdateUsername(text)}
                                                />
                                                <View style={styleAccount.containerButton}>
                                                    <TouchableOpacity
                                                        style={styleAccount.modalCancelButton}
                                                        onPress={() => setModalUpdateUsernameVisible(!modalUpdateUsernameVisible)}
                                                    >
                                                        <Text style={styleAccount.modalButtonTextStyle}>Cancel</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={styleAccount.modalAcceptButton}
                                                        onPress={() => {
                                                            if(userDB != undefined) {
                                                                if (updatedUsername === "") {
                                                                    setErrorMessage("Empty fields are not allowed")
                                                                } else if (userDB.username === updatedUsername) {
                                                                    setModalUpdateUsernameVisible(!modalUpdateUsernameVisible)
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
                                                        <Text style={styleAccount.modalButtonTextStyle}>Accept</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                        <Toast/>
                                    </Modal>
                                    <TouchableOpacity
                                        onPress={() => setModalUpdateUsernameVisible(true)}>
                                        <Image source={require('../../../../assets/edit.png')} style={styleAccount.editButton}/>
                                    </TouchableOpacity>

                                </View>
                            </View>
                            <View style={styleAccount.containerLogOut}>
                                <Image source={require("../../../../assets/log-out-icon.png")}
                                       style={styleAccount.logOutIcon}
                                />
                                <Text style={styleAccount.LogOut} onPress={() => {
                                    deleteSession().then(r => navigation.replace("WelcomeScreen"))}
                                }> Log out</Text>
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

export const stylesProfilePicture =StyleSheet.create({
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
        backgroundColor:AppColors.secondaryColor,
        width:wp("30%"),
        height:hp("3.7%"),
        justifyContent:"center",
        borderRadius:25,
        marginTop:hp("3%"),
    },
    changePhotoButtonText:{
        fontFamily:"zen_kaku_regular",
        color:AppColors.white,
        alignSelf:"center",
    }
})