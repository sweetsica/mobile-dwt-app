import Header from '../../components/header/Header.tsx';
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {fs_14_400, text_black} from '../../assets/style.ts';
import DropdownIcon from '../../assets/img/dropdown-icon.svg';
import AddIcon from '../../assets/img/add.svg';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useMemo, useState} from 'react';
import CustomerSummary from "../../components/customer/CustomerSummary.tsx";
import CustomerItem from "../../components/customer/CustomerItem.tsx";
import dayjs from "dayjs";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {dwtApi} from "../../api/service/dwtApi.ts";
import AdminTabBlock from "../../components/common/tab/AdminTabBlock.tsx";
import FilterClassifyModal from "../../components/customer/FilterClassifyModal.tsx";
import {LIST_CLASSIFY_CUSTOMER_STATUS_FILTER, LIST_PROCESS_CUSTOMER_STATUS_FILTER} from "../../assets/constant.ts";
import FilterCityModal from "../../components/customer/FilterCityModal.tsx";
import FilterProcessModal from "../../components/customer/FilterProcessModal.tsx";
import FilterCustomerTypeModal from "../../components/customer/FilterCustomerTypeModal.tsx";
import DatePickerFromToModal from "../../components/common/modal/DatePickerFromToModal.tsx";
import {useRefreshOnFocus} from "../../hook/useRefeshOnFocus.ts";
import {useConnection} from "../../redux/connection";
import UserFilterModal from "../../components/common/modal/UserFilterModal.tsx";

