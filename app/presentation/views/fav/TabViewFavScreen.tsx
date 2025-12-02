import * as React from 'react';
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {
    View,
    useWindowDimensions, Text,
} from 'react-native';
import {
    TabView,
    SceneMap,
    TabBar,
} from 'react-native-tab-view';
import {AppColors} from "../../theme/AppTheme";
import {FavGamesScreen} from "./FavGamesScreen";
import {PlayedGamesScreen} from "./PlayedGamesScreen";
import styleFav from "./StyleFav";
import stylesTabBar from "./StylesTabBar";
import {useEffect, useState} from "react";
import {useUserGamesContext} from "../../provider/GameProvider";
import Animated, {FadeInUp} from 'react-native-reanimated';
import AnimatedNumber from "react-native-animated-numbers";


const renderScene = SceneMap({
    favgames: FavGamesScreen,
    playedgames: PlayedGamesScreen,
});

export default function TabViewFavScreen({}) {
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const {favListGames, playedListGames} = useUserGamesContext()
    const [favGamesLength, setFavGamesLenght] = useState(favListGames.length);
    const [playedGamesLength, setPlayedGamesLenght] = useState(playedListGames.length);

    useEffect(() => {
        setFavGamesLenght(favListGames.length);
    }, [favListGames.length]);

    useEffect(() => {
        setPlayedGamesLenght(playedListGames.length);
    }, [playedListGames.length]);

    const renderTabBar = (props: any) => (
        <View style={styleFav.header}>
            <Animated.View
                entering={FadeInUp.duration(800)}>
                <Text style={styleFav.title}>Game library</Text>
                <View
                    style={{alignItems:"center"}}>
                    <View
                        style={{flexDirection:"row", gap:wp("32%"), position:"absolute"}}>
                        <AnimatedNumber fontStyle={stylesTabBar.textLabels} animateToNumber={favGamesLength} animationDuration={400}/>
                        <AnimatedNumber fontStyle={stylesTabBar.textLabels} animateToNumber={playedGamesLength} animationDuration={400}/>
                    </View>
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: AppColors.white }}
                        style={stylesTabBar.favScreenTabLabels}
                    />
                </View>
            </Animated.View>
        </View>
    );

    const [routes] = React.useState([
        { key: 'favgames', title: 'I want them' },
        { key: 'playedgames', title: 'I played them' },
    ]);

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={renderTabBar}
            initialLayout={{ width: layout.width }}
        />
    );
}