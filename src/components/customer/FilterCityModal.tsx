import {
    FlatList,
    Pressable,
    ScrollView,
    StyleSheet,
    Text, TextInput,
    View,
} from 'react-native';
import PropTypes, {InferProps} from 'prop-types';
import {ReactNativeModal} from 'react-native-modal';
import {fs_14_700, text_center, text_red} from '../../assets/style.ts';
import CloseIcon from '../../assets/img/close-icon.svg';
import PrimaryCheckbox from '../common/checkbox/PrimaryCheckbox.tsx';
import {useEffect, useState} from 'react';
import PrimaryButton from '../common/button/PrimaryButton.tsx';
import {LIST_CITY_VN} from "../../assets/ListCityVN.ts";
import SearchIcon from "../../assets/img/search-icon.svg";

export default function FilterCityModal(
    {
        visible,
        setVisible,
        setCurrentCity,
        currentCity,
    }: InferProps<typeof FilterCityModal.propTypes>) {
    const [currentFilter, setCurrentFilter] = useState(currentCity.code);
    const [listCity, setListCity] = useState(LIST_CITY_VN);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        if (searchValue) {
            setListCity(LIST_CITY_VN.filter((item: any) => {
                return item.name.toLowerCase().includes(searchValue.toLowerCase());
            }));
        } else {
            setListCity(LIST_CITY_VN);
        }
    }, [searchValue]);

    const handleChangeCheck = (value: any) => {
        setCurrentFilter(value);
    };
    const handleSaveValue = () => {
        setCurrentCity(
            listCity.find(
                (item: any) => item.code === currentFilter
            )
        );
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
            }}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[fs_14_700, text_red, text_center]}>TỈNH/ THÀNH PHỐ</Text>
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
                            style={{padding: 0, width: '80%'}}
                            value={searchValue}
                            onChangeText={setSearchValue}
                        />
                    </View>
                    <FlatList
                        contentContainerStyle={{
                            paddingBottom: 10,
                        }}
                        data={[{
                            name: 'Tất cả',
                            code: 0,
                        }, ...listCity]}
                        renderItem={({item}) => {
                            return (
                                <PrimaryCheckbox
                                    label={item.name}
                                    checked={currentFilter === item.code}
                                    onChange={() => handleChangeCheck(item.code)}
                                />
                            );
                        }}
                        keyExtractor={(item: any) => item.code}
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

FilterCityModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
    setCurrentCity: PropTypes.func.isRequired,
    currentCity: PropTypes.any.isRequired,
};
