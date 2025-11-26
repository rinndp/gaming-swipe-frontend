import {
    ActivityIndicator, Alert, DeviceEventEmitter,
    FlatList,
    ImageBackground, Modal, Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {Image} from "expo-image"
import stylesHome from "../home/StyleHome";
import styleFav from "./StyleFav";
import viewModel, {favScreenViewModel} from "./ViewModel";
import React, {useCallback, useState} from "react";
import styleHome from "../home/StyleHome";
import { widthPercentageToDP as wp} from "react-native-responsive-screen";
import {UseUserLocalStorage} from "../../hooks/UseUserLocalStorage";
import {FavGame} from "../../../domain/entities/FavGame";
import {AppColors} from "../../theme/AppTheme";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import Toast from "react-native-toast-message";
import styleAccount from "../account/StyleAccount";
import {PropsStackNavigation} from "../../interfaces/StackNav";
import {stylesFavGameItem} from "./FavGamesScreen";
import {ActivtyIndicatorCustom} from "../../components/ActivtyIndicatorCustom";
import {FlashList} from "@shopify/flash-list";


export function PlayedGamesScreen({navigation = useNavigation()}: PropsStackNavigation) {
    const {playedListGames,
        loadPlayedGames,
        showLoading,
        deletePlayedGame} = favScreenViewModel();
    const {user} = UseUserLocalStorage()

    useFocusEffect(
        useCallback(() => {
            if(user?.slug != undefined) {
                loadPlayedGames(user?.slug);
            }
        }, [user?.slug])
    );

    const [selectedGameId, setSelectedGameId] = useState<number | null>(null);

    const favGameRenderItem = useCallback(({ item }: { item: FavGame }) => (
        <View style={stylesFavGameItem.card}>
            <View style={stylesFavGameItem.container}>
                <TouchableOpacity onPress={() => navigation.navigate("GameDetails", {gameId : item.id_api, likeButton: false})}>
                    <Image
                        contentFit="contain"
                        transition={500}
                        source={{ uri: item.image_url }} style={stylesFavGameItem.image} />
                </TouchableOpacity>
                <Text style={{ ...stylesHome.gameNameText, width: "50%", fontSize: wp("3.5%"), color:"white"}}>{item.name}</Text>
                <TouchableOpacity
                    style={{...stylesFavGameItem.deleteIcon, padding: wp("3%"), alignItems:"center", justifyContent:"center"}}
                    onPress={() => {
                        item.id
                            ? setSelectedGameId(item.id)
                            : Toast.show({"type": "error", "text1": "Unexpected error!"})}}
                >
                    <Image source={require("../../../../assets/borrar.png")} style={stylesFavGameItem.deleteIcon} />
                </TouchableOpacity>

                {selectedGameId === item.id && (
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={true}
                        onRequestClose={() => setSelectedGameId(null)}
                    >
                        <View style={styleAccount.centeredView}>
                            <View style={styleAccount.modalView}>
                                <Text style={{...styleAccount.textPopUp, color: AppColors.red}}>Delete this game?</Text>
                                <Text style={styleAccount.gameNamePopUp}>{item.name}</Text>
                                <View style={styleAccount.containerButton}>
                                    <TouchableOpacity
                                        style={styleAccount.modalCancelButton}
                                        onPress={() => setSelectedGameId(null)}
                                    >
                                        <Text style={styleAccount.modalButtonTextStyle}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styleAccount.modalAcceptButton}
                                        onPress={async () => {
                                            console.log(item.name)
                                            await deletePlayedGame(item.id_api, user?.slug || "");
                                            setSelectedGameId(null);
                                        }}
                                    >
                                        <Text style={styleAccount.modalButtonTextStyle}>Accept</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}
            </View>
        </View>
    ), [user?.slug, selectedGameId, navigation]);

    return (
        <View style={{width: '100%', height: '100%', backgroundColor: AppColors.backgroundColor}}>
            {showLoading ? (
                <>
                    <ActivtyIndicatorCustom showLoading={showLoading}/>
                </>
            ):(
                <>
                    <View style={{height:"100%"}}>
                        <FlashList data={playedListGames}
                                  removeClippedSubviews={true}
                                  renderItem={favGameRenderItem}
                                  extraData={playedListGames}
                                  fadingEdgeLength={10}
                                  ListFooterComponent={<Text style={{...styleFav.footerFavGames, display: showLoading ? "none" : "flex"}}>Play more games!</Text>}
                        />
                    </View>
                </>
            )}
                <Toast/>
        </View>
    );
}