import {
    FlatList, Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/header/Header.tsx';
import {Calendar} from 'react-native-calendars/';
import {LocaleConfig} from 'react-native-calendars';
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';
import ChevronLeftIcon from '../../assets/img/chevron-left-calendar.svg';
import ChevronRightIcon from '../../assets/img/chevron-right-calendar.svg';
import {fs_13_400, row_between, text_gray} from '../../assets/style.ts';
import AdminTabBlock from "../../components/common/tab/AdminTabBlock.tsx";

export default function WorkOfficeListReport({route, navigation}: any) {
    const {data} = route.params;
    const listLogs = data?.isWorkArise ? data.report_task_logs : data.target_logs || [];
    const initialDate = dayjs(new Date()).format('YYYY-MM-DD');
    const [markedDates, setMarkedDates] = useState<any>({});
    useEffect(() => {
        const markedDates = listLogs.reduce((prev: any, curr: any) => {
            const date = dayjs(
                data.isWorkArise ? curr.report_date : curr.reportedDate
            ).format('YYYY-MM-DD');
            return {
                ...prev,
                [date]: {
                    marked: true,
                    dotColor: '#DC3545',
                },
            };
        }, {});
        const today = dayjs(new Date()).format('YYYY-MM-DD');
        if (!markedDates[today]) {
            markedDates[today] = {
                selected: true,
                dotColor: '#DC3545',
                selectedColor: '#DC3545',
                selectedTextColor: '#FFF',
            };
        } else {
            markedDates[today] = {
                ...markedDates[today],
                selected: true,
                dotColor: '#DC3545',
                selectedColor: '#DC3545',
                selectedTextColor: '#FFF',
            };
        }
        setMarkedDates(markedDates);
    }, [data]);
    const handleChangeDay = (day: any) => {
        const listMarkedDates = {...markedDates};
        const date = dayjs(day).format('YYYY-MM-DD');
        if (!listMarkedDates[date]) {
            Object.keys(listMarkedDates).forEach((key) => {
                listMarkedDates[key] = {
                    ...listMarkedDates[key],
                    selected: false,
                };
            });
            listMarkedDates[date] = {
                selected: true,
                dotColor: '#DC3545',
                selectedColor: '#DC3545',
                selectedTextColor: '#FFF',
            };
        } else {
            Object.keys(listMarkedDates).forEach((key) => {
                listMarkedDates[key] = {
                    ...listMarkedDates[key],
                    selected: false,
                };
            });
            listMarkedDates[date] = {
                ...listMarkedDates[date],
                selected: true,
                dotColor: '#DC3545',
                selectedColor: '#DC3545',
                selectedTextColor: '#FFF',
            };
        }
        setMarkedDates(listMarkedDates);
    };

    const handlePressDay = (day: string) => {
        if(data.isWorkArise) {
            const index = listLogs.findIndex((item: any) => {
                const dayItem = dayjs(item.report_date).format('YYYY-MM-DD');
                return dayItem === day;
            });
            if(index !== -1) {
                // @ts-ignore
                navigation.navigate('WorkOfficeAriseReportEdit', {
                    data: {
                        ...listLogs[index],
                        name: data.name,
                        unit_name: data.unit_name,
                        totalTarget: data?.kpi_keys[0]?.pivot?.quantity,
                    },
                });
            } else {
                handleChangeDay(day)
            }
        } else {
            const index = listLogs.findIndex((item: any) => {
                const dayItem = dayjs(item.reportedDate).format('YYYY-MM-DD');
                return dayItem === day;
            });
            if(index !== -1) {
                // @ts-ignore
                navigation.navigate('WorkOfficeReportEdit', {
                    data: {
                        ...listLogs[index],
                        name: data.name,
                        kpi_keys: data.kpi_keys,
                    },
                });
            } else {
                handleChangeDay(day)
            }
        }
    }
    return (
        <SafeAreaView style={styles.wrapper}>
            <AdminTabBlock/>
            <Header
                title="TIẾN TRÌNH"
                handleGoBack={() => {
                    navigation.goBack();
                }}
            />
            <View style={styles.content}>
                <Calendar
                    style={styles.calendarContainer}
                    initialDate={initialDate}
                    firstDay={1}
                    markedDates={markedDates}
                    onDayPress={(day) => handlePressDay(day.dateString)}
                    theme={{
                        dayTextColor: '#000',
                        todayTextColor: '#DC3545',
                        textDayFontSize: 13,
                        textDayFontWeight: '500',
                    }}
                    renderArrow={(direction) => {
                        return direction === 'left' ? (
                            <ChevronLeftIcon width={20} height={20}/>
                        ) : (
                            <ChevronRightIcon width={20} height={20}/>
                        );
                    }}
                />
                <FlatList
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainer}
                    data={listLogs}
                    renderItem={({item}) => {
                        const reportDate = data.isWorkArise
                            ? item.report_date
                            : item.reportedDate;
                        const formatDate =
                            'Thứ ' +
                            (dayjs(reportDate).day() + 1) +
                            ', Ngày ' +
                            dayjs(reportDate).date() +
                            ' tháng ' +
                            (dayjs(reportDate).month() + 1) +
                            ' năm ' +
                            dayjs(reportDate).year();
                        return (
                            <View>
                                <Pressable onPress={() => handlePressDay(reportDate)}>
                                    <Text style={styles.title}>{formatDate}</Text>
                                </Pressable>
                                <View style={row_between}>
                                    <Text style={styles.description}>
                                        {item?.note ?? item?.target_log_details[0]?.note}
                                    </Text>
                                </View>
                            </View>
                        );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={() => <View style={{height: 10}}/>}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    content: {
        paddingHorizontal: 15,
        flex: 1,
        paddingTop: 10,
    },
    calendarContainer: {
        width: '100%',
        borderRadius: 12,
        backgroundColor: '#FFF',
        borderColor: '#787878',
        borderWidth: 0.5,
    },
    contentContainer: {
        paddingBottom: 30,
        marginTop: 20,
        gap: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        borderBottomColor: '#D9D9D9',
        borderBottomWidth: 0.5,
        paddingBottom: 3,
        marginBottom: 5,
    },
    description: {
        borderLeftWidth: 3,
        borderLeftColor: '#C1AAC3',
        paddingLeft: 10,
        fontSize: 13,
        fontWeight: '400',
        color: '#787878',
    },
});
