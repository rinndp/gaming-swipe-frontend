import React, {useCallback, useEffect, useState} from 'react';
import {
    View,
    TouchableOpacity,
    Modal,
    StyleSheet,
    ActivityIndicator,
    ScrollView, Image,
} from 'react-native';
import {Text} from "./Text";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { IgdbApiDelivery } from '../../data/sources/remote/igdbAPI/IgdbApiDelivery';
import { useTheme } from "../provider/ThemeProvider";
import {useFocusEffect} from "@react-navigation/native";
import {Platform} from "../../domain/entities/Game";
import {popularPlatforms} from "../utils/PopularPlatformsArray";
import Slider from "@react-native-community/slider";
import {useGenres} from "../hooks/UseGenres";
import { AppColors } from '../theme/AppTheme';

interface FilterModalProps {
    onApply: (filters: { genres: Platform []; platforms: Platform []; rating: number }) => void;
    selectedPlatform: Platform [];
    selectedGenre: Platform [];
    selectedRating: number;
    
}

export const DEFAULT_RATING = 50;

function FilterModal({ onApply, selectedGenre, selectedPlatform, selectedRating}: FilterModalProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [categories, setCategories] = useState<Platform[]>([]);
    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [selectedGenresInModal, setSelectedGenresInModal] = useState<Platform []>([]);
    const [selectedPlatformsInModal, setSelectedPlatformsInModal] = useState<Platform []>([]);
    const [selectedRatingInModal, setSelectedRatingInModal] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    const { colors, theme } = useTheme();
    const styleF = styles(colors);

    const {data, isLoading, error} = useGenres()

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                if (!isLoading && data) {
                    setCategories(data);
                    setPlatforms(popularPlatforms);
                    setSelectedPlatformsInModal(selectedPlatform);
                    setSelectedGenresInModal(selectedGenre);
                    setSelectedRatingInModal(selectedRating);
                }
            } catch (err) {
                console.log('Error fetching filters:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFilters();
    }, [isLoading]);

    const renderOptions = (data: Platform[], selecteds: Platform [], setSelected: (val: Platform []) => void) => (
        <View style={styleF.optionsContainer}>
            {data.map((item) => (
                <TouchableOpacity
                    key={item.name}
                    style={[styleF.optionButton, selecteds?.some(selected => selected.name === item.name) && styleF.selectedOption]}
                    onPress={() =>
                        selecteds?.some(selected => selected.name === item.name)
                            ? setSelected(selecteds?.filter(selected => selected.name !== item.name))
                            : setSelected([...selecteds, item])}
                >
                    <Text style={styleF.optionText}>
                        {item.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    const applyFilters = () => {
        onApply({
            genres: selectedGenresInModal,
            platforms: selectedPlatformsInModal,
            rating: selectedRatingInModal
        });
        setModalVisible(false);
    };

    const clearFilters = () => {
        setSelectedGenresInModal([])
        setSelectedPlatformsInModal([])
        setSelectedRatingInModal(DEFAULT_RATING)
    }

    const nullFilters = selectedGenre.length === 0 && selectedPlatform.length === 0 && selectedRating === DEFAULT_RATING

    return (
        <View style={styleF.container}>
            <TouchableOpacity style={styleF.button} onPress={() => setModalVisible(true)}>
                <Image source={nullFilters
                    ? require("../../../assets/filter-icon.png")
                    : theme === "light" ? require("../../../assets/inverted-active-filter-icon.png") : require("../../../assets/active-filter-icon.png")}
                       style={{
                           width: wp("7%"),
                           height: wp("7%"),
                           tintColor: nullFilters  ? colors.white : "",
                }}
                />
            </TouchableOpacity>
            <Modal
                visible={modalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styleF.modalOverlay}>
                    <View style={styleF.modalContent}>
                        <TouchableOpacity
                            style={styleF.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styleF.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                        {loading ? (
                            <ActivityIndicator size="large" />
                        ) : (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text style={styleF.label}>Rating</Text>
                                <View style={{flexDirection:"row", paddingHorizontal: wp("2%"), alignItems:"center", gap: wp("5%")}}>
                                    <Slider
                                        style={{width: "80%", height: hp("2%")}}
                                        minimumValue={0}
                                        maximumValue={100}
                                        step={5}
                                        thumbTintColor={colors.white}
                                        value={selectedRatingInModal}
                                        onValueChange={setSelectedRatingInModal}
                                        minimumTrackTintColor={colors.secondaryColor}
                                        maximumTrackTintColor="#000000"
                                    />
                                    <Text style={styleF.label}>{selectedRatingInModal}</Text>
                                </View>
                                <Text style={styleF.label}>Platforms</Text>
                                {renderOptions(platforms, selectedPlatformsInModal, setSelectedPlatformsInModal)}
                                <Text style={styleF.label}>Categories</Text>
                                {renderOptions(categories, selectedGenresInModal, setSelectedGenresInModal)}
                            </ScrollView>
                        )}
                        <View style={{flexDirection:"row", paddingHorizontal: wp("2%")}}>
                            <TouchableOpacity
                                style={[styleF.button, { marginTop: hp("2%"), width: "50%", alignItems: "flex-start" }]}
                                onPress={clearFilters}
                            >
                                <Text style={{...styleF.buttonText, color: colors.red}}>Clear filters</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styleF.button, { marginTop: hp("2%"), width: "50%" }]}
                                onPress={applyFilters}
                            >
                                <Text style={styleF.buttonText}>Apply filters</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default FilterModal;

const styles = (colors: any) => StyleSheet.create({
    container: {
        paddingHorizontal: wp("5.4%"),
    },
    button: {
        backgroundColor: colors.transparent,
        alignItems: "flex-end",
    },
    buttonText: {
        fontSize: wp("3.9%"),
        fontFamily: "zen_kaku_regular",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.48)',
        justifyContent: 'center',
        padding: wp("4%"),
    },
    modalContent: {
        backgroundColor: colors.buttonBackground,
        padding: wp("8%"),
        borderRadius: 15,
        maxHeight: "80%",
    },

    label: {
        textAlign: "center",
        fontSize: wp("4%"),
        fontFamily: "zen_kaku_medium",
        alignSelf: "flex-start",
        marginVertical: hp("3%"),
        marginStart: wp("2%"),
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: wp("1%"),
    },
    optionButton: {
        backgroundColor: colors.lighterButtonBackground,
        padding: wp("2%"),
        borderRadius: 20,
        marginBottom:hp("1%"),
    },
    selectedOption: {
        backgroundColor: colors.secondaryColor,
    },
    optionText: {
        color: colors.white,
        fontSize: wp("3%"),
        fontFamily: "zen_kaku_regular",
    },
    closeButton: {
        position: 'absolute',
        right: wp("1%"),
        padding: wp("4%"),
    },
    closeButtonText: {
        fontSize: wp("5%"),
        color: colors.red,
    },
});
