import { View, StyleSheet } from "react-native";
import { Text } from "./Text"
import { useTheme } from "../theme/ThemeContext";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { transformSmallCoverUrl } from "../utils/TransformCoverUrls";
import { HorizontalFlashList } from "./HorizontalFlashList";
import { PlatformItem } from "./PlatformItem";
import { transformGameIntoFavGameInterface } from "../views/home/ViewModel";
import { HandleLikeButton } from "./HandleLikeButton";
import { Game, Platform } from "../../domain/entities/Game";


interface SearchGameItemProps {
    item: Game;
    navigation: any;
    loadFavGames: () => Promise<void>;
    colors: any;
}

  export const SearchGameItem = ({item, navigation, loadFavGames, colors}: SearchGameItemProps) => {
    const style = styleSearchGameItem(colors);
    return (
        <View style={style.gameCard}>
        <TouchableOpacity onPress={() => navigation.navigate("GameDetails", {gameId : item.id, likeButton: true})}>
            <Image
                source={{
                    uri: item.cover
                        ? transformSmallCoverUrl(item.cover.url)
                        : "https://www.igdb.com/assets/no_cover_show-ef1e36c00e101c2fb23d15bb80edd9667bbf604a12fc0267a66033afea320c65.png"
                }}
                contentFit="contain"
                transition={250}
                style={style.gameCover}
            />
        </TouchableOpacity>
        <View>
            <View style={style.name_rating}>
                <Text style={style.gameName}>{item.name}</Text>
            </View>
            <View style={style.plaformsFlatlistContainer}>
                <HorizontalFlashList
                    data={item.platforms ? item.platforms : []}
                    style={{minWidth:wp("50%")}}
                    renderItem={({item}: {item: Platform}) => PlatformItem({item, colors: colors})}
                />
            </View>
        </View>
        <View style={style.thirdColumnContainer}>
            {item.rating ? (
                <Text style={style.rating}>{item.rating.toFixed(1)}</Text>
            ) : (
                <>
                    <View style={style.rating}>
                        <Text style={{width:item.hypes ? "auto" : "100%", fontSize:wp("3%"), textAlign:"center", color: item.hypes ? colors.green : colors.white}}>
                            {item.hypes ? item.hypes : "No rate"}</Text>
                        {item.hypes && (
                        <Image style={{width:wp("3%"), height:hp("1%"), tintColor: colors.green}}
                            source={require("../../../assets/hypes-icon.png")}/>
                        )}
                    </View>
                </>

            )}
            <HandleLikeButton game={transformGameIntoFavGameInterface(item)} loadFavGames={() => loadFavGames()}/>
            <Text style={style.gameReleaseYear}>{item.release_dates?.[0]?.y ?? "TBD"}</Text>
        </View>
    </View>
    )
}

const styleSearchGameItem = (colors: any) => StyleSheet.create({
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
        backgroundColor: colors.thirdColor,
        padding: wp("2%"),
        flexDirection:"row",
        gap:wp("1%"),
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        width: wp("15%"),
        borderRadius: 15,
    },
    gameReleaseYear: {
        fontSize: wp("3%"),
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
