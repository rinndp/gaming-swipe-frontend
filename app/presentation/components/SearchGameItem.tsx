import { View, StyleSheet } from "react-native";
import { Text } from "./Text"
import { AppColors } from "../theme/AppTheme";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { transformSmallCoverUrl } from "../utils/TransformCoverUrls";
import { HorizontalFlashList } from "./HorizontalFlashList";
import { PlatformItem } from "./PlatformItem";
import { transformGameIntoFavGameInterface } from "../views/home/ViewModel";
import { HandleLikeButton } from "./HandleLikeButton";
import { Game } from "../../domain/entities/Game";


interface SearchGameItemProps {
    item: Game;
    navigation: any;
    loadFavGames: () => Promise<void>;
}

  export const SearchGameItem = ({item, navigation, loadFavGames}: SearchGameItemProps) => {
    return (
        <View style={styleSearchGameItem.gameCard}>
        <TouchableOpacity onPress={() => navigation.navigate("GameDetails", {gameId : item.id, likeButton: true})}>
            <Image
                source={{
                    uri: item.cover
                        ? transformSmallCoverUrl(item.cover.url)
                        : "https://www.igdb.com/assets/no_cover_show-ef1e36c00e101c2fb23d15bb80edd9667bbf604a12fc0267a66033afea320c65.png"
                }}
                contentFit="contain"
                transition={250}
                style={styleSearchGameItem.gameCover}
            />
        </TouchableOpacity>
        <View>
            <View style={styleSearchGameItem.name_rating}>
                <Text style={styleSearchGameItem.gameName}>{item.name}</Text>
            </View>
            <View style={styleSearchGameItem.plaformsFlatlistContainer}>
                <HorizontalFlashList
                    data={item.platforms ? item.platforms : []}
                    style={{minWidth:wp("50%")}}
                    renderItem={PlatformItem}
                />
            </View>
        </View>
        <View style={styleSearchGameItem.thirdColumnContainer}>
            {item.rating ? (
                <Text style={styleSearchGameItem.rating}>{item.rating.toFixed(1)}</Text>
            ) : (
                <>
                    <View style={styleSearchGameItem.rating}>
                        <Text style={{width:item.hypes ? "auto" : "100%", fontSize:wp("3%"), textAlign:"center", color: item.hypes ? AppColors.green : AppColors.white}}>
                            {item.hypes ? item.hypes : "No rate"}</Text>
                        {item.hypes && (
                        <Image style={{width:wp("3%"), height:hp("1%"), tintColor: AppColors.green}}
                            source={require("../../../assets/hypes-icon.png")}/>
                        )}
                    </View>
                </>

            )}
            <HandleLikeButton game={transformGameIntoFavGameInterface(item)} loadFavGames={() => loadFavGames()}/>
            <Text style={styleSearchGameItem.gameReleaseYear}>{item.release_dates?.[0]?.y ?? "TBD"}</Text>
        </View>
    </View>
    )
}

const styleSearchGameItem = StyleSheet.create({
    thirdColumnContainer:{
        alignItems: "center",
        gap: hp("2.4%"),
    },
    fav:{
        width:wp("6%"),
        height:hp("3%"),
        tintColor:"#4dc51f",
        alignSelf: "center",
    },
    rating: {
        fontSize: wp("3%"),
        backgroundColor: AppColors.thirdColor,
        padding: wp("2%"),
        flexDirection:"row",
        gap:wp("1%"),
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        width: wp("15%"),
        borderRadius: 15,
        color: AppColors.white,
    },
    gameReleaseYear: {
        fontSize: wp("3%"),
        color: AppColors.white,
        textAlign: "center",
    },
    gameCard: {
        width: "100%",
        flexDirection: "row",
        padding: wp("2%"),
        alignItems: "center",
        zIndex:1,
    },
    gameCover: {
        padding:wp("1%"),
        width: wp("25%"),
        height: hp("15%"),
        borderRadius: 5,
        marginRight: 10,
    },
    name_rating: {
        flexDirection:"row",
        alignSelf: "center",
        alignItems: "center",
        justifyContent:"space-between",
    },

    gameName: {
        flex:3,
        fontSize: wp("3.3%"),
        height: hp("10%"),
        marginTop: hp("1%"),
        paddingEnd: wp("3%"),
        fontFamily: "zen_kaku_regular",
        color: AppColors.white,
    },
    plaformsFlatlistContainer:{
        flex:1,
        minWidth:wp("50%"),
        width: wp("50%"),
        flexDirection:"row",
        alignSelf: "center",
        alignItems: "center",
    },
});
