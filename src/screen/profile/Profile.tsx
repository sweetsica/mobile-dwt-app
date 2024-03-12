import {
    Alert,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ChevronLeft from '../../assets/img/chevron-left-dark.svg';
import PrimaryButton from '../../components/common/button/PrimaryButton.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useConnection} from '../../redux/connection';
import {dwtApi} from '../../api/service/dwtApi.ts';
import NoAvatarIcon from '../../assets/img/no-avatar.svg';
import CameraAvatarIcon from '../../assets/img/camera-avatar.svg';
import {useQuery} from '@tanstack/react-query';
import {
    fs_12_400,
    fs_14_400,
    fs_14_500,
    fs_25_700,
    text_black,
    text_center,
    text_gray,
    text_red,
} from '../../assets/style.ts';
import PrimaryLoading from '../../components/common/loading/PrimaryLoading.tsx';
import StarFillIcon from '../../assets/img/star-fill.svg';
import StarIcon from '../../assets/img/star.svg';
import BoxIcon from '../../assets/img/profile/box.svg';
import ChevronRightProfileIcon from '../../assets/img/profile/chevron-right-profile.svg';
import {useRefreshOnFocus} from '../../hook/useRefeshOnFocus.ts';
import React, {useEffect, useMemo, useState} from 'react';
import UploadAvatarModal from '../../components/profile/UploadAvatarModal.tsx';
import LoadingActivity from '../../components/common/loading/LoadingActivity.tsx';
import ToastSuccessModal from '../../components/common/modal/ToastSuccessModal.tsx';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import VersionCheck from 'react-native-version-check';
import {LIST_BUSINESS_DEPARTMENT} from "../../assets/constant.ts";
import dayjs from "dayjs";
import {getTotalTempSalary} from "../../utils";

const listMenu = [
    {
        name: 'Thông tin cá nhân',
        icon: <FontAwesome5Icon name={'user'} color={'#CA1F24'} size={20}/>,
        screen: 'UserInfo',
    },
    {
        name: 'Họp giao ban',
        icon: <FontAwesome5Icon name={'plus'} color={'#CA1F24'} size={20}/>,
        screen: 'MeetingInfo',
    },
    {
        name: 'Quá trình công tác',
        icon: <FontAwesome5Icon name={'edit'} color={'#CA1F24'} size={20}/>,
        screen: 'WorkInfo',
    },
    {
        name: 'Lịch sử lương',
        icon: <FontAwesome5Icon name={'coins'} color={'#CA1F24'} size={20}/>,
        screen: 'SalaryInfo',
    },
    {
        name: 'Trang bị',
        icon: <BoxIcon width={20} height={20} color={'#CA1F24'}/>,
        screen: 'EducationInfo',
    },
    {
        name: 'Khen thưởng & Xử phạt',
        icon: <FontAwesome5Icon name={'star'} color={'#CA1F24'} size={20}/>,
        screen: 'RewardAndPunishInfo',
    },
    {
        name: 'Nghỉ & Phép',
        icon: <FontAwesome5Icon name={'minus'} color={'#CA1F24'} size={20}/>,
        screen: 'AbsenceInfo',
    },
    {
        name: 'Cập nhật mật khẩu',
        icon: <FontAwesome5Icon name={'cog'} color={'#CA1F24'} size={20}/>,
        screen: 'SettingInfo',
    },
];

export default function Profile({navigation}: any) {
    const {
        onSetUserInfo,
        onSetCurrentTabManager,
        connection: {userInfo, listDepartmentGroup},
    } = useConnection();
    const [isOpenUploadAvatar, setIsOpenUploadAvatar] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [currentVersion, setCurrentVersion] = useState('1.0.0');

    useEffect(() => {
        setCurrentVersion(VersionCheck.getCurrentVersion());
    }, []);
    const handleLogout = async () => {
        await dwtApi.logout();
        await AsyncStorage.removeItem('accessToken');
        onSetUserInfo(null);
        onSetCurrentTabManager(0);
        navigation.navigate('Home');
        navigation.navigate('Login');
    };

    // const handleOpenUpdateLink = async () => {
    //     try {
    //         const newLink = await axios.get('https://zombie-game.fun/api/release');
    //         const downloadUrl = newLink.data.data.url;
    //         await Linking.openURL(downloadUrl);
    //     } catch (err: any) {
    //         console.log(err);
    //         Alert.alert('Không thể mở liên kết');
    //     }
    // };
    const {
        data: userData = {},
        isLoading: isLoadingUserData,
        refetch,
    } = useQuery(
        ['getUserInfo', userInfo?.id],
        async () => {
            const res = await dwtApi.getUserById(userInfo?.id);
            return res.data;
        },
        {
            enabled: !!userInfo?.id && !!userInfo,
        }
    );

    const {
        data: totalSalary = 0,
        isLoading: isLoadingSalary,
        refetch: refetchSalary,
    } = useQuery(['listSalary', userInfo?.departement_id], async () => {
        if(listDepartmentGroup.business.includes(userInfo?.departement_id)) {
            const res = await dwtApi.getSalaryHistory({
                year_f: dayjs().format('YYYY'),
            });
            const salaryHistory = res?.data?.salaryHistory?.data;

            const monthSalary = salaryHistory.find((salary: any) => {
                return salary.month === (dayjs().month() + 1)
            })
            if(monthSalary === undefined) {
                return 0;
            }
            const salaryDetail = await dwtApi.getSalaryById(monthSalary.id);
            return getTotalTempSalary(salaryDetail.data)
        }
        return 0;
    }, {
        enabled: !!userInfo && listDepartmentGroup.business.includes(userInfo?.departement_id),
    });

    const handleUploadAvatar = async (images: any) => {
        try {
            setIsOpenUploadAvatar(false);
            setIsLoading(true);
            const imageUrl = await dwtApi.uploadFile(images[0]);
            const res = await dwtApi.updateUserById(userInfo.id, {
                ...userInfo,
                avatar: imageUrl,
            });
            if (res.status === 200) {
                setIsSuccess(true);
                await refetch();
                onSetUserInfo(res.data);
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại sau');
        } finally {
            setIsLoading(false)
        }
    };

    useRefreshOnFocus(() => {
        refetch();
        refetchSalary();
    });

    if (isLoadingUserData || isLoadingSalary) {
        return <PrimaryLoading/>;
    }
    return (
        userData && (
            <SafeAreaView style={styles.wrapper}>
                <TouchableOpacity
                    style={styles.backIcon}
                    hitSlop={10}
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <ChevronLeft width={16} height={16}/>
                </TouchableOpacity>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: 10}}
                >
                    <View style={styles.avatarContainer}>
                        <View
                            style={{
                                borderRadius: 999,
                                width: 90,
                                height: 90,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {userData?.avatar ? (
                                <Image
                                    source={{uri: userData?.avatar}}
                                    style={{
                                        width: 90,
                                        height: 90,
                                        borderRadius: 999,
                                    }}
                                />
                            ) : (
                                <NoAvatarIcon width={90} height={90}/>
                            )}
                        </View>
                        <TouchableOpacity
                            style={styles.cameraIcon}
                            onPress={() => {
                                setIsOpenUploadAvatar(true);
                            }}
                        >
                            <CameraAvatarIcon width={30} height={30}/>
                        </TouchableOpacity>
                    </View>
                    <Text
                        style={[
                            fs_14_500,
                            text_red,
                            text_center,
                            {
                                marginTop: 5,
                            },
                        ]}
                    >
                        {userData.name} - {userData.code}
                    </Text>

                    <Text
                        style={[
                            fs_14_400,
                            text_center,
                            {
                                marginTop: 3,
                                color: '#8E9294',
                            },
                        ]}
                    >
                        {userData?.position?.name}
                    </Text>

                    <View style={styles.ratingContainer}>
                        <View style={styles.starContainer}>
                            <StarFillIcon width={16} height={16}/>
                            <StarFillIcon width={16} height={16}/>
                            <StarFillIcon width={16} height={16}/>
                            <StarFillIcon width={16} height={16}/>
                            <StarIcon width={16} height={16}/>
                        </View>
                        <Text style={[fs_12_400, text_black, {marginLeft: 10}]}>4.5</Text>
                    </View>

                    <View style={styles.twoBoxContainer}>
                        <View style={styles.box}>
                            <Text style={[fs_12_400, text_gray, text_center]}>
                                Bạn đã gắn bó cùng công ty
                            </Text>
                            <Text style={[fs_25_700, text_black]}>
                                {userData.number_days_with_company}
                            </Text>
                        </View>

                        <View style={styles.box}>
                            <Text style={[fs_12_400, text_gray]}>Lượng tạm tính</Text>
                            <Text style={[fs_25_700, text_black, text_center]}>
                                {(Math.ceil(totalSalary)).toLocaleString()}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider}/>

                    <View>
                        {listMenu.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.rowItem}
                                onPress={() =>
                                    navigation.navigate(item.screen, {
                                        data: userData,
                                    })
                                }
                            >
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <View
                                        style={{
                                            width: 22,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {item.icon}
                                    </View>
                                    <Text style={[fs_14_500, text_black, {marginLeft: 10}]}>
                                        {item.name}
                                    </Text>
                                </View>
                                <ChevronRightProfileIcon width={16} height={16}/>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <PrimaryButton
                        onPress={handleLogout}
                        text={'Đăng xuất'}
                        buttonStyle={styles.buttonStyle}
                    />

                    {/*<PrimaryButton*/}
                    {/*    onPress={handleOpenUpdateLink}*/}
                    {/*    text={'Cập nhật phiên bản mới nhất'}*/}
                    {/*    buttonStyle={styles.buttonStyle}*/}
                    {/*/>*/}
                    <Text style={[fs_12_400, text_gray, text_center, {marginTop: 10}]}>
                        Phiên bản {currentVersion}
                    </Text>
                </ScrollView>
                <UploadAvatarModal
                    visible={isOpenUploadAvatar}
                    setVisible={setIsOpenUploadAvatar}
                    handleUploadAvatar={handleUploadAvatar}
                />

                <LoadingActivity isLoading={isLoading}/>

                <ToastSuccessModal
                    visible={isSuccess}
                    handlePressOk={() => setIsSuccess(false)}
                    description={'Cập nhật avatar thành công'}
                />
            </SafeAreaView>
        )
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fff',
        flex: 1,
        paddingTop: 30,
        paddingBottom: 10,
        position: 'relative',
    },
    backIcon: {
        position: 'absolute',
        top: 20,
        left: 15,
        zIndex: 1,
    },
    buttonStyle: {
        paddingVertical: 12,
        marginHorizontal: 15,
        marginTop: 20,
        borderRadius: 6,
    },
    avatarContainer: {
        borderRadius: 999,
        borderColor: '#787878',
        borderWidth: 4,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: -3,
        right: -3,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 10,
    },
    starContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    twoBoxContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 10,
        gap: 10,
        paddingHorizontal: 15,
    },
    box: {
        width: '48%',
        paddingVertical: 7,
        paddingHorizontal: 3,
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DD0013',
    },
    divider: {
        width: '100%',
        height: 3,
        backgroundColor: '#D9D9D9',
        marginVertical: 20,
    },
    rowItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderTopColor: '#D9D9D9',
        borderTopWidth: 0.5,
        borderBottomColor: '#D9D9D9',
        borderBottomWidth: 0.5,
    },
});
