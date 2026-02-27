import React, {useCallback, useEffect, useState} from "react";
import {
    View,
    TouchableOpacity,
}
    from "react-native";
import {Text} from "../../components/Text";
import {Image} from "expo-image"
import { CustomTextInputSearch } from "../../components/CustomTextInputSearch";
import {styleSearch, styleSearchUserItem} from "./StyleSearch";
import {searchViewModel} from "./ViewModel";
import styleFav from "../library/StyleFav";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import {useNavigation} from "@react-navigation/native";
import {PropsStackNavigation} from "../../interfaces/StackNav";
import {UseUserLocalStorage} from "../../hooks/UseUserLocalStorage";
import {homeViewModel} from "../home/ViewModel";
import {favScreenViewModel} from "../library/ViewModel";
import {GetSearchUserInterface} from "../../../domain/entities/User";
import {FlashList} from "@shopify/flash-list";
import Animated, {FadeInLeft} from 'react-native-reanimated';
import {ActivtyIndicatorCustom} from "../../components/ActivtyIndicatorCustom";
import {useAnticipatedGames} from "../../hooks/UseAnticipatedGames";
import { SearchGameItem } from "../../components/SearchGameItem";
import { useTheme } from "../../theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Game } from "../../../domain/entities/Game";


export function Search({navigation = useNavigation()}: PropsStackNavigation) {

    const { colors } = useTheme();
    const style = styleSearch(colors);
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
        <View style={style.container}>
            <View style={{width: '100%', height: '100%', backgroundColor: colors.backgroundColor}}>
                <View style={style.containerHeader}>
                    <View style={style.logoContainer}>
                        <Image source={require("../../../../assets/igdb-logo.webp")} style={style.logo} />
                    </View>
                    <View>
                        <Text style={style.headerTitle}>Search</Text>
                    </View>
                    <View style={style.tabsContainer}>
                        <TouchableOpacity
                            style={[style.tabButton, selectedTab === "games" && style.tabButtonSelected]}
                            onPress={() => setSelectedTab("games")}
                        >
                            <Image
                                contentFit={"contain"}
                                source={require("../../../../assets/controller-icon.png")}
                                style={{...style.item, height: hp("2.7%"),}}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[style.tabButton, selectedTab === "users" && style.tabButtonSelected]}
                            onPress={() => setSelectedTab("users")}
                        >
                            <Ionicons name="person" size={20} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>
                {selectedTab === "games" && (
                    <>
                        <View style={style.containerHeader}>
                            <View style={style.containerSearchInput}>
                                <CustomTextInputSearch
                                    keyboardType="default"
                                    secureTextEntry={false}
                                    value={searchText}
                                    onPressButtonFromInterface={(text: string) => onSearchTextChange(text)}
                                />
                            </View>
                        </View>
                        <View style={style.resultTextContainer}>
                            {searchText !== "" ? (
                                <Text style={style.resultText}>Results for "{searchText}"</Text>
                            ) : (
                                <Animated.Text
                                    entering={FadeInLeft.duration(800)}
                                    style={style.resultText}><Text style={{...style.resultText, fontFamily: "zen_kaku_medium", fontSize: wp("4.9")}}>TOP 15</Text>   Most anticipated games</Animated.Text>
                            )}
                        </View>
                        <View style={style.gameCardsContainer}>
                            {loading ? (
                                <>
                                    <ActivtyIndicatorCustom showLoading={loading}/>
                                </>
                            ):(
                                <>
                                    <FlashList
                                        data={gamesDisplayed}
                                        keyExtractor={(item: Game) => item.id?.toString() || ""}
                                        fadingEdgeLength={10}
                                        renderItem={({item}) => SearchGameItem({
                                            item, 
                                            navigation, 
                                            loadFavGames: () => loadFavGames(user?.slug || ""),
                                            colors: colors
                                        })}                                        
                                        ListFooterComponent={
                                            <Text style={{...styleFav(colors).footerFavGames, display: gamesDisplayed.length > 0 ? "flex" : "none"}}>No more games</Text>
                                        }
                                        onEndReached={loadMoreGames}
                                        onEndReachedThreshold={0.5}
                                        getItemType={() => "game"} 
                                        ListEmptyComponent={
                                            <View style={{ alignItems: "center", width: "100%", marginTop: 20 }}>
                                                <Text style={{ ...style.emptyFlatListText, display: loading ? "none" : "flex" }}>
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
                        <View style={style.containerHeader}>
                            <View style={style.containerSearchInput}>
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
                                    keyExtractor={(item: GetSearchUserInterface) => item.username || ""}
                                    data={searchedUsers}
                                    removeClippedSubviews={true}
                                    renderItem={searchUserItem}
                                    fadingEdgeLength={10}
                                    ListEmptyComponent={
                                        <View style={{ alignItems: "center", width: "100%", marginTop: 20 }}>
                                            <Text style={{ ...style.emptyFlatListText, display: loading ? "none" : "flex" }}>
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
