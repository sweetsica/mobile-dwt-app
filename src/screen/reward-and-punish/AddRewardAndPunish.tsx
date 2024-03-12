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
import {LIST_REWARD_AND_PUNISHMENT_TYPE, LIST_REWARD_AND_PUNISHMENT_UNIT} from "../../assets/constant.ts";

export default function AddRewardAndPunish({navigation}: any) {
    const {
        connection: {userInfo},
    } = useConnection();
    const [isOpenCancelModal, setIsOpenCancelModal] =
        useState(false);
    const [isOpenSelectFromDateModal, setOpenSelectFromDateModal] =
        useState(false);
    const [isOpenUpWorkModalSuccess, setOpenUpWorkModalSuccess] = useState(false);
    const [isErrorModal, setIsErrorModal] = useState(false);
    // upload field
    const [userId, setUserId] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [unit, setUnit] = useState('');
    const [amount, setAmount] = useState('');
    const [file, setFile] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const {data: listUser = [], isLoading: isLoadingListUser} = useQuery(
        ['listAllUser'],
        async () => {
            const response = await dwtApi.getListAllUser();
            return response.data;
        },
        {
            enabled: !!userInfo,
        }
    );

    const handleAddRewardAndPunish = async () => {
        if (!userId) {
            return Alert.alert('Vui lòng chọn người liên quan');
        }
        if (!description) {
            return Alert.alert('Vui lòng nhập nội dung');
        }
        if (!type) {
            return Alert.alert('Vui lòng chọn loại');
        }
        if (!unit) {
            return Alert.alert('Vui lòng chọn đơn vị');
        }
        if (!amount) {
            return Alert.alert('Vui lòng nhập số lượng');
        }

        try {
            setIsLoading(true)
            const requestData = {
                user_id: +userId,
                content: description,
                quantity: amount.toString(),
                type: type,
                unit: unit,
                status: 1,
            };
            const response = await dwtApi.createRewardPunish(requestData);
            if (response.status === 200) {
                setOpenUpWorkModalSuccess(true);
            }
        } catch (err: any) {
            console.log(err);
            Alert.alert('Có lỗi xảy ra, vui lòng thử lại sau');
        } finally {
            setIsLoading(false)
        }
    };

    const handleClearData = () => {
        setUserId('');
        setUnit('');
        setType('');
        setAmount('');
        setDescription('');

    };

    const handlePressCancel = () => {
        setIsOpenCancelModal(false);
        handleClearData();
        navigation.goBack();
    };

    const handlePressOk = () => {
        setOpenUpWorkModalSuccess(false);
        handleClearData();
        navigation.goBack();
    };

    if (isLoadingListUser) {
        return <PrimaryLoading/>;
    }
    return (
        <SafeAreaView style={styles.wrapper}>
            <Header
                title="KHEN THƯỞNG & XỬ PHẠT"
                handleGoBack={() => {
                    setIsOpenCancelModal(true);
                }}
                rightView={
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleAddRewardAndPunish}
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
                        Người liên quan <Text style={text_red}>*</Text>:
                    </Text>
                    <PrimaryDropdown
                        data={listUser.map((user: any) => {
                            return {
                                label: user.name,
                                value: user.id.toString(),
                            };
                        })}
                        value={userId}
                        changeValue={setUserId}
                        dropdownStyle={styles.dropdownStyle}
                        isSearch={true}
                    />
                </View>

                <View style={styles.inputBox}>
                    <Text style={[fs_15_700, text_black]}>
                        Nội dung <Text style={text_red}>*</Text>:
                    </Text>
                    <TextInput
                        style={[styles.input, text_black, fs_15_400]}
                        placeholderTextColor={'#787878'}
                        value={description}
                        onChangeText={setDescription}
                        multiline={true}
                    />
                </View>

                <View style={styles.rowBetweenGap20}>
                    <View style={[styles.inputBox, styles.w_50]}>
                        <Text style={[fs_15_700, text_black]}>
                            Loại <Text style={text_red}>*</Text>:
                        </Text>
                        <PrimaryDropdown
                            data={LIST_REWARD_AND_PUNISHMENT_TYPE.slice(1).map((item: any) => {
                                return {
                                    label: item.label,
                                    value: item.value,
                                };
                            })}
                            value={type}
                            changeValue={setType}
                            dropdownStyle={styles.dropdownStyle}
                            isSearch={false}
                        />
                    </View>

                    <View style={[styles.inputBox, styles.w_50]}>
                        <Text style={[fs_15_700, text_black]}>
                            Đơn vị <Text style={text_red}>*</Text>:
                        </Text>
                        <PrimaryDropdown
                            data={LIST_REWARD_AND_PUNISHMENT_UNIT}
                            value={unit}
                            changeValue={setUnit}
                            dropdownStyle={styles.dropdownStyle}
                            isSearch={false}
                        />
                    </View>
                </View>

                <View style={styles.rowBetweenGap20}>
                    <View style={[styles.inputBox, styles.w_50]}>
                        <Text style={[fs_15_700, text_black]}>
                            Số lượng <Text style={text_red}>*</Text>:
                        </Text>
                        <TextInput
                            style={[styles.input, text_black, fs_15_400]}
                            placeholderTextColor={'#787878'}
                            value={amount}
                            onChangeText={setAmount}
                        />
                    </View>

                    <TouchableOpacity style={[styles.inputBox, styles.w_50]}>
                        <Text style={[fs_15_700, text_black]}>
                            File đính kèm:
                        </Text>
                        <View style={[styles.fileInput]}>
                            <Text style={[fs_15_700,text_red, text_center]}>+ Thêm tệp đính kèm</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <LoadingActivity isLoading={isLoading}/>
            <ToastConfirmModal
                visible={isOpenCancelModal}
                handleCancel={handlePressCancel}
                handleOk={() => {
                    setIsOpenCancelModal(false);
                }}
                description={'Bạn có muốn hủy tạo mới quyết định này?'}
                okText={'Tiếp tục tạo'}
                cancelText={'Hủy tạo mới'}
            />
            <ToastSuccessModal
                visible={isOpenUpWorkModalSuccess}
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
    fileInput: {
        borderWidth: 1,
        borderColor: '#D20019',
        borderRadius: 5,
        paddingVertical: 11,
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
