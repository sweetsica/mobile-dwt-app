import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    fs_12_400,
    fs_15_700,
    text_black,
    text_center,
} from '../../assets/style.ts';
import DropdownIcon from '../../assets/img/dropdown-icon.svg';
import DailyCalendar from './DailyCalendar.tsx';
import PersonalReportDetail from './PersonalReportDetail.tsx';
import PrimaryButton from '../common/button/PrimaryButton.tsx';
import MonthPickerModal from '../common/modal/MonthPickerModal.tsx';
import {useEffect, useState} from 'react';
import dayjs from 'dayjs';
import {dwtApi} from '../../api/service/dwtApi.ts';
import LoadingActivity from '../common/loading/LoadingActivity.tsx';
import EmptyDailyReportIcon from '../../assets/img/empty-daily-report.svg';
import CreateOrEditDailyReportModal from '../common/modal/CreateOrEditDailyReportModal.tsx';
import {useQuery} from '@tanstack/react-query';
import {useRefreshOnFocus} from "../../hook/useRefeshOnFocus.ts";
import {useConnection} from "../../redux/connection";

export default function PersonalReport() {
    const {connection: {userInfo}} = useConnection();
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
    const today = dayjs();
    //only can create or edit if today is same day with currentDate
    const canCreateOrEdit =
        currentDate.month === today.month() &&
        currentDate.year === today.year() &&
        currentDate.date === today.date();

    const [isOpenCreateOrEditModal, setIsOpenCreateOrEditModal] = useState(false);

    const {
        data: userDailyReportData = {},
        isLoading: loadingUserReport,
        refetch: reFetchUserReport,
        isSuccess: successUserReport
    } = useQuery(
        ['dwtApi.getDailyReportPersonalPerMonth', currentDate, userInfo?.id],
        ({queryKey}: any) =>
            dwtApi.getDailyReportPersonalPerMonth({
                date_report: `${queryKey[1].year}-${queryKey[1].month + 1}`,
            })
    );
    const {data: userDailyReports = []} = userDailyReportData;

    const todayReport = userDailyReports.find((item: any) => {
        const itemDate = dayjs(item?.date_report);
        return (
            itemDate.month() === currentDate.month &&
            itemDate.year() === currentDate.year &&
            itemDate.date() === currentDate.date
        );
    });

    useEffect(() => {
        setCurrentDate({
            month: dayjs().month(),
            year: dayjs().year(),
            date: dayjs().date(),
        })
    }, [dayjs().date()]);

    useRefreshOnFocus(reFetchUserReport)

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity
                style={styles.monthBox}
                onPress={() => {
                    setIsOpenSelectMonth(true);
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
                listUserReports={userDailyReports}
            />
            {todayReport ? (
                <ScrollView style={styles.listReport}>
                    <FlatList
                        scrollEnabled={false}
                        contentContainerStyle={{
                            paddingTop: 30,
                            paddingBottom: 20,
                        }}
                        data={
                            todayReport
                                ? [
                                    {
                                        key: 1,
                                        text: todayReport?.yesterday_work_note ?? '',
                                        label: 'Hôm qua',
                                        time: dayjs(todayReport?.created_at).format('HH:mm'),
                                        todayType: 0
                                    },
                                    {
                                        key: 2,
                                        text: todayReport?.today_work_note ?? '',
                                        label: 'Hôm nay',
                                        time: dayjs(todayReport?.created_at).format('HH:mm'),
                                        todayType: 1
                                    },
                                ]
                                : []
                        }
                        renderItem={({item}) => {
                            return (
                                <View style={styles.boxContainer}>
                                    <PersonalReportDetail data={item}/>
                                </View>
                            );
                        }}
                        ItemSeparatorComponent={() => <View style={{height: 20}}/>}
                    />
                </ScrollView>
            ) : (
                <View>
                    <EmptyDailyReportIcon
                        style={{alignSelf: 'center', marginTop: 50}}
                    />
                    <Text style={[fs_12_400, text_black, text_center]}>
                        Bạn chưa có báo cáo.
                    </Text>
                </View>
            )}
            {todayReport && canCreateOrEdit && (
                <PrimaryButton
                    onPress={() => {
                        setIsOpenCreateOrEditModal(true);
                    }}
                    text={'Sửa báo cáo'}
                    buttonStyle={styles.buttonStyle}
                />
            )}

            {!todayReport && canCreateOrEdit && (
                <PrimaryButton
                    onPress={() => {
                        setIsOpenCreateOrEditModal(true);
                    }}
                    text={'Thêm báo cáo'}
                    buttonStyle={styles.buttonStyle}
                />
            )}

            <MonthPickerModal
                visible={isOpenSelectMonth}
                setVisible={() => {
                    setIsOpenSelectMonth(false);
                }}
                currentMonth={currentDate}
                setCurrentMonth={setCurrentDate}
            />
            {
                isOpenCreateOrEditModal && (
                    <CreateOrEditDailyReportModal
                        visible={isOpenCreateOrEditModal}
                        setVisible={setIsOpenCreateOrEditModal}
                        isEdit={todayReport}
                        currentDate={currentDate}
                        onSuccess={reFetchUserReport}
                    />
                )
            }
            <LoadingActivity isLoading={loadingUserReport}/>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
    },
    monthBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        alignSelf: 'flex-end',
        padding: 8,
        marginBottom: 5,
    },
    dropdownStyle: {
        width: 100,
        alignSelf: 'flex-end',
        marginRight: 15,
        marginTop: 10,
    },
    buttonStyle: {
        paddingVertical: 12,
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 8,
    },
    listReport: {
        position: 'relative',
        paddingHorizontal: 15,
    },
    timeText: {
        fontSize: 12,
        fontWeight: '400',
        position: 'absolute',
        left: 0,
        top: 20,
    },
    boxContainer: {
        width: '100%',
    },
});
