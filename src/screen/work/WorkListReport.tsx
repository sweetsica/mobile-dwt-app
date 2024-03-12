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
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';
import ChevronLeftIcon from '../../assets/img/chevron-left-calendar.svg';
import ChevronRightIcon from '../../assets/img/chevron-right-calendar.svg';
import {fs_13_400, row_between, text_gray} from '../../assets/style.ts';
import AdminTabBlock from "../../components/common/tab/AdminTabBlock.tsx";

export default function WorkListReport({route, navigation}: any) {
    const {data} = route.params;
    const listLogs = data.isWorkArise
        ? data.business_standard_arise_logs
        : data.business_standard_report_logs || [];
    const initialDate = dayjs(new Date()).format('YYYY-MM-DD');
    const [markedDates, setMarkedDates] = useState<any>({});
    useEffect(() => {
        const markedDates = listLogs.reduce((prev: any, curr: any) => {
            const date = dayjs(curr.reported_date).format('YYYY-MM-DD');
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
        const itemIndex = listLogs.findIndex((item: any) => {
            return dayjs(item.reported_date).format('YYYY-MM-DD') === day;
        })
        if (itemIndex !== -1) {
            navigation.navigate('WorkReportEdit', {
                data: {
                    ...listLogs[itemIndex],
                    ...data,
                },
                isWorkArise: data.isWorkArise,
            });
        } else {
            handleChangeDay(day)
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
                        const reportDate = item.reported_date;
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
                                <Pressable onPress={() => handlePressDay(formatDate)}>
                                    <Text style={styles.title}>{formatDate}</Text>
                                </Pressable>
                                <View style={row_between}>
                                    <Text style={styles.description}>{item.note}</Text>
                                    <Text style={[fs_13_400, text_gray]}>{item.quantity}</Text>
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
