import {
    Alert, FlatList, Keyboard,
    Pressable, ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity, TouchableWithoutFeedback, TouchableWithoutFeedbackComponent,
    View,
} from 'react-native';
import PropTypes, {InferProps} from 'prop-types';
import {ReactNativeModal} from 'react-native-modal';
import {
    fs_14_700,
    fs_15_400,
    fs_15_700,
    text_black,
    text_center,
    text_gray,
    text_red,
} from '../../assets/style.ts';
import CloseIcon from '../../assets/img/close-icon.svg';
import {useEffect, useMemo, useState} from 'react';
import PrimaryButton from '../common/button/PrimaryButton.tsx';
import dayjs from "dayjs";
import {useQuery} from '@tanstack/react-query';
import {dwtApi} from '../../api/service/dwtApi.ts';
import PrimaryDropdown from "../common/dropdown/PrimaryDropdown.tsx";
import {useConnection} from '../../redux/connection';
import PrimaryCheckbox from "../common/checkbox/PrimaryCheckbox.tsx";
import MechanicTargetItem from "./MechanicTargetItem.tsx";

export default function CreateFactoryDailyReportModal(
    {
        visible,
        setVisible,
        today,
        refetchListData,
        onSuccess
    }: InferProps<typeof CreateFactoryDailyReportModal.propTypes>) {
    const {
        connection: {userInfo},
    } = useConnection();
    const [note, setNote] = useState('');
    const [currentWork, setCurrentWork] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const [listMechanicTarget, setListMechanicTarget] = useState<
        {
            targetId: string;
            targetAmount: string;
            targetKpi: number;
            unit: string
        }[]
    >([
        {
            targetId: '',
            targetAmount: '',
            unit: '',
            targetKpi: 0
        },
    ]);

    const {data: listWork = []} = useQuery(
        ['getListWorkFactoryBySelf', today],
        async ({queryKey}) => {
            const response = await dwtApi.getListWorkFactoryBySelf({
                date: today.format('YYYY-MM-DD'),
            });
            return response.data;
        }
    );

    const {
        data: listMechanicTargetData = [],
    } = useQuery(['getListMechanicTarget'], async () => {
        const response = await dwtApi.getListMechanicTarget();
        return response.data;
    })

    const currentGoal = useMemo(() => {
        if (!currentWork) {
            return '';
        }
        const currentWorkItem = listWork.find(
            (item: any) => item.id === Number(currentWork)
        );
        if (!currentWorkItem) {
            return '';
        }
        return currentWorkItem?.goal;
    }, [currentWork]);
    const handleSave = async () => {
        if (!currentWork) {
            return Alert.alert('Vui lòng chọn công việc');
        }
        if (!note) {
            return Alert.alert('Vui lòng nhập nội dung báo cáo');
        }

        if (isCompleted) {
            for (let i = 0; i < listMechanicTarget.length; i++) {
                if (listMechanicTarget[i].targetId === '') {
                    return Alert.alert('Vui lòng chọn loại báo cáo');
                }
                if (listMechanicTarget[i].targetAmount === '') {
                    return Alert.alert('Vui lòng nhập số lượng hoàn thành');
                }
            }
        }
        try {
            const mechanicReport = listMechanicTarget.map((item) => {
                return {
                    mechanic_target_id: Number(item.targetId),
                    mechanic_target_amount: Number(item.targetAmount),
                };
            });
            const response = await dwtApi.createProductionReport({
                project_work_id: currentWork,
                logDate: today.format('YYYY-MM-DD'),
                content: note,
                user_id: userInfo?.id,
                status: isCompleted ? 1 : undefined,
                type: 2,
                mechanic_targets: isCompleted ? mechanicReport : null,
            });
            if (response) {
                Alert.alert('Báo cáo thành công');
                setNote('');
                setCurrentWork('');
                setIsCompleted(false);
                setListMechanicTarget([
                    {
                        targetId: '',
                        targetAmount: '',
                        unit: '',
                        targetKpi: 0
                    },
                ]);
                setVisible(false);
                onSuccess && onSuccess();
                refetchListData && (await refetchListData());
            }
        } catch (e) {
            console.log(e);
            Alert.alert('Báo cáo thất bại');
        }
    };
    const handleClose = () => {
        setNote('');
        setCurrentWork('');
        setIsCompleted(false);
        setListMechanicTarget([
            {
                targetId: '',
                targetAmount: '',
                unit: '',
                targetKpi: 0
            },
        ]);
        setVisible(false);
    };

    useEffect(() => {
        if (!isCompleted) {
            setListMechanicTarget([
                {
                    targetId: '',
                    targetAmount: '',
                    unit: '',
                    targetKpi: 0
                },
            ]);
        }
    }, [isCompleted]);
    return (
        <View
            style={styles.wrapper}
        >
            <View
                style={styles.content}
            >
                <ScrollView
                    keyboardShouldPersistTaps='handled'
                    scrollEnabled={false}
                >
                    <View style={styles.header}>
                        <Text style={[fs_14_700, text_red, text_center]}>
                            BÁO CÁO CÔNG VIỆC
                        </Text>
                        <Pressable hitSlop={10} onPress={handleClose}>
                            <CloseIcon width={20} height={20} style={styles.closeIcon}/>
                        </Pressable>
                    </View>
                    <View style={styles.row_container}>
                        <Text style={[fs_15_400, text_center, text_gray]}>
                            Ngày {today.format('DD/MM/YYYY')}
                        </Text>
                        <View style={styles.inputContainer}>
                            <Text style={[fs_15_700, text_black]}>Tên công việc:</Text>
                            <PrimaryDropdown
                                dropdownStyle={styles.input}
                                data={listWork.map((item: any) => {
                                    return {
                                        label: item.name,
                                        value: item.id,
                                    };
                                })}
                                changeValue={(value) => {
                                    setCurrentWork(value);
                                }}
                                value={currentWork}
                                isSearch={false}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={[fs_15_700, text_black]}>Mục tiêu:</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    styles.bgGray,
                                    {
                                        color: '#787878',
                                    },
                                ]}
                                value={currentGoal}
                                editable={false}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={[fs_15_700, text_black]}>
                                Báo cáo<Text style={[text_red]}>*</Text>:
                            </Text>
                            <TextInput
                                style={[styles.input]}
                                onChangeText={setNote}
                                value={note}
                                multiline={true}
                                placeholder={'Nội dung báo cáo*'}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <PrimaryCheckbox
                                label={'Hoàn thành'}
                                checked={isCompleted}
                                onChange={setIsCompleted}
                                labelStyle={styles.labelStyle}
                            />
                        </View>
                        {isCompleted &&
                            (
                                <ScrollView
                                    style={{
                                        maxHeight: 200,
                                        marginTop: 10,
                                    }}
                                    contentContainerStyle={{
                                        paddingTop: 10,
                                    }}
                                >
                                    {
                                        listMechanicTarget.map((item, index) => {
                                            return (
                                                <MechanicTargetItem
                                                    key={index}
                                                    item={item}
                                                    index={index}
                                                    listMechanicTarget={listMechanicTarget}
                                                    setListMechanicTarget={setListMechanicTarget}
                                                    listMechanicTargetData={listMechanicTargetData}
                                                />
                                            )
                                        })
                                    }
                                </ScrollView>
                            )
                        }

                        {isCompleted && (
                            <TouchableOpacity
                                onPress={() => {
                                    setListMechanicTarget([
                                        ...listMechanicTarget,
                                        {
                                            targetId: '',
                                            targetAmount: '',
                                            unit: '',
                                            targetKpi: 0
                                        },
                                    ]);
                                }}
                            >
                                <Text
                                    style={[
                                        fs_15_400,
                                        {
                                            color: '#0070FF',
                                            textAlign: 'center',
                                            marginTop: 15,
                                            borderBottomColor: '#D9D9D9',
                                            borderBottomWidth: 1,
                                            paddingBottom: 15,
                                        },
                                    ]}
                                >
                                    Thêm
                                </Text>
                            </TouchableOpacity>
                        )}

                        <PrimaryButton
                            onPress={handleSave}
                            text={'Gửi'}
                            buttonStyle={styles.button}
                        />
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: 'rgba(217, 217, 217, 0.75)',
        justifyContent: 'center',
        margin: 0,
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 2,
    },
    content: {
        backgroundColor: '#FFF',
        borderRadius: 15,
    },
    header: {
        paddingVertical: 13,
        paddingHorizontal: 20,
        borderBottomColor: '#D9D9D9',
        borderBottomWidth: 1,
        position: 'relative',
    },
    closeIcon: {
        position: 'absolute',
        right: 0,
        bottom: 0,
    },
    row_container: {
        paddingVertical: 10,
        // paddingHorizontal: 15,
    },
    button: {
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 15,
        marginHorizontal: 15
    },
    inputContainer: {
        gap: 6,
        marginTop: 20,
        marginHorizontal: 15,
    },
    input: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        paddingHorizontal: 10,
        paddingVertical: 7,
        color: '#000',
    },
    bgGray: {
        backgroundColor: '#F0EEEE',
    },
    labelStyle: {
        ...fs_15_700,
        ...text_black,
    },

    dropdownStyle: {
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 3,
    },
});

CreateFactoryDailyReportModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
    today: PropTypes.any.isRequired,
    refetchListData: PropTypes.func,
    onSuccess: PropTypes.func,
};
