import {ReactNativeModal} from 'react-native-modal';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CheckSuccess from '../../../assets/img/check-success.svg';
import {
  fs_15_400,
  fs_15_500,
  fs_15_700,
  mb20,
  text_black,
  text_center,
  text_red,
} from '../../../assets/style.ts';
import PropTypes, {InferProps} from 'prop-types';

export default function ToastConfirmModal({
  visible,
  handleOk,
  handleCancel,
  okText,
  cancelText,
  description,
}: InferProps<typeof ToastConfirmModal.propTypes>) {
  return (
    <ReactNativeModal isVisible={visible} style={styles.modal}>
      <View style={styles.modalContent}>
        <Text style={[fs_15_700, text_black, text_center, mb20, {
          width: '90%',
        }]}>
          {description}
        </Text>

        <View style={styles.divider} />

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

        <View style={styles.divider} />

        <TouchableOpacity onPress={handleCancel}>
          <Text
            style={[fs_15_400, text_red, text_center, {paddingVertical: 15}]}>
            {cancelText}
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
    paddingTop: 30,
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#D9D9D9',
    width: '100%',
  },
});

ToastConfirmModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  handleOk: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  description: PropTypes.string,
};
