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
import PrimaryTable from '../../components/common/table/PrimaryTable.tsx';
import { useQuery } from '@tanstack/react-query';
import { dwtApi } from '../../api/service/dwtApi.ts';
import AdminTabBlock from '../../components/common/tab/AdminTabBlock.tsx';
import ListDepartmentModal from '../../components/home/manager-component/ListDepartmentModal.tsx';

export default function AttendanceSummary({ navigation }: any) {
  const {
    connection: { userInfo, currentTabManager },
  } = useConnection();
  const [fromDate, setFromDate] = useState(dayjs().startOf('week'));
  const [toDate, setToDate] = useState(dayjs());
  const [isSelectDate, setIsSelectDate] = useState(false);
  const [isOpenSelectDepartment, setIsOpenSelectDepartment] = useState(false);

  const [currentDepartment, setCurrentDepartment] = useState<any>({
    value: 0,
    label: 'Phòng ban',
  });

  const { data: listDepartment = [] } = useQuery(
    ['listDepartment'],
    async () => {
      const res = await dwtApi.getListDepartment();
      return res.data;
    },
    {
      enabled:
        !!userInfo &&
        (userInfo.role === 'admin' || userInfo.role === 'manager'),
    }
  );
  const { data: listAttendanceSummary = [], isLoading } = useQuery(
    [
      'listAttendanceSummary',
      fromDate,
      toDate,
      currentDepartment,
      currentTabManager,
    ],
    async ({ queryKey }) => {
      if (queryKey[4] === 1) {
        let departmentid =
          queryKey[3].value === 0 ? undefined : queryKey[3].value;
        const res = await dwtApi.getAttendanceSummaryDepartment({
          datetimeFilter:
            dayjs(fromDate).format('DD/MM/YYYY') +
            ' - ' +
            dayjs(toDate).format('DD/MM/YYYY'),
          department: departmentid,
        });
        return res.data.data;
      }
      const res = await dwtApi.getAttendanceSummaryDepartment({
        datetimeFilter:
          dayjs(fromDate).format('DD/MM/YYYY') +
          ' - ' +
          dayjs(toDate).format('DD/MM/YYYY'),
        department: userInfo.departement_id,
      });
      return res.data.data;
    },
    {
      enabled: !!userInfo,
    }
  );

  const columns = [
    {
      key: 'name',
      title: 'Tên',
      width: 0.3,
    },
    {
      key: 'date',
      title: 'Thời gian',
      width: 0.25,
    },
    {
      key: 'totalSuccess',
      title: 'Đã điểm danh',
      width: 0.25,
    },
    {
      key: 'totalFail',
      title: 'Đi trễ',
      width: 0.2,
    },
  ];

  return (
    <SafeAreaView style={styles.wrapper}>
      <AdminTabBlock secondLabel={'Quản lý'} />
      <Header
        title={'TỔNG QUAN CHẤM CÔNG'}
        handleGoBack={() => navigation.goBack()}
      />
      <View
        style={[
          styles.filter_wrapper,
          {
            justifyContent:
              currentTabManager === 1 ? 'space-between' : 'flex-end',
          },
        ]}
      >
        {currentTabManager === 1 && (
          <TouchableOpacity
            style={[styles.dropdown]}
            onPress={() => {
              setIsOpenSelectDepartment(true);
            }}
          >
            <Text style={[text_black, fs_14_400, { width: '80%' }]}>
              {currentDepartment.label}
            </Text>
            <DropdownIcon width={20} height={20} />
          </TouchableOpacity>
        )}
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
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <PrimaryTable
          onRowPress={(item: any) => {
            navigation.navigate('AttendanceHistory', {
              departmentId: item.id,
              title: currentTabManager === 1 ? item.name : '',
            });
          }}
          data={listAttendanceSummary.map((item: any) => {
            return {
              ...item,
            };
          })}
          columns={columns}
          headerColor={'#DCE1E7'}
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
      {isOpenSelectDepartment && (
        <ListDepartmentModal
          currentDepartment={currentDepartment}
          setCurrentDepartment={setCurrentDepartment}
          visible={isOpenSelectDepartment}
          setVisible={setIsOpenSelectDepartment}
          listDepartment={listDepartment.map((department: any) => {
            return {
              value: department.id,
              label: department.name,
            };
          })}
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
    marginTop: 10,
  },
  dateSelectBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
    borderColor: 'rgba(0, 0, 0, 0.25)',
    borderWidth: 1,
    flex: 0.65,
  },
  filter_wrapper: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginTop: 10,
    gap: 10,
  },
  dropdown: {
    flex: 0.35,
    borderRadius: 5,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.25)',
  },
});
