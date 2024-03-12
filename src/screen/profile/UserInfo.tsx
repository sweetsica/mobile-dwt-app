import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/header/Header.tsx';
import {
  fs_10_400,
  fs_14_500,
  fs_14_700,
  fs_15_700,
  text_black,
  text_center,
  text_gray,
  text_red,
  text_white,
} from '../../assets/style.ts';
import { useQuery } from '@tanstack/react-query';
import { dwtApi } from '../../api/service/dwtApi.ts';
import { useConnection } from '../../redux/connection';
import PrimaryLoading from '../../components/common/loading/PrimaryLoading.tsx';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import DatePickerModal from '../../components/common/modal/DatePickerModal.tsx';
import { BANK_LIST } from '../../assets/constant.ts';
import ToastSuccessModal from '../../components/common/modal/ToastSuccessModal.tsx';
import LoadingActivity from '../../components/common/loading/LoadingActivity.tsx';
import {useRefreshOnFocus} from "../../hook/useRefeshOnFocus.ts";

export default function UserInfo({ navigation }: any) {
  const [editUserInfo, setEditUserInfo] = useState({
    name: '',
    phone: '',
    id_card: '',
    released_from: '',
    release_date: '',
    permanent_address: '',
    sex: '0',
    dob: '',
    bank_name: '',
    bank_number: '',
    receiver_name: '',
  });
  const [isOpenSelectBirthday, setIsOpenSelectBirthday] = useState(false);
  const [isOpenSelectReleaseDate, setIsOpenSelectReleaseDate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const {
    onSetUserInfo,
    connection: { userInfo },
  } = useConnection();
  const {
    data: userData = {},
    isLoading: isLoadingUser,
    refetch,
  } = useQuery(
    ['getUserInfo', userInfo?.id],
    async () => {
      const res = await dwtApi.getUserById(userInfo?.id);
      const transferInformation = JSON.parse(
        res.data?.transfer_information || '{}'
      );
      setEditUserInfo({
        name: res.data?.name,
        phone: res.data?.phone,
        id_card: res.data?.id_card,
        released_from: res.data?.released_from,
        release_date: res.data?.release_date,
        dob: res.data?.dob,
        permanent_address: res.data?.permanent_address,
        sex: res.data?.sex?.toString(),
        bank_name: transferInformation?.bank_name ?? null,
        bank_number: transferInformation?.bank_number ?? null,
        receiver_name: transferInformation?.receiver_name ?? null,
      });
      return res.data;
    },
    {
      enabled: !!userInfo && !!userInfo?.id,
    }
  );


  const handleSave = async () => {
    if (editUserInfo?.name === '') {
      return Alert.alert('Vui lòng nhập đầy đủ tên');
    }

    if (editUserInfo?.phone === '') {
      return Alert.alert('Vui lòng nhập đầy đủ số điện thoại');
    }

    try {
      setIsLoading(true);
      const res = await dwtApi.updateUserById(userInfo.id, {
        ...userInfo,
        name: editUserInfo?.name,
        phone: editUserInfo?.phone,
        id_card: editUserInfo?.id_card,
        released_from: editUserInfo?.released_from,
        release_date: editUserInfo?.release_date,
        dob: editUserInfo?.dob,
        sex: Number(editUserInfo?.sex),
        permanent_address: editUserInfo?.permanent_address,
        transfer_information: {
          bank_name: editUserInfo?.bank_name,
          bank_number: editUserInfo?.bank_number,
          receiver_name: editUserInfo?.receiver_name,
        },
      });

      if (res.status === 200) {
        setIsLoading(false);
        setIsUpdateSuccess(true);
        onSetUserInfo(res.data);
        await refetch();
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại sau');
      setIsLoading(false);
    }
  };

  useRefreshOnFocus(refetch)

  if (isLoadingUser) {
    return <PrimaryLoading />;
  }

  return (
    userData && (
      <SafeAreaView style={styles.wrapper}>
        <Header
          title={'Thông tin cá nhân'}
          handleGoBack={() => navigation.goBack()}
          rightView={
            <TouchableOpacity style={styles.sendButton} onPress={handleSave}>
              <Text style={[fs_15_700, text_white, text_center]}>Lưu</Text>
            </TouchableOpacity>
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
        >
          <View style={styles.rowContainer}>
            <View style={styles.rowItem}>
              <Text style={[fs_10_400, text_gray]}>Mã nhân viên</Text>
              <Text style={[fs_14_500, text_black]}>{userData?.code}</Text>
            </View>

            <View style={styles.rowItem}>
              <Text style={[fs_10_400, text_gray]}>Vị trí</Text>
              <Text style={[fs_14_500, text_black]}>
                {userData?.position?.name}
              </Text>
            </View>

            <View style={styles.rowItem}>
              <Text style={[fs_10_400, text_gray]}>Phòng ban</Text>
              <Text style={[fs_14_500, text_black]}>
                {userData?.departement?.name}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.rowContainer}>
            <View style={styles.rowItem}>
              <Text style={[fs_10_400, text_gray]}>
                Tên <Text style={text_red}>*</Text>
              </Text>
              <TextInput
                style={[
                  fs_14_500,
                  text_black,
                  {
                    flex: 1,
                    textAlign: 'right',
                    paddingVertical: 0,
                  },
                ]}
                value={editUserInfo?.name}
                onChangeText={(text) =>
                  setEditUserInfo({ ...editUserInfo, name: text })
                }
              />
            </View>

            <Pressable
              style={styles.rowItem}
              onPress={() => setIsOpenSelectBirthday(true)}
            >
              <Text style={[fs_10_400, text_gray]}>Ngày sinh</Text>
              <Text style={[fs_14_500, text_black]}>
                {userData?.dob && dayjs(editUserInfo?.dob).format('DD-MM-YYYY')}
              </Text>
            </Pressable>

            <View style={styles.rowItem}>
              <Text style={[fs_10_400, text_gray]}>Giới tính</Text>
              <View style={{ height: 20, justifyContent: 'center' }}>
                <Dropdown
                  style={{
                    width: 100,
                  }}
                  itemTextStyle={[text_black, fs_14_500]}
                  selectedTextStyle={[
                    text_black,
                    fs_14_500,
                    {
                      textAlign: 'right',
                    },
                  ]}
                  data={[
                    {
                      label: 'Nam',
                      value: '1',
                    },
                    {
                      label: 'Nữ',
                      value: '0',
                    },
                  ]}
                  labelField="label"
                  valueField="value"
                  value={editUserInfo?.sex}
                  maxHeight={200}
                  onChange={(item) => {
                    setEditUserInfo({ ...editUserInfo, sex: item.value });
                  }}
                  iconStyle={{
                    display: 'none',
                  }}
                />
              </View>
            </View>

            <View style={styles.rowItem}>
              <Text style={[fs_10_400, text_gray]}>
                Số điện thoại <Text style={text_red}>*</Text>
              </Text>
              <TextInput
                style={[
                  fs_14_500,
                  text_black,
                  {
                    flex: 1,
                    textAlign: 'right',
                    paddingVertical: 0,
                  },
                ]}
                value={editUserInfo?.phone}
                onChangeText={(text) =>
                  setEditUserInfo({ ...editUserInfo, phone: text })
                }
              />
            </View>

            <View style={styles.rowItem}>
              <Text style={[fs_10_400, text_gray]}>CMT/CCCD</Text>
              <TextInput
                style={[
                  fs_14_500,
                  text_black,
                  {
                    flex: 1,
                    textAlign: 'right',
                    paddingVertical: 0,
                  },
                ]}
                value={editUserInfo?.id_card}
                onChangeText={(text) =>
                  setEditUserInfo({ ...editUserInfo, id_card: text })
                }
              />
            </View>

            <View style={styles.rowItem}>
              <Text style={[fs_10_400, text_gray]}>Nơi cấp</Text>
              <TextInput
                style={[
                  fs_14_500,
                  text_black,
                  {
                    textAlign: 'right',
                    paddingVertical: 0,
                    flex: 1,
                  },
                ]}
                value={editUserInfo?.released_from}
                onChangeText={(text) =>
                  setEditUserInfo({ ...editUserInfo, released_from: text })
                }
              />
            </View>

            <Pressable
              style={styles.rowItem}
              onPress={() => {
                setIsOpenSelectReleaseDate(true);
              }}
            >
              <Text style={[fs_10_400, text_gray]}>Ngày cấp</Text>
              <Text style={[fs_14_500, text_black]}>
                {editUserInfo?.release_date &&
                  dayjs(editUserInfo?.release_date).format('DD-MM-YYYY')}
              </Text>
            </Pressable>

            <View style={styles.rowItem}>
              <Text style={[fs_10_400, text_gray]}>Thường trú</Text>
              <TextInput
                style={[
                  fs_14_500,
                  text_black,
                  {
                    flex: 1,
                    textAlign: 'right',
                    paddingVertical: 0,
                  },
                ]}
                value={editUserInfo?.permanent_address}
                onChangeText={(text) =>
                  setEditUserInfo({ ...editUserInfo, permanent_address: text })
                }
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.rowContainer}>
            <Text style={[fs_14_700, text_red]}>Thông tin trả lương</Text>
            <View style={styles.rowItem}>
              <Text style={[fs_10_400, text_gray]}>Tên người nhận</Text>
              <TextInput
                style={[
                  fs_14_500,
                  text_black,
                  {
                    flex: 1,
                    textAlign: 'right',
                    paddingVertical: 0,
                  },
                ]}
                value={editUserInfo?.receiver_name}
                onChangeText={(text) =>
                  setEditUserInfo({ ...editUserInfo, receiver_name: text })
                }
              />
            </View>

            <View style={styles.rowItem}>
              <Text style={[fs_10_400, text_gray]}>Số tài khoản</Text>
              <TextInput
                style={[
                  fs_14_500,
                  text_black,
                  {
                    flex: 1,
                    textAlign: 'right',
                    paddingVertical: 0,
                  },
                ]}
                value={editUserInfo?.bank_number}
                onChangeText={(text) =>
                  setEditUserInfo({ ...editUserInfo, bank_number: text })
                }
              />
            </View>

            <View style={styles.rowItem}>
              <Text style={[fs_10_400, text_gray]}>Ngân hàng</Text>
              <View
                style={{ height: 20, justifyContent: 'center', width: '80%' }}
              >
                <Dropdown
                  mode={'modal'}
                  style={{
                    width: '100%',
                  }}
                  containerStyle={{
                    height: 600,
                  }}
                  itemTextStyle={[text_black, fs_14_500]}
                  selectedTextStyle={[
                    text_black,
                    fs_14_500,
                    {
                      textAlign: 'right',
                    },
                  ]}
                  data={BANK_LIST}
                  labelField="label"
                  valueField="value"
                  value={editUserInfo?.bank_name}
                  maxHeight={200}
                  onChange={(item) => {
                    setEditUserInfo({ ...editUserInfo, bank_name: item.value });
                  }}
                  searchPlaceholder={'Tìm kiếm ngân hàng'}
                  search
                  placeholder={'Chọn ngân hàng'}
                  iconStyle={{
                    display: 'none',
                  }}
                  placeholderStyle={{
                    textAlign: 'right',
                    ...fs_14_500,
                  }}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <DatePickerModal
          visible={isOpenSelectBirthday}
          setVisible={setIsOpenSelectBirthday}
          currentDate={editUserInfo?.dob}
          setCurrentDate={(value: any) => {
            setEditUserInfo({
              ...editUserInfo,
              dob: dayjs(value).format('YYYY-MM-DD'),
            });
          }}
        />

        <DatePickerModal
          visible={isOpenSelectReleaseDate}
          setVisible={setIsOpenSelectReleaseDate}
          currentDate={editUserInfo?.release_date}
          setCurrentDate={(value: any) => {
            setEditUserInfo({
              ...editUserInfo,
              release_date: dayjs(value).format('YYYY-MM-DD'),
            });
          }}
        />

        <LoadingActivity isLoading={isLoading} />

        <ToastSuccessModal
          visible={isUpdateSuccess}
          handlePressOk={() => setIsUpdateSuccess(false)}
          description={'Cập nhật thông tin thành công'}
        />
      </SafeAreaView>
    )
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
  rowContainer: {
    paddingHorizontal: 15,
  },
  divider: {
    height: 6,
    backgroundColor: '#D9D9D9',
    width: '100%',
    marginVertical: 20,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#DADADA',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
});
