import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import {
    fs_13_400,
    fs_14_700, mb15, row_between,
    text_black,
    text_center,
    text_red,
} from '../../../assets/style.ts';
import DateTimePicker from 'react-native-ui-datepicker';
import CloseIcon from '../../../assets/img/close-icon.svg';
import {useState} from 'react';
import 'dayjs/locale/vi';
import PrimaryButton from '../button/PrimaryButton.tsx';
import {ReactNativeModal} from 'react-native-modal';
import dayjs from 'dayjs';
import PrimaryDropdown from "../dropdown/PrimaryDropdown.tsx";
import TimeInput from "../input/TimeInput.tsx";

export default function DatePickerModal(
    {
        setVisible,
        visible,
        currentDate,
        setCurrentDate,
        type,
    }: any) {
    const [dateSelect, setDateSelect] = useState(currentDate || dayjs());
    const [time, setTime] = useState<string>(dayjs().format('HH:mm'));
    const handleSaveValue = () => {
        if (type === 'datetime') {
            const hour = parseInt(time.split(':')[0]);
            const minute = parseInt(time.split(':')[1]);
            if(hour > 23 || hour < 0 || minute > 59 || minute < 0) {
                return Alert.alert('Lỗi', 'Vui lòng chọn thời gian hợp lệ');
            }
            setCurrentDate(dateSelect.set('hour', hour).set('minute', minute));
        } else {
            setCurrentDate(dateSelect);
        }
        setVisible(false);
    };

    return visible ? (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={[fs_14_700, text_red, text_center]}>CHỌN THỜI GIAN</Text>
                    <Pressable
                        hitSlop={10}
                        onPress={() => {
                            setVisible(false);
                        }}>
                        <CloseIcon width={20} height={20} style={styles.closeIcon}/>
                    </Pressable>
                </View>

                <View style={styles.content}>
                    <View style={styles.calendar}>
                        <DateTimePicker
                            value={dateSelect}
                            onValueChange={(date: any) => {
                                setDateSelect(dayjs(date));
                            }}
                            locale={'vi'}
                            mode={'date'}
                            firstDayOfWeek={1}
                            selectedItemColor={'#CA1F24'}
                            weekDaysTextStyle={styles.weekDayTextStyle}
                            calendarTextStyle={styles.dayTextStyle}
                            headerTextStyle={styles.headerTextStyle}
                        />
                        {
                            type === 'datetime' && (
                                <View style={[row_between, mb15]}>
                                    <Text style={[fs_13_400, text_black]}>Thời gian</Text>
                                    <TimeInput time={time} setTime={setTime}/>
                                </View>
                            )
                        }
                    </View>
                    <PrimaryButton
                        onPress={handleSaveValue}
                        text={'Áp dụng'}
                        buttonStyle={styles.button}
                    />
                </View>
            </View>
        </View>
    ) : null
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: 'rgba(217, 217, 217, 0.75)',
        justifyContent: 'center',
        margin: 0,
        position: 'absolute',
        zIndex: 999,
        width: '100%',
        height: '100%',
    },
    header: {
        paddingVertical: 13,
        paddingHorizontal: 20,
        borderBottomColor: '#D9D9D9',
        borderBottomWidth: 1,
        position: 'relative',
    },
    container: {
        backgroundColor: '#FFF',
        paddingBottom: 15,
    },
    closeIcon: {
        position: 'absolute',
        right: 0,
        bottom: 0,
    },
    content: {
        paddingHorizontal: 15,
    },
    row_gap10: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    calendar: {
        marginTop: 15,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingTop: 10,
    },
    weekDayTextStyle: {
        fontSize: 10,
        color: '#8F9098',
        fontWeight: '600',
    },
    dayTextStyle: {
        fontSize: 12,
        color: '#000',
        fontWeight: '700',
    },
    button: {
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 15,
    },
    headerTextStyle: {
        ...fs_14_700,
        ...text_black,
    },
    dropdownStyle: {
        width: 70,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignItems: 'center',
    },
});
