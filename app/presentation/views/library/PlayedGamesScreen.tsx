import {
    ActivityIndicator, Alert, DeviceEventEmitter,
    FlatList,
    ImageBackground, Modal, Pressable,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import {Text} from "../../components/Text";
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
import {stylesFavGameItem} from "./ToPlayGamesScreen";
import {ActivtyIndicatorCustom} from "../../components/ActivtyIndicatorCustom";
import {FlashList} from "@shopify/flash-list";
import { useTheme } from "../../theme/ThemeContext";
import Animated, { FadeInLeft } from "react-native-reanimated";


export function PlayedGamesScreen({navigation = useNavigation()}: PropsStackNavigation) {

    const { colors } = useTheme();
    const styleFGI = stylesFavGameItem(colors);
    const styleAcc = styleAccount(colors);

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

    const toPlayGameRenderItem = useCallback(({ item }: { item: FavGame }) => (
        <View style={styleFGI.card}>
            <View style={styleFGI.container}>
                <TouchableOpacity onPress={() => navigation.navigate("GameDetails", {gameId : item.id_api, likeButton: false})}>
                    <Image
                        contentFit="contain"
                        transition={500}
                        source={{ uri: item.image_url }} style={styleFGI.image} />
                </TouchableOpacity>
                <Text style={{ ...stylesHome(colors).gameNameText, width: "50%", fontSize: wp("3.5%")}}>{item.name}</Text>
                <TouchableOpacity
                    style={{...styleFGI.deleteIcon, padding: wp("3%"), alignItems:"center", justifyContent:"center"}}
                    onPress={() => {
                        item.id
                            ? setSelectedGameId(item.id)
                            : Toast.show({"type": "error", "text1": "Unexpected error!"})}}
                >
                    <Image source={require("../../../../assets/borrar.png")} style={styleFGI.deleteIcon} />
                </TouchableOpacity>

                {selectedGameId === item.id && (
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={true}
                        onRequestClose={() => setSelectedGameId(null)}
                    >
                        <View style={styleAcc.centeredView}>
                            <View style={styleAcc.modalView}>
                                <Text style={{...styleAcc.textPopUp, color: colors.red}}>Delete this game?</Text>
                                <Text style={styleAcc.gameNamePopUp}>{item.name}</Text>
                                <View style={styleAcc.containerButton}>
                                    <TouchableOpacity
                                        style={styleAcc.modalCancelButton}
                                        onPress={() => setSelectedGameId(null)}
                                    >
                                        <Text style={styleAcc.modalButtonTextStyle}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styleAcc.modalAcceptButton}
                                        onPress={async () => {
                                            console.log(item.name)
                                            await deletePlayedGame(item.id_api, user?.slug || "");
                                            setSelectedGameId(null);
                                        }}
                                    >
                                        <Text style={styleAcc.modalButtonTextStyle}>Accept</Text>
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
        <View style={{width: '100%', height: '100%', backgroundColor: colors.backgroundColor}}>
            {showLoading ? (
                <>
                    <ActivtyIndicatorCustom showLoading={showLoading}/>
                </>
            ):(
                <>
                    <Animated.View 
                        entering={FadeInLeft.duration(800)} 
                        style={{height:"100%"}}>
                        <FlashList data={playedListGames}
                                  removeClippedSubviews={true}
                                  renderItem={toPlayGameRenderItem}
                                  extraData={playedListGames}
                                  initialScrollIndex={0}
                                  fadingEdgeLength={10}
                                  ListFooterComponent={<Text style={{...styleFav(colors).footerFavGames, display: showLoading ? "none" : "flex"}}>Play more games!</Text>}
                        />
                    </Animated.View>
                </>
            )}
                <Toast/>
        </View>
    );
}