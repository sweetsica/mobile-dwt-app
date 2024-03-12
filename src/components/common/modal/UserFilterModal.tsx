import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text, TextInput,
    View,
} from 'react-native';
import PropTypes, {InferProps} from 'prop-types';
import {ReactNativeModal} from 'react-native-modal';
import {fs_14_700, text_center, text_red} from '../../../assets/style.ts';
import CloseIcon from '../../../assets/img/close-icon.svg';
import {useEffect, useState} from 'react';
import PrimaryButton from '../../common/button/PrimaryButton.tsx';
import PrimaryCheckbox from "../checkbox/PrimaryCheckbox.tsx";
import SearchIcon from "../../../assets/img/search-icon.svg";
import {LIST_CITY_VN} from "../../../assets/ListCityVN.ts";

export default function UserFilterModal(
    {
        visible,
        setVisible,
        currentUser,
        setCurrentUser,
        listUser,
        searchValue,
        setSearchValue,
    }: InferProps<typeof UserFilterModal.propTypes>) {
    const [currentFilter, setCurrentFilter] = useState(currentUser);

    const handleChangeCheck = (value: any) => {
        setCurrentFilter(value);
    };

    const handleSaveValue = () => {
        setCurrentUser(currentFilter);
        setSearchValue('')
        setVisible(false);
    };
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
                setSearchValue('')
            }}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[fs_14_700, text_red, text_center]}>LỌC NHÂN SỰ</Text>
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
                    <View
                        style={styles.input}>
                        <SearchIcon width={20} height={20}/>
                        <TextInput
                            style={{padding: 0, width: '80%', color: '#000'}}
                            value={searchValue}
                            onChangeText={setSearchValue}
                            placeholder={'Tìm kiếm'}
                        />
                    </View>
                    <FlatList
                        contentContainerStyle={{
                            paddingBottom: 10,
                        }}
                        data={listUser}
                        renderItem={({item}) => {
                            return (
                                <PrimaryCheckbox
                                    label={item.label}
                                    checked={currentFilter.value === item.value}
                                    onChange={() => handleChangeCheck(item)}
                                />
                            );
                        }}
                        keyExtractor={item => item.value}
                        ItemSeparatorComponent={() => <View style={{height: 15}}/>}
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
    input: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        marginBottom: 10,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
    }
});

UserFilterModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
    currentUser: PropTypes.any.isRequired,
    setCurrentUser: PropTypes.func.isRequired,
    listUser: PropTypes.array.isRequired,
    searchValue: PropTypes.string.isRequired,
    setSearchValue: PropTypes.func.isRequired,
};
