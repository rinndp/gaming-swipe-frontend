import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {PropsStackNavigation} from "../../interfaces/StackNav";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {Image} from "expo-image";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {companyDetailsViewModel} from "./ViewModel";
import stylesHome from "../home/StyleHome";
import styleHome from "../home/StyleHome";
import React, {useCallback, useEffect, useState} from "react";
import App, {RootStackParamsList} from "../../../../App";
import {styleGameDetails, styleSimilarGame} from "./StyleGameDetails";
import {AppColors} from "../../theme/AppTheme";
import {SimilarGame} from "../../../domain/entities/Game";
import {homeViewModel} from "../home/ViewModel";
import {FlashList} from "@shopify/flash-list";
import {transformCoverUrl, transformLogoUrlCompany, transformSmallCoverUrl} from "../../utils/TransformCoverUrls";
import {getCountryNameFromNumericCode} from "../../utils/GetCountryFromNumericCode";
import {formatUnixDate} from "../../utils/FormatUnixDate";
import Animated, {FadeInDown, FadeInLeft} from "react-native-reanimated";
import {ActivtyIndicatorCustom} from "../../components/ActivtyIndicatorCustom";
import {useCompanyDetails} from "../../hooks/UseCompanyDetails";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";



type CompanyDetailsRouteProp = RouteProp<RootStackParamsList, "CompanyDetails">;

