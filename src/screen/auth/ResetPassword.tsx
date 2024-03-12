import {Alert, Dimensions, Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import Logo from '../../assets/img/logo.svg';
import {useRef, useState} from 'react';
import UsernameInput from '../../components/common/input/UsernameInput.tsx';
import {
    fs_12_400,
    fs_13_400,
    fs_14_400,
    fs_15_500,
    fs_15_700, mt10,
    text_black,
    text_center, text_gray,
    text_red,
} from '../../assets/style.ts';
import PrimaryButton from '../../components/common/button/PrimaryButton.tsx';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from "../../components/header/Header.tsx";
import {dwtApi} from "../../api/service/dwtApi.ts";
import FontawesomeIcon from "react-native-vector-icons/FontAwesome6";

const {width} = Dimensions.get('window');
const ResetPassword = ({route, navigation}: any) => {
    const {email, otp} = route.params;
    const [username, setUsername] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
    const [hidePassword, setHidePassword] = useState<boolean>(true);
    const [hideConfirmPassword, setHideConfirmPassword] = useState<boolean>(true);
    const passwordRef = useRef<any>(null)
    const confirmPasswordRef = useRef<any>(null)
    const handleSubmit = async () => {
        navigation.navigate('Login')
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
                    XÁC MINH OTP THÀNH CÔNG
                </Text>
                <Text style={[fs_13_400, text_black, text_center, styles.mb3]}>
                    Vui lòng nhập mật khẩu mới
                </Text>
                <UsernameInput
                    username={username}
                    setUsername={setUsername}
                    errorMsg={''}
                    label={'Số điện thoại'}
                    placeholder={'Nhập số điện thoại'}
                    keyBoardType={'phone-pad'}
                    onSubmitEditing={() => {
                        passwordRef?.current?.focus()
                    }}
                />
                <View style={mt10}>
                    <View style={styles.passwordContainer}>
                        <Text style={[fs_14_400, text_black]}>{'Mật khẩu'}</Text>
                        <View style={styles.row_center}>
                            <TextInput
                                placeholder={'1412345678'}
                                placeholderTextColor="rgba(0, 0, 0, 0.25)"
                                style={[fs_14_400, text_black, styles.input]}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={hidePassword}
                                ref={passwordRef}
                                onSubmitEditing={() => {
                                    confirmPasswordRef?.current?.focus()
                                }}
                            />
                            <Pressable
                                onPress={() => setHidePassword(!hidePassword)}
                                hitSlop={8}
                                style={styles.icon}>
                                <FontawesomeIcon
                                    name={hidePassword ? 'eye-slash' : 'eye'}
                                    size={16}
                                    color="#000"
                                />
                            </Pressable>
                        </View>
                    </View>
                    {passwordError && (
                        <Text style={[text_gray, fs_12_400, styles.error]}>{passwordError}</Text>
                    )}
                </View>

                <View style={mt10}>
                    <View style={styles.passwordContainer}>
                        <Text style={[fs_14_400, text_black]}>{'Nhập lại mật khẩu'}</Text>
                        <View style={styles.row_center}>
                            <TextInput
                                placeholder={'1412345678'}
                                placeholderTextColor="rgba(0, 0, 0, 0.25)"
                                style={[fs_14_400, text_black, styles.input]}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={hideConfirmPassword}
                                ref={confirmPasswordRef}
                            />
                            <Pressable
                                onPress={() => setHideConfirmPassword(!hideConfirmPassword)}
                                hitSlop={8}
                                style={styles.icon}>
                                <FontawesomeIcon
                                    name={hideConfirmPassword ? 'eye-slash' : 'eye'}
                                    size={16}
                                    color="#000"
                                />
                            </Pressable>
                        </View>
                    </View>
                    {confirmPasswordError && (
                        <Text style={[text_gray, fs_12_400, styles.error]}>{confirmPasswordError}</Text>
                    )}
                </View>
                <PrimaryButton
                    onPress={handleSubmit}
                    text={'Đổi mật khẩu'}
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
    footer: {
        justifyContent: 'flex-end',
        flex: 0.1,
        paddingBottom: 20,
    },
    password: {
        width: '100%',
    },
    passwordContainer: {
        backgroundColor: '#F2F6FF',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingTop: 12,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        width: '100%',
    },
    error: {
        marginLeft: 12,
        marginTop: 4,
        fontStyle: 'italic',
    },
    row_center: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    icon: {
        width: '10%',
        alignItems: 'flex-end',
    },
    input: {
        height: 40,
        width: '90%',
    },
});
export default ResetPassword;
