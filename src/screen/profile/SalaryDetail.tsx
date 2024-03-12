import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/header/Header.tsx';
import {useQuery} from '@tanstack/react-query';
import {dwtApi} from '../../api/service/dwtApi.ts';
import PrimaryLoading from '../../components/common/loading/PrimaryLoading.tsx';
import SalaryItemIcon from '../../assets/img/wallet_icon.svg';
import dayjs from 'dayjs';
import {
    fs_12_700,
    fs_14_400,
    fs_15_700,
    fw_bold,
    text_black,
    text_center,
    text_gray,
    text_green,
    text_red,
    text_right,
} from '../../assets/style.ts';
import CheckSalaryIcon from '../../assets/img/check-salary.svg';
import {useMemo} from "react";

export default function SalaryDetail({route, navigation}: any) {
    const {id} = route.params;
    const {data: salaryInfo, isLoading: isLoadingSalary} = useQuery(
        ['salaryDetail', id],
        async ({queryKey}) => {
            const res = await dwtApi.getSalaryById(queryKey[1] as string);
            return res.data;
        },
        {
            enabled: !!id,
        }
    );

    const {salaryTmpData, salaryCompleteData} = useMemo(() => {
        let salaryTmpData = {
            basicSalary: 0,
            performanceSalary: 0,
            allowance: 0,
            salaryTitle: 0,
            totalSalary: 0,
        };
        let salaryCompleteData = {
            basicSalary: 0,
            performanceSalary: 0,
            allowance: 0,
            salaryTitle: 0,
            totalSalary: 0,
        };
        const salaryRate = salaryInfo?.salary_history?.salary_rate;
        salaryTmpData.basicSalary =
            (salaryInfo?.basic_salary * salaryRate * salaryInfo?.days_work) /
            salaryInfo?.all_days_work.toFixed(0)
        salaryTmpData.performanceSalary =
            (salaryInfo?.salary_history?.performance_salary *
                salaryInfo?.kpi?.tmpTotalKPI) /
            salaryInfo?.kpi?.expectTotalKPI.toFixed(0) || 0;
        salaryTmpData.allowance =
            (salaryInfo?.salary_history?.allowance * salaryInfo?.days_work) /
            salaryInfo?.all_days_work.toFixed(0) || 0;
        salaryTmpData.salaryTitle = salaryInfo?.salary_history?.salary_title;
        salaryTmpData.totalSalary =
            salaryTmpData.basicSalary +
            salaryTmpData.performanceSalary +
            salaryTmpData.allowance +
            salaryTmpData.salaryTitle;
        salaryCompleteData.basicSalary = salaryInfo?.basic_salary * salaryRate;
        salaryCompleteData.performanceSalary =
            salaryInfo?.salary_history?.performance_salary;
        salaryCompleteData.allowance = salaryInfo?.salary_history?.allowance;
        salaryCompleteData.salaryTitle = salaryInfo?.salary_history?.salary_title;
        salaryCompleteData.totalSalary =
            salaryCompleteData.basicSalary +
            salaryCompleteData.performanceSalary +
            salaryCompleteData.allowance +
            salaryCompleteData.salaryTitle;
        return {
            salaryTmpData,
            salaryCompleteData,
        };
    }, [salaryInfo]);

    if (isLoadingSalary) {
        return <PrimaryLoading/>;
    }
    return (
        salaryInfo && (
            <SafeAreaView style={styles.wrapper}>
                <Header
                    title={
                        `Chi tiết phiếu lương 
${salaryInfo?.salary_history?.month} / ${salaryInfo?.salary_history?.year}`
                    }
                    handleGoBack={() => navigation.goBack()}
                />
                <ScrollView
                    style={{
                        marginTop: 30,
                    }}
                >
                    <View style={styles.box}>
                        <Text
                            style={[
                                text_center,
                                text_black,
                                {
                                    fontSize: 26,
                                    fontWeight: '700',
                                },
                            ]}
                        >
                            {salaryTmpData?.totalSalary?.toLocaleString()}
                        </Text>

                        <View
                            style={{
                                flexDirection: 'row',
                                alignSelf: 'center',
                                alignItems: 'center',
                                marginTop: 5,
                                gap: 5,
                            }}
                        >
                            {
                                salaryInfo?.salary_history?.paid_salary === 2 && (
                                    <CheckSalaryIcon/>
                                )
                            }
                            <Text
                                style={[
                                    {
                                        color: '#00894F',
                                    },
                                    fs_12_700,
                                ]}
                            >
                                {salaryInfo?.salary_history?.paid_salary === 2
                                    ? 'Đã chi trả'
                                    : 'Chưa chi trả'}
                            </Text>
                        </View>
                        {
                            salaryInfo?.salary_history?.paid_salary === 2 && (
                                <Text
                                    style={[
                                        fs_14_400,
                                        text_gray,
                                        text_center,
                                        {
                                            marginTop: 5,
                                        },
                                    ]}
                                >
                                    Thời gian chi trả{' '}
                                    {dayjs(salaryInfo?.salary_history?.pay_day).format('DD/MM/YYYY')}
                                </Text>
                            )
                        }
                    </View>

                    <View
                        style={{...styles.box, marginTop: 20, backgroundColor: '#fff'}}
                    >
                        <Text style={[text_gray]}>Chi trả qua</Text>

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 5,
                                paddingHorizontal: 10,
                            }}
                        >
                            <SalaryItemIcon width={30} height={30}/>
                            <View
                                style={{
                                    marginLeft: 20,
                                }}
                            >
                                <Text style={[fs_14_400, text_black]}>
                                    Tên tài khoản:{' '}
                                    <Text style={{fontWeight: 'bold'}}>
                                        {salaryInfo?.transfer_information?.receiver_name}
                                    </Text>
                                </Text>

                                <Text style={[fs_14_400, text_black]}>
                                    Số tài khoản:{' '}
                                    <Text style={{fontWeight: 'bold'}}>
                                        {salaryInfo?.transfer_information?.bank_number}
                                    </Text>
                                </Text>

                                <Text style={[fs_14_400, text_black]}>
                                    Ngân hàng:{' '}
                                    <Text style={{fontWeight: 'bold'}}>
                                        {salaryInfo?.transfer_information?.bank_name}
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View
                        style={{...styles.box, marginTop: 20, backgroundColor: '#fff'}}
                    >
                        <Text
                            style={[
                                text_red,
                                text_center,
                                fs_15_700,
                                {
                                    marginBottom: 10,
                                },
                            ]}
                        >
                            Phiếu lương
                        </Text>
                        <View>
                            {/* Header */}
                            <View style={[styles.row]}>
                                <View style={styles.cell}>
                                    <Text style={[text_black, text_center, fw_bold]}>Khoản</Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text style={[text_black, text_center, fw_bold]}>
                                        Tạm tính
                                    </Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text style={[text_black, text_center, fw_bold]}>Mức HT</Text>
                                </View>
                            </View>

                            {/* Rows */}
                            <View style={styles.row}>
                                <View style={styles.cell}>
                                    <Text style={[text_black]}>Lương cơ bản</Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text style={[text_black, text_right, fw_bold]}>
                                        {salaryTmpData?.basicSalary.toLocaleString()}
                                    </Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text style={[text_black, text_right, fw_bold]}>
                                        {salaryCompleteData?.basicSalary.toLocaleString()}
                                    </Text>
                                </View>
                            </View>

                            {/* Add more rows as needed */}

                            <View style={styles.row}>
                                <View style={styles.cell}>
                                    <Text style={[text_black]}>Lương năng suất / KPI</Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text style={[text_black, text_right, fw_bold]}>
                                        {salaryTmpData?.performanceSalary.toLocaleString()}
                                    </Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text style={[text_black, text_right, fw_bold]}>
                                        {salaryCompleteData?.performanceSalary.toLocaleString()}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.cell}>
                                    <Text style={[text_black]}>Phụ cấp</Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text style={[text_black, text_right, fw_bold]}>
                                        {salaryTmpData?.allowance.toLocaleString()}
                                    </Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text style={[text_black, text_right, fw_bold]}>
                                        {salaryCompleteData?.allowance.toLocaleString()}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.cell}>
                                    <Text style={[text_black]}>Lương chức danh</Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text style={[text_black, text_right, fw_bold]}>
                                        {salaryTmpData?.salaryTitle.toLocaleString()}
                                    </Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text style={[text_black, text_right, fw_bold]}>
                                        {salaryCompleteData?.salaryTitle.toLocaleString()}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.cell}>
                                    <Text style={[text_black]}>Các khoản giảm trừ phạt</Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text style={[text_black, text_right, fw_bold]}>0</Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text style={[text_black, text_right, fw_bold]}>0</Text>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 10,
                            }}
                        >
                            <Text
                                style={[
                                    text_red,
                                    fs_15_700,
                                    {
                                        marginBottom: 10,
                                        marginRight: 10,
                                    },
                                ]}
                            >
                                Tổng
                            </Text>
                            <View>
                                <Text style={[text_green, text_center, fs_15_700]}>
                                    {salaryTmpData?.totalSalary?.toLocaleString()}
                                </Text>
                                <Text style={[text_black, text_center, fs_15_700]}>
                                    ( {salaryCompleteData?.totalSalary?.toLocaleString()})
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    );
}
const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
    },

    box: {
        width: '100%',
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
        borderColor: '#D9D9D9',
        borderWidth: 1,
        padding: 10,
    },
    table: {
        // borderWidth: 1,
        // borderColor: '#000',
        color: '#000',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderBottomWidth: 1,
        // borderBottomColor: '#000',
    },
    cell: {
        flex: 1,
        padding: 8,
        borderRightWidth: 1,
        borderRightColor: '#efefef',
    },
});
