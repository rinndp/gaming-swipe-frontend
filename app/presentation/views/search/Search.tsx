import React, {useCallback, useEffect, useState} from "react";
import {
    Text,
    View,
    Keyboard, ActivityIndicator, TouchableOpacity,
}
    from "react-native";
import {Image} from "expo-image"
import { CustomTextInputSearch } from "../../components/CustomTextInputSearch";
import {styleSearch, styleSearchCompanyItem, styleSearchUserItem} from "./StyleSearch";
import {Game} from "../../../domain/entities/Game";
import viewModel, {searchViewModel} from "./ViewModel";
import {AppColors} from "../../theme/AppTheme";
import styleFav from "../library/StyleFav";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import {ToPlayGamesScreen} from "../library/ToPlayGamesScreen";
import FiltroComponent from "../../components/FilterButton";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {PropsStackNavigation} from "../../interfaces/StackNav";
import {UseUserLocalStorage} from "../../hooks/UseUserLocalStorage";
import viewModelHome, {homeViewModel} from "../home/ViewModel";
import viewModelFav, {favScreenViewModel} from "../library/ViewModel";
import {PlatformItem} from "../../components/PlatformItem";
import Toast from "react-native-toast-message";
import {CompanyDetailsInterface} from "../../../domain/entities/Company";
import stylesHome from "../home/StyleHome";
import styleHome from "../home/StyleHome";
import {GetSearchUserInterface} from "../../../domain/entities/User";
import {API_BASE_URL} from "../../../data/sources/remote/api/ApiDelivery";
import {FlashList} from "@shopify/flash-list";
import {transformCoverUrl, transformSmallCoverUrl} from "../../utils/TransformCoverUrls";
import Animated, {FadeInDown, FadeInLeft} from 'react-native-reanimated';
import {ActivtyIndicatorCustom} from "../../components/ActivtyIndicatorCustom";
import {useUserGamesContext} from "../../provider/GameProvider";
import {useAnticipatedGames} from "../../hooks/UseAnticipatedGames";
import {HorizontalFlashList} from "../../components/HorizontalFlashList";
import { HandleLikeButton } from "../../components/HandleLikeButton";
import { SearchGameItem } from "../../components/SearchGameItem";


