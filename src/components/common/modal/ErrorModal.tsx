import {ReactNativeModal} from 'react-native-modal';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CheckSuccess from '../../../assets/img/check-success.svg';
import {
    fs_15_400,
    fs_15_500,
    fs_15_700, mb10,
    mb20,
    text_black,
    text_center,
    text_red,
} from '../../../assets/style.ts';
import PropTypes, {InferProps} from 'prop-types';

export default function ErrorModal(
    {
        visible,
        handleOk,
        handleCancel,
        okText,
        cancelText,
        description,
    }: InferProps<typeof ErrorModal.propTypes>) {
    return visible ?  (
        <View style={styles.modal}>
            <View style={styles.modalContent}>
                <Text style={[fs_15_700, text_red, text_center]}>Thông báo</Text>
                <Text style={[fs_15_700, text_black, text_center, mb20]}>
                    {description}
                </Text>

                <View style={styles.divider}/>

                <TouchableOpacity onPress={handleOk}>
                    <Text
                        style={[
                            fs_15_400,
                            text_center,
                            {paddingVertical: 15, color: '#0D6EFD'},
                        ]}>
                        {okText}
                    </Text>
                </TouchableOpacity>

                <View style={styles.divider}/>

                <TouchableOpacity onPress={handleCancel}>
                    <Text
                        style={[fs_15_400, text_red, text_center, {paddingVertical: 15}]}>
                        {cancelText}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    ) : null
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        backgroundColor: 'rgba(217, 217, 217, 0.75)',
        justifyContent: 'center',
        margin: 0,
        position: 'absolute',
        zIndex: 999,
        width: '100%',
        height: '100%',
        paddingHorizontal: 40,
    },
    modalContent: {
        backgroundColor: '#fff',
        paddingTop: 20,
        alignItems: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#D9D9D9',
        width: '100%',
    },
});

ErrorModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    handleOk: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    description: PropTypes.string,
};
