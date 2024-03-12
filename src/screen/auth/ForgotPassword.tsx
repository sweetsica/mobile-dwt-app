import {Alert, Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import Logo from '../../assets/img/logo.svg';
import {useState} from 'react';
import UsernameInput from '../../components/common/input/UsernameInput.tsx';
import {
    fs_13_400,
    fs_14_400,
    fs_15_500,
    fs_15_700,
    text_black,
    text_center,
    text_red,
} from '../../assets/style.ts';
import PrimaryButton from '../../components/common/button/PrimaryButton.tsx';
import ChevronLeftRed from '../../assets/img/chevron-left-red.svg';
import {ReactNativeModal} from 'react-native-modal';
import CheckSuccess from '../../assets/img/check-success.svg';
import {SafeAreaView} from 'react-native-safe-area-context';
import SendOtpSuccessModal from "../../components/auth/SendOtpSuccessModal.tsx";
import Header from "../../components/header/Header.tsx";
import {dwtApi} from "../../api/service/dwtApi.ts";

const {width} = Dimensions.get('window');
const ForgotPassword = ({navigation}: any) => {
    const [username, setUsername] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(false);
    const handleSubmit = async () => {
        try {
            setLoading(true);
            const res = await dwtApi.forgetPassword({
                email: username
            })
            console.log(res)
            if (res.status === 200) {
                navigation.navigate('VerifyOtp', {
                    email: username,
                    otp: res.data.otp
                })
            }
        } catch (err) {
            console.log(err);

            navigation.navigate('VerifyOtp', {
                email: username,
                otp: '123456'
            })
            // Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại sau');
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.wrapper}>
            <Header title={'Quên mật khẩu'} handleGoBack={() => {
                navigation.goBack()
            }}/>
            <View style={styles.container}>
                <View style={styles.logo}>
                    <Logo width={width - 100} height={150}/>
                </View>
                <Text style={[fs_15_700, text_red, text_center]}>
                    Bạn quên mật khẩu?
                </Text>
                <Text style={[fs_13_400, text_black, text_center, styles.mb3]}>
                    Vui lòng nhập số điện thoại để cấp lại mật khẩu mới
                </Text>
                <UsernameInput
                    username={username}
                    setUsername={setUsername}
                    errorMsg={''}
                    label={'Số điện thoại'}
                    placeholder={'Nhập số điện thoại'}
                    keyBoardType={'phone-pad'}
                />
                <PrimaryButton
                    onPress={handleSubmit}
                    text={'Gửi OTP'}
                    buttonStyle={styles.forgotButton}
                />
            </View>
            <View style={styles.footer}>
                <Pressable style={styles.forgotPassword} hitSlop={8}>
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

    forgotPassword: {
        alignSelf: 'flex-end',
    },
    footer: {
        justifyContent: 'flex-end',
        flex: 0.1,
        paddingBottom: 20,
    },
});
export default ForgotPassword;
