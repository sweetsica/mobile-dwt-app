import {Alert, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/header/Header.tsx';
import { fs_15_700, text_black, text_center, text_white } from '../../assets/style.ts';
import { TextInput } from 'react-native';
import FontawesomeIcon from 'react-native-vector-icons/FontAwesome6';
import { useState } from 'react';
import LoadingActivity from '../../components/common/loading/LoadingActivity.tsx';
import { dwtApi } from '../../api/service/dwtApi.ts';
import { useConnection } from '../../redux/connection';
import ToastSuccessModal from '../../components/common/modal/ToastSuccessModal.tsx';

export default function SettingInfo({ navigation }: any) {
  const {
    connection: { userInfo },
  } = useConnection();
  const [hideOldPassword, setHideOldPassword] = useState<boolean>(true);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [hideNewPassword, setHideNewPassword] = useState<boolean>(true);
  const [newPassword, setNewPassword] = useState<string>('');
  const [hideConfirmPassword, setHideConfirmPassword] = useState<boolean>(true);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorConfirmPassword, setErrorConfirmPassword] = useState<string>('');
  const [errorOldPassword, setErrorOldPassword] = useState<string>('');
  const [errorNewPassword, setErrorNewPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState<boolean>(false);

  const handleSave = async () => { 
    if (oldPassword === '') {
      setErrorOldPassword('Vui lòng nhập mật khẩu cũ');
      return;
    }
    if (oldPassword.length < 6) {
      setErrorOldPassword('Mật khẩu phải có ít nhất 6 kí tự');
      return;
    }
    setErrorOldPassword('');
    if (newPassword === '') {
      setErrorNewPassword('Vui lòng nhập mật khẩu mới');
      return;
    }
    if (newPassword.length < 6) {
      setErrorNewPassword('Mật khẩu phải có ít nhất 6 kí tự');
      return;
    }
    setErrorNewPassword('');
    if (confirmPassword === '') {
      setErrorConfirmPassword('Vui lòng nhập lại mật khẩu mới');
      return;
    }
    if (confirmPassword.length < 6) {
      setErrorConfirmPassword('Mật khẩu phải có ít nhất 6 kí tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorConfirmPassword('Mật khẩu không khớp');
      return;
    }
    setErrorConfirmPassword('');
    // call api change password
    try {
      setIsLoading(true);
      const response = await dwtApi.updateUserById(userInfo.id, {
        oldPassword: oldPassword,
        password: newPassword,
      });
      if (response.status === 200) { 
        setIsOpenSuccessModal(true);
      }
    } catch (error: any) {
      console.log(error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      setIsLoading(false);
    }
  }

  const handlePressOk = () => { 
    setIsOpenSuccessModal(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <Header
        title={'Cập nhật mật khẩu'}
        handleGoBack={() => navigation.goBack()}
        rightView={
          <TouchableOpacity style={styles.sendButton} onPress={handleSave}>
            <Text style={[fs_15_700, text_white, text_center]}>Lưu</Text>
          </TouchableOpacity>
        }
      />
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={[fs_15_700, text_black]}>Mật khẩu cũ:</Text>
          <View style={errorOldPassword === '' ? styles.inputBox : styles.inputBoxError}>
            <TextInput
              style={styles.input}
              secureTextEntry={hideOldPassword}
              value={oldPassword}
              onChangeText={setOldPassword}
              placeholder='Nhập mật khẩu cũ'
              placeholderTextColor={'#787878'}
              passwordRules={'minlength: 6;'}
            />
            <View style={styles.buttonContainer}>
              {
                oldPassword !== '' &&
                <Pressable
                  onPress={() => setOldPassword('')}
                  hitSlop={8}
                  disabled={oldPassword === ''}
                  style={styles.deleteIcon}>
                  <FontawesomeIcon name={'circle-xmark'} size={16} color="#000" />
                </Pressable>
              }
              <Pressable
                onPress={() => setHideOldPassword(!hideOldPassword)}
                hitSlop={8}>
                <FontawesomeIcon
                  name={hideOldPassword ? 'eye-slash' : 'eye'}
                  size={16}
                  color="#000"
                />
              </Pressable>
            </View>
          </View>
          {
            errorOldPassword !== '' &&
            <Text style={styles.textError}>{errorOldPassword}</Text>
          }
        </View>

        <View style={styles.inputContainer}>
          <Text style={[fs_15_700, text_black]}>Mật khẩu mới:</Text>
          <View style={errorNewPassword === '' ? styles.inputBox : styles.inputBoxError}>
            <TextInput
              style={styles.input}
              secureTextEntry={hideNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder='Nhập mật khẩu mới'
              placeholderTextColor={'#787878'}
            />
            <View style={styles.buttonContainer}>
              {
                newPassword !== '' &&
                <Pressable
                  onPress={() => setNewPassword('')}
                  hitSlop={8}
                  disabled={newPassword === ''}
                  style={styles.deleteIcon}>
                  <FontawesomeIcon name={'circle-xmark'} size={16} color="#000" />
                </Pressable>
              }
              <Pressable
                onPress={() => setHideNewPassword(!hideNewPassword)}
                hitSlop={8}>
                <FontawesomeIcon
                  name={hideNewPassword ? 'eye-slash' : 'eye'}
                  size={16}
                  color="#000"
                />
              </Pressable>
            </View>
          </View>
          {
            errorNewPassword !== '' &&
            <Text style={styles.textError}>{errorNewPassword}</Text>
          }
        </View>

        <View style={styles.inputContainer}>
          <Text style={[fs_15_700, text_black]}>Nhập lại mật khẩu mới:</Text>
          <View style={errorConfirmPassword === '' ? styles.inputBox : styles.inputBoxError}>
            <TextInput
              style={styles.input}
              secureTextEntry={hideConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder='Nhập lại mật khẩu mới'
              placeholderTextColor={'#787878'}
            />
            <View style={styles.buttonContainer}>
              {
                confirmPassword !== '' &&
                <Pressable
                  onPress={() => setConfirmPassword('')}
                  hitSlop={8}
                  disabled={confirmPassword === ''}
                  style={styles.deleteIcon}>
                  <FontawesomeIcon name={'circle-xmark'} size={16} color="#000" />
                </Pressable>
              }
              <Pressable
                onPress={() => setHideConfirmPassword(!hideConfirmPassword)}
                hitSlop={8}>
                <FontawesomeIcon
                  name={hideConfirmPassword ? 'eye-slash' : 'eye'}
                  size={16}
                  color="#000"
                />
              </Pressable>
            </View>
          </View>
          {
            errorConfirmPassword !== '' &&
            <Text style={styles.textError}>{errorConfirmPassword}</Text>
          }
        </View>
      </View>
      <LoadingActivity isLoading={isLoading} />
      <ToastSuccessModal visible={isOpenSuccessModal} description={'Đổi mật khẩu thành công'} handlePressOk={handlePressOk}/>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#BC2426',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 30
  },
  inputContainer: {
    gap: 6,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
  },
  inputBoxError: {
    borderWidth: 1,
    borderColor: '#F50000',
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
  },
  textError: {
    color: '#F50000',
    fontSize: 13,
  },
  input: {
    width: '80%',
    paddingVertical: 3,
  },
  deleteIcon: {
    marginRight: 5,
    paddingRight: 5,
    borderRightWidth: 1,
    borderRightColor: '#D9D9D9',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '17%',
    justifyContent: 'flex-end'
  },
});
