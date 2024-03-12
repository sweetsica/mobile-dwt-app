import Header from '../../components/header/Header.tsx';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {fs_14_400, text_black} from '../../assets/style.ts';
import DropdownIcon from '../../assets/img/dropdown-icon.svg';
import PrimaryTable from '../../components/common/table/PrimaryTable.tsx';
import AddIcon from '../../assets/img/add.svg';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useMemo, useState} from 'react';
import ProposeStatusFilterModal from '../../components/common/modal/ProposeStatusFilterModal.tsx';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {dwtApi} from '../../api/service/dwtApi.ts';
import {LIST_PROPOSE_STATUS, LIST_PROPOSE_STATUS_COLOR_DATA,} from '../../assets/constant.ts';
import dayjs from 'dayjs';
import {useRefreshOnFocus} from '../../hook/useRefeshOnFocus.ts';
import {useConnection} from "../../redux/connection";
import AdminTabBlock from "../../components/common/tab/AdminTabBlock.tsx";
import DatePickerFromToModal from "../../components/common/modal/DatePickerFromToModal.tsx";
import ListDepartmentModal from "../../components/home/manager-component/ListDepartmentModal.tsx";

export default function Propose({navigation}: any) {
    const {connection: {currentTabManager, userInfo}} = useConnection()
    const [isOpenStatusSelect, setIsOpenStatusSelect] = useState(false);
    const [isOpenTimeSelect, setIsOpenTimeSelect] = useState(false);
    const [statusValue, setStatusValue] = useState(LIST_PROPOSE_STATUS[0]);
    const [fromDateValue, setFromDateValue] = useState(null);
    const [toDateValue, setToDateValue] = useState(null);
    const [isOpenDepartmentSelect, setIsOpenDepartmentSelect] = useState(false);
    const [departmentValue, setDepartmentValue] = useState({
        value: 0,
        label: 'Phòng ban',
    });
    const columns = [
        {
            key: 'index',
            title: 'TT',
            width: 0.1,
        },
        {
            key: 'problem',
            title: 'Vấn đề',
            width: 0.35,
        },
        {
            key: 'creator',
            title: 'Người nêu',
            width: 0.3,
        },
        {
            key: 'date',
            title: 'Ngày phát sinh',
            width: 0.25,
        },
    ];

    const {
        data: {pages = []} = {},
        isFetching: IsProposeFetching,
        refetch: refetchPropose,
        fetchNextPage: fetchNextPropose,
        hasNextPage: hasNextPropose,
    } = useInfiniteQuery(
        ['listPropose', statusValue, currentTabManager, fromDateValue, toDateValue, departmentValue],
        async ({pageParam = 1, queryKey}: any) => {
            const params = {
                status: queryKey[1].value === -1 ? undefined : queryKey[1].value,
                start_date: queryKey[3] ? dayjs(queryKey[3]).format('YYYY-MM-DD') : undefined,
                end_date: queryKey[4] ? dayjs(queryKey[4]).format('YYYY-MM-DD') : undefined,
                limit: 15,
                page: pageParam,
            }
            console.log(params, 'params')
            if (queryKey[2] === 0) {
                const response = await dwtApi.getListPersonalPropose(params);
                return {
                    data: response.data.data,
                    nextPage: pageParam + 1
                };
            } else {
                const response = await dwtApi.getListDepartmentPropose({
                    ...params,
                    department_id: queryKey[5].value === 0 ? undefined : queryKey[5].value,
                });
                return {
                    data: response.data.data,
                    nextPage: pageParam + 1
                };
            }
        },
        {
            getNextPageParam: lastPage => {
                const {nextPage} = lastPage;
                if (lastPage.data.length < 15) {
                    return undefined;
                }
                return nextPage;
            }
        },
    );
    const listPropose = pages.flatMap(page => page.data);

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


    const tableData = useMemo(() => {
        return listPropose.map((item: any, index: number) => {
            return {
                ...item,
                index: index + 1,
                creator: item.user.name,
                date: dayjs(item.created_at).format('DD/MM/YYYY'),
                bgColor: LIST_PROPOSE_STATUS_COLOR_DATA[item.status as keyof typeof LIST_PROPOSE_STATUS_COLOR_DATA] || '#fff',
            };
        });
    }, [listPropose]);

    useRefreshOnFocus(refetchPropose);

    const getMorePropose = async () => {
        if (hasNextPropose) {
            await fetchNextPropose();
        }
    }

    return (
        <SafeAreaView style={styles.wrapper}>
            <AdminTabBlock/>
            <Header
                title={'DANH SÁCH ĐỀ XUẤT'}
                handleGoBack={() => {
                    navigation.goBack();
                }}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}>
                <ScrollView
                    contentContainerStyle={currentTabManager === 1 ? styles.filter_wrapper : {
                        width: '100%',
                        justifyContent: 'space-between',
                    }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    <TouchableOpacity
                        style={[styles.dropdown, {
                            width: currentTabManager === 1 ? 150 : '47%',
                        }]}
                        onPress={() => {
                            setIsOpenStatusSelect(true);
                        }}>
                        <Text style={[text_black, fs_14_400]}>{statusValue.label}</Text>
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
                <View>
                    <PrimaryTable
                        data={tableData}
                        columns={columns}
                        headerColor={'#D9D9D9'}
                        isFetchingData={IsProposeFetching}
                        getMoreData={getMorePropose}
                    />
                </View>
            </ScrollView>

            <TouchableOpacity
                style={styles.align_end}
                onPress={() => {
                    navigation.navigate('AddPropose');
                }}>
                <AddIcon width={32} height={32}/>
            </TouchableOpacity>
            <ProposeStatusFilterModal
                visible={isOpenStatusSelect}
                setVisible={setIsOpenStatusSelect}
                setStatusValue={setStatusValue}
                statusValue={statusValue}
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
        backgroundColor: '#FFF',
        position: 'relative',
    },
    content: {
        gap: 20,
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 15,
    },
    filter_wrapper: {
        gap: 10,
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
    align_end: {
        position: 'absolute',
        bottom: 10,
        right: 15,
    },
});
