import {FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {fs_10_500, fs_12_400, fs_15_700, py20, text_black, text_center, text_white} from '../../../assets/style.ts';
import WorkProgressBlock from '../manager-component/WorkProgressBlock.tsx';
import BehaviorBlock from '../home-component/BehaviorBlock.tsx';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {dwtApi} from '../../../api/service/dwtApi.ts';
import PrimaryLoading from '../../common/loading/PrimaryLoading.tsx';
import AddIcon from '../../../assets/img/add.svg';
import PlusButtonModal from '../../work/PlusButtonModal.tsx';
import {useMemo, useState} from 'react';
import {useRefreshOnFocus} from '../../../hook/useRefeshOnFocus.ts';
import DropdownIcon from "../../../assets/img/dropdown-icon.svg";
import dayjs from "dayjs";
import MonthPickerModal from "../../common/modal/MonthPickerModal.tsx";
import {useConnection} from "../../../redux/connection";
import ReportAndProposeBlock from "../manager-component/ReportAndProposeBlock.tsx";
import {getMonthFormat} from "../../../utils";
import UserFilterModal from "../../common/modal/UserFilterModal.tsx";
import DailyCalendar from "../../daily-report/DailyCalendar.tsx";
import EmptyDailyReportIcon from "../../../assets/img/empty-daily-report.svg";

export default function AdminFactory(
    {
        leftDepartmentData,
        rewardAndPunishData,
        navigation
    }: any) {
    const {connection: {userInfo}} = useConnection()
    const [currentDate, setCurrentDate] = useState<{
        month: number;
        year: number;
        date: number;
    }>({
        month: dayjs().month(),
        year: dayjs().year(),
        date: dayjs().date(),
    });
    const [isOpenTimeSelect, setIsOpenTimeSelect] = useState(false);
    const [isOpenUserSelect, setIsOpenUserSelect] = useState(false);
    const [currentUserId, setCurrentUserId] = useState({
        label: 'Nhân sự',
        value: 0,
    });
    const [searchUserValue, setSearchUserValue] = useState('');

    const [isOpenPlusButton, setIsOpenPlusButton] = useState(false);


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

    const {
        data: totalPropose = 0
    } = useQuery(['totalProposeHome'], async () => {
        const res = await dwtApi.getListDepartmentPropose();
        return res?.data?.total;
    })


    const {
        data: listUsers = [],
    } = useQuery(["dwtApi.getListAllUser", searchUserValue], async ({queryKey}) => {
            const res = await dwtApi.searchUser({
                q: queryKey[1],
            })
            return res?.data?.data
        },
    )

    const {
        data: managerFactoryData = {},
        isLoading: loadingProductionDiary,
        refetch: refetchFactoryWork
    } = useQuery(
            [
                'adminFactory',
                currentDate.month,
                currentDate.year,
            ],
            ({queryKey}: any) =>
                dwtApi.getProductionDiaryPerMonth({
                    date: getMonthFormat(queryKey[1] + 1, queryKey[2]),
                })
        );
    const {data: listManagerFactory = []} = managerFactoryData;

    const todayLogs = useMemo(() => {
        return listManagerFactory.filter(
            (item: any) => {
                const logDate = dayjs(item?.logDate);
                return logDate.month() === currentDate.month &&
                    logDate.year() === currentDate.year &&
                    logDate.date() === currentDate.date;
            }
        ).sort((a: any, b: any) => {
            return a?.project_work_id - b?.project_work_id;
        })
    }, [listManagerFactory, currentDate]);

    useRefreshOnFocus(refetchFactoryWork);

    if (loadingProductionDiary) {
        return <PrimaryLoading/>;
    }
    return (
        <View style={styles.wrapper}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/*<View style={styles.filter_wrapper}>*/}
                {/*    <TouchableOpacity*/}
                {/*        style={styles.dropdown}*/}
                {/*        onPress={() => {*/}
                {/*            setIsOpenTimeSelect(true);*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        <Text style={[text_black, fs_12_400]}>*/}
                {/*            Tháng {currentDate.month + 1}/{currentDate.year}*/}
                {/*        </Text>*/}
                {/*        <DropdownIcon width={20} height={20}/>*/}
                {/*    </TouchableOpacity>*/}
                {/*    <TouchableOpacity*/}
                {/*        style={styles.dropdown}*/}
                {/*        onPress={() => {*/}
                {/*            setIsOpenUserSelect(true);*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        <Text style={[text_black, fs_12_400]}>*/}
                {/*            {currentUserId.label}*/}
                {/*        </Text>*/}
                {/*        <DropdownIcon width={20} height={20}/>*/}
                {/*    </TouchableOpacity>*/}
                {/*</View>*/}
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
                    type={'factory'}
                />

                <TouchableOpacity
                    style={styles.monthBox}
                    onPress={() => {
                        setIsOpenTimeSelect(true);
                    }}
                >
                    <Text style={[fs_15_700, text_black]}>
                        Tháng {currentDate.month + 1}
                    </Text>
                    <DropdownIcon width={20} height={20}/>
                </TouchableOpacity>
                <DailyCalendar
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    listProjectLogs={listManagerFactory}
                />
                <FlatList
                    scrollEnabled={false}
                    contentContainerStyle={{
                        paddingTop: 30,
                        paddingBottom: 20,
                    }}
                    data={todayLogs.map((item: any) => ({...item, key: item.id}))}
                    renderItem={({item}) => {
                        return (
                            <TouchableOpacity
                                style={styles.boxContainer}
                                onPress={() => {
                                    // @ts-ignore
                                    navigation.navigate('ProjectWorkDetail', {
                                        data: item.project_work_id,
                                    });
                                }}
                            >
                                <View style={styles.logWrapper}>
                                    <View
                                        style={[
                                            styles.timeBox,
                                            {
                                                backgroundColor:
                                                    item?.type === 1 ? '#C02626' : '#7CB8FF',
                                            },
                                        ]}
                                    >
                                        <Text style={[fs_10_500, text_white, text_center]}>
                                            {item?.user_name} ({item?.type === 1 ? 'GV' : 'TK'})
                                        </Text>
                                    </View>
                                    <Text style={[fs_12_400, text_black]}>• {item?.content}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    ItemSeparatorComponent={() => <View style={{height: 20}}/>}
                    ListEmptyComponent={() => {
                        return (
                            <View>
                                <EmptyDailyReportIcon
                                    style={{alignSelf: 'center', marginTop: 50}}
                                />
                                <Text style={[fs_12_400, text_black, text_center]}>
                                    Chưa có báo cáo.
                                </Text>
                            </View>
                        )
                    }}
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

            <MonthPickerModal
                visible={isOpenTimeSelect}
                setVisible={setIsOpenTimeSelect}
                setCurrentMonth={setCurrentDate}
                currentMonth={currentDate}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    dropdown: {
        width: '48%',
        borderRadius: 5,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.25)',
    },
    monthBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        alignSelf: 'flex-end',
        padding: 8,
        marginBottom: 5,
    },
    boxContainer: {
        width: '100%',
    },
    logWrapper: {
        width: '100%',
        backgroundColor: '#F4F4F4',
        borderRadius: 12,
        elevation: 5,
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: {
            width: 1,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        paddingVertical: 15,
        paddingLeft: 15,
        paddingRight: 10,
    },
    timeBox: {
        position: 'absolute',
        left: 15,
        top: -8,
        borderRadius: 15,
        paddingVertical: 3,
        paddingHorizontal: 5,
    },
});
