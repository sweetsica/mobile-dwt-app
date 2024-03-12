import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import Logo from '../../assets/img/logo.svg';
import {
    fs_13_400,
    fs_14_400,
    fs_15_700, mt20,
    text_black,
    text_center,
    text_red,
} from '../../assets/style.ts';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from "../../components/header/Header.tsx";
import OTPTextInput from 'react-native-otp-textinput';
import {useRef, useState} from "react";
import PrimaryButton from "../../components/common/button/PrimaryButton.tsx";

const {width: windowWidth} = Dimensions.get('window');
const VerifyOtp = ({route, navigation}: any) => {
    const {email, otp} = route.params;
    const [isErrorOtp, setIsErrorOtp] = useState<boolean>(false);
    const [inputOtp, setInputOtp] = useState<string>('');
    const ref = useRef<any>(null)
    const handleSubmit = () => {
        if (otp !== inputOtp) {
            setIsErrorOtp(true)
        } else {
            setIsErrorOtp(false)
            setInputOtp('')
            navigation.navigate('ResetPassword', {email, otp})
        }
        console.log(inputOtp, email, otp)
    }
    return (
        <SafeAreaView style={styles.wrapper}>
            <Header title={'Quên mật khẩu'} handleGoBack={() => {
                navigation.goBack()
            }}/>
            <View style={styles.container}>
                <View style={styles.logo}>
                    <Logo width={windowWidth - 100} height={150}/>
                </View>
                <Text style={[fs_15_700, text_red, text_center]}>
                    XÁC MINH OTP
                </Text>
                <Text style={[fs_13_400, text_black, text_center, styles.mb3]}>
                    Vui lòng nhập mã OTP được gửi về số điện thoại của bạn
                </Text>
                <View style={{alignItems: 'center'}}>
                    <OTPTextInput
                        ref={ref}
                        inputCount={6}
                        tintColor={text_black.color}
                        offTintColor={isErrorOtp ? text_red.color : 'rgba(0, 0, 0, 0.10)'}
                        handleTextChange={(e: any) => {
                            setInputOtp(e)
                        }}
                        textInputStyle={isErrorOtp ? styles.errorInput : styles.input}
                    />
                </View>
                {
                    isErrorOtp && (
                        <Text style={[text_red, fs_14_400, text_center, mt20]}>
                            Mã OTP không hợp lệ. Vui lòng kiểm tra lại.
                        </Text>
                    )
                }

                <PrimaryButton
                    onPress={handleSubmit}
                    text={'Gửi OTP'}
                    buttonStyle={styles.forgotButton}
                />
            </View>
            <View style={styles.footer}>
                <Pressable hitSlop={8}>
                    <Text style={[fs_14_400, text_black, text_center]}>
                        Nếu gặp vấn đề về tài khoản hãy liên hệ đến{' '}
                        <Text style={[text_red]}>Admin</Text>
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fff',
        flex: 1,
    },
    forgotButton: {
        paddingVertical: 12,
        marginVertical: 20,
    },
    logo: {
        alignItems: 'center',
    },
    mb3: {
        marginBottom: 30,
    },
    container: {
        flex: 0.9,
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    input: {
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'rgba(0, 0, 0, 0.10)',
        width: (windowWidth - 100) / 6,
        height: (windowWidth - 100) / 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(217, 217, 217, 0.20)',
        fontSize: 20,
        fontWeight: '500',
    },
    errorInput: {
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#DD0013',
        width: (windowWidth - 100) / 6,
        height: (windowWidth - 100) / 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        fontSize: 20,
        fontWeight: '500',
    },
    footer: {
        justifyContent: 'flex-end',
        flex: 0.1,
        paddingBottom: 20,
    },
});
export default VerifyOtp;
