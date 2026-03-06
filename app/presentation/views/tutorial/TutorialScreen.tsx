import { TouchableOpacity, View } from "react-native";
import { Text } from "../../components/Text";
import stylesAuthViews from "../auth/StylesAuthViews";
import { useTheme } from "../../provider/ThemeProvider";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { PropsStackNavigation } from "../../interfaces/StackNav";
import { useCallback, useMemo, useRef } from "react";
import { Image } from "expo-image";
import stylesHome from "../home/StyleHome";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NopeButton } from "../../components/NopeButton";
import { RewindButton } from "../../components/RewindButton";
import { LikeButton } from "../../components/LikeButton";
import { Swiper, SwiperCardRefType } from "rn-swiper-list";
import Animated, { FadeIn, FadeInDown, FadeOutDown, SlideInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { AppColors } from "../../theme/AppTheme";
import { RootStackParamsList } from "../../../../App";
import stylesTutorial from "./StylesTutorial";

interface TutorialCard {
    id: number;
    title: string;
    description: string;
    image?: string;
    video?: any;
    needsBackgroundColor?: boolean;
    needsTintColor?: boolean;
    needsFitCover?: boolean;
}

const cards  = [
    {
        id: 0,
        title: "Welcome to GamingSwipe",
        description: "GamingSwipe is a platform that allows you to swipe through games and find your next favorite game.",
        image: require("../../../../assets/icon.png"),
        needsFitCover: true,
    },
    {
        id: 1,
        title: "How does the swiper work?",
        description: "Swipe left to discard a video game, swipe right to like it and add it to your library, or tap the rewind button to undo your last swipe.",
        image: require("../../../../assets/gifs/swiper.gif"),
        needsBackgroundColor: true,
    },
    {
        id: 2,
        title: "How to see more details about a game?",
        description: "Tap on a game cover to see more details about it, including the game's storyline, summary, videos, screenshots, etc.",
        image: require("../../../../assets/gifs/details.gif"),
        needsBackgroundColor: true,
    },
    {
        id: 3,
        title: "How to manage your library?",
        description: "Organize your games by To-play and Played, with the possibility to remove any game from your library.",
        image: require("../../../../assets/gifs/library.gif"),
        needsBackgroundColor: true,
    },
    {
        id: 4,
        title: "How to see other users' libraries?",
        description: "Go to the Search tab and search for a user by username, then tap on the user's profile to see their library.",
        image: require("../../../../assets/gifs/users.gif"),
        needsBackgroundColor: true,
    },
    {
        id: 5,
        title: "You are ready to start swiping!",
        description: "Swipe through more than 300k games and find your next favorite game.",
        image: require("../../../../assets/gifs/solid-snake-fortnite.gif"),
        needsFitCover: true,
    },
]

type TutorialRouteProp = RouteProp<RootStackParamsList, "TutorialScreen">;


export function TutorialScreen({navigation = useNavigation()}: PropsStackNavigation) {
    const { colors } = useTheme();
    const styleH = useMemo(() => stylesHome(colors), [colors]);

    const route = useRoute<TutorialRouteProp>()
    const { firstTime } = route.params;
    
    const ref = useRef<SwiperCardRefType>(null);
  
    const renderCard = useCallback((item: TutorialCard) => {
        return (
            <View style={{width: "100%", height:"100%"}}>
                <Image
                    source={item.image}
                    style={[styleH.image, {backgroundColor: item.needsBackgroundColor ? AppColors.backgroundColor : "transparent"}]}
                    contentFit={item.needsFitCover ? "cover" : "contain"}
                    priority={"high"}
                    transition={150}
                />
                <View style={{marginVertical: hp("1%"), paddingHorizontal: wp("5%")}}>
                    <View style={styleH.firstRowCardContainer}>
                        <Text style={{fontSize: wp("4%"), fontFamily: "zen_kaku_black"}}> {item.title}</Text>
                    </View>
                    <View style={{marginTop: hp("1%")}} collapsable={false}>
                        <Text style={{fontSize: wp("3.4%"), fontFamily: "zen_kaku_regular", textAlign: "justify"}}> {item.description}</Text>
                    </View>
                </View>
            </View>
        );
    }, [styleH, colors]);

    const handleSkip = () => {
        if (firstTime) {
            navigation.replace("UserNavigation");
        } else {
            navigation.goBack();
        }
    }

    return (
        <View style={stylesAuthViews(colors).container}>
            <Animated.View entering={FadeIn.duration(500)} style={stylesTutorial.header}>
                <Animated.Text style={stylesAuthViews(colors).h2}>Tutorial</Animated.Text>
                <TouchableOpacity 
                  style={{flexDirection: "row",alignItems: "center", gap: wp("1%"), height: hp("5%"), width: wp("12%"), marginTop: hp("00.6%")}} 
                  onPress={() => handleSkip()}>
                    <Animated.Text 
                        entering={FadeIn.duration(500)} 
                        style={{fontSize: wp("4%"), fontFamily: "zen_kaku_regular", color: colors.white}}>Skip</Animated.Text>
                    <Ionicons name="arrow-forward-outline" size={10} color={colors.white} style={{marginTop: hp("0.3%")}} />
                </TouchableOpacity>
            </Animated.View>
            <GestureHandlerRootView style={[styleH.cardContainer, { marginBottom: hp("11%")}]}>
                <Swiper
                    ref={ref}
                    data={cards as TutorialCard[]}
                    cardStyle={[styleH.cardStyle]}
                    overlayLabelContainerStyle={styleH.overlayLabelContainer}
                    swipeVelocityThreshold={1000}
                    prerenderItems={2}
                    renderCard={renderCard}
                    disableTopSwipe={true}
                    disableBottomSwipe={true}
                    onSwipeRight={async (cardIndex: number) => {
                        console.log('Card index', cardIndex);
                    }}
                    onSwipedAll={() => {
                       handleSkip();
                    }}
                />
            </GestureHandlerRootView>
            <View style={stylesTutorial.buttonsContainer}>
                    <View style={{alignItems: "center", gap: hp("1%")}}>
                        <RewindButton onPress={() =>  ref.current?.swipeBack()}></RewindButton>
                        <Text style={{fontSize: wp("3.7%"), fontFamily: "zen_kaku_regular"}}>Rewind</Text>
                    </View>
                    <View style={{alignItems: "center", gap: hp("1%")}}>
                        <LikeButton onPress={() => ref.current?.swipeRight()}></LikeButton>
                        <Text style={{fontSize: wp("3.7%"), fontFamily: "zen_kaku_regular"}}>Next</Text>
                    </View>
            </View>
        </View>
    )
}