import {FlatList, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {
    fs_12_400,
    fs_12_700,
    fs_14_400,
    fs_14_700,
    fs_15_700,
    text_black,
    text_center,
    text_red,
    text_white,
} from '../../../assets/style.ts';
import {useState} from 'react';
import AddIcon from "../../../assets/img/add.svg";
import PlusButtonModal from "../../work/PlusButtonModal.tsx";
import {useConnection} from '../../../redux/connection';
import {useQuery} from '@tanstack/react-query';
import {dwtApi} from '../../../api/service/dwtApi.ts';
import dayjs from "dayjs";
import PrimaryLoading from "../../common/loading/PrimaryLoading.tsx";
import {useRefreshOnFocus} from '../../../hook/useRefeshOnFocus.ts';
import HomeHeader from "../../home/HomeHeader.tsx";
import FactoryReportDetail from "../../home/home-component/FactoryReportDetail.tsx";
import ChevronLeftIcon from "../../../assets/img/chevron-left-dark.svg";
import EmptyDailyReportIcon from "../../../assets/img/empty-daily-report.svg";

export default function UserFactoryWork({navigation}: any) {
    const {connection: {userInfo}} = useConnection();
    const [isOpenPlusButton, setIsOpenPlusButton] = useState(false);

    const {
        data: listFactoryReport = [],
        isLoading: loadingListFactoryReport,
        refetch,
    } = useQuery(['userFactory'], async () => {
        const date = dayjs().format('YYYY-MM');
        const response = await dwtApi.getProductionPersonalDiaryByMonth({
            date: date,
        });
        return response.data;
    });

    const {
        data: personalFactoryResult = {}
    } = useQuery(['personalFactoryResult', userInfo], async ({queryKey}) => {
        const date = dayjs().format('YYYY-MM');
        const res = await dwtApi.getFactoryPersonalResult({
            date: date,
            user_id: queryKey[1]?.id,
            department_id: queryKey[1]?.departement_id,
        });
        return res.data;
    }, {
        enabled: !!userInfo
    });


    const summaryData = [
        {
            label: 'Tổng KPI tạm tính',
            value: personalFactoryResult.total_kpi ?? 0,
            unit: ' KPI',
        },
        {
            label: 'Tổng số báo cáo',
            value: personalFactoryResult.total_report ?? 0,
            unit: '',
        },
    ];

    useRefreshOnFocus(refetch);

    if (loadingListFactoryReport) {
        return <PrimaryLoading/>;
    }

    return (
        <View style={styles.wrapper}>
            <HomeHeader navigation={navigation}/>
            <View style={styles.header}>
                <TouchableOpacity
                    style={{width: '25%'}}
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <ChevronLeftIcon width={16} height={16}/>
                </TouchableOpacity>
                <View style={{width: '40%'}}>
                    <Text style={[fs_15_700, text_black, text_center]}>
                        CÔNG VIỆC THÁNG
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        navigation.navigate('UserFactoryWorkDay');
                    }}
                >
                    <Text style={[fs_12_700, text_white, text_center]}>Xem theo ngày</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <View style={styles.summaryBox}>
                    {summaryData.map((item: any, index: number) => {
                        return (
                            <View style={styles.summaryRow} key={index}>
                                <View>
                                    <Text style={[fs_14_700, text_black]}>{item.label}:</Text>
                                </View>
                                <View>
                                    <Text style={[fs_14_400, text_black]}>
                                        <Text style={[text_red]}>{item.value}</Text>
                                        {item.unit}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
                <FlatList
                    data={listFactoryReport}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: 20}}
                    renderItem={({item}) => {
                        return <FactoryReportDetail data={item} navigation={navigation}/>;
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    style={{marginTop: 20}}
                    ItemSeparatorComponent={() => <View style={{height: 15}}/>}
                    ListEmptyComponent={() => {
                        return (
                            <View>
                                <EmptyDailyReportIcon
                                    style={{alignSelf: 'center', marginTop: 50}}
                                />
                                <Text style={[fs_12_400, text_black, text_center]}>
                                    Chưa có báo cáo.
                                </Text>
                            </View>
                        );
                    }}
                />
            </View>
            <TouchableOpacity
                style={styles.align_end}
                onPress={() => setIsOpenPlusButton(true)}
            >
                <AddIcon width={32} height={32}/>
                <PlusButtonModal
                    visible={isOpenPlusButton}
                    setVisible={setIsOpenPlusButton}
                    navigation={navigation}
                    notHasReceiveWork={true}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: '#F6F6F6',
        paddingVertical: 10,
        justifyContent: 'space-between',
    },
    content: {
        paddingHorizontal: 15,
        paddingTop: 20,
        flex: 1,
    },
    button: {
        borderRadius: 5,
        backgroundColor: '#DD0013',
        paddingVertical: 5,
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryBox: {
        backgroundColor: '#F3F4F4',
        borderRadius: 6,
        paddingHorizontal: 15,
        width: '100%',
        gap: 10,
        paddingVertical: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    logWrapper: {
        width: '100%',
        backgroundColor: '#F4F4F4',
        borderRadius: 12,
        elevation: 5,
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: {
            width: 1,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        paddingVertical: 15,
        paddingLeft: 15,
        paddingRight: 10,
    },
    align_end: {
        position: 'absolute',
        bottom: 10,
        right: 15,
        zIndex: 2,
    },
});
