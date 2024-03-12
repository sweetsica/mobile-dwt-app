import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/header/Header.tsx';
import {useMemo, useState} from 'react';
import AdminTabBlock from '../../components/common/tab/AdminTabBlock.tsx';
import {useConnection} from '../../redux/connection';
import {
    fs_12_400,
    fs_12_500,
    fs_15_700,
    mb10,
    row_between,
    text_black,
    text_center,
    text_gray
} from "../../assets/style.ts";
import DropdownIcon from "../../assets/img/dropdown-icon.svg";
import dayjs from "dayjs";
import MonthPickerModal from "../../components/common/modal/MonthPickerModal.tsx";
import DailyMeetingCalendar from "../../components/meeting/DailyMeetingCalendar.tsx";
import MeetingItem from "../../components/meeting/MeetingItem.tsx";
import AddIcon from "../../assets/img/add.svg";
import PlusButtonModal from "../../components/work/PlusButtonModal.tsx";
import {useQuery} from "@tanstack/react-query";
import {dwtApi} from "../../api/service/dwtApi.ts";
import PrimaryLoading from "../../components/common/loading/PrimaryLoading.tsx";
import EmptyDailyReportIcon from "../../assets/img/empty-daily-report.svg";
import ListDepartmentModal from "../../components/home/manager-component/ListDepartmentModal.tsx";

