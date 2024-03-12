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
import {useEffect, useMemo, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useConnection} from '../../redux/connection';
import ToastSuccessModal from '../../components/common/modal/ToastSuccessModal.tsx';
import ToastConfirmModal from '../../components/common/modal/ToastConfirmModal.tsx';
import dayjs from 'dayjs';
import {useQuery} from '@tanstack/react-query';
import {dwtApi} from '../../api/service/dwtApi.ts';
import PrimaryDropdown from '../../components/common/dropdown/PrimaryDropdown.tsx';
import PrimaryLoading from '../../components/common/loading/PrimaryLoading.tsx';
import LoadingActivity from '../../components/common/loading/LoadingActivity.tsx';
import {validatePhone} from '../../utils';
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import DatePickerModal from "../../components/common/modal/DatePickerModal.tsx";
import ErrorModal from "../../components/common/modal/ErrorModal.tsx";

export default function AddCustomer({navigation}: any) {
    const {
        connection: {userInfo},
    } = useConnection();
    const [isOpenCancelModal, setIsOpenCancelModal] =
        useState(false);
    const [isOpenSelectFromDateModal, setOpenSelectFromDateModal] =
        useState(false);
    const [isOpenSelectToDateModal, setOpenSelectToDateModal] = useState(false);
    const [isOpenUpWorkModalSuccess, setOpenUpWorkModalSuccess] = useState(false);
    const [isErrorModal, setIsErrorModal] = useState(false);
    // upload field
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [note, setNote] = useState('');
    const [creater, setCreater] = useState('');
    const [date, setDate] = useState(dayjs());

    const [isLoading, setIsLoading] = useState(false);

    const {data: listUser = [], isLoading: isLoadingListUser} = useQuery(
        ['listUser'],
        async () => {
            if (userInfo.role === 'manager') {
                const response = await dwtApi.getListUserDepartment(
                    userInfo?.departement_id
                );
                return response.data.data;
            } else {
                const response = await dwtApi.getListAllUser();
                return response.data;
            }
        },
        {
            enabled: !!userInfo,
        }
    );

    const handleAddCustomer = async () => {
        if (!name) {
            return Alert.alert('Vui lòng nhập tên khách hàng');
        }
        if (!phone) {
            return Alert.alert('Vui lòng nhập số điện thoại');
        }
        if (!address) {
            return Alert.alert('Vui lòng nhập địa chỉ');
        }
        if (!note) {
            return Alert.alert('Vui lòng nhập thông tin chào hàng');
        }
        if (!creater) {
            return Alert.alert('Vui lòng chọn nhân sự thu thập');
        }

        if (!date) {
            return Alert.alert('Vui lòng chọn ngày nhập');
        }

        if (!validatePhone(phone)) {
            return Alert.alert('Số điện thoại không hợp lệ');
        }

        try {
            setIsLoading(true)
            const requestData = {
                name,
                phone,
                address,
                note,
                user_id: Number(creater),
                create_at: dayjs(date).format('YYYY-MM-DD HH:mm'),
            };
            const response = await dwtApi.createCustomer(requestData);
            if (response.status === 200) {
                setOpenUpWorkModalSuccess(true);
            }
        } catch (err: any) {
            console.log(err);
            if (err.message === 'The phone has already been taken.') {
                setIsErrorModal(true)
            }
        } finally {
            setIsLoading(false)
        }
    };

    const handleClearData = () => {
        setName('');
        setPhone('');
        setAddress('');
        setNote('');
        setCreater('');
        setDate(dayjs());
    };

    const handlePressCancel = () => {
        setIsOpenCancelModal(false);
        handleClearData();
        navigation.navigate('Customer');
    };

    const handlePressOk = () => {
        setOpenUpWorkModalSuccess(false);
        handleClearData();
        navigation.navigate('Customer');
    };

    if (isLoadingListUser) {
        return <PrimaryLoading/>;
    }
    return (
        <SafeAreaView style={styles.wrapper}>
            <Header
                title="THÊM MỚI KHÁCH HÀNG"
                handleGoBack={() => {
                    setIsOpenCancelModal(true);
                }}
                rightView={
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleAddCustomer}
                    >
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
                        Tên khách hàng <Text style={text_red}>*</Text>:
                    </Text>
                    <TextInput
                        style={[styles.input, text_black, fs_15_400]}
                        placeholderTextColor={'#787878'}
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View style={styles.inputBox}>
                    <Text style={[fs_15_700, text_black]}>
                        Số điện thoại <Text style={text_red}>*</Text>:
                    </Text>
                    <TextInput
                        style={[styles.input, text_black, fs_15_400]}
                        placeholderTextColor={'#787878'}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType={'numeric'}
                        inputMode={'numeric'}
                    />
                </View>

                <View style={styles.inputBox}>
                    <Text style={[fs_15_700, text_black]}>
                        Địa chỉ <Text style={text_red}>*</Text>:
                    </Text>
                    <TextInput
                        style={[styles.input, text_black, fs_15_400]}
                        placeholderTextColor={'#787878'}
                        value={address}
                        onChangeText={setAddress}
                        multiline={true}
                    />
                </View>

                <View style={styles.inputBox}>
                    <Text style={[fs_15_700, text_black]}>
                        Thông tin chào hàng <Text style={text_red}>*</Text>:
                    </Text>
                    <TextInput
                        style={[styles.input, text_black, fs_15_400]}
                        placeholderTextColor={'#787878'}
                        value={note}
                        onChangeText={setNote}
                        multiline={true}
                    />
                </View>

                <View style={styles.rowBetweenGap20}>
                    <View style={[styles.inputBox, styles.w_50]}>
                        <Text style={[fs_15_700, text_black]}>
                            Nhân sự thu thập <Text style={text_red}>*</Text>:
                        </Text>
                        <PrimaryDropdown
                            data={listUser.map((user: any) => {
                                return {
                                    label: user.name,
                                    value: user.id,
                                };
                            })}
                            value={creater}
                            changeValue={setCreater}
                            dropdownStyle={styles.dropdownStyle}
                            isSearch={true}
                        />
                    </View>

                    <View style={[styles.inputBox, styles.w_50]}>
                        <Text style={[fs_15_700, text_black]}>
                            Ngày nhập <Text style={text_red}>*</Text>:
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setOpenSelectFromDateModal(true);
                            }}
                            style={[styles.boxTime, {
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }]}
                        >
                            <Text style={[text_black, fs_15_400]}>
                                {dayjs(date).format('DD/MM/YYYY HH:mm')}
                            </Text>
                            <FontAwesome6Icon name={'calendar-days'} size={20} color={'#787878'}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <LoadingActivity isLoading={isLoading}/>
            <ToastConfirmModal
                visible={isOpenCancelModal}
                handleCancel={handlePressCancel}
                handleOk={() => {
                    setIsOpenCancelModal(false);
                }}
                description={'Bạn có muốn hủy tạo mới khách hàng này?'}
                okText={'Tiếp tục tạo khách hàng'}
                cancelText={'Hủy tạo mới'}
            />
            <DatePickerModal
                visible={isOpenSelectFromDateModal}
                setVisible={setOpenSelectFromDateModal}
                currentDate={date}
                setCurrentDate={setDate}
                type={'datetime'}
            />
            <ToastSuccessModal
                visible={isOpenUpWorkModalSuccess}
                handlePressOk={handlePressOk}
                description={'Thêm mới thành công'}
            />
            <ErrorModal
                visible={isErrorModal}
                handleOk={() => {
                    setIsErrorModal(false)
                    setPhone('')
                }}
                handleCancel={() => {
                    setIsErrorModal(false)
                    handleClearData();
                    navigation.navigate('Customer');
                }}
                description={'Số điện thoại đã tồn tại!'}
                okText={'Chỉnh sửa'}
                cancelText={'Hủy tạo mới'}
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
    disable: {
        backgroundColor: '#F0EEEE',
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
    listFile: {
        marginTop: 20,
        gap: 12,
    },
    rowBetweenGap20: {
        flexDirection: 'row',
        gap: 20,
    },
    fileBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 10,
        paddingVertical: 7,
        borderWidth: 1,
        borderColor: '#787878',
        borderRadius: 5,
    },
    w_50: {
        flex: 0.5,
    },
    boxTime: {
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 5,
        alignItems: 'center',
    },
});
