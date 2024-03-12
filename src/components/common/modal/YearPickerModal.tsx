import {
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    fs_12_700,
    fs_14_700,
    fs_16_700,
    row_between,
    text_black,
    text_center,
    text_red,
    text_white,
} from '../../../assets/style.ts';
import CloseIcon from '../../../assets/img/close-icon.svg';
import {useState} from 'react';
import 'dayjs/locale/vi';
import PrimaryButton from '../button/PrimaryButton.tsx';
import {ReactNativeModal} from 'react-native-modal';
import dayjs from 'dayjs';
import ChevronLeftCalendarIcon from '../../../assets/img/chevron-left-calendar.svg';
import ChevronRightCalendarIcon from '../../../assets/img/chevron-right-calendar.svg';

export default function YearPickerModal(
    {
        setVisible,
        visible,
        currentYear,
        setCurrentYear
    }: any) {
    const [selectedYear, setSelectedYear] = useState(
        currentYear || dayjs().year()
    );
    const [listYear, setListYear] = useState(getYearsAroundCurrentYear(selectedYear));

    function getYearsAroundCurrentYear(year: number) {
        const startYear = Math.floor(year / 12) * 12;

        const years = [];
        for (let i = startYear; i < (startYear + 12) ; i++) {
            years.push(i);
        }

        return years;
    }

    const handleSaveValue = () => {
        setCurrentYear(selectedYear);
        setVisible(false);
    };

    return (
        <ReactNativeModal
            animationInTiming={200}
            animationOutTiming={200}
            animationIn={'fadeInUp'}
            animationOut={'fadeOutDown'}
            swipeDirection={'down'}
            backdropTransitionInTiming={200}
            backdropTransitionOutTiming={200}
            onSwipeComplete={() => {
                setVisible(false);
            }}
            style={styles.wrapper}
            isVisible={visible}
            onBackdropPress={() => {
                setVisible(false);
            }}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={[fs_14_700, text_red, text_center]}>CHỌN NĂM</Text>
                    <Pressable
                        hitSlop={10}
                        onPress={() => {
                            setVisible(false);
                        }}
                    >
                        <CloseIcon width={20} height={20} style={styles.closeIcon}/>
                    </Pressable>
                </View>

                <View style={styles.content}>
                    {/* Year Picker */}
                    <View
                        style={[
                            row_between,
                            {
                                marginBottom: 15,
                            },
                        ]}
                    >
                        <TouchableOpacity
                            hitSlop={10}
                            onPress={() => {
                                setListYear(getYearsAroundCurrentYear(listYear[0] - 12));
                                setSelectedYear(listYear[11] - 12)
                            }}
                        >
                            <ChevronLeftCalendarIcon width={25} height={25}/>
                        </TouchableOpacity>
                        <Text style={[fs_16_700, text_black, text_center]}>
                            {listYear[0]} - {listYear[listYear.length - 1]}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setListYear(getYearsAroundCurrentYear(listYear[0] + 12));
                                setSelectedYear(listYear[0] + 12)
                            }}
                        >
                            <ChevronRightCalendarIcon width={25} height={25}/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.rowYear}>
                        {listYear.map((year, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.year,
                                        {
                                            backgroundColor:
                                                year === selectedYear ? '#CA1F24' : '#fff',
                                            borderRadius: 5,
                                        },
                                    ]}
                                    onPress={() => {
                                        setSelectedYear(year);
                                    }}
                                >
                                    <Text
                                        style={[
                                            fs_12_700,
                                            year === selectedYear ? text_white : text_black,
                                            text_center,
                                        ]}
                                    >
                                        {year}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <PrimaryButton
                        onPress={handleSaveValue}
                        text={'Áp dụng bộ lọc'}
                        buttonStyle={styles.button}
                    />
                </View>
            </View>
        </ReactNativeModal>
    );
}
const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: 'rgba(217, 217, 217, 0.75)',
        justifyContent: 'center',
        margin: 0,
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
        paddingTop: 15,
    },
    rowYear: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    year: {
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
        width: '25%',
        borderBottomColor: '#F1F5F9',
        borderBottomWidth: 1,
    },
    button: {
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 15,
    },
});
