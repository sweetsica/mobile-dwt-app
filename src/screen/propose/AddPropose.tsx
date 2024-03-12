import Header from '../../components/header/Header.tsx';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  fs_15_400,
  fs_15_700,
  text_black,
  text_center,
  text_red,
  text_white,
} from '../../assets/style.ts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import ToastSuccessModal from '../../components/common/modal/ToastSuccessModal.tsx';
import PrimaryDropdown from '../../components/common/dropdown/PrimaryDropdown.tsx';
import { dwtApi } from '../../api/service/dwtApi.ts';
import ToastConfirmModal from '../../components/common/modal/ToastConfirmModal.tsx';

export default function AddPropose({ navigation }: any) {
  const [isOpenCancelReportModal, setIsOpenCancelReportModal] = useState(false);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);
  const [currentType, setCurrentType] = useState(0);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (currentType === 0) {
      return Alert.alert('Vui lòng chọn phân loại');
    }
    if (description === '') {
      return Alert.alert('Vui lòng nhập vấn đề tồn đọng');
    }

    try {
      setIsLoading(true);
      const response = await dwtApi.createNewPropose({
        description: description,
        type: currentType,
      });

      if (response.status === 200) {
        setIsLoading(false);
        setIsOpenSuccessModal(true);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  const handleGoBack = () => {
    setDescription('');
    setCurrentType(0);
    setIsOpenCancelReportModal(false);
    navigation.goBack();
  };

  const handleOk = () => {
    setDescription('');
    setCurrentType(0);
    setIsOpenSuccessModal(false);
    navigation.goBack('Propose');
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <Header
        title="THÊM ĐỀ XUẤT"
        handleGoBack={() => {
          setIsOpenCancelReportModal(true);
        }}
        rightView={
          <TouchableOpacity style={styles.sendButton} onPress={handleSave}>
            <Text style={[fs_15_700, text_white, text_center]}>Gửi</Text>
          </TouchableOpacity>
        }
      />
      <View style={styles.content}>
        <View style={[styles.inputBox]}>
          <Text style={[fs_15_700, text_black]}>
            Phân loại <Text style={text_red}>*</Text>:
          </Text>
          <PrimaryDropdown
            data={[
              {
                label: 'Than phiền',
                value: 1,
              },
              {
                label: 'Cần giải quyết',
                value: 2,
              },
            ]}
            value={currentType}
            changeValue={setCurrentType}
            dropdownStyle={styles.dropdownStyle}
            isSearch={false}
            placeholder={'Chọn phân loại'}
          />
        </View>

        <View style={[styles.inputBox]}>
          <Text style={[fs_15_700, text_black]}>
            Vấn đề tồn đọng<Text style={text_red}>*</Text>:
          </Text>
          <TextInput
            style={[styles.input, text_black, fs_15_400]}
            placeholderTextColor={'#787878'}
            value={description}
            onChangeText={setDescription}
            multiline={true}
          />
        </View>
      </View>
      <ToastSuccessModal
        visible={isOpenSuccessModal}
        handlePressOk={handleOk}
        description={'Thêm đề xuất thành công'}
      />
      <ToastConfirmModal
        visible={isOpenCancelReportModal}
        handleOk={() => {
          setIsOpenCancelReportModal(false);
        }}
        handleCancel={handleGoBack}
        okText={'Tiếp tuc'}
        cancelText={'Hủy đề xuất'}
        description={'Bạn có muốn hủy thêm đề xuất?'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  sendButton: {
    backgroundColor: '#BC2426',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  content: {
    paddingHorizontal: 15,
    marginTop: 20,
    gap: 20,
  },
  inputBox: {
    gap: 6,
  },
  dropdownStyle: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 7,
  },
});