export default function MeetingInfo({navigation}: any) {
    const {
        connection: {currentTabManager, userInfo},
    } = useConnection();

    const [currentDate, setCurrentDate] = useState<{
        month: number;
        year: number;
        date: number;
    }>({
        month: dayjs().month(),
        year: dayjs().year(),
        date: dayjs().date(),
    });
    const [isOpenSelectMonth, setIsOpenSelectMonth] = useState(false);
    const [isOpenPlusButton, setIsOpenPlusButton] = useState(false);
    const [isOpenDepartmentSelect, setIsOpenDepartmentSelect] = useState(false);
    const [departmentValue, setDepartmentValue] = useState<any>({
        label: 'Phòng ban',
        value: 0,
    });


    const {
        data: listDepartment = []
    } = useQuery(['listDepartment'], async () => {
        if (userInfo?.role === 'admin') {
            const res = await dwtApi.getListDepartment();
            return res?.data;
        } else if (userInfo?.role === 'manager') {
            const res = await dwtApi.getListChildrenDepartment(userInfo?.departement_id);
            return await Promise.all(res?.data?.map(async (item: string) => {
                const res = await dwtApi.getDepartmentById(item);
                return res?.data;
            }));
        }
    }, {
        enabled: !!userInfo && ['manager', 'admin'].includes(userInfo?.role),
    });

    const {
        data: listMeetingData = [],
        isLoading: isLoadingListMeeting,
    } = useQuery(['listMeeting', currentDate.month, currentDate.year, currentTabManager, departmentValue, userInfo], async ({queryKey}) => {
        if (queryKey[3] === 1) {
            const res = await dwtApi.getListMeeting({
                date: dayjs().month(Number(queryKey[1])).year(Number(queryKey[2])).format('MM/YYYY'),
                departement: queryKey[4]?.value === 0 ? undefined : queryKey[4]?.value,
            });
            if (userInfo?.role === 'manager') {
                const listChildrenDepartment = await dwtApi.getListChildrenDepartment(userInfo?.departement_id);
                return res?.data?.meetings.filter((item: any) => {
                    return listChildrenDepartment?.data?.includes(item?.departement_id);
                });
            }
            return res?.data?.meetings;
        } else {
            if (queryKey[5]?.role === 'user') {
                const res = await dwtApi.getListMeeting({
                    date: dayjs().month(Number(queryKey[1])).year(Number(queryKey[2])).format('MM/YYYY'),
                });
                return res?.data?.meetings
            } else {
                const res = await dwtApi.getListMeetingPersonalForManager({
                    date: dayjs().month(Number(queryKey[1])).year(Number(queryKey[2])).format('MM/YYYY'),
                });
                return res?.data;
            }
        }
    })

    const listMeetingToday = useMemo(() => {
        return listMeetingData.filter((item: any) => {
            return dayjs(item?.start_time.split(' ')[0]).date() === currentDate.date;
        })

    }, [listMeetingData, currentDate, currentTabManager])

    if (isLoadingListMeeting) {
        return <PrimaryLoading/>
    }

    return (
        <SafeAreaView style={styles.wrapper}>
            <AdminTabBlock/>
            <Header title={'DANH SÁCH CUỘC HỌP'} handleGoBack={() => navigation.goBack()}/>
            <View style={styles.content}>
                <View style={styles.top}>
                    <View style={[currentTabManager === 1 ? row_between : {justifyContent: 'flex-end'}, mb10]}>
                        {
                            currentTabManager === 1 && (
                                <TouchableOpacity
                                    style={styles.monthBox}
                                    onPress={() => {
                                        setIsOpenDepartmentSelect(true);
                                    }}>
                                    <Text style={[fs_15_700, text_black]}>
                                        {departmentValue.label}
                                    </Text>
                                    <DropdownIcon width={20} height={20}/>
                                </TouchableOpacity>
                            )
                        }
                        <TouchableOpacity
                            style={styles.monthBox}
                            onPress={() => {
                                setIsOpenSelectMonth(true);
                            }}>
                            <Text style={[fs_15_700, text_black]}>
                                Tháng {currentDate.month + 1}
                            </Text>
                            <DropdownIcon width={20} height={20}/>
                        </TouchableOpacity>
                    </View>
                    <DailyMeetingCalendar
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        listMeeting={listMeetingData}
                    />
                </View>

                {
                    currentTabManager === 1 && (
                        <View style={styles.totalReportBox}>
                            <Text style={[fs_12_500, text_gray]}>
                                {listMeetingToday.length} cuộc họp
                            </Text>
                        </View>
                    )
                }
                <FlatList
                    keyExtractor={(item, index) => item.id}
                    showsVerticalScrollIndicator={false}
                    data={listMeetingToday}
                    contentContainerStyle={{
                        paddingBottom: 20,
                        paddingTop: 10,
                    }}
                    renderItem={({item}) => {
                        return (
                            <MeetingItem item={item}/>
                        )
                    }}
                    ItemSeparatorComponent={() => <View style={{height: 10}}/>}
                    ListEmptyComponent={() => {
                        return (
                            <View>
                                <EmptyDailyReportIcon
                                    style={{alignSelf: 'center', marginTop: 50}}
                                />
                                <Text style={[fs_12_400, text_black, text_center]}>
                                    Bạn không có cuộc họp nào.
                                </Text>
                            </View>
                        )
                    }}
                />
            </View>

            <MonthPickerModal
                visible={isOpenSelectMonth}
                setVisible={() => {
                    setIsOpenSelectMonth(false);
                }}
                currentMonth={currentDate}
                setCurrentMonth={setCurrentDate}
            />

            <TouchableOpacity
                style={styles.align_end}
                onPress={() => setIsOpenPlusButton(true)}
            >
                <AddIcon width={32} height={32}/>
                <PlusButtonModal
                    visible={isOpenPlusButton}
                    setVisible={setIsOpenPlusButton}
                    navigation={navigation}
                    notHasReceiveWork={true}
                />
            </TouchableOpacity>

            <ListDepartmentModal
                visible={isOpenDepartmentSelect}
                setVisible={setIsOpenDepartmentSelect}
                currentDepartment={departmentValue}
                setCurrentDepartment={setDepartmentValue}
                listDepartment={listDepartment.map((item: any) => {
                    return {
                        label: item.name,
                        value: item.id,
                    };
                })}
            />
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative',
    },
    content: {
        paddingTop: 10,
        flex: 1,
    },
    monthBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        alignSelf: 'flex-end',
    },
    top: {
        paddingHorizontal: 15,
    },
    align_end: {
        position: 'absolute',
        bottom: 10,
        right: 15,
        zIndex: 2,
    },
    totalReportBox: {
        backgroundColor: '#F7F7F7',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
});
