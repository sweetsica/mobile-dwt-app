import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  fs_12_500,
  fs_14_400,
  text_black,
  text_gray,
} from '../../assets/style.ts';
import DropdownIcon from '../../assets/img/dropdown-icon.svg';
import {useState} from 'react';
import dayjs from 'dayjs';
import DatePickerModal from '../common/modal/DatePickerModal.tsx';
import ListDepartmentModal from '../home/manager-component/ListDepartmentModal.tsx';
import {useQuery} from '@tanstack/react-query';
import {dwtApi} from '../../api/service/dwtApi.ts';
import UserReportDetail from './UserReportDetail.tsx';

export default function DepartmentReport({}) {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [isOpenSelectDate, setIsOpenSelectDate] = useState(false);
  const [isOpenSelectDepartment, setIsOpenSelectDepartment] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<any>({
    value: 0,
    label: 'Phòng ban',
  });

  const {data: listDepartment = []} = useQuery(['listDepartment'], async () => {
    const res = await dwtApi.getListDepartment();
    return res.data;
  });

  const {data: dailyReportData = {}} = useQuery(
    [
      'dwtApi.getDepartmentDailyReport',
      {
        department_id: currentDepartment.value,
        date_report: `${currentDate.year()}-${
          currentDate.month() + 1
        }-${currentDate.date()}`,
      },
    ],
    ({queryKey}) => dwtApi.getDepartmentDailyReport(queryKey[1]),
    {
      enabled: !!currentDate,
    },
  );

  const {
    data: {
      countUsers = 0,
      countDailyReports = 0,
      dailyReportPaginate: {data: dailyReports = []} = {},
    } = {},
  } = dailyReportData;

  return (
    <View style={styles.wrapper}>
      <View style={styles.filter_wrapper}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => {
            setIsOpenSelectDate(true);
          }}>
          <Text style={[text_black, fs_14_400]}>
            {currentDate.format('DD-MM-YYYY')}
          </Text>
          <DropdownIcon width={20} height={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dropdown]}
          onPress={() => {
            setIsOpenSelectDepartment(true);
          }}>
          <Text style={[text_black, fs_14_400, {width: '80%'}]}>
            {currentDepartment.label}
          </Text>
          <DropdownIcon width={20} height={20} />
        </TouchableOpacity>
      </View>
      <View style={styles.totalReportBox}>
        <Text style={[fs_12_500, text_gray]}>
          {countDailyReports}/ {countUsers} báo cáo
        </Text>
      </View>
      <FlatList
        data={dailyReports}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingVertical: 20,
        }}
        renderItem={({item}) => {
          return <UserReportDetail data={item} />;
        }}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={{height: 10}} />}
      />
      {/*<View>*/}
      {/*  <EmptyDailyReportIcon style={{alignSelf: 'center', marginTop: 50}} />*/}
      {/*  <Text style={[fs_12_400, text_black, text_center]}>*/}
      {/*    Bạn chưa có báo cáo.*/}
      {/*  </Text>*/}
      {/*</View>*/}
      <DatePickerModal
        visible={isOpenSelectDate}
        setVisible={() => {
          setIsOpenSelectDate(false);
        }}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />

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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },

  filter_wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 10,
  },
  dropdown: {
    width: '47%',
    borderRadius: 5,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.25)',
  },
  totalReportBox: {
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
  },
});
