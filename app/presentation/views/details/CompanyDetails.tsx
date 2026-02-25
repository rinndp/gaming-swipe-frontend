import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {PropsStackNavigation} from "../../interfaces/StackNav";
import {
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    View
} from "react-native";
import {Text} from "../../components/Text";
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
import { HorizontalFlashList } from "../../components/HorizontalFlashList";
import { useTheme } from "../../theme/ThemeContext";



type CompanyDetailsRouteProp = RouteProp<RootStackParamsList, "CompanyDetails">;

export function CompanyDetails ({navigation = useNavigation()}: PropsStackNavigation) {
    countries.registerLocale(enLocale);

    const { colors, theme } = useTheme();
    const style = styleGameDetails(colors);

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


    const developedGames = companyDetails?.developed;
    const publishedGames = companyDetails?.published;


    const gameItem = useCallback(({item} : {item:SimilarGame}) => (
        <View style={{...styleSimilarGame(colors).card, backgroundColor: colors.buttonBackground}}>
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
                    style={styleSimilarGame(colors).image}
                />
            </TouchableOpacity>
            <Text style={styleSimilarGame(colors).name}>{item.name}</Text>
        </View>
    ), [navigation])

    return (
            <View style={{width: '100%', height: '100%', backgroundColor: colors.backgroundColor}}>
                {!showLoading ? (
                    <>
                        <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                            <View
                                style={{...style.header, flexDirection: "column", paddingBottom: 0, alignItems:"center"}}>
                                <TouchableOpacity onPress={() => {
                                    setShowLoading(true)
                                    navigation.goBack()
                                    }} 
                                    style={{...style.goBackIconTouchable, bottom: hp("30%")}}>
                                    <Image source={require("../../../../assets/go-back-icon.png")}
                                           style={style.goBackIcon} />
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
                                    <Text style={{...style.name, height: "auto", lineHeight: 40, paddingBottom: hp("2%")}}>{companyDetails?.name}</Text>
                                </Animated.View>
                            </View>
                            <Animated.View
                                entering={FadeInDown.duration(800)}
                                style={{paddingHorizontal: wp("4%")}}>
                                {companyDetails?.start_date && (
                                    <View>
                                        <Text style={style.infoTitles}>Founded</Text>
                                        <Text style={style.summary}>{formatUnixDate(companyDetails.start_date)}</Text>
                                        {companyDetails?.country && (
                                            <View>
                                                <Text style={style.summary}>{getCountryNameFromNumericCode(companyDetails.country)}</Text>
                                            </View>
                                        )}
                                    </View>
                                )}
                                <Text style={style.infoTitles}>Description</Text>
                                <Text style={{...style.summary, marginBottom: hp("4%")}}>{companyDetails?.description ? companyDetails.description : "No description available"}</Text>
                                {companyDetails?.developed && (
                                    <View>
                                        <Text style={style.infoTitles}>Developed games</Text>
                                        <HorizontalFlashList data={developedGames || []} renderItem={gameItem} />
                                    </View>
                                )}

                                {companyDetails?.published && (
                                    <View style={{paddingBottom: hp("4%")}}>
                                        <Text style={{...style.infoTitles, marginTop: wp("-4%")}}>Published games</Text>
                                        <HorizontalFlashList data={publishedGames || []} renderItem={gameItem} />
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