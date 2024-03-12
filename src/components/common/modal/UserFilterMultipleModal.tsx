import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import PropTypes, {InferProps} from 'prop-types';
import {ReactNativeModal} from 'react-native-modal';
import {fs_14_700, text_center, text_red} from '../../../assets/style.ts';
import CloseIcon from '../../../assets/img/close-icon.svg';
import {useState} from 'react';
import PrimaryButton from '../../common/button/PrimaryButton.tsx';
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function UserFilterMultipleModal(
    {
        visible,
        setVisible,
        setListCurrentUser,
        listCurrentUser,
        listUser,
        fetchNextPageUser,
        hasNextPageUser,
        isFetchingUser,
    }: InferProps<typeof UserFilterMultipleModal.propTypes>) {
    const [currentFilter, setCurrentFilter] = useState(listCurrentUser ?? []);
    const handleChangeCheck = (value: any) => {
        if (currentFilter?.includes(value)) {
            const newList = currentFilter?.filter((item: any) => item !== value);
            setCurrentFilter(newList);
        } else {
            setCurrentFilter([...currentFilter, value]);
        }
    };
    const handleSaveValue = () => {
        setListCurrentUser(currentFilter);
        setVisible(false);
    };

    const getMoreUser = async () => {
        if (hasNextPageUser && fetchNextPageUser) {
            await fetchNextPageUser();
        }
    }
    return (
        <ReactNativeModal
            animationInTiming={200}
            animationOutTiming={200}
            animationIn={'fadeInUp'}
            animationOut={'fadeOutDown'}
            swipeDirection={'down'}
            backdropTransitionInTiming={200}
            backdropTransitionOutTiming={200}
            style={styles.wrapper}
            isVisible={visible}
            onBackdropPress={() => {
                setVisible(false);
            }}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[fs_14_700, text_red, text_center]}>LỌC NGƯỜI GIAO</Text>
                    <Pressable
                        hitSlop={10}
                        onPress={() => {
                            setVisible(false);
                        }}>
                        <CloseIcon width={20} height={20} style={styles.closeIcon}/>
                    </Pressable>
                </View>

                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: 20,
                        paddingVertical: 15,
                    }}>
                    <FlatList
                        contentContainerStyle={{
                            paddingBottom: 10,
                        }}
                        data={listUser}
                        renderItem={({item}) => {
                            return (
                                <BouncyCheckbox
                                    size={20}
                                    text={item.label}
                                    hitSlop={10}
                                    unfillColor={'#FFFFFF'}
                                    fillColor={'#CA1F24'}
                                    isChecked={currentFilter?.includes(item?.value)}
                                    textStyle={styles.text}
                                    iconStyle={styles.radius}
                                    innerIconStyle={styles.radius}
                                    onPress={() => handleChangeCheck(item)}
                                />
                            );
                        }}
                        keyExtractor={item => item.value}
                        ItemSeparatorComponent={() => <View style={{height: 15}}/>}
                        onEndReachedThreshold={0.5}
                        refreshing={isFetchingUser}
                        ListFooterComponent={
                            isFetchingUser ? (
                                <ActivityIndicator size={'large'} color={'#CA1F24'} />
                            ) : null
                        }
                        onEndReached={getMoreUser}
                    />
                    <PrimaryButton
                        onPress={handleSaveValue}
                        text={'Áp dụng bộ lọc'}
                        buttonStyle={styles.button}
                    />
                </View>
            </View>
        </ReactNativeModal>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: 'rgba(217, 217, 217, 0.75)',
        justifyContent: 'center',
        margin: 0,
    },
    content: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        height: '70%',
    },
    row_center: {
        flexDirection: 'row',
        alignItems: 'center',
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
        gap: 12,
        paddingVertical: 15,
    },
    row_item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 10,
    },
    button: {
        paddingVertical: 12,
        borderRadius: 8,
    },
    text: {
        textDecorationLine: 'none',
        fontSize: 13,
        color: '#000',
    },
    radius: {
        borderRadius: 2,
    },
});

UserFilterMultipleModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
    listCurrentUser: PropTypes.array.isRequired,
    setListCurrentUser: PropTypes.func.isRequired,
    listUser: PropTypes.array.isRequired,
    fetchNextPageUser: PropTypes.func,
    hasNextPageUser: PropTypes.bool,
    isFetchingUser: PropTypes.bool,
};
