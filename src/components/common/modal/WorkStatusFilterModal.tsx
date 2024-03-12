import {Pressable, StyleSheet, Text, View} from 'react-native';
import PropTypes, {InferProps} from 'prop-types';
import {ReactNativeModal} from 'react-native-modal';
import {fs_14_700, text_center, text_red} from '../../../assets/style.ts';
import CloseIcon from '../../../assets/img/close-icon.svg';
import PrimaryCheckbox from '../checkbox/PrimaryCheckbox.tsx';
import {useState} from 'react';
import PrimaryButton from '../button/PrimaryButton.tsx';
import {
  LIST_WORK_STATUS_FILTER,
  WORK_STATUS_COLOR,
} from '../../../assets/constant.ts';

export default function WorkStatusFilterModal({
  visible,
  setVisible,
  setStatusValue,
  statusValue,
}: InferProps<typeof WorkStatusFilterModal.propTypes>) {
  const [currentFilter, setCurrentFilter] = useState(statusValue.value);

  const handleChangeCheck = (value: string) => {
    setCurrentFilter(value);
  };

  const handleSaveValue = () => {
    setStatusValue(
      LIST_WORK_STATUS_FILTER.find(item => item.value === currentFilter),
    );
    setVisible(false);
  };
  return (
    <ReactNativeModal
      animationInTiming={200}
      animationOutTiming={200}
      animationIn={'fadeInUp'}
      animationOut={'fadeOutDown'}
      swipeDirection={'down'}
      backdropTransitionInTiming={200}
      backdropTransitionOutTiming={200}
      onSwipeComplete={() => {
        setVisible(false);
      }}
      style={styles.wrapper}
      isVisible={visible}
      onBackdropPress={() => {
        setVisible(false);
      }}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[fs_14_700, text_red, text_center]}>LỌC TRẠNG THÁI</Text>
          <Pressable
            hitSlop={10}
            onPress={() => {
              setVisible(false);
            }}>
            <CloseIcon width={20} height={20} style={styles.closeIcon} />
          </Pressable>
        </View>
        <View style={styles.row_container}>
          {LIST_WORK_STATUS_FILTER.map((item: any, index) => (
            <View
              key={index}
              style={[
                styles.row,
                index === 0 && styles.borderTopBottom,
                {
                  // @ts-ignore
                  backgroundColor: WORK_STATUS_COLOR[item.value],
                },
              ]}>
              <PrimaryCheckbox
                label={item.label}
                checked={currentFilter === item.value}
                onChange={() => handleChangeCheck(item.value)}
              />
            </View>
          ))}
          <PrimaryButton
            onPress={handleSaveValue}
            text={'Áp dụng bộ lọc'}
            buttonStyle={styles.button}
          />
        </View>
      </View>
    </ReactNativeModal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'rgba(217, 217, 217, 0.75)',
    justifyContent: 'center',
    margin: 0,
  },
  content: {
    backgroundColor: '#FFF',
    borderRadius: 15,
  },
  header: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
    position: 'relative',
  },
  closeIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  row_container: {
    paddingVertical: 15,
  },
  row: {
    paddingVertical: 7,
    paddingHorizontal: 20,
  },
  borderTopBottom: {
    borderTopWidth: 1,
    borderTopColor: '#D9D9D9',
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 9,
    marginHorizontal: 20,
  },
});

WorkStatusFilterModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  setStatusValue: PropTypes.func.isRequired,
  statusValue: PropTypes.any,
};
