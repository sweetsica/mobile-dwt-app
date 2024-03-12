import {StyleSheet, Text, View} from "react-native";
import HomeHeader from "../home/HomeHeader.tsx";
import {SafeAreaView} from "react-native-safe-area-context";
import ComingSoonImage from "./../../assets/img/coming-soon.svg";
import {fs_14_700, fs_16_700, text_black, text_red} from "../../assets/style.ts";
import PrimaryButton from "../common/button/PrimaryButton.tsx";

export default function ComingSoonScreenComponent({navigation}: any) {
    return (
        <SafeAreaView style={styles.wrapper}>
            <HomeHeader navigation={navigation}/>
            <View style={{
                flex: 1,
            }}>
                <View style={{
                    flex: 0.9,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <ComingSoonImage/>

                    <Text style={[fs_16_700, text_red, {
                        marginTop: 20,
                    }]}>ĐANG PHÁT TRIỂN!</Text>
                    <Text style={[fs_14_700, text_black]}>Tính năng đang phát triển, vui lòng quay lại sau! </Text>
                </View>
                <View style={styles.footer}>
                    <PrimaryButton
                        onPress={() => {
                            navigation.goBack();
                        }}
                        text={'Trở về'}
                        buttonStyle={styles.button}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
    },
    footer: {
        flex: 0.1,
        alignSelf: 'flex-end',
        paddingHorizontal: 15,
        width: '100%',
    },
    button: {
        paddingVertical: 12,
        borderRadius: 6,
    }
});
