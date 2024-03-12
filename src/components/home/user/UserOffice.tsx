import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { py20 } from '../../../assets/style.ts';
import WorkProgressBlock from '../home-component/WorkProgressBlock.tsx';
import SummaryBlock from '../home-component/SummaryBlock.tsx';
import BehaviorBlock from '../home-component/BehaviorBlock.tsx';
import WorkTable from '../WorkTable.tsx';
import { useQuery } from '@tanstack/react-query';
import { dwtApi } from '../../../api/service/dwtApi.ts';
import PrimaryLoading from '../../common/loading/PrimaryLoading.tsx';
import AddIcon from '../../../assets/img/add.svg';
import PlusButtonModal from '../../work/PlusButtonModal.tsx';
import { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useRefreshOnFocus } from '../../../hook/useRefeshOnFocus.ts';
import WorkOfficeManagerTable from "../manager-component/WorkOfficeManagerTable.tsx";
import MainTarget from "../MainTarget.tsx";
import dayjs from "dayjs";

export default function UserOffice({
  attendanceData,
  checkInTime,
  checkOutTime,
  rewardAndPunishData,
}: any) {
  const navigation = useNavigation();
  const [isOpenPlusButton, setIsOpenPlusButton] = useState(false);

  const {
    data: userOfficeData,
    isLoading: isLoadingWork,
    refetch: refetchWork,
  } = useQuery(['userOffice'], async () => {
    const resPersonal = await dwtApi.getOfficeWorkPersonal();
    return resPersonal.data;
  });


  const {
    data: mainTargetData,
  } = useQuery(['mainTargetOffice'], async () => {
    const res: any =  await dwtApi.getMainTarget();
    return res[1]
  })

  const {
    data: tmpMainTargetData,
  } = useQuery(['tmpMainTargetOffice'], async () => {
    const res: any =  await dwtApi.getTotalTmpMainTarget('office', dayjs().format('YYYY-MM'));
    return res?.data
  })

  const {
    listWorkPersonal = [],
    monthOverviewPersonal = {},
    monthOverviewDepartment = {},
    workSummary = {},
    userKpi = 0,
    departmentKpi = 0,
  } = useMemo(() => {
    if (userOfficeData) {
      const userKpiData = userOfficeData?.kpi;
      const departmentKpiData = userOfficeData?.departmentKpi;
      const listWorkPersonal = [
        ...userKpiData.targetDetails,
        ...userKpiData.reportTasks.map((item: any) => {
          return {
            ...item,
            isWorkArise: true,
          };
        }),
      ];
      const workSummary = {
        done: listWorkPersonal.filter((item: any) => item.work_status === 3)
          .length,
        working: listWorkPersonal.filter((item: any) => item.work_status === 2)
          .length,
        late: listWorkPersonal.filter((item: any) => item.work_status === 4)
          .length,
        total: listWorkPersonal.filter(
          (item: any) =>
            item.work_status === 3 ||
            item.work_status === 2 ||
            item.work_status === 4
        ).length,
      };
      return {
        listWorkPersonal: listWorkPersonal,
        monthOverviewPersonal: {
          percent: userKpiData.percentFinish,
          tasks: userKpiData.monthOverview.map((item: any) => {
            return {
              name: item.name,
              kpi: item?.kpiValue ?? 0,
            };
          }),
        },
        monthOverviewDepartment: {
          percent: departmentKpiData.percentFinish,
          tasks: departmentKpiData.monthOverview.map((item: any) => {
            return {
              name: item.name,
              kpi: item?.kpiValue ?? 0,
            };
          }),
        },
        workSummary,
        userKpi: userKpiData.totalWork,
        departmentKpi: departmentKpiData.totalWork,
      };
    } else {
      return {
        listWorkPersonal: [],
        monthOverviewPersonal: {},
        monthOverviewDepartment: {},
        workSummary: {},
        userKpi: 0,
        departmentKpi: 0,
      };
    }
  }, [userOfficeData]);

  useRefreshOnFocus(refetchWork);

  if (isLoadingWork) {
    return <PrimaryLoading />;
  }
  return (
    <View style={styles.wrapper}>
      <View style={{
        paddingHorizontal: 15,
        paddingVertical: 10
      }}>

        <MainTarget tmpAmount={tmpMainTargetData?.countFinish} name={mainTargetData?.name} value={mainTargetData?.amount} unit={mainTargetData?.unit}  />
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <WorkProgressBlock
          attendanceData={attendanceData}
          checkIn={checkInTime}
          checkOut={checkOutTime}
          userKpi={userKpi}
          departmentKpi={departmentKpi}
        />
        <SummaryBlock
          monthOverviewPersonal={monthOverviewPersonal}
          monthOverviewDepartment={monthOverviewDepartment}
        />
        <BehaviorBlock
          rewardAndPunishData={rewardAndPunishData}
          workSummary={workSummary}
          type={'office'}
        />
        <WorkOfficeManagerTable listWork={listWorkPersonal} />
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
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  content: {
    gap: 15,
    paddingHorizontal: 15,
    paddingBottom: 20,
    paddingTop: 10,
  },
  align_end: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    zIndex: 2,
  },
});
