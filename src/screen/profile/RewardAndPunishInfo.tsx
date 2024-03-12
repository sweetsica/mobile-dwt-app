import {Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/header/Header.tsx';
import AdminTabBlock from "../../components/common/tab/AdminTabBlock.tsx";
import {fs_14_400, text_black} from "../../assets/style.ts";
import DropdownIcon from "../../assets/img/dropdown-icon.svg";
import dayjs from "dayjs";
import PrimaryTable from "../../components/common/table/PrimaryTable.tsx";
import AddIcon from "../../assets/img/add.svg";
import {useConnection} from "../../redux/connection";
import {useMemo, useState} from "react";
import DatePickerModal from "../../components/common/modal/DatePickerModal.tsx";
import FilterRewardAndPunishStatusModal from "../../components/reward-and-punish/FilterRewardAndPunishStatusModal.tsx";
import FilterRewardAndPunishTypeModal from "../../components/reward-and-punish/FilterRewardAndPunishTypeModal.tsx";
import {
    LIST_REWARD_AND_PUNISHMENT_STATUS_COLOR,
    LIST_REWARD_AND_PUNISHMENT_TYPE,
    LIST_REWARD_AND_PUNISHMENT_UNIT
} from "../../assets/constant.ts";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {dwtApi} from "../../api/service/dwtApi.ts";
import {useRefreshOnFocus} from "../../hook/useRefeshOnFocus.ts";
import PrimaryLoading from "../../components/common/loading/PrimaryLoading.tsx";
import ListDepartmentModal from "../../components/home/manager-component/ListDepartmentModal.tsx";

const {width: windowWidth} = Dimensions.get('window');

const columns = [
    {
        title: 'Người liên quan',
        key: 'name',
        width: 5 / 15,
    },
    {
        title: 'Nội dung',
        key: 'content',
        width: 4 / 15,
    },
    {
        title: 'Loại',
        key: 'type',
        width: 2 / 15,
    },
    {
        title: 'SL',
        key: 'quantity',
        width: 2 / 15,
    },
    {
        title: 'Đơn vị',
        key: 'unit',
        width: 2 / 15,
    },
]


export default function RewardAndPunishInfo({navigation}: any) {
    const {connection: {currentTabManager, userInfo}} = useConnection();
    const [isOpenStatusSelect, setIsOpenStatusSelect] = useState(false);
    const [isOpenTimeSelect, setIsOpenTimeSelect] = useState(false);
    const [statusValue, setStatusValue] = useState({
        label: 'Tất cả trạng thái',
        value: 0,
    });
    const [timeValue, setTimeValue] = useState(null);
    const [isOpenTypeSelect, setIsOpenTypeSelect] = useState(false);
    const [typeValue, setTypeValue] = useState({
        label: 'Loại',
        value: 0,
    });
    const [isOpenDepartmentSelect, setIsOpenDepartmentSelect] = useState(false);
    const [departmentValue, setDepartmentValue] = useState({
        label: 'Phòng ban',
        value: 0,
    });

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
        isLoading: listRewardAndPunishmentLoading,
        isFetching: listRewardAndPunishmentFetching,
        fetchNextPage: fetchNextListRewardAndPunishment,
        hasNextPage: hasNextListRewardAndPunishment,
        refetch: refetchListRewardAndPunishment,
    } = useInfiniteQuery(
        ['listRewardAndPunishment', statusValue, typeValue, timeValue, departmentValue],
        async ({pageParam = 1, queryKey}: any) => {
            const [_, status, type, time] = queryKey;
            const res = await dwtApi.getListRewardPunish({
                create_at: time ? dayjs(time).format('DD/MM/YYYY') : undefined,
                status: status?.value === 0 ? undefined : status?.value,
                type: type?.value === 0 ? undefined : type?.value,
                page: pageParam,
                department: departmentValue?.value === 0 ? undefined : departmentValue?.value,
                limit: 10,
            });
            return {
                data: res?.data?.data,
                nextPage: pageParam + 1,
            };
        }, {
            getNextPageParam: lastPage => {
                const {nextPage} = lastPage;
                if (lastPage.data.length < 10) {
                    return undefined;
                }
                return nextPage;
            },
        });

    const listRewardPunish = pages.flatMap(page => page.data);
    const tableData = useMemo(() => {
        return listRewardPunish.filter((item) => {
            if (currentTabManager === 1) {
                return true;
            } else {
                return item?.user?.id === userInfo?.id;
            }
        }).map((item: any) => {
            return {
                name: item?.user?.name,
                content: item?.content,
                type: LIST_REWARD_AND_PUNISHMENT_TYPE[item?.type].label,
                quantity: item?.quantity,
                unit: LIST_REWARD_AND_PUNISHMENT_UNIT.find(
                    (unit) => unit.value === +item?.unit)?.label,
                bgColor: LIST_REWARD_AND_PUNISHMENT_STATUS_COLOR[+item?.status],
            }
        })
    }, [listRewardPunish, userInfo]);

    const getMoreData = async () => {
        if (hasNextListRewardAndPunishment) {
            await fetchNextListRewardAndPunishment();
        }
    }

    useRefreshOnFocus(refetchListRewardAndPunishment)

    if (listRewardAndPunishmentLoading) {
        return <PrimaryLoading/>
    }
    return (
        <SafeAreaView style={styles.wrapper}>
            <AdminTabBlock/>
            <Header
                title={'KHEN THƯỞNG & XỬ PHẠT'}
                handleGoBack={() => navigation.goBack()}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[
                        styles.filter_wrapper,
                        currentTabManager === 1 ? {gap: (windowWidth - 30) * 2 / 100} : {width: '100%'}
                    ]}
                    horizontal={true}
                >
                    <TouchableOpacity
                        style={[styles.dropdown, {
                            width: (windowWidth - 30) * 38 / 100,
                        }]}
                        onPress={() => {
                            setIsOpenStatusSelect(true);
                        }}>
                        <Text style={[text_black, fs_14_400]}>{statusValue.label}</Text>
                        <DropdownIcon width={20} height={20}/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.dropdown, {
                            width: (windowWidth - 30) * 25 / 100,
                        }]}
                        onPress={() => {
                            setIsOpenTypeSelect(true);
                        }}>
                        <Text style={[text_black, fs_14_400]}>{typeValue.label}</Text>
                        <DropdownIcon width={20} height={20}/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.dropdown, {
                            width: (windowWidth - 30) * 33 / 100,
                        }]}
                        onPress={() => {
                            setIsOpenTimeSelect(true);
                        }}>
                        <Text style={[text_black, fs_14_400]}>
                            {timeValue ? dayjs(timeValue).format('DD/MM/YYYY') : "Thời gian"}
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
                        getMoreData={getMoreData}
                        isFetchingData={listRewardAndPunishmentFetching}
                    />
                </View>
            </ScrollView>

            <FilterRewardAndPunishTypeModal
                visible={isOpenTypeSelect}
                setVisible={setIsOpenTypeSelect}
                setStatusValue={setTypeValue}
                statusValue={typeValue}
            />

            <FilterRewardAndPunishStatusModal
                visible={isOpenStatusSelect}
                setVisible={setIsOpenStatusSelect}
                setStatusValue={setStatusValue}
                statusValue={statusValue}
            />
            <DatePickerModal
                visible={isOpenTimeSelect}
                setVisible={setIsOpenTimeSelect}
                currentDate={timeValue}
                setCurrentDate={setTimeValue}
            />
            {
                currentTabManager === 1 && (

                    <TouchableOpacity
                        style={styles.align_end}
                        onPress={() => {
                            navigation.navigate('AddRewardAndPunish');
                        }}>
                        <AddIcon width={32} height={32}/>
                    </TouchableOpacity>
                )
            }
            <ListDepartmentModal
                visible={isOpenDepartmentSelect}
                setVisible={setIsOpenDepartmentSelect}
                currentDepartment={departmentValue}
                setCurrentDepartment={setDepartmentValue}
                listDepartment={listDepartment}
            />
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
        gap: 20,
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 15,
    },
    filter_wrapper: {
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    dropdown: {
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.25)',
    },
    align_end: {
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 10,
        right: 15,
    },
});
