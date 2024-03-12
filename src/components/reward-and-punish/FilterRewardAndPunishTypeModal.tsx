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
import {useState} from 'react';
import PrimaryButton from '../common/button/PrimaryButton.tsx';
import {LIST_CUSTOMER_TYPE_FILTER, LIST_REWARD_AND_PUNISHMENT_TYPE} from "../../assets/constant.ts";


export default function FilterRewardAndPunishTypeModal(
    {
        visible,
        setVisible,
        setStatusValue,
        statusValue,
    }: InferProps<typeof FilterRewardAndPunishTypeModal.propTypes>) {
    const [currentFilter, setCurrentFilter] = useState(statusValue.value);

    const handleChangeCheck = (value: any) => {
        setCurrentFilter(value);
    };
    const handleSaveValue = () => {
        setStatusValue(
            LIST_REWARD_AND_PUNISHMENT_TYPE.find(
                (item: any) => item.value === currentFilter
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
                    <Text style={[fs_14_700, text_red, text_center]}>LOẠI KHEN THƯỞNG & XỬ PHẠT</Text>
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
                        data={LIST_REWARD_AND_PUNISHMENT_TYPE}
                        renderItem={({item}) => {
                            return (
                                <PrimaryCheckbox
                                    label={item.label}
                                    checked={currentFilter === item.value}
                                    onChange={() => handleChangeCheck(item.value)}
                                />
                            );
                        }}
                        keyExtractor={(item: any) => item.value}
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
        height: '50%',
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
});

FilterRewardAndPunishTypeModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
    setStatusValue: PropTypes.func.isRequired,
    statusValue: PropTypes.any.isRequired,
};
