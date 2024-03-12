import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
    fs_13_400,
    fs_13_700,
    text_black,
    text_center, text_red,
} from '../../../assets/style.ts';
import {useNavigation} from '@react-navigation/native';

export default function WorkRowDetail(
    {
        data,
        isWorkArise,
        isDepartment,
        date
    }: any) {
    const navigation = useNavigation();
    return (
        <View style={styles.wrapper}>
            <View style={styles.row}>
                <Text style={[fs_13_700, text_black, styles.title]}>Tên nhiệm vụ:</Text>
                <Text style={[fs_13_400, text_black, styles.value]}>{data.name}</Text>
            </View>

            <View style={styles.row}>
                <Text style={[fs_13_700, text_black, styles.title]}>ĐVT:</Text>
                <Text style={[fs_13_400, text_black, styles.value]}>
                    {data.unit_name}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={[fs_13_700, text_black, styles.title]}>Chỉ tiêu:</Text>
                <Text style={[fs_13_400, text_black, styles.value]}>
                    {data.totalTarget}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={[fs_13_700, text_black, styles.title]}>
                    Đã hoàn thành:
                </Text>
                <Text style={[fs_13_400, text_black, styles.value]}>
                    {data.totalComplete}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={[fs_13_700, text_black, styles.title]}>
                    Định mức (giờ):
                </Text>
                <Text style={[fs_13_400, text_black, styles.value]}>
                    {data.working_hours}
                </Text>
            </View>

            <View style={styles.listButton}>
                <TouchableOpacity
                    style={isDepartment ? styles.departmentButton : styles.button}
                    onPress={() => {
                        // @ts-ignore
                        navigation.navigate('WorkListReport', {
                            data: data,
                        });
                    }}
                >
                    <Text style={[fs_13_700, text_red]}>Tiến trình</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={isDepartment ? [styles.departmentButton, styles.leftBorder]
                        : [styles.button, styles.leftBorder]}
                    onPress={() => {
                        if (isDepartment) {
                            // @ts-ignore
                            navigation.navigate('WorkDetailDepartment', {
                                data: data,
                                managerWorkId: data.business_standard_id,
                                date: date,
                            });
                        } else {
                            // @ts-ignore
                            navigation.navigate('WorkDetail', {
                                data: data,
                                date: date,
                            });
                        }
                    }}
                >
                    <Text style={[fs_13_700, text_red]}>Xem chi tiết</Text>
                </TouchableOpacity>

                {
                    !isDepartment && (
                        <TouchableOpacity
                            style={[styles.button, styles.leftBorder]}
                            onPress={() => {
                                // @ts-ignore
                                navigation.navigate('WorkReport', {
                                    data: data,
                                    isWorkArise: isWorkArise,
                                });
                            }}
                        >
                            <Text style={[fs_13_700, text_red]}>Báo cáo</Text>
                        </TouchableOpacity>
                    )
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        borderLeftColor: '#D9D9D9',
        borderLeftWidth: 0.5,
        borderRightColor: '#D9D9D9',
        borderRightWidth: 1,
        borderBottomColor: '#D9D9D9',
        borderBottomWidth: 1,
        paddingTop: 12,
    },
    row: {
        flexDirection: 'row',
        width: '100%',
        paddingLeft: 20,
    },
    title: {
        width: '40%',
    },
    value: {
        width: '60%',
    },
    listButton: {
        flexDirection: 'row',
        flex: 1,
        borderTopColor: '#D9D9D9',
        borderTopWidth: 1,
        borderBottomColor: '#D9D9D9',
        borderBottomWidth: 0.5,
        marginTop: 10,
    },
    button: {
        flex: 1 / 3,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 7,
    },
    departmentButton: {
        flex: 1 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 7,
    },
    leftBorder: {
        borderLeftColor: '#D9D9D9',
        borderLeftWidth: 0.5,
    }
});