export function CompanyDetails ({navigation = useNavigation()}: PropsStackNavigation) {
    countries.registerLocale(enLocale);

    const route = useRoute<CompanyDetailsRouteProp>()
    const {companyId} = route.params
    const [showLoading, setShowLoading] = useState(true);

    const {data, isLoading, error} = useCompanyDetails(companyId);
    const companyDetails = data ? data[0] : null;

    useEffect(() => {
        if (!isLoading) {
            const timeout = setTimeout(() => {
                setShowLoading(false);
            }, 200)
            return () => clearTimeout(timeout);
        } else {
            setShowLoading(true);
        }
    }, [isLoading]);

    const ITEMS_PER_PAGE = 15;

    const [developedGames, setDevelopedGames] = useState<SimilarGame[]>([]);
    const [pageDevelopedGames, setPageDevelopedGames] = useState(1);
    const [loadingMoreDevelopedGames, setLoadingMoreDevelopedGames] = useState(false);

    const [publishedGames, setPublishedGames] = useState<SimilarGame[]>([]);
    const [pagePublishedGames, setPagePublishedGames] = useState(1);
    const [loadingMorePublishedGames, setLoadingMorePublishedGames] = useState(false);

    const loadMoreDevelopedGames = () => {
        if (!loadingMoreDevelopedGames) {
            setLoadingMoreDevelopedGames(true);

            const start = (pageDevelopedGames - 1) * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            const newItems = companyDetails?.developed.slice(start, end);

            if (newItems != undefined && newItems.length > 0) {
                setTimeout(() => {
                    if (newItems != undefined)
                        setDevelopedGames((prev) => [...prev, ...newItems]);
                    setPageDevelopedGames((prev) => prev + 1);
                    setLoadingMoreDevelopedGames(false);
                }, 500);
            }
            setLoadingMoreDevelopedGames(false);
            return;
        }
    };

    const loadMorePublishedGames = () => {
        if (!loadingMorePublishedGames) {
            setLoadingMorePublishedGames(true);

            const start = (pagePublishedGames - 1) * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            const newItems = companyDetails?.published.slice(start, end);

            if (newItems != undefined && newItems.length > 0) {
                setTimeout(() => {
                    if (newItems != undefined)
                        setPublishedGames((prev) => [...prev, ...newItems]);
                    setPagePublishedGames((prev) => prev + 1);
                    setLoadingMorePublishedGames(false);
                }, 500);
            }
            setLoadingMorePublishedGames(false);
            return;
        }
    };

    useEffect(() => {
        if (companyDetails?.developed != undefined)
            loadMoreDevelopedGames()
        if (companyDetails?.published != undefined)
            loadMorePublishedGames()
    }, [showLoading]);

    const developedGameItem = useCallback(({item} : {item:SimilarGame}) => (
        <View style={{...styleSimilarGame.card, backgroundColor: AppColors.buttonBackground}}>
            <TouchableOpacity onPress={() => {navigation.push("GameDetails", {gameId : item.id, likeButton: true})}}>
                <Image
                    source={{
                        uri: item.cover
                            ? transformSmallCoverUrl(item.cover.url)
                            : "https://www.igdb.com/assets/no_cover_show-ef1e36c00e101c2fb23d15bb80edd9667bbf604a12fc0267a66033afea320c65.png"
                    }}
                    priority={"high"}
                    contentFit="cover"
                    transition={250}
                    style={styleSimilarGame.image}
                />
            </TouchableOpacity>
            <Text style={styleSimilarGame.name}>{item.name}</Text>
        </View>
    ), [navigation])

    return (
            <View style={{width: '100%', height: '100%', backgroundColor: AppColors.backgroundColor}}>
                {!showLoading ? (
                    <>
                        <ScrollView style={{paddingBottom: hp("60%")}} showsVerticalScrollIndicator={false}>
                            <View
                                style={{...styleGameDetails.header, flexDirection: "column", paddingBottom: 0, alignItems:"center"}}>
                                <TouchableOpacity onPress={() => {
                                    setShowLoading(true)
                                    navigation.goBack()
                                    }} 
                                    style={{...styleGameDetails.goBackIconTouchable, bottom: hp("30%")}}>
                                    <Image source={require("../../../../assets/go-back-icon.png")}
                                           style={styleGameDetails.goBackIcon} />
                                </TouchableOpacity>
                                <Animated.View
                                    style={{width: wp("100%"), alignItems: "center"}}>
                                    <Image
                                        source={{
                                            uri: companyDetails?.logo
                                                ? transformLogoUrlCompany(companyDetails.logo.url)
                                                : "https://www.igdb.com/assets/no_cover_show-ef1e36c00e101c2fb23d15bb80edd9667bbf604a12fc0267a66033afea320c65.png"
                                        }}
                                        contentFit="contain"
                                        transition={500}
                                        style={{width: wp("40%"), height: hp("20%"), marginVertical: wp("1%")}}
                                    />
                                </Animated.View>
                                <Animated.View
                                    entering={FadeInLeft.duration(800)}
                                    style={{flex: 1}}>
                                    <Text style={{...styleGameDetails.name, height: "auto", lineHeight: 40, paddingBottom: hp("2%")}}>{companyDetails?.name}</Text>
                                </Animated.View>
                            </View>
                            <Animated.View
                                entering={FadeInDown.duration(800)}
                                style={{paddingHorizontal: wp("4%")}}>
                                {companyDetails?.start_date && (
                                    <View>
                                        <Text style={styleGameDetails.infoTitles}>Founded</Text>
                                        <Text style={styleGameDetails.summary}>{formatUnixDate(companyDetails.start_date)}</Text>
                                        {companyDetails?.country && (
                                            <View>
                                                <Text style={styleGameDetails.summary}>{getCountryNameFromNumericCode(companyDetails.country)}</Text>
                                            </View>
                                        )}
                                    </View>
                                )}
                                <Text style={styleGameDetails.infoTitles}>Description</Text>
                                <Text style={{...styleGameDetails.summary, marginBottom: hp("4%")}}>{companyDetails?.description ? companyDetails.description : "No description available"}</Text>
                                {companyDetails?.developed && (
                                    <View>
                                        <Text style={styleGameDetails.infoTitles}>Developed games</Text>
                                        <FlashList
                                            data={developedGames}
                                            renderItem={developedGameItem}
                                            fadingEdgeLength={5}
                                            keyExtractor={(item) => item.id.toString()}
                                            onEndReached={loadMoreDevelopedGames}
                                            onEndReachedThreshold={1.5}
                                            showsHorizontalScrollIndicator={false}
                                            ListFooterComponent={loadingMoreDevelopedGames ? <ActivityIndicator size="large" color={AppColors.white} style={{marginTop: hp("2%")}} /> : null}
                                            horizontal={true}
                                        />
                                    </View>
                                )}

                                {companyDetails?.published && (
                                    <View>
                                        <Text style={{...styleGameDetails.infoTitles, marginTop: wp("-4%")}}>Published games</Text>
                                        <FlashList
                                            data={publishedGames}
                                            renderItem={developedGameItem}
                                            fadingEdgeLength={5}
                                            keyExtractor={(item) => item.id.toString()}
                                            onEndReached={loadMorePublishedGames}
                                            onEndReachedThreshold={1.5}
                                            showsHorizontalScrollIndicator={false}
                                            ListFooterComponent={loadingMorePublishedGames ? <ActivityIndicator size="large" color={AppColors.white} /> : null}
                                            horizontal={true}
                                        />
                                    </View>
                                )}
                            </Animated.View>
                        </ScrollView>
                    </>
                ) : (
                    <ActivtyIndicatorCustom showLoading={showLoading}/>
                )}
            </View>
    )
}