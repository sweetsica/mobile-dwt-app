import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/header/Header.tsx';
import TabBlock from '../../../components/work/TabBlock.tsx';
import { useMemo, useState } from 'react';
import PrimaryTable from '../../../components/common/table/PrimaryTable.tsx';
import AddIcon from '../../../assets/img/add.svg';
import DropdownIcon from '../../../assets/img/dropdown-icon.svg';
import { fs_14_400, text_black } from '../../../assets/style.ts';
import WorkStatusFilterModal from '../../../components/common/modal/WorkStatusFilterModal.tsx';
import {
  LIST_WORK_STATUS_FILTER,
  WORK_OFFICE_STATUS_COLOR,
  WORK_STATUS_COLOR,
} from '../../../assets/constant.ts';
import { useQuery } from '@tanstack/react-query';
import { dwtApi } from '../../../api/service/dwtApi.ts';
import dayjs from 'dayjs';
import { useRefreshOnFocus } from '../../../hook/useRefeshOnFocus.ts';
import PlusButtonModal from '../../../components/work/PlusButtonModal.tsx';
import MonthPickerModal from '../../../components/common/modal/MonthPickerModal.tsx';
import AdminTabBlock from '../../../components/common/tab/AdminTabBlock.tsx';
import { useConnection } from '../../../redux/connection';
import ListDepartmentModal from '../../../components/home/manager-component/ListDepartmentModal.tsx';
import WorkRowDetail from '../../../components/common/table/WorkRowDetail.tsx';
import { getMonthFormat } from '../../../utils';
import WorkOfficeStatusFilterModal from "../../common/modal/WorkOfficeStatusFilterModal.tsx";
import TabOfficeBlock from "../TabOfficeBlock.tsx";
import WorkOfficeRowDetail from "../../common/table/WorkOfficeRowDetail.tsx";

const columns = [
  {
    key: 'index',
    title: 'STT',
    width: 0.1,
  },
  {
    key: 'name',
    title: 'Tên',
    width: 0.4,
  },
  {
    key: 'quantity',
    title: 'Số lượng',
    width: 0.25,
  },
  {
    key: 'kpi',
    title: 'NS/KPI',
    width: 0.25,
  },
];
export default function UserOfficeWork({ navigation }: any) {
  const {
    connection: { userInfo, currentTabManager },
  } = useConnection();
  const [statusValue, setStatusValue] = useState(LIST_WORK_STATUS_FILTER[0]);
  const [currentMonth, setCurrentMonth] = useState({
    month: dayjs().month(),
    year: dayjs().year(),
  });
  const [isOpenTimeSelect, setIsOpenTimeSelect] = useState(false);
  const [isOpenStatusSelect, setIsOpenStatusSelect] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [isOpenPlusButton, setIsOpenPlusButton] = useState(false);

  const {
    data: { listTargetWorkData, listAriseWorkData } = {
      listTargetWorkData: [],
      listAriseWorkData: [],
    },
    isLoading: isLoadingWorkPersonal,
    refetch: refetchWorkPersonal,
  } = useQuery(['userOfficeWork'], async ({ queryKey }: any) => {
    const res = await dwtApi.getOfficeWorkPersonal();

    return {
      listTargetWorkData: res.data.kpi.targetDetails,
      listAriseWorkData: res.data.kpi.reportTasks,
    };
  });

  const tableData = useMemo(() => {
    switch (currentTab) {
      case 0:
        return listTargetWorkData
          .map((work: any, index: number) => {
            return {
              ...work,
              index: index + 1,
              quantity: work?.quantity_display,
              kpi: work?.kpiValue,
              criteria: work?.kpi_keys && work?.kpi_keys[0].name,
              criteria_required:
                work?.kpi_keys && work?.kpi_keys[0]?.pivot?.quantity,
              bgColor: work.work_status
                ? // @ts-ignore
                  WORK_OFFICE_STATUS_COLOR[work.work_status]
                : '#FFF',
            };
          })
          .filter((work: any) => {
            if (statusValue.value === '0') {
              return true;
            }
            if (work?.actual_state) {
              return work.work_status.toString() === statusValue.value;
            }
            return false;
          });
      case 1:
        return listAriseWorkData
          .map((work: any, index: number) => {
            return {
              ...work,
              index: index + 1,
              quantity: work?.quantity_display,
              kpi: work?.kpiValue,
              bgColor: work.work_status
                ? // @ts-ignore
                  WORK_OFFICE_STATUS_COLOR[work.work_status]
                : '#FFF',
            };
          })
          .filter((work: any) => {
            if (statusValue.value === '0') {
              return true;
            }
            if (work?.actual_state) {
              return work.actual_state.toString() === statusValue.value;
            }
            return false;
          });
      default:
        return [];
    }
  }, [currentTab, statusValue, listTargetWorkData, listAriseWorkData]);

  useRefreshOnFocus(() => {
    refetchWorkPersonal();
  });

  return (
    <View style={styles.wrapper}>
      <Header
        title={'NHẬT TRÌNH CÔNG VIỆC'}
        handleGoBack={() => {
          navigation.goBack();
        }}
      />
      <TabOfficeBlock currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.filter_wrapper}>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => {
              setIsOpenStatusSelect(true);
            }}
          >
            <Text style={[text_black, fs_14_400]}>{statusValue.label}</Text>
            <DropdownIcon width={20} height={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dropdown]}
            onPress={() => {
              setIsOpenTimeSelect(true);
            }}
          >
            <Text style={[text_black, fs_14_400]}>
              {currentMonth.month + 1}/{currentMonth.year}
            </Text>
            <DropdownIcon width={20} height={20} />
          </TouchableOpacity>
        </View>
        <PrimaryTable
          data={tableData}
          columns={columns}
          canShowMore={true}
          rowDetailComponent={(item: any) => {
            return (
              <WorkOfficeRowDetail
                data={item}
                isWorkArise={currentTab === 1}
                isDepartment={false}
              />
            );
          }}
        />
      </ScrollView>

      <TouchableOpacity
        style={styles.align_end}
        onPress={() => setIsOpenPlusButton(true)}
      >
        <AddIcon width={32} height={32} />
        <PlusButtonModal
          visible={isOpenPlusButton}
          setVisible={setIsOpenPlusButton}
          navigation={navigation}
          hasGiveWork={currentTabManager === 1}
        />
      </TouchableOpacity>
      <WorkOfficeStatusFilterModal
        visible={isOpenStatusSelect}
        setVisible={setIsOpenStatusSelect}
        setStatusValue={setStatusValue}
        statusValue={statusValue}
      />
      <MonthPickerModal
        visible={isOpenTimeSelect}
        setVisible={setIsOpenTimeSelect}
        setCurrentMonth={setCurrentMonth}
        currentMonth={currentMonth}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFF',
    position: 'relative',
  },
  content: {
    gap: 10,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 20,
  },
  filter_wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pl10: {
    paddingLeft: 10,
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
  align_end: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    zIndex: 2,
  },
});