export function Search({navigation = useNavigation()}: PropsStackNavigation) {
    const {
        gamesDisplayed,
        loading,
        loadMoreGames,
        onSearchTextChange,
        searchText,
        searchUserText,
        onSearchUserTextChange,
        setGamesDisplayed,
        searchedUsers,
        setLoading,
    } = searchViewModel()
    const [selectedTab, setSelectedTab] = useState<"games" | "users">("games");

    const {user} = UseUserLocalStorage()
    const {data, isLoading, error} = useAnticipatedGames();

    useEffect(() => {
        if (data) {
            setLoading(true);
            if(user?.slug != undefined) {
                loadFavGames(user?.slug);
                loadPlayedGames(user?.slug);
            }
            setTimeout(() => {
                setGamesDisplayed(data)
                setLoading(false);
            }, 1000)
        }
    }, [data, user?.slug]);

    const {
        transformGameIntoFavGameInterface,
    } = homeViewModel()

    const {
        loadFavGames,
        loadPlayedGames,
    } = favScreenViewModel()

    const searchUserItem = useCallback(({item} : {item:GetSearchUserInterface}) => (
        <TouchableOpacity style={styleSearchUserItem.container} onPress={() => navigation.push("UserDetails", {userSearch : item})}>
            <Image source={item.image ? {uri: `${item.image}`} : require("../../../../assets/account-image.jpg")}
                    style={styleSearchUserItem.image}
                   contentFit="cover"
                   transition={250}
            />
            <Text style={styleSearchUserItem.name}>{item.username}</Text>
        </TouchableOpacity>
    ), [])

    return (
        <View style={styleSearch.container}>
            <View style={{width: '100%', height: '100%', backgroundColor: AppColors.backgroundColor}}>
                <View style={styleSearch.containerHeader}>
                    <View style={styleSearch.logoContainer}>
                        <Image source={require("../../../../assets/igdb-logo.webp")} style={styleSearch.logo} />
                    </View>
                    <View>
                        <Text style={styleSearch.headerTitle}>Search</Text>
                    </View>
                    <View style={styleSearch.tabsContainer}>
                        <TouchableOpacity
                            style={[styleSearch.tabButton, selectedTab === "games" && styleSearch.tabButtonSelected]}
                            onPress={() => setSelectedTab("games")}
                        >
                            <Image
                                contentFit={"contain"}
                                source={require("../../../../assets/controller-icon.png")}
                                style={{...styleSearch.item, height: hp("2.7%"),}}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styleSearch.tabButton, selectedTab === "users" && styleSearch.tabButtonSelected]}
                            onPress={() => setSelectedTab("users")}
                        >
                            <Image
                                contentFit={"contain"}
                                source={require("../../../../assets/account-icon-filled.png")}
                                style={styleSearch.item}/>
                        </TouchableOpacity>
                    </View>
                </View>
                {selectedTab === "games" && (
                    <>
                        <View style={styleSearch.containerHeader}>
                            <View style={styleSearch.containerSearchInput}>
                                <CustomTextInputSearch
                                    keyboardType="default"
                                    secureTextEntry={false}
                                    value={searchText}
                                    onPressButtonFromInterface={(text: string) => onSearchTextChange(text)}
                                />
                            </View>
                        </View>
                        <View style={styleSearch.resultTextContainer}>
                            {searchText !== "" ? (
                                <Text style={styleSearch.resultText}>Results for "{searchText}"</Text>
                            ) : (
                                <Animated.Text
                                    entering={FadeInLeft.duration(800)}
                                    style={styleSearch.resultText}><Text style={{...styleSearch.resultText, fontFamily: "zen_kaku_medium", fontSize: wp("4.4")}}>TOP 15</Text>   Most anticipated games</Animated.Text>
                            )}
                        </View>
                        <View style={styleSearch.gameCardsContainer}>
                            {loading ? (
                                <>
                                    <ActivtyIndicatorCustom showLoading={loading}/>
                                </>
                            ):(
                                <>
                                    <FlashList
                                        data={gamesDisplayed}
                                        keyExtractor={(item) => item.id.toString()}
                                        fadingEdgeLength={10}
                                        renderItem={({item}) => SearchGameItem({
                                            item, 
                                            navigation, 
                                            loadFavGames: () => loadFavGames(user?.slug || "")
                                        })}                                        
                                        ListFooterComponent={
                                            <Text style={{...styleFav.footerFavGames, display: gamesDisplayed.length > 0 ? "flex" : "none"}}>No more games</Text>
                                        }
                                        onEndReached={loadMoreGames}
                                        onEndReachedThreshold={0.5}
                                        getItemType={() => "game"} 
                                        ListEmptyComponent={
                                            <View style={{ alignItems: "center", width: "100%", marginTop: 20 }}>
                                                <Text style={{ ...styleSearch.emptyFlatListText, display: loading ? "none" : "flex" }}>
                                                    No results
                                                </Text>
                                            </View>
                                        }
                                    />
                                </>
                            )}
                        </View>
                    </>
                )}

                {selectedTab ===  "users" && (
                    <>
                        <View style={styleSearch.containerHeader}>
                            <View style={styleSearch.containerSearchInput}>
                                <CustomTextInputSearch
                                    keyboardType="default"
                                    secureTextEntry={false}
                                    value={searchUserText}
                                    onPressButtonFromInterface={(text: string) => onSearchUserTextChange(text)}
                                />
                            </View>
                        </View>
                        {loading ? (
                            <>
                                <ActivtyIndicatorCustom showLoading={loading}/>
                            </>
                        ):(
                            <>
                                <FlashList
                                    data={searchedUsers}
                                    removeClippedSubviews={true}
                                    renderItem={searchUserItem}
                                    fadingEdgeLength={10}
                                    ListEmptyComponent={
                                        <View style={{ alignItems: "center", width: "100%", marginTop: 20 }}>
                                            <Text style={{ ...styleSearch.emptyFlatListText, display: loading ? "none" : "flex" }}>
                                                No results
                                            </Text>
                                        </View>
                                    }
                                />
                            </>
                        )}
                    </>
                )}
            </View>
        </View>
    );
}
