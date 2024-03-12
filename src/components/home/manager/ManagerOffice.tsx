import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {fs_12_400, py20, text_black} from '../../../assets/style.ts';
import WorkProgressBlock from '../manager-component/WorkProgressBlock.tsx';
import BehaviorBlock from '../home-component/BehaviorBlock.tsx';
import WorkTable from '../WorkTable.tsx';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {dwtApi} from '../../../api/service/dwtApi.ts';
import PrimaryLoading from '../../common/loading/PrimaryLoading.tsx';
import AddIcon from '../../../assets/img/add.svg';
import PlusButtonModal from '../../work/PlusButtonModal.tsx';
import {useMemo, useState} from 'react';
import {useRefreshOnFocus} from '../../../hook/useRefeshOnFocus.ts';
import DropdownIcon from "../../../assets/img/dropdown-icon.svg";
import dayjs from "dayjs";
import ListDepartmentModal from "../manager-component/ListDepartmentModal.tsx";
import MonthPickerModal from "../../common/modal/MonthPickerModal.tsx";
import {useConnection} from '../../../redux/connection';
import ReportAndProposeBlock from "../manager-component/ReportAndProposeBlock.tsx";
import {getMonthFormat} from '../../../utils';
import UserFilterModal from "../../common/modal/UserFilterModal.tsx";
import WorkOfficeManagerTable from "../manager-component/WorkOfficeManagerTable.tsx";
import MainTarget from "../MainTarget.tsx";

