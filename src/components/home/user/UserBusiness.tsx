import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import WorkProgressBlock from '../home-component/WorkProgressBlock.tsx';
import SummaryBlock from '../home-component/SummaryBlock.tsx';
import BehaviorBlock from '../home-component/BehaviorBlock.tsx';
import WorkTable from '../WorkTable.tsx';
import {useQuery} from '@tanstack/react-query';
import {dwtApi} from '../../../api/service/dwtApi.ts';
import PrimaryLoading from '../../common/loading/PrimaryLoading.tsx';
import AddIcon from '../../../assets/img/add.svg';
import PlusButtonModal from '../../work/PlusButtonModal.tsx';
import {useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useRefreshOnFocus} from '../../../hook/useRefeshOnFocus.ts';
import MainTarget from "../MainTarget.tsx";
import dayjs from "dayjs";

export default function UserBusiness(
    {
        attendanceData,
        checkInTime,
        checkOutTime,
        rewardAndPunishData,
    }: any) {
    const navigation = useNavigation();
    const [isOpenPlusButton, setIsOpenPlusButton] = useState(false);

    const {
        data: userBusinessData,
        isLoading: isLoadingWork,
        refetch: refetchWork,
    } = useQuery(['userBusiness'], async () => {
        const resPersonal = await dwtApi.getWorkListAndPoint();
        return resPersonal.data;
    });

    const {
        data: mainTargetData,
    } = useQuery(['mainTargetBusiness'], async () => {
        const res: any = await dwtApi.getMainTarget();
        return res[0]
    })


    const {
        data: tmpMainTargetData,
    } = useQuery(['tmpMainTargetBusiness'], async () => {
        const res: any = await dwtApi.getTotalTmpMainTarget('business', dayjs().format('YYYY-MM'));
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
        if (userBusinessData) {
            const listWorkPersonal = [
                ...userBusinessData?.kpi.keys,
                ...userBusinessData?.kpi.noneKeys,
                ...userBusinessData?.kpi.workArise.map((item: any) => {
                    return {
                        ...item,
                        isWorkArise: true,
                    };
                }),
            ];
            const userKpiData = userBusinessData?.kpi;
            const departmentKpiData = userBusinessData?.departmentKPI;
            const workSummary = {
                done: listWorkPersonal.filter((item: any) => item.actual_state === 4)
                    .length,
                working: listWorkPersonal.filter((item: any) => item.actual_state === 2)
                    .length,
                late: listWorkPersonal.filter((item: any) => item.actual_state === 5)
                    .length,
                total: listWorkPersonal.filter(
                    (item: any) =>
                        item.actual_state === 4 ||
                        item.actual_state === 2 ||
                        item.actual_state === 5
                ).length,
            };
            return {
                listWorkPersonal: listWorkPersonal,
                monthOverviewPersonal: {
                    percent: userKpiData.monthOverview.percent,
                    tasks: userKpiData.monthOverview.tasks.map((item: any) => {
                        return {
                            name: item.name,
                            kpi: item.business_standard_score_tmp
                                ? item.business_standard_score_tmp
                                : 0,
                        };
                    }),
                },
                monthOverviewDepartment: {
                    percent: departmentKpiData.monthOverview.percent,
                    tasks: departmentKpiData.monthOverview.tasks.map((item: any) => {
                        return {
                            name: item.name,
                            kpi: item.business_standard_score_tmp
                                ? item.business_standard_score_tmp
                                : 0,
                        };
                    }),
                },
                workSummary,
                userKpi: userKpiData.monthOverview.totalWork,
                departmentKpi: departmentKpiData.monthOverview.totalWork,
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
    }, [userBusinessData]);

    useRefreshOnFocus(refetchWork);

    if (isLoadingWork) {
        return <PrimaryLoading/>;
    }
    return (
        <View style={styles.wrapper}>

            <View style={{
                paddingHorizontal: 15,
                paddingVertical: 10
            }}>
                <MainTarget tmpAmount={tmpMainTargetData?.sum} name={mainTargetData?.name}
                            value={mainTargetData?.amount} unit={mainTargetData?.unit}/>
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
                    type={'business'}
                />
                <WorkTable
                    listWork={listWorkPersonal.map((item) => {
                        return {
                            ...item,
                            amount: item?.business_standard_quantity_display,
                            kpi: item?.business_standard_score_tmp,
                        };
                    })}
                />
            </ScrollView>

            <TouchableOpacity
                style={styles.align_end}
                onPress={() => setIsOpenPlusButton(true)}
            >
                <AddIcon width={32} height={32}/>
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
