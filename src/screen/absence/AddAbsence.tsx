import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Header from '../../components/header/Header.tsx';
import {
    fs_15_400,
    fs_15_700,
    row_between,
    text_black,
    text_center,
    text_red,
    text_white,
} from '../../assets/style.ts';
import {useMemo, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useConnection} from '../../redux/connection';
import ToastSuccessModal from '../../components/common/modal/ToastSuccessModal.tsx';
import ToastConfirmModal from '../../components/common/modal/ToastConfirmModal.tsx';
import dayjs from 'dayjs';
import DatePickerModal from '../../components/common/modal/DatePickerModal.tsx';
import {useQuery} from '@tanstack/react-query';
import {dwtApi} from '../../api/service/dwtApi.ts';
import PrimaryDropdown from '../../components/common/dropdown/PrimaryDropdown.tsx';
import PrimaryLoading from '../../components/common/loading/PrimaryLoading.tsx';
import LoadingActivity from '../../components/common/loading/LoadingActivity.tsx';
import {LIST_ABSENCE_TYPE} from '../../assets/constant.ts';
import PrimaryCheckbox from "../../components/common/checkbox/PrimaryCheckbox.tsx";

const TIME_IN_DAY = [
    {
        value: 1,
        label: 'Sáng',
    },
    {
        value: 2,
        label: 'Chiều',
    },
    {
        value: 3,
        label: 'Cả ngày',
    },
];
export default function AddAbsence({navigation}: any) {
    const {
        connection: {userInfo},
    } = useConnection();
    const [isOpenCancelModal, setIsOpenCancelModal] = useState(false);
    const [isOpenSelectDateModal, setIsOpenSelectDateModal] = useState(false);
    const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);

    const [note, setNote] = useState('');
    const [date, setDate] = useState(dayjs());
    const [type, setType] = useState(0);
    const [timeInDay, setTimeInDay] = useState(1);

    const [isLoading, setIsLoading] = useState(false);

    const {data: listUnit = [], isLoading: isLoadingListUnit} = useQuery(
        ['listUnit'],
        async () => {
            const res = await dwtApi.getListUnit();
            return res.data.data;
        }
    );

    const {data: listUserData = {}, isLoading: isLoadingListUser} = useQuery(
        ['listUser'],
        async () => {
            if (userInfo.role === 'manager') {
                return await dwtApi.getListAllUser();
            } else {
                return await dwtApi.getListUserDepartment(userInfo.department_id);
            }
        },
        {
            enabled: !!userInfo,
        }
    );

    const listUser = useMemo(() => {
        return listUserData?.data?.data || [];
    }, [listUserData]);

    const handleSubmit = async () => {
        if (!note) {
            return Alert.alert('Vui lòng nhập lý do nghỉ');
        }
        if (type === 0) {
            return Alert.alert('Vui lòng chọn loại nghỉ');
        }
        setIsLoading(true);
        try {
            await dwtApi.createAbsence({
                absent_type: type,
                note: note,
                day_off: dayjs(date).format('YYYY-MM-DD'),
                absent_duration_type: timeInDay,
                user_id: userInfo?.id,
                signature_user: userInfo?.signature,
            });
            setIsOpenSuccessModal(true);
        } catch (e) {
            console.log(e);
            Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại sau');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearData = () => {
        setNote('');
        setDate(dayjs());
        setType(0);
        setTimeInDay(1);
    };

    const handlePressCancel = () => {
        setIsOpenCancelModal(false);
        handleClearData();
        navigation.navigate('AbsenceInfo');
    };

    const handlePressOk = () => {
        setIsOpenSuccessModal(false);
        handleClearData();
        navigation.navigate('AbsenceInfo');
    };

    if (isLoadingListUnit || isLoadingListUser) {
        return <PrimaryLoading/>;
    }
    return (
        <SafeAreaView style={styles.wrapper}>
            <Header
                title="TẠO ĐƠN NGHỈ"
                handleGoBack={() => {
                    setIsOpenCancelModal(true);
                }}
                rightView={
                    <TouchableOpacity style={styles.sendButton} onPress={handleSubmit}>
                        <Text style={[fs_15_700, text_white, text_center]}>Lưu</Text>
                    </TouchableOpacity>
                }
            />
            <ScrollView
                style={{flex: 1}}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.inputBox}>
                    <Text style={[fs_15_700, text_black]}>
                        Loại nghỉ: <Text style={text_red}>*</Text>
                    </Text>
                    <PrimaryDropdown
                        data={LIST_ABSENCE_TYPE.slice(1, 4)}
                        value={type}
                        changeValue={setType}
                        dropdownStyle={styles.dropdownStyle}
                        isSearch={false}
                    />
                </View>

                <View style={styles.inputBox}>
                    <Text style={[fs_15_700, text_black]}>
                        Lý do nghỉ: <Text style={text_red}>*</Text>
                    </Text>
                    <TextInput
                        style={[styles.input, text_black, fs_15_400]}
                        placeholderTextColor={'#787878'}
                        value={note}
                        onChangeText={setNote}
                        multiline={true}
                    />
                </View>

                <View style={[row_between, styles.inputBox]}>
                    <Text style={[fs_15_400, text_black]}>Chọn thời gian:</Text>

                    <TouchableOpacity
                        style={styles.boxTime}
                        onPress={() => {
                            setIsOpenSelectDateModal(true);
                        }}
                    >
                        <Text style={[fs_15_400, text_black]}>
                            {dayjs(date).format('DD/MM/YYYY')}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.timeInDayContainer}>
                    {TIME_IN_DAY.map((item) => {
                        return (
                            <View key={item.value}>
                                <PrimaryCheckbox
                                    onChange={(checked) => {
                                        setTimeInDay(item.value);
                                    }}
                                    checked={timeInDay === item.value}
                                    label={item.label}
                                />
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
            <LoadingActivity isLoading={isLoading}/>
            <ToastConfirmModal
                visible={isOpenCancelModal}
                handleCancel={handlePressCancel}
                handleOk={() => {
                    setIsOpenCancelModal(false);
                }}
                description={'Bạn có muốn hủy tạo mới đơn nghỉ này?'}
                okText={'Tiếp tục tạo đơn nghỉ'}
                cancelText={'Hủy tạo mới'}
            />
            <DatePickerModal
                visible={isOpenSelectDateModal}
                setVisible={setIsOpenSelectDateModal}
                currentDate={date}
                setCurrentDate={setDate}
            />
            <ToastSuccessModal
                visible={isOpenSuccessModal}
                handlePressOk={handlePressOk}
                description={'Thêm mới thành công'}
            />
            <LoadingActivity isLoading={isLoading}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    sendButton: {
        backgroundColor: '#BC2426',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    content: {
        paddingTop: 10,
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    labelStyle: {
        ...fs_15_700,
        ...text_black,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 7,
    },
    dropdownStyle: {
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 3,
    },
    inputBox: {
        gap: 6,
        marginTop: 20,
    },
    buttonStyle: {
        borderRadius: 5,
        paddingVertical: 12,
    },
    boxTime: {
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    timeInDayContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});
