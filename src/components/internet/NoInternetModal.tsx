import {StyleSheet, Text, View} from "react-native";
import {ReactNativeModal} from "react-native-modal";
import PrimaryButton from "../common/button/PrimaryButton.tsx";
import {useCallback, useEffect, useState} from "react";
import NetInfo from "@react-native-community/netinfo";
import {useFocusEffect} from "@react-navigation/native";

const NoInternetModal = () => {
    const [hasInternet, setHasInternet] = useState(true);
    useFocusEffect(
        useCallback(() => {
            const netInfoSubscription = NetInfo.addEventListener((state) => {
                const offline = !(state.isConnected && state.isInternetReachable);
                setHasInternet(!offline);
            });

            return () => {
                netInfoSubscription();
            };
        }, [])
    );

    return (
        <ReactNativeModal
            isVisible={!hasInternet}
            style={styles.modal}
            animationInTiming={200}
            animationOutTiming={200}
            backdropTransitionInTiming={200}
            backdropTransitionOutTiming={200}
        >
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Lỗi mất mạng</Text>
                <Text style={styles.modalText}>
                    Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng và thử lại.
                </Text>
                {/*<PrimaryButton*/}
                {/*    onPress={onRetry}*/}
                {/*    disabled={isRetrying}*/}
                {/*    text={isRetrying ? "Đang tải..." : "Thử lại"}*/}
                {/*/>*/}
            </View>
        </ReactNativeModal>
    )
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: "flex-end",
        margin: 0,
    },
    modalContainer: {
        backgroundColor: "white",
        width: "100%",
        padding: 15,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 8,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 16,
        textAlign: "center",
    },
})

export default NoInternetModal;