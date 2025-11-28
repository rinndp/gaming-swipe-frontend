import {
    ActivityIndicator,
    Alert,
    ImageBackground,
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
import {CustomTextInputPassword} from "../../components/CustomTextInputPassword";
import {CustomTextInput} from "../../components/CustomTextInput";
import {UseUserLocalStorage} from "../../hooks/UseUserLocalStorage";
import stylesHome from "../home/StyleHome";
import styleHome from "../home/StyleHome";
import {UpdateUserDTO, UserInterface} from "../../../domain/entities/User";
import Toast from "react-native-toast-message";
import {PasswordsDTO} from "../../../domain/entities/UpdatePasswordDTO";
import * as ImagePickerExpo from "expo-image-picker";
import {AppColors} from "../../theme/AppTheme";
import styles from "../auth/StylesAuthViews";
import {removeUserUseCase} from "../../../domain/usesCases/userLocal/RemoveUser";
import {API_BASE_URL} from "../../../data/sources/remote/api/ApiDelivery";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import Animated, {FadeInDown, FadeInLeft} from "react-native-reanimated";
import stylesAuthViews from "../auth/StylesAuthViews";
import {ActivtyIndicatorCustom} from "../../components/ActivtyIndicatorCustom";

export function Account({navigation = useNavigation(), route}: PropsStackNavigation){

    const [modalVisibleFirst, setModalVisibleFirst] = useState(false);

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

    const [updatedFirstName, setUpdateFirstName] = useState("");

    useFocusEffect(
        useCallback(() => {
            if(user?.slug != undefined){
                getUserDB(user?.slug)
                if (userDB != undefined){
                    setUpdateFirstName(userDB.username)
                }
                setShowLoading(false);
            }
        }, [user?.slug, JSON.stringify(userDB)])
    )

    useEffect(() => {
        if (errorMessage != "") {
            Toast.show({
                type: "error",
                text1: errorMessage,
            })
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
                                        style={stylesProfilePicture.photo}  source={userDB?.image ? {uri: `${API_BASE_URL.slice(0, -4)}${userDB?.image}`} : require("../../../../assets/account-image.jpg")}
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
                                        visible={modalVisibleFirst}
                                        onRequestClose={() => {
                                            Alert.alert("Modal has been closed.");
                                            setModalVisibleFirst(!modalVisibleFirst);
                                        }}
                                    >
                                        <View style={styleAccount.centeredView}>
                                            <View style={styleAccount.modalView}>
                                                <CustomTextInput
                                                    label={"Username (Max. 20 characters)"}
                                                    keyboardType={"default"}
                                                    maxLenght={20}
                                                    value={userDB?.username}
                                                    secureTextEntry={false}
                                                    onChangeText={(text) => setUpdateFirstName(text)}
                                                />
                                                <View style={styleAccount.containerButton}>
                                                    <TouchableOpacity
                                                        style={styleAccount.modalCancelButton}
                                                        onPress={() => setModalVisibleFirst(!modalVisibleFirst)}
                                                    >
                                                        <Text style={styleAccount.modalButtonTextStyle}>Cancel</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={styleAccount.modalAcceptButton}
                                                        onPress={() => {
                                                            if(userDB != undefined) {
                                                                if (updatedFirstName === "") {
                                                                    setErrorMessage("Empty fields are not allowed")
                                                                    setModalVisibleFirst(!modalVisibleFirst)
                                                                } else if (userDB.username === updatedFirstName) {
                                                                    setModalVisibleFirst(!modalVisibleFirst)
                                                                } else {
                                                                    const data: UpdateUserDTO = {
                                                                        username: updatedFirstName
                                                                    }
                                                                    if (user?.slug != undefined)
                                                                        updateUserDetails(user?.slug, data)

                                                                    userDB.username = updatedFirstName
                                                                    setModalVisibleFirst(!modalVisibleFirst)
                                                                    setUpdateFirstName(updatedFirstName)
                                                                }
                                                            }}
                                                        }
                                                    >
                                                        <Text style={styleAccount.modalButtonTextStyle}>Accept</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </Modal>
                                    <TouchableOpacity
                                        onPress={() => setModalVisibleFirst(true)}>
                                        <Image source={require('../../../../assets/edit.png')} style={styleAccount.editButton}/>
                                    </TouchableOpacity>

                                </View>
                            </View>
                            <View style={styleAccount.containerLogOut}>
                                <Image source={require("../../../../assets/log-out-icon.png")}
                                       style={styleAccount.logOutIcon}
                                />
                                <Text style={styleAccount.LogOut} onPress={() => {
                                    deleteSession().then(r => navigation.replace("AuthView"))}
                                }> Log out</Text>
                            </View>
                        </Animated.View>
                        <Toast/>
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