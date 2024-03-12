import {ReactNativeModal} from 'react-native-modal';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
    fs_14_400, fs_14_500,
    fs_16_500,
    text_black,
    text_center,
    text_gray,
} from '../../assets/style.ts';
import PropTypes, {InferProps} from 'prop-types';
import {fs_15_400, text_red} from "../../assets/style.ts";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";

export default function SendOtpSuccessModal(
    {
        visible,
        handlePressOk,
    }: InferProps<typeof SendOtpSuccessModal.propTypes>) {
    return (
        <ReactNativeModal isVisible={visible} style={styles.modal}>
            <View style={styles.modalContent}>
                <TouchableOpacity style={styles.closeIcon} hitSlop={10}>
                    <FontAwesome6Icon name="xmark" size={20} color="#000"/>
                </TouchableOpacity>
                <Text style={[fs_16_500, text_red, text_center]}>Thông báo</Text>
                <View style={styles.divider} />
                <Text style={[fs_14_500, text_gray, text_center, styles.description]}>
                    Mã OTP đã được gửi về số điện thoại của bạn. Nhập mã OTP để lấy lại mật khẩu.
                </Text>

                <View style={styles.divider} />
                <TouchableOpacity onPress={handlePressOk}>
                    <Text
                        style={[
                            fs_15_400,
                            text_center,
                            {paddingBottom: 15, color: '#0D6EFD'},
                        ]}>Nhập OTP
                    </Text>
                </TouchableOpacity>

            </View>
        </ReactNativeModal>
    );
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        margin: 0,
        paddingHorizontal: 40,
    },
    modalContent: {
        backgroundColor: '#fff',
        paddingTop: 10,
        position: 'relative',
    },
    closeIcon: {
        position: 'absolute',
        right: 15,
        top: 10,
    },
    description: {
        marginVertical: 15,
    },
    divider: {
        height: 1,
        backgroundColor: '#D9D9D9',
        width: '100%',
        marginVertical: 10,
    },
});

SendOtpSuccessModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    handlePressOk: PropTypes.func.isRequired,
};
