import {Image, Pressable, StyleSheet, TouchableOpacity, View} from 'react-native';
import SmallLogo from '../../assets/img/small-logo.svg';
import SearchIcon from '../../assets/img/search-icon.svg';
import NotiIcon from '../../assets/img/noti-icon.svg';
import AvatarIcon from '../../assets/img/avatar.svg';
import {useConnection} from '../../redux/connection';

export default function HomeHeader({navigation}: any) {
    const {
        connection: {userInfo},
    } = useConnection();
    return (
        <View style={styles.wrapper}>
            <Pressable onPress={() => {
                navigation.navigate('Home');
            }}>
                <SmallLogo width={140} height={60}/>
            </Pressable>
            <View style={styles.row}>
                <TouchableOpacity style={styles.iconButton}>
                    <SearchIcon width={20} height={20}/>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => {
                        navigation.navigate('News');
                    }}
                >
                    <NotiIcon width={20} height={20}/>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        width: 35,
                        height: 35,
                        borderRadius: 999,
                    }}
                    onPress={() => {
                        navigation.navigate('Profile');
                    }}
                >
                    {userInfo?.avatar ? (
                        <Image
                            source={{uri: userInfo?.avatar}}
                            width={35}
                            height={35}
                            borderRadius={999}
                        />
                    ) : (
                        <AvatarIcon width={35} height={35}/>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#DADADA',
        borderBottomWidth: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    iconButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 35,
        height: 35,
        borderRadius: 999,
        backgroundColor: '#F5F5F5',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
});
