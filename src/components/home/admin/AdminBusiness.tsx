import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import BehaviorBlock from '../home-component/BehaviorBlock.tsx';
import WorkTable from '../WorkTable.tsx';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {dwtApi} from '../../../api/service/dwtApi.ts';
import PrimaryLoading from '../../common/loading/PrimaryLoading.tsx';
import AddIcon from '../../../assets/img/add.svg';
import PlusButtonModal from '../../work/PlusButtonModal.tsx';
import {useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useRefreshOnFocus} from '../../../hook/useRefeshOnFocus.ts';
import {useConnection} from '../../../redux/connection';
import dayjs from "dayjs";
import WorkProgressBlock from "../manager-component/WorkProgressBlock.tsx";
import ReportAndProposeBlock from "../manager-component/ReportAndProposeBlock.tsx";
import WorkBusinessManagerTable from "../manager-component/WorkBusinessManagerTable.tsx";
import {fs_12_400, text_black} from "../../../assets/style.ts";
import DropdownIcon from "../../../assets/img/dropdown-icon.svg";
import ListDepartmentModal from "../manager-component/ListDepartmentModal.tsx";
import MonthPickerModal from "../../common/modal/MonthPickerModal.tsx";
import UserFilterModal from "../../common/modal/UserFilterModal.tsx";
import {LIST_BUSINESS_DEPARTMENT} from "../../../assets/constant.ts";
import {getMonthFormat} from "../../../utils";

export default function AdminBusiness(
    {
        rewardAndPunishData,
        leftDepartmentData
    }: any) {
    const {
        connection: {userInfo, listDepartmentGroup},
    } = useConnection();
    const navigation = useNavigation();
    const [isOpenPlusButton, setIsOpenPlusButton] = useState(false);

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

    const {data: listDepartment = []} = useQuery(
        ['listDepartmentBusiness'],
        async () => {
            const res = await dwtApi.getListDepartment();
            return res.data.filter((item: any) =>
                listDepartmentGroup.business.includes(item.id)
            );
        }, {enabled: !!listDepartmentGroup}
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
                departement_id: queryKey[1].value === 0 ? undefined : queryKey[1].value,
                q: queryKey[2],
            });

            return res?.data?.data;
        },
    );

    const {
        data: listWorkDepartment = [],
        isLoading: isLoadingWork,
        refetch: refetchWork,
    } = useQuery(
        ['adminBusiness', currentDepartment, currentUserId, currentMonth],
        async ({queryKey}) => {
            const listWorkDepartmentData = await dwtApi.getListWorkDepartment({
                date: getMonthFormat(queryKey[3].month + 1, queryKey[3].year),
                department_id: queryKey[1].value === 0 ? undefined : queryKey[1].value,
                user_id: queryKey[2].value === 0 ? undefined : queryKey[2].value,
            });
            const listWorkAriseDepartmentData =
                await dwtApi.getListWorkAriseDepartment({
                    date: getMonthFormat(queryKey[3].month + 1, queryKey[3].year),
                    department_id: queryKey[1].value === 0 ? undefined : queryKey[1].value,
                    user_id: queryKey[2].value === 0 ? undefined : queryKey[2].value,
                });

            const listWorkDepartmentAll = Object.keys(
                listWorkDepartmentData.data.kpi.keyByUsers
            ).reduce((acc, val) => {
                return acc.concat(listWorkDepartmentData.data.kpi.keyByUsers[val]);
            }, []);

            const listNonKeyWorkDepartmentAll = Object.keys(
                listWorkDepartmentData.data.kpi.nonKeyByUsers
            ).reduce((acc, val) => {
                return acc.concat(listWorkDepartmentData.data.kpi.nonKeyByUsers[val]);
            }, []);

            return [
                ...listWorkDepartmentAll,
                ...listNonKeyWorkDepartmentAll,
                ...listWorkAriseDepartmentData.data.businessStandardWorkAriseAll.map(
                    (item: any) => {
                        return {
                            ...item,
                            isWorkArise: true,
                        };
                    }
                ),
            ];
        },
        {
            enabled: !!userInfo,
        }
    );

    const workSummary = useMemo(() => {
        if (listWorkDepartment) {
            return {
                done: listWorkDepartment.filter((item: any) => item.actual_state === 4)
                    .length,
                working: listWorkDepartment.filter(
                    (item: any) => item.actual_state === 2
                ).length,
                late: listWorkDepartment.filter((item: any) => item.actual_state === 5)
                    .length,
                total: listWorkDepartment.filter(
                    (item: any) =>
                        item.actual_state === 4 ||
                        item.actual_state === 2 ||
                        item.actual_state === 5
                ).length,
            };
        } else {
            return {};
        }
    }, [listWorkDepartment]);

    useRefreshOnFocus(refetchWork);

    if (isLoadingWork) {
        return <PrimaryLoading/>;
    }
    return (
        <View style={styles.wrapper}>
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
                    type={'business'}
                />
                <WorkBusinessManagerTable
                    listWork={listWorkDepartment}
                    date={dayjs().format('YYYY-MM')}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
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
