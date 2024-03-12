import {Alert, FlatList, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import PropTypes, {InferProps} from 'prop-types';
import {ReactNativeModal} from 'react-native-modal';
import {
    fs_12_400,
    fs_12_700,
    fs_14_700,
    fs_15_400,
    fs_15_700,
    text_black,
    text_center,
    text_gray,
    text_red, text_white
} from '../../../assets/style.ts';
import CloseIcon from '../../../assets/img/close-icon.svg';
import PrimaryCheckbox from '../checkbox/PrimaryCheckbox.tsx';
import {useState} from 'react';
import PrimaryButton from '../button/PrimaryButton.tsx';
import {
    LIST_ABSENCE_TYPE, LIST_ABSENCE_TYPE_COLOR,
    LIST_WORK_STATUS_FILTER,
    WORK_STATUS_COLOR,
} from '../../../assets/constant.ts';
import dayjs from "dayjs";
import {useConnection} from "../../../redux/connection";
import {dwtApi} from "../../../api/service/dwtApi.ts";

export default function ApproveWorkBusinessModal(
    {
        visible,
        setVisible,
        data,
        isWorkArise,
        refetchData
    }: InferProps<typeof ApproveWorkBusinessModal.propTypes>) {
    const {connection: {userInfo}} = useConnection()
    const [listData, setListData] = useState(data);

    const columns = [
        {
            title: 'Ngày báo cáo',
            key: 'date',
            width: 1 / 3,
        },
        {
            title: 'Giá trị',
            key: 'value',
            width: 1 / 3,
        },
        {
            title: 'GT nghiệm thu',
            key: 'valueDone',
            width: 1 / 3,
        },
    ]
    const handleSave = async () => {
        try {
            if (isWorkArise) {
                const requestData = listData.map((item: any) => {
                    return {
                        arise_log_id: item.id,
                        manager_quantity: item.valueDone ? Number(item.valueDone) : null,
                        updated_by: userInfo?.id,
                        updated_date: dayjs().format('YYYY-MM-DD'),
                        business_standard_arise_id: item.work_arise_id
                    }
                })
                const res = await dwtApi.approveWorkAriseBussiness(requestData)
                if (res.status === 200) {
                    Alert.alert('Nghiệm thu công việc thành công')
                    refetchData && (await refetchData())
                    setVisible(false)
                }
            } else {
                const requestData = listData.map((item: any) => {
                    return {
                        report_log_id: item.id,
                        manager_quantity: item.valueDone ? Number(item.valueDone) : null,
                        updated_by: userInfo?.id,
                        updated_date: dayjs().format('YYYY-MM-DD'),
                        business_standard_report_id: item.business_standard_report_id
                    }
                })
                const res = await dwtApi.approveWorkBusiness(requestData)
                if (res.status === 200) {
                    Alert.alert('Nghiệm thu công việc thành công')
                    refetchData && (await refetchData())
                    setVisible(false)
                }
            }
        } catch (err: any) {
            console.log('err', err)
            Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại sau');
        }
    }
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
            }}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[fs_14_700, text_red, text_center]}>NGHIỆM THU CÔNG VIỆC</Text>
                    <Pressable
                        hitSlop={10}
                        onPress={() => {
                            setVisible(false);
                        }}>
                        <CloseIcon width={20} height={20} style={styles.closeIcon}/>
                    </Pressable>
                </View>
                <View style={styles.body}>
                    <View style={styles.row}>
                        {columns.map((column: any, index: any) => {
                            return (
                                <View
                                    key={index}
                                    style={[
                                        {
                                            flex: column.width,
                                            backgroundColor: '#FFF',
                                            height: 'auto',
                                        },
                                        styles.cell,
                                    ]}>
                                    <Text style={[fs_12_700, text_black, text_center]}>
                                        {column.title}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                    <FlatList
                        scrollEnabled={false}
                        data={listData}
                        renderItem={({item, index: rowIndex}) => {
                            return (
                                <View style={[styles.row]}>
                                    {columns.map((column: any, colIndex: any) => {
                                        let bgColor = '#DBE3F3';
                                        if (item?.manager_quantity) {
                                            bgColor = '#D4F3D5';
                                        }
                                        return (
                                            <View
                                                key={colIndex}
                                                style={[
                                                    {
                                                        flex: column.width,
                                                        backgroundColor: bgColor,
                                                        height: 'auto',
                                                    },
                                                    styles.cell,
                                                ]}>
                                                {
                                                    column.key === 'valueDone' ?
                                                        <TextInput
                                                            style={[fs_12_400, text_black, text_center, {
                                                                paddingVertical: 0
                                                            }]}
                                                            value={item[column.key] ? item[column.key].toString() : null}
                                                            keyboardType={'numeric'}
                                                            onChangeText={(text) => {
                                                                const data = [...listData];
                                                                data[rowIndex][column.key] = text;
                                                                setListData(data);
                                                            }}

                                                        />
                                                        :
                                                        <Text style={[fs_12_400, text_black, text_center]}>
                                                            {item[column.key]}
                                                        </Text>
                                                }
                                            </View>
                                        );
                                    })}
                                </View>
                            );
                        }}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                <View style={styles.footer}>
                    {
                        data.length > 0 && (
                            <TouchableOpacity style={styles.button} onPress={handleSave}>
                                <Text style={[fs_15_700, text_white]}>Xác nhận</Text>
                            </TouchableOpacity>
                        )
                    }
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
    content: {
        backgroundColor: '#FFF',
        borderRadius: 15,
    },
    header: {
        paddingVertical: 13,
        paddingHorizontal: 15,
        borderBottomColor: '#D9D9D9',
        borderBottomWidth: 1,
        position: 'relative',
    },
    closeIcon: {
        position: 'absolute',
        right: 0,
        bottom: 0,
    },
    body: {
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        paddingVertical: 7,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#D9D9D9',
        paddingHorizontal: 3,
    },
    footer: {
        borderTopColor: '#D9D9D9',
        borderTopWidth: 1,
        paddingVertical: 15,
        alignItems: 'flex-end',
        paddingRight: 15,
    },
    button: {
        backgroundColor: '#CA1F24',
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 3,
    }
});

ApproveWorkBusinessModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    isWorkArise: PropTypes.bool,
    refetchData: PropTypes.func
};
