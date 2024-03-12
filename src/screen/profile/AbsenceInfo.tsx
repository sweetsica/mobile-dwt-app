import {
    ActivityIndicator,
    FlatList, ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/header/Header.tsx';
import DropdownIcon from '../../assets/img/dropdown-icon.svg';
import {fs_14_400, text_black, text_gray} from '../../assets/style.ts';
import {useState} from 'react';
import {
    LIST_ABSENCE_TYPE,
    LIST_ABSENCE_TYPE_COLOR,
} from '../../assets/constant.ts';
import AddIcon from "../../assets/img/add.svg";
import AbsenceTypeFilterModal from "../../components/common/modal/AbsenceTypeFilterModal.tsx";
import AdminTabBlock from "../../components/common/tab/AdminTabBlock.tsx";
import {useConnection} from '../../redux/connection';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {dwtApi} from '../../api/service/dwtApi.ts';
import {useRefreshOnFocus} from '../../hook/useRefeshOnFocus.ts';
import dayjs from "dayjs";
import ListDepartmentModal from "../../components/home/manager-component/ListDepartmentModal.tsx";
import DatePickerFromToModal from "../../components/common/modal/DatePickerFromToModal.tsx";
import AbsenceItem from "../../components/absence/AbsenceItem.tsx";

export default function AbsenceInfo({navigation}: any) {
    const {
        connection: {currentTabManager, userInfo},
    } = useConnection();
    const [absentType, setAbsentType] = useState(LIST_ABSENCE_TYPE[0]);
    const [isOpenFilterModal, setIsOpenFilterModal] = useState(false);
    const [departmentValue, setDepartmentValue] = useState({
        label: 'Phòng ban',
        value: 0,
    });
    const [isOpenDepartmentSelect, setIsOpenDepartmentSelect] = useState(false);
    const [fromDateValue, setFromDateValue] = useState(null);
    const [toDateValue, setToDateValue] = useState(null);
    const [isOpenTimeSelect, setIsOpenTimeSelect] = useState(false);

    const {
        data: listDepartment = []
    } = useQuery(['listDepartment'], async () => {
        if (userInfo?.role === 'admin') {
            const res = await dwtApi.getListDepartment();
            return res?.data;
        } else if (userInfo?.role === 'manager') {
            const res = await dwtApi.getListChildrenDepartment(userInfo?.departement_id);
            return await Promise.all(res?.data?.map(async (item: string) => {
                const res = await dwtApi.getDepartmentById(item);
                return res?.data;
            }));
        }
    }, {
        enabled: !!userInfo && ['manager', 'admin'].includes(userInfo?.role),
    });

    const {
        data: {pages = []} = {},
        isLoading: isLoadingListAbsence,
        refetch: refetchListAbsence,
        hasNextPage: hasNextPageListAbsence,
        fetchNextPage: fetchNextPageListAbsence,
        isFetching: isFetchingListAbsence,
    } = useInfiniteQuery(
        ['getListAbsence', absentType.value, fromDateValue, toDateValue, departmentValue, currentTabManager],
        async ({pageParam = 1, queryKey}: any) => {
            const params = {
                "absentType[]": queryKey[1] === 0 ? undefined : Number(queryKey[1]),
                start_date: queryKey[2] ? dayjs(queryKey[2]).format('YYYY-MM-DD') : undefined,
                end_date: queryKey[3] ? dayjs(queryKey[3]).format('YYYY-MM-DD') : undefined,
                datetime: (queryKey[3] && queryKey[2]) ?
                    dayjs(queryKey[2]).format('DD/MM/YYYY') + ' - ' + dayjs(queryKey[3]).format('DD/MM/YYYY')
                    : undefined,
                limit: 10,
                page: pageParam,
            }
            console.log(params)
            if (queryKey[5] === 1) {
                const departmentDefaultId = userInfo?.role === 'admin' ? undefined : userInfo?.departement_id;
                const res = await dwtApi.getAllAbsenceManager({
                    ...params,
                    department: queryKey[4].value === 0 ? departmentDefaultId : queryKey[4].value,
                });
                return {
                    data: res?.data?.data,
                    nextPage: pageParam + 1,
                }
            } else {
                const res = await dwtApi.getAllAbsencePersonal(userInfo?.id, params);
                return {
                    data: res?.data?.data,
                    nextPage: pageParam + 1,
                }
            }
        },
        {
            getNextPageParam: lastPage => {
                const {nextPage} = lastPage;
                if (lastPage.data.length < 10) {
                    return undefined;
                }
                return nextPage;
            }
        },
    );
    const listAbsence = pages?.flatMap(item => item.data) || [];

    const getMoreData = async () => {
        if (hasNextPageListAbsence) {
            await fetchNextPageListAbsence();
        }
    }

    useRefreshOnFocus(refetchListAbsence);

    return (
        <SafeAreaView style={styles.wrapper}>
            <AdminTabBlock secondLabel={'Quản lý'}/>
            <Header
                title={'Nghỉ & Phép'}
                handleGoBack={() => navigation.goBack()}
            />
            <View
                style={{marginVertical: 10}}>
                <ScrollView
                    contentContainerStyle={currentTabManager === 1 ? styles.filter_wrapper : {
                        width: '100%',
                        justifyContent: 'space-between',
                        paddingHorizontal: 15,
                    }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    <TouchableOpacity
                        style={[styles.dropdown, {
                            width: currentTabManager === 1 ? 150 : '47%',
                        }]}
                        onPress={() => {
                            setIsOpenFilterModal(true);
                        }}>
                        <Text style={[text_black, fs_14_400]}>{absentType.label}</Text>
                        <DropdownIcon width={20} height={20}/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.dropdown, {
                            width: currentTabManager === 1 ? 150 : '47%',
                        }]}
                        onPress={() => {
                            setIsOpenTimeSelect(true);
                        }}>
                        <Text style={[text_black, fs_14_400]}>
                            {
                                (!fromDateValue && !toDateValue) ? 'Thời gian' :
                                    (fromDateValue ? dayjs(fromDateValue).format('DD/MM/YYYY') : 'Từ') + ' - ' +
                                    (toDateValue ? dayjs(toDateValue).format('DD/MM/YYYY') : 'Đến')
                            }
                        </Text>
                        <DropdownIcon width={20} height={20}/>
                    </TouchableOpacity>

                    {
                        currentTabManager === 1 && (
                            <TouchableOpacity
                                style={[styles.dropdown, {
                                    width: 150,
                                }]}
                                onPress={() => {
                                    setIsOpenDepartmentSelect(true);
                                }}>
                                <Text style={[text_black, fs_14_400]}>
                                    {departmentValue.label}
                                </Text>
                                <DropdownIcon width={20} height={20}/>
                            </TouchableOpacity>
                        )
                    }
                </ScrollView>
            </View>
            <FlatList
                contentContainerStyle={{paddingBottom: 20}}
                data={listAbsence.map((item: any) => {
                    return {
                        ...item,
                        type: item.absent_type,
                        date: dayjs(item.day_off).format('DD/MM/YYYY'),
                    };
                })}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={getMoreData}
                refreshing={isFetchingListAbsence}
                ListFooterComponent={
                    isFetchingListAbsence ? (
                        <ActivityIndicator size={'large'} color={'#CA1F24'}/>
                    ) : null
                }
                ItemSeparatorComponent={() => <View style={{height: 5}}/>}
                renderItem={({item}) => {
                    return (
                        <AbsenceItem item={item} currentTabManager={currentTabManager}/>
                    );
                }}
            />

            <TouchableOpacity
                style={styles.align_end}
                onPress={() => {
                    navigation.navigate('AddAbsence');
                }}
            >
                <AddIcon width={32} height={32}/>
            </TouchableOpacity>
            <AbsenceTypeFilterModal
                visible={isOpenFilterModal}
                setVisible={setIsOpenFilterModal}
                setStatusValue={setAbsentType}
                statusValue={absentType}
            />
            <ListDepartmentModal
                visible={isOpenDepartmentSelect}
                setVisible={setIsOpenDepartmentSelect}
                currentDepartment={departmentValue}
                setCurrentDepartment={setDepartmentValue}
                listDepartment={listDepartment.map((item: any) => {
                    return {
                        label: item.name,
                        value: item.id,
                    };
                })}
            />
            {
                isOpenTimeSelect && (
                    <DatePickerFromToModal
                        setVisible={setIsOpenTimeSelect}
                        fromDate={fromDateValue}
                        toDate={toDateValue}
                        setFromDate={setFromDateValue}
                        setToDate={setToDateValue}
                    />
                )
            }
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative',
    },
    content: {
        gap: 15,
        paddingTop: 10,
    },
    dropdown: {
        borderRadius: 5,
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.25)',
    },
    item: {
        flexDirection: 'row',
        flex: 1,
        padding: 10,
        gap: 10,
    },
    leftItem: {
        flex: 0.1,
        justifyContent: 'center',
    },
    rightItem: {
        flex: 0.9,
        flexDirection: 'row',
    },
    gap5: {
        gap: 5,
    },
    filter_wrapper: {
        gap: 10,
        paddingHorizontal: 15,
    },
    align_end: {
        position: 'absolute',
        bottom: 10,
        right: 15,
        zIndex: 2,
    },
});