export default function ManagerOffice(
    {
        rewardAndPunishData,
        navigation,
        leftDepartmentData
    }: any) {
    const {
        connection: {userInfo},
    } = useConnection();
    const [isOpenDepartmentModal, setIsOpenDepartmentModal] =
        useState<boolean>(false);
    const [currentDepartment, setCurrentDepartment] = useState<any>({
        value: 0,
        label: 'Phòng ban',
    });
    const [currentMonth, setCurrentMonth] = useState({
        month: dayjs().month(),
        year: dayjs().year(),
    });
    const [isOpenTimeSelect, setIsOpenTimeSelect] = useState(false);
    const [isOpenUserSelect, setIsOpenUserSelect] = useState(false);
    const [currentUserId, setCurrentUserId] = useState({
        label: 'Nhân sự',
        value: 0,
    });
    const [searchUserValue, setSearchUserValue] = useState('');

    const [isOpenPlusButton, setIsOpenPlusButton] = useState(false);


    const {
        data: mainTargetData,
    } = useQuery(['mainTargetOffice'], async () => {
        const res: any = await dwtApi.getMainTarget();
        return res[1]
    })

    const {
        data: tmpMainTargetData,
    } = useQuery(['tmpMainTargetOffice'], async () => {
        const res: any = await dwtApi.getTotalTmpMainTarget('office', dayjs().format('YYYY-MM'));
        return res?.data
    })

    const {data: listDepartment = []} = useQuery(
        ['listDepartmentOffice', userInfo?.departement_id],
        async () => {
            const res = await dwtApi.getListDepartment();
            const listChildrenDepartment = await dwtApi.getListChildrenDepartment(userInfo?.departement_id);

            return res.data.filter((item: any) =>
                listChildrenDepartment?.data?.includes(item.id)
            );
        }, {enabled: !!userInfo}
    );

    const {data: totalReport = 0} = useQuery(
        ['dailyReportHome'],
        async () => {
            const res = await dwtApi.getDailyReportDepartment({
                date_report: dayjs().format('YYYY-MM-DD'),
            });
            return res?.data?.countDailyReports;
        },
        {
            enabled: !!userInfo,
        }
    );

    const {data: totalMeeting = 0} = useQuery(
        ['totalMeetingHome'],
        async () => {
            try {
                const res = await dwtApi.getListMeetingHomePage({
                    date: dayjs().format('DD/MM/YYYY'),
                    departement: userInfo?.departement_id,
                });
                return res?.data?.total;
            } catch (err) {
                console.log(err)
            }
        },
        {
            enabled: !!userInfo,
        }
    );

    const {data: totalPropose = 0} = useQuery(
        ['totalProposeHome'],
        async () => {
            const res = await dwtApi.getListDepartmentPropose();
            return res?.data?.total;
        }
    );

    const {
        data: listUsers = [],
    } = useQuery(
        ['dwtApi.getListAllUser', currentDepartment, searchUserValue],
        async ({queryKey}) => {
            const res = await dwtApi.searchUser({
                departement_id:
                    queryKey[1].value === 0
                        ? undefined
                        : queryKey[1].value,
                q: queryKey[2],
            });

            return res?.data?.data
        },
    );

    const {
        data: managerOfficeData,
        isLoading: isLoadingWork,
        refetch: refetchWork,
    } = useQuery(
        ['managerOffice', currentDepartment, currentMonth, currentUserId],
        async ({queryKey}) => {
            const res = await dwtApi.getOfficeWorkDepartment({
                department_id:
                    queryKey[1].value === 0
                        ? userInfo?.departement_id
                        : queryKey[1].value,
                start_date: getMonthFormat(queryKey[2].month + 1, queryKey[2].year),
                user_id: queryKey[3].value === 0 ? undefined : queryKey[3].value,
            });
            return res.data;
        }
    );

    const {listWorkDepartment = [], workSummary = {}} = useMemo(() => {
        if (managerOfficeData) {
            const listWorkOffice = [
                ...managerOfficeData.departmentKpi.targetDetails,
                ...managerOfficeData.departmentKpi.reportTasks.map((item: any) => {
                    return {
                        ...item,
                        isWorkArise: true,
                    };
                }),
            ];
            const workSummary = {
                done: listWorkOffice.filter((item: any) => item.work_status === 3)
                    .length,
                working: listWorkOffice.filter((item: any) => item.work_status === 2)
                    .length,
                late: listWorkOffice.filter((item: any) => item.work_status === 4)
                    .length,
                total: listWorkOffice.filter(
                    (item: any) =>
                        item.work_status === 3 ||
                        item.work_status === 2 ||
                        item.work_status === 4
                ).length,
            };
            return {
                listWorkDepartment: listWorkOffice,
                workSummary: workSummary,
            };
        } else {
            return {
                listWorkDepartment: [],
                workSummary: {},
            };
        }
    }, [managerOfficeData]);

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

                <MainTarget tmpAmount={tmpMainTargetData?.countFinish} name={mainTargetData?.name}
                            value={mainTargetData?.amount} unit={mainTargetData?.unit}/>
            </View>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.filter_wrapper}>
                    <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() => {
                            setIsOpenTimeSelect(true);
                        }}
                    >
                        <Text style={[text_black, fs_12_400]}>
                            Tháng {currentMonth.month + 1}/{currentMonth.year}
                        </Text>
                        <DropdownIcon width={20} height={20}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() => {
                            setIsOpenUserSelect(true);
                        }}
                    >
                        <Text style={[text_black, fs_12_400]}>{currentUserId.label}</Text>
                        <DropdownIcon width={20} height={20}/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() => {
                            setIsOpenDepartmentModal(true);
                        }}
                    >
                        <Text style={[text_black, fs_12_400]}>
                            {currentDepartment.label}
                        </Text>
                        <DropdownIcon width={20} height={20}/>
                    </TouchableOpacity>
                </View>
                <WorkProgressBlock
                    leftDepartmentData={leftDepartmentData}
                    totalMeeting={totalMeeting}
                />
                <ReportAndProposeBlock
                    totalDailyReport={totalReport}
                    totalPropose={totalPropose}
                />

                <BehaviorBlock
                    rewardAndPunishData={rewardAndPunishData}
                    workSummary={workSummary}
                    type={'office'}
                />
                <WorkOfficeManagerTable listWork={listWorkDepartment}/>
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

            {isOpenDepartmentModal && (
                <ListDepartmentModal
                    currentDepartment={currentDepartment}
                    setCurrentDepartment={setCurrentDepartment}
                    visible={isOpenDepartmentModal}
                    setVisible={setIsOpenDepartmentModal}
                    listDepartment={listDepartment.map((department: any) => {
                        return {
                            value: department.id,
                            label: department.name,
                        };
                    })}
                />
            )}

            <MonthPickerModal
                visible={isOpenTimeSelect}
                setVisible={setIsOpenTimeSelect}
                setCurrentMonth={setCurrentMonth}
                currentMonth={currentMonth}
            />

            <UserFilterModal
                visible={isOpenUserSelect}
                setVisible={setIsOpenUserSelect}
                currentUser={currentUserId}
                setCurrentUser={setCurrentUserId}
                searchValue={searchUserValue}
                setSearchValue={setSearchUserValue}
                listUser={[
                    {
                        value: 0,
                        label: 'Tất cả',
                    },
                    ...listUsers.map((item: any) => {
                        return {
                            value: item.id,
                            label: item.name,
                        };
                    }),
                ]}
            />
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
    filter_wrapper: {
        gap: 10,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    dropdown: {
        width: '31%',
        borderRadius: 5,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.25)',
    },
});
