import {
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
import { useState } from 'react';
import { fs_14_400, text_black } from '../../assets/style.ts';
import DropdownIcon from '../../assets/img/dropdown-icon.svg';
import DatePickerFromToModal from '../../components/common/modal/DatePickerFromToModal.tsx';
import { useQuery } from '@tanstack/react-query';
import { dwtApi } from '../../api/service/dwtApi.ts';
import AttendanceHistoryTable from '../../components/attendance/AttendanceHistoryTable.tsx';
import PrimaryLoading from '../../components/common/loading/PrimaryLoading.tsx';
import AdminTabBlock from '../../components/common/tab/AdminTabBlock.tsx';

export default function AttendanceHistory({ route, navigation }: any) {
  const { departmentId, title } = route.params;
  const {
    connection: { userInfo },
  } = useConnection();
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [isSelectDate, setIsSelectDate] = useState(false);

  const { data: listAttendanceHistory = [], isLoading } = useQuery(
    ['listAttendanceHistoryDepartment', fromDate, toDate],
    async () => {
      const res = await dwtApi.getAttendanceHistoryDepartment({
        datetime:
          dayjs(fromDate).format('DD/MM/YYYY') +
          ' - ' +
          dayjs(toDate).format('DD/MM/YYYY'),
        department: departmentId,
      });
      return res.data.data;
    },
    {
      enabled: !!userInfo && !!departmentId,
    }
  );

  return (
    <SafeAreaView style={styles.wrapper}>
      <AdminTabBlock secondLabel={'Quản lý'} />
      <Header
        title={'LỊCH SỬ CHẤM CÔNG' + ' ' + title}
        handleGoBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.dateSelectBox}
          onPress={() => {
            setIsSelectDate(true);
          }}
        >
          <Text style={[fs_14_400, text_black]}>
            {dayjs(fromDate).format('DD/MM/YYYY')} -{' '}
            {dayjs(toDate).format('DD/MM/YYYY')}
          </Text>
          <DropdownIcon />
        </TouchableOpacity>
        <AttendanceHistoryTable
          data={listAttendanceHistory.map((item: any) => {
            return {
              ...item,
              name: item.users.name,
              date: dayjs()
                .month(item.month - 1)
                .year(item.year)
                .date(item.day)
                .format('DD/MM/YYYY'),
              checkIn: item.checkIn ? item.checkIn : '--:--',
              checkOut: item.checkOut ? item.checkOut : '--:--',
            };
          })}
        />
      </ScrollView>
      {isSelectDate && (
        <DatePickerFromToModal
          fromDate={fromDate}
          toDate={toDate}
          setVisible={setIsSelectDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 15,
  },
  dateSelectBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    borderColor: 'rgba(0, 0, 0, 0.25)',
    borderWidth: 1,
    width: 220,
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
});
