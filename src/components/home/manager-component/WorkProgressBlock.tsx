import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {
    fs_10_400,
    fs_10_500,
    fs_12_400,
    fs_12_500,
    mt10,
    row_between,
    text_black,
    text_center,
    text_red,
    text_white,
    w_full,
} from '../../../assets/style';
import CalendarIcon from '../../../assets/img/calendar-icon.svg';
import ClockIcon from '../../../assets/img/clock-icon.svg';
import ClockOtIcon from '../../../assets/img/clock-ot-icon.svg';
import MeetingIcon from '../../../assets/img/meeting-icon.svg';
import PropTypes, {InferProps} from 'prop-types';
import {padStart} from '../../../utils';
import ResultChart from './ResultChart.tsx';
import {useNavigation} from '@react-navigation/native';
import {useState} from "react";

export default function WorkProgressBlock(
    {
        totalMeeting,
        leftDepartmentData
    }: InferProps<typeof WorkProgressBlock.propTypes>) {
    const navigation = useNavigation();
    const [chartHeight, setChartHeight] = useState<number>(60);
    return (
        <View style={styles.wrapper}>
            <TouchableOpacity
                style={styles.blockItem}
                onPress={() => {
                    // @ts-ignore
                    navigation.navigate('Attendance');
                }}
            >
                <View style={[row_between, styles.mb4]}>
                    <View style={styles.row_gap3}>
                        <ClockIcon width={16} height={16}/>
                        <Text style={[fs_12_400, text_black]}>Sỹ số</Text>
                    </View>
                    <Text style={[fs_12_400, text_black]}>
                        {leftDepartmentData?.totalUserCheckin ?? 0}/{leftDepartmentData?.totalUser ?? 0}
                    </Text>
                </View>

                <View style={[row_between, styles.mb4]}>
                    <View style={styles.row_gap3}>
                        <CalendarIcon width={16} height={16}/>
                        <Text style={[fs_12_400, text_black]}>Công tác</Text>
                    </View>
                    <Text style={[fs_12_400, text_black]}>
                        {leftDepartmentData?.totalUserTrip ?? 0}
                    </Text>
                </View>

                <View style={[styles.row, w_full, styles.mb4]}>
                    <View style={[styles.row_gap3]}>
                        <ClockOtIcon width={16} height={16}/>
                        <Text style={[fs_12_400, text_black]}>Nghỉ</Text>
                    </View>
                    <Text style={[fs_12_400, text_red]}>{leftDepartmentData?.totalUserLeave ?? 0}</Text>
                </View>

                <View style={[row_between]}>
                    <View style={styles.row_gap3}>
                        <MeetingIcon width={16} height={16}/>
                        <Text style={[fs_12_400, text_black]}>Giao ban</Text>
                    </View>
                    <Text style={[fs_12_400, text_black]}>{totalMeeting ?? 0}</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.blockItem}>
                <Text style={[fs_12_500, text_red, text_center, styles.mb4]}>
                    Lượng việc (điểm)
                </Text>
                <View style={[styles.row_chart]} onLayout={({nativeEvent}) => {
                    setChartHeight(nativeEvent.layout.height);
                }}>
                    <ResultChart height={chartHeight}/>
                    <View
                        style={{
                            justifyContent: 'space-between',
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                gap: 5,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 12,
                                    fontWeight: '400',
                                    color: '#000',
                                }}
                            >
                                VP
                            </Text>
                            <View
                                style={{
                                    borderRadius: 25,
                                    backgroundColor: '#2563EB',
                                    width: 25,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={[fs_10_500, text_white, text_center]}>70</Text>
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                gap: 5,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 12,
                                    fontWeight: '400',
                                    color: '#000',
                                }}
                            >
                                KD
                            </Text>
                            <View
                                style={{
                                    borderRadius: 25,
                                    backgroundColor: '#38BDF8',
                                    width: 25,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={[fs_10_500, text_white, text_center]}>70</Text>
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                gap: 5,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 12,
                                    fontWeight: '400',
                                    color: '#000',
                                }}
                            >
                                SX
                            </Text>
                            <View
                                style={{
                                    borderRadius: 25,
                                    backgroundColor: '#DBEAFE',
                                    width: 25,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={[fs_10_500, text_white, text_center]}>70</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    blockItem: {
        width: '48%',
        backgroundColor: '#F5F5F5',
        borderRadius: 6,
        elevation: 5,
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        padding: 8,
        height: 'auto',
    },
    row_gap3: {
        flexDirection: 'row',
        gap: 3,
    },
    row_chart: {
        flexDirection: 'row',
        flex: 1,
        gap: 5,
        justifyContent: 'space-between',
        width: '100%',
    },
    mb4: {
        marginBottom: 6,
    },
    col_chart: {
        flexDirection: 'column',
        width: '50%',
        gap: 5,
        height: 80,
        justifyContent: 'space-between',
    },
});

WorkProgressBlock.propTypes = {
    totalMeeting: PropTypes.number,
    leftDepartmentData: PropTypes.any
};
