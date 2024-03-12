import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {
    fs_12_400,
    fs_14_400,
    text_black,
    text_gray,
} from '../../../assets/style.ts';
import PropTypes, {InferProps} from 'prop-types';
import FontawesomeIcon from 'react-native-vector-icons/FontAwesome6';

export default function UsernameInput(
    {
        username,
        setUsername,
        errorMsg,
        label,
        placeholder,
        onSubmitEditing,
        keyBoardType,
    }: InferProps<typeof UsernameInput.propTypes>) {
    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <Text style={[fs_14_400, text_black]}>{label}</Text>
                <View style={styles.row_center}>
                    <TextInput
                        placeholder={placeholder || 'Email hoặc số điện thoại'}
                        placeholderTextColor="rgba(0, 0, 0, 0.25)"
                        style={[fs_14_400, text_black, styles.input]}
                        value={username}
                        onChangeText={setUsername}
                        onSubmitEditing={() => {
                            onSubmitEditing && onSubmitEditing()
                        }}
                        keyboardType={keyBoardType || 'default'}
                    />
                    <Pressable
                        onPress={() => setUsername('')}
                        hitSlop={8}
                        disabled={username === ''}
                        style={[styles.icon, {opacity: username !== '' ? 1 : 0}]}>
                        <FontawesomeIcon name={'circle-xmark'} size={16} color="#000"/>
                    </Pressable>
                </View>
            </View>
            {errorMsg !== '' && (
                <Text style={[text_gray, fs_12_400, styles.error]}>{errorMsg}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    },
    container: {
        backgroundColor: '#F2F6FF',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingTop: 12,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        width: '100%',
    },
    icon: {
        width: '10%',
        alignItems: 'flex-end',
    },
    row_center: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    input: {
        height: 40,
        width: '90%',
    },
    error: {
        marginLeft: 12,
        marginTop: 4,
        fontStyle: 'italic',
    },
});

UsernameInput.propTypes = {
    username: PropTypes.string.isRequired,
    setUsername: PropTypes.func.isRequired,
    errorMsg: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    onSubmitEditing: PropTypes.func,
    keyBoardType: PropTypes.any,
};

UsernameInput.defaultProps = {
    errorMsg: '',
    label: 'Tên đăng nhập',
    placeholder: 'Email hoặc số điện thoại',
};