export default function Customer({navigation}: any) {
    const {connection: {userInfo, currentTabManager}} = useConnection()
    const [classify, setClassify] = useState({
        label: 'Loại khách',
        value: 'all',
    });
    const [isOpenClassify, setIsOpenClassify] = useState(false);

    const [address, setAddress] = useState({
        name: 'Tỉnh/TP',
        code: 0,
    });
    const [isOpenAddressSelect, setIsOpenAddressSelect] = useState(false);

    const [process, setProcess] = useState({
        label: 'Giai đoạn',
        value: 'all',
    });

    const [isOpenProcessSelect, setIsOpenProcessSelect] = useState(false);

    const [customerType, setCustomerType] = useState({
        label: 'Nhóm',
        value: 'all',
    });
    const [isOpenCustomerTypeSelect, setIsOpenCustomerTypeSelect] = useState(false);

    const [fromDate, setFromDate] =
        useState(dayjs().startOf('year').format('YYYY-MM-DD'));
    const [toDate, setToDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [isOpenSelectDate, setIsOpenSelectDate] = useState(false);

    const [isOpenUserFilter, setIsOpenUserFilter] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        value: 0,
        label: 'Nhân sự thu thập',
    });
    const [searchUserValue, setSearchUserValue] = useState('')


    const {
        data: listUsers = [],
    } = useQuery(
        ['dwtApi.getListAllUser', searchUserValue],
        async ({queryKey}) => {
            const res = await dwtApi.searchUser({
                q: queryKey[1],
            });

            return res?.data?.data
        },
        {
            enabled: !!userInfo && currentTabManager === 1
        }
    );



    const {
        data: {pages: pageCustomer = []} = {},
        isFetching: isFetchingCustomer,
        refetch: refetchCustomer,
        fetchNextPage: fetchNextPageCustomer,
        hasNextPage: hasNextPageCustomer,
    } = useInfiniteQuery(['listCustomer', classify, address, process, customerType, {
            fromDate,
            toDate,
        }, currentUser],
        async ({pageParam = 1, queryKey}: any) => {
            const res = await dwtApi.getListCustomer({
                classify: queryKey[1].value === 'all' ? undefined : queryKey[1].value,
                city: queryKey[2].code === 0 ? undefined : queryKey[2].name,
                process: queryKey[3].value === 'all' ? undefined : queryKey[3].value,
                customer_type: queryKey[4].value === 'all' ? undefined : queryKey[4].value,
                start_date: queryKey[5].fromDate ? dayjs(queryKey[5].fromDate).format('YYYY-MM-DD') : undefined,
                end_date: queryKey[5].toDate ? dayjs(queryKey[5].toDate).format('YYYY-MM-DD') : undefined,
                user_id: queryKey[6].value === 0 ? undefined : queryKey[6].value,
                page: pageParam,
                limit: 10,
            });
            return {
                customerData: res?.data,
                data: res?.data?.customer?.data,
                nextPage: pageParam + 1,
            }
        }, {
            getNextPageParam: lastPage => {
                const {nextPage} = lastPage;
                if (lastPage.data.length < 10) {
                    return undefined;
                }
                return nextPage;
            }
        }
    );
    const listCustomer = pageCustomer.flatMap(page => page.data);
    const customerData = pageCustomer[0]?.customerData;


    useRefreshOnFocus(refetchCustomer)

    //function get more data
    const getMoreData = async () => {
        if (hasNextPageCustomer) {
            await fetchNextPageCustomer();
        }
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <AdminTabBlock/>
            <Header
                title={'DANH SÁCH KHÁCH HÀNG'}
                handleGoBack={() => {
                    navigation.navigate('Menu');
                }}
            />
            <View>
                <CustomerSummary
                    totalCustomer={customerData?.customer?.total ?? 0}
                    totalPotential={customerData?.potential ?? 0}
                    totalCare={customerData?.takingCare ?? 0}
                    totalCooperation={customerData?.cooperating ?? 0}
                />
            </View>
            <View style={styles.content}>
                <View>
                    <ScrollView
                        horizontal={true}
                        contentContainerStyle={styles.filter_wrapper}
                        showsHorizontalScrollIndicator={false}
                    >
                        <TouchableOpacity
                            style={[styles.dropdown, {width: 140}]}
                            onPress={() => {
                                setIsOpenClassify(true);
                            }}>
                            <Text style={[text_black, fs_14_400]}>{classify.label}</Text>
                            <DropdownIcon width={20} height={20}/>
                        </TouchableOpacity>

                        {
                            currentTabManager === 1 && (
                                <TouchableOpacity
                                    style={[styles.dropdown, {width: 200}]}
                                    onPress={() => {
                                        setIsOpenUserFilter(true);
                                    }}>
                                    <Text style={[text_black, fs_14_400]}>{currentUser.label}</Text>
                                    <DropdownIcon width={20} height={20}/>
                                </TouchableOpacity>
                            )
                        }

                        <TouchableOpacity
                            style={[styles.dropdown, {width: 140}]}
                            onPress={() => {
                                setIsOpenAddressSelect(true);
                            }}>
                            <Text style={[text_black, fs_14_400]}>
                                {address.name}
                            </Text>
                            <DropdownIcon width={20} height={20}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.dropdown, {width: 120}]}
                            onPress={() => {
                                setIsOpenProcessSelect(true);
                            }}>
                            <Text style={[text_black, fs_14_400]}>
                                {process.label}
                            </Text>
                            <DropdownIcon width={20} height={20}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.dropdown, {width: 120}]}
                            onPress={() => {
                                setIsOpenCustomerTypeSelect(true);
                            }}>
                            <Text style={[text_black, fs_14_400]}>
                                {customerType.label}
                            </Text>
                            <DropdownIcon width={20} height={20}/>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.dropdown, {width: 200}]}
                            onPress={() => {
                                setIsOpenSelectDate(true);
                            }}>
                            <Text style={[text_black, fs_14_400]}>
                                {dayjs(fromDate).format('DD/MM/YYYY')} -{' '}
                                {dayjs(toDate).format('DD/MM/YYYY')}
                            </Text>
                            <DropdownIcon width={20} height={20}/>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                <FlatList
                    data={listCustomer}
                    renderItem={({item}) => {
                        return (
                            <CustomerItem item={item}/>
                        )
                    }}
                    keyExtractor={(item) => item.id.toString()}
                    ItemSeparatorComponent={() => <View style={{height: 10}}/>}
                    contentContainerStyle={{
                        paddingVertical: 10,
                    }}
                    onEndReached={getMoreData}
                    onEndReachedThreshold={0.5}
                    refreshing={isFetchingCustomer}
                    ListFooterComponent={
                        isFetchingCustomer ? (
                            <ActivityIndicator size={'large'} color={'#3D5CFF'}/>
                        ) : null
                    }
                />
            </View>
            <TouchableOpacity
                style={styles.align_end}
                onPress={() => {
                    navigation.navigate('AddCustomer');
                }}>
                <AddIcon width={32} height={32}/>
            </TouchableOpacity>

            <FilterClassifyModal
                visible={isOpenClassify}
                setVisible={setIsOpenClassify}
                setStatusValue={setClassify}
                statusValue={classify}
            />

            <FilterCityModal
                visible={isOpenAddressSelect}
                setVisible={setIsOpenAddressSelect}
                setCurrentCity={setAddress}
                currentCity={address}
            />

            <FilterProcessModal
                visible={isOpenProcessSelect}
                setVisible={setIsOpenProcessSelect}
                setStatusValue={setProcess}
                statusValue={process}
            />
            <FilterCustomerTypeModal
                visible={isOpenCustomerTypeSelect}
                setVisible={setIsOpenCustomerTypeSelect}
                setStatusValue={setCustomerType}
                statusValue={customerType}
            />
            {
                isOpenSelectDate && (
                    <DatePickerFromToModal
                        setVisible={setIsOpenSelectDate}
                        fromDate={fromDate}
                        toDate={toDate}
                        setFromDate={setFromDate}
                        setToDate={setToDate}
                    />
                )
            }
            <UserFilterModal
                visible={isOpenUserFilter}
                setVisible={setIsOpenUserFilter}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                searchValue={searchUserValue}
                setSearchValue={setSearchUserValue}
                listUser={[{
                    value: 0,
                    label: 'Tất cả',
                }, ...listUsers.map((item: any) => {
                    return {
                        value: item.id,
                        label: item.name,
                    };
                })]}
            />
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
        paddingTop: 10,
        borderTopColor: 'rgba(228, 229, 231, 0.57)',
        borderTopWidth: 10,
        flex: 1,
        gap: 10,
    },
    filter_wrapper: {
        gap: 10,
        paddingHorizontal: 15,
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
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 10,
        right: 15,
    },
});
