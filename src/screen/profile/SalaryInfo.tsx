import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/header/Header.tsx';
import {
  fs_12_400,
  fs_14_400,
  fs_14_500,
  fs_16_400,
  text_black,
  text_gray,
} from '../../assets/style.ts';
import DropdownIcon from '../../assets/img/dropdown-icon.svg';
import { useMemo, useState } from 'react';
import PrimaryDropdown from '../../components/common/dropdown/PrimaryDropdown.tsx';
import { useQuery } from '@tanstack/react-query';
import { dwtApi } from '../../api/service/dwtApi.ts';
import PrimaryLoading from '../../components/common/loading/PrimaryLoading.tsx';
import SalaryItemIcon from '../../assets/img/salary-item-icon.svg';
import dayjs from 'dayjs';
import { useRefreshOnFocus } from '../../hook/useRefeshOnFocus.ts';
import YearPickerModal from "../../components/common/modal/YearPickerModal.tsx";
import SalarySummaryIcon from "../../assets/img/salary-summary.svg";
import { useConnection } from '../../redux/connection';
import { LIST_BUSINESS_DEPARTMENT } from '../../assets/constant.ts';
import ComingSoonScreenComponent from "../../components/coming-soon/ComingSoonScreenComponent.tsx";

const { width: windowWidth } = Dimensions.get('window');

export default function SalaryInfo({ route,  navigation }: any) {
  const {
    connection: { userInfo, listDepartmentGroup },
  } = useConnection();
  const [isOpenYearSelect, setIsOpenYearSelect] = useState(false);
  const [currentYear, setCurrentYear] = useState(dayjs().year());
  const [salaryMode, setSalaryMode] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);

  const {
    data: listSalary = [],
    isLoading: isLoadingListSalary,
    refetch: refetchListSalary,
  } = useQuery(
    ['listSalary', salaryMode, currentYear],
    async () => {
      const res = await dwtApi.getSalaryHistory({
        status_f: salaryMode === 0 ? undefined : salaryMode,
        year_f: currentYear,
      });
      const listSalaryHistories = res?.data?.salaryHistory?.data;
      for (let i = 0; i < listSalaryHistories.length; i++) {
        const salaryId = listSalaryHistories[i].id;
        const salaryDetail = await dwtApi.getSalaryById(salaryId);
        listSalaryHistories[i].salaryDetail = salaryDetail.data;
      }
      return listSalaryHistories;
    },
    {
      enabled:
        !!userInfo &&
          listDepartmentGroup.business.includes(userInfo?.departement_id),
    }
  );

  const totalSummary = useMemo(() => {
    let total = 0;
    listSalary.forEach((salary: any) => {
      total += salary?.salaryDetail?.totalSalary * salary?.salaryDetail?.salary_history?.salary_rate
    });
    return total;
  }, [listSalary]);

  useRefreshOnFocus(refetchListSalary);

  if (!listDepartmentGroup.business.includes(userInfo?.departement_id)) {
    return <ComingSoonScreenComponent navigation={navigation} />;
  }

  if (isLoadingListSalary) {
    return <PrimaryLoading />;
  }
  return (
    <SafeAreaView style={styles.wrapper}>
      <Header
        title={'Lịch sử lương'}
        handleGoBack={() =>
            navigation.goBack()
        }
      />

      <View style={styles.filter_wrapper}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => {
            setIsOpenYearSelect(true);
          }}
        >
          <Text style={[text_black, fs_14_400]}>{currentYear}</Text>
          <DropdownIcon width={20} height={20} />
        </TouchableOpacity>

        <PrimaryDropdown
          data={[
            {
              label: 'Tất cả',
              value: 0,
            },
            {
              label: 'Thay đổi lương',
              value: 2,
            },
          ]}
          changeValue={setSalaryMode}
          value={salaryMode}
          dropdownStyle={{
            width: '47%',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#D9D9D9',
            paddingHorizontal: 10,
          }}
          isSearch={false}
          placeholder={'Tất cả'}
          textStyle={{
            ...fs_14_400,
            ...text_black,
          }}
        />
      </View>
      <View style={styles.countSalaryBox}>
        <Text style={[fs_16_400, text_gray]}>
          {listSalary?.length ?? 0} phiếu lương
        </Text>
      </View>
      <FlatList
        data={listSalary}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingBottom: 10,
        }}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: any) => {
          return (
            <TouchableOpacity
              style={[
                styles.item,
                {
                  backgroundColor:
                    item.paid_salary === 2 ? '#FFF8C3' : '#CCF4D3',
                },
              ]}
              onPress={() => {
                navigation.navigate('SalaryDetail', {
                  id: item.id,
                });
              }}
              onLayout={(e) => {
                setItemWidth(e.nativeEvent.layout.width);
              }}
            >
              <SalaryItemIcon width={30} height={30} />
              <View
                style={{
                  gap: 5,
                  width: itemWidth - 30 - 10 - 24,
                }}
              >
                <View style={styles.rowItem}>
                  <Text style={[fs_14_400, text_black]}>
                    Phiếu lương tháng {item.month}/{item.year}
                  </Text>

                  <Text style={[fs_14_500, text_black]}>
                    {(item?.salaryDetail?.totalSalary * item?.salaryDetail?.salary_history?.salary_rate)?.toLocaleString()}
                  </Text>
                </View>
                <View>
                  <Text style={[fs_12_400, text_black]}>
                    Vị trí: {item.position_name}
                  </Text>
                </View>
                <View style={styles.rowItem}>
                  <Text style={[fs_12_400, text_gray]}>
                    Thời gian chi trả:{' '}
                    {dayjs(item.pay_day).format('DD/MM/YYYY')}
                  </Text>

                  <Text
                    style={[
                      fs_12_400,
                      {
                        color: '#679AE6',
                      },
                    ]}
                  >
                    Xem chi tiết
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      />
      <View
        style={{
          flexDirection: 'row',
          paddingBottom: 10,
          alignSelf: 'center',
          gap: 5,
        }}
      >
        <SalarySummaryIcon />
        <Text
          style={{
            fontSize: 18,
            fontWeight: '400',
            color: '#000',
          }}
        >
          Tổng thu nhập năm:
          <Text
            style={{
              fontSize: 21,
              fontWeight: '700',
              color: '#C02626',
            }}
          >
            {' '}
            {totalSummary.toLocaleString()} đ
          </Text>
        </Text>
      </View>
      <YearPickerModal
        visible={isOpenYearSelect}
        setVisible={setIsOpenYearSelect}
        currentYear={currentYear}
        setCurrentYear={setCurrentYear}
      />
    </SafeAreaView>
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
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 10,
  },
  pl10: {
    paddingLeft: 10,
  },
  dropdown: {
    width: '47%',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.25)',
  },
  countSalaryBox: {
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 6,
    gap: 10,
    alignItems: 'center',
    width: '100%',
  },
  divider: {
    height: 1,
    backgroundColor: '#D9D9D9',
    marginVertical: 10,
  },
  rowItem: {
    flexDirection: windowWidth < 300 ? 'column' : 'row',
    justifyContent: 'space-between',
    gap: windowWidth < 300 ? 5 : 0,
  },
});
