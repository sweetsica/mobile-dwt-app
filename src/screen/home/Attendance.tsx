import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/header/Header.tsx';
import { useConnection } from '../../redux/connection';
import dayjs from 'dayjs';
import {
  fs_12_500,
  fs_14_400,
  fs_14_700,
  fs_15_400,
  fs_15_700,
  mt10,
  row_between,
  text_black,
  text_center,
  text_red,
} from '../../assets/style.ts';
import CheckWorkBlock from '../../components/attendance/CheckWorkBlock.tsx';
import { useState } from 'react';
import ToastSuccessModal from '../../components/common/modal/ToastSuccessModal.tsx';
import { useQuery } from '@tanstack/react-query';
import { dwtApi } from '../../api/service/dwtApi.ts';
import PrimaryLoading from '../../components/common/loading/PrimaryLoading.tsx';
import AttendanceCalendar from '../../components/attendance/AttendanceCalendar.tsx';
import AdminTabBlock from '../../components/common/tab/AdminTabBlock.tsx';
import { useRefreshOnFocus } from '../../hook/useRefeshOnFocus.ts';

export default function Attendance({ navigation }: any) {
  const {
    connection: { userInfo },
  } = useConnection();
  const [isOpenCheckSuccessModal, setIsOpenCheckSuccessModal] = useState(false);
  const [checkInOutTime, setCheckInOutTime] = useState('--:--');
  const [currentMonth, setCurrentMonth] = useState(dayjs().format('YYYY-MM'));
  const {
    data: checkInOutData = {},
    isLoading: isLoadingCheckInOut,
    refetch: refetchCheckInOut,
  } = useQuery(
    ['checkInOut', dayjs().format('YYYY-MM-DD')],
    async ({ queryKey }) => {
      try {
        const response = await dwtApi.getCheckInOutByDate(
          userInfo.id,
          queryKey[1]
        );
        return response.data;
      } catch {
        return {
          checkIn: null,
          checkOut: null,
        };
      }
    },
    {
      enabled: !!userInfo && !!userInfo?.id,
    }
  );

  const {
    data: attendanceMonthData = [],
    isLoading: isLoadingAttendanceMonthData,
    refetch: refetchAttendanceMonthData,
  } = useQuery(
    ['getAttendanceMonthInfo', currentMonth],
    async ({ queryKey }) => {
      const response = await dwtApi.getAttendanceByMonth(queryKey[1]);
      return response.data;
    }
  );

  const {
    data: attendanceData,
    isLoading: isLoadingAttendance,
    refetch: refetchAttendanceData,
  } = useQuery(['getAttendanceInfo'], async () => {
    const res = await dwtApi.getAttendanceInfo();
    return res.data;
  });

  const handleCheckIn = async () => {
    try {
      const currentTime = dayjs().format('HH:mm');
      const response = await dwtApi.checkInOut(currentTime);
      if (response.status === 200) {
        setCheckInOutTime(response.data.checkIn.substring(0, 5));
        setIsOpenCheckSuccessModal(true);
        await refetchCheckInOut();
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại sau');
    }
  };
  const handleCheckOut = async () => {
    try {
      const currentTime = dayjs().format('HH:mm');
      const response = await dwtApi.checkInOut(
        checkInOutData.checkIn.substring(0, 5),
        currentTime
      );
      if (response.status === 200) {
        setCheckInOutTime(response.data.checkOut.substring(0, 5));
        setIsOpenCheckSuccessModal(true);
        await refetchCheckInOut();
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại sau');
    }
  };

  useRefreshOnFocus(() => {
    refetchAttendanceData();
    refetchAttendanceMonthData();
    refetchCheckInOut();
  });

  return (
    <SafeAreaView style={styles.wrapper}>
      <AdminTabBlock secondLabel={'Quản lý'} />
      <Header title={'CHẤM CÔNG'} handleGoBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <Text style={[fs_15_400, text_red, text_center]}>
          Ngày {dayjs().format('DD/MM/YYYY')}
        </Text>
        <CheckWorkBlock
          checkIn={checkInOutData?.checkIn}
          checkOut={checkInOutData?.checkOut}
          handleCheckIn={handleCheckIn}
          handleCheckOut={handleCheckOut}
        />
        <View
          style={[
            row_between,
            mt10,
            {
              paddingBottom: 10,
              borderBottomColor: '#D9D9D9',
              borderBottomWidth: 1,
            },
          ]}
        >
          <Text style={[fs_15_700, text_black]}>BẢNG CHẤM CÔNG</Text>
          <TouchableOpacity
            style={{
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 8,
              backgroundColor: '#FFF',
              borderColor: '#DD0013',
              borderWidth: 1,
            }}
            onPress={() => {
              navigation.navigate('AddAbsence');
            }}
          >
            <Text style={[fs_12_500, text_red]}>+ Đơn nghỉ</Text>
          </TouchableOpacity>
        </View>

        <AttendanceCalendar
          attendanceMonthData={attendanceMonthData}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
        />

        <View
          style={[
            row_between,
            mt10,
            {
              paddingBottom: 10,
              borderBottomColor: '#D9D9D9',
              borderBottomWidth: 1,
            },
          ]}
        >
          <Text style={[fs_15_700, text_black]}>THỐNG KÊ THÁNG</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AttendanceSummary');
            }}
            hitSlop={10}
          >
            <Text
              style={[
                fs_14_400,
                {
                  color: 'rgba(0, 112, 255, 0.71)',
                },
              ]}
            >
              {'Bảng công >'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.boxContainer}>
          <View style={styles.box}>
            <Text style={[fs_15_400, text_black]}>Tổng công</Text>
            <Text style={[fs_15_400, text_black]}>
              {Number(attendanceData?.calcDaysWork).toFixed(2)}/{attendanceData?.allDaysWork}
            </Text>
          </View>
          <View style={styles.box}>
            <Text style={[fs_15_400, text_black]}>Nghỉ / Vắng</Text>
            <Text style={[fs_15_400, text_black]}>
              {Number(attendanceData?.numAbsent).toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>
      <ToastSuccessModal
        visible={isOpenCheckSuccessModal}
        handlePressOk={() => {
          setIsOpenCheckSuccessModal(false);
        }}
        description={`Chấm công thành công lúc ${checkInOutTime}`}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainerStyle: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 15,
    gap: 10,
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box: {
    width: '48%',
    borderRadius: 5,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
});
