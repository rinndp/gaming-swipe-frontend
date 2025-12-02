import Toast from "react-native-toast-message";

export const showCustomToast = (text: string | undefined) => {
    Toast.show({
        position: "bottom",
        type: 'error',
        autoHide: true,
        visibilityTime: 1400,
        text1: text,
    });
}