import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import PropTypes, {InferProps} from 'prop-types';
import {ReactNativeModal} from 'react-native-modal';
import {fs_14_700, fs_15_400, fs_15_700, text_black, text_center, text_gray, text_red} from '../../../assets/style.ts';
import CloseIcon from '../../../assets/img/close-icon.svg';
import PrimaryCheckbox from '../checkbox/PrimaryCheckbox.tsx';
import {useState} from 'react';
import PrimaryButton from '../button/PrimaryButton.tsx';
import {
    LIST_ABSENCE_TYPE, LIST_ABSENCE_TYPE_COLOR,
    LIST_WORK_STATUS_FILTER,
    WORK_STATUS_COLOR,
} from '../../../assets/constant.ts';
import dayjs from "dayjs";

export default function CreateNewFactoryReport(
    {
        visible,
        setVisible,
    }: InferProps<typeof CreateNewFactoryReport.propTypes>) {

    const today = dayjs().format('DD/MM/YYYY');
    const [name, setName] = useState('');
    const [target, setTarget] = useState('');
    const [note, setNote] = useState('');
    const handleSave = async () => {

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
            onSwipeComplete={() => {
                setVisible(false);
            }}
            style={styles.wrapper}
            isVisible={visible}
            onBackdropPress={() => {
                setVisible(false);
            }}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[fs_14_700, text_red, text_center]}>BÁO CÁO CÔNG VIỆC</Text>
                    <Pressable
                        hitSlop={10}
                        onPress={() => {
                            setVisible(false);
                        }}>
                        <CloseIcon width={20} height={20} style={styles.closeIcon}/>
                    </Pressable>
                </View>
                <View style={styles.row_container}>
                    <Text style={[fs_15_400, text_center, text_gray]}>Ngày {today}</Text>
                    <View style={styles.inputContainer}>
                        <Text style={[fs_15_700, text_black]}>Tên công việc:</Text>
                        <TextInput
                            style={[styles.input, styles.bgGray]}
                            onChangeText={setName}
                            value={name}
                            editable={false}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={[fs_15_700, text_black]}>Mục tiêu:</Text>
                        <TextInput
                            style={[styles.input, styles.bgGray]}
                            onChangeText={setTarget}
                            value={target}
                            editable={false}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={[fs_15_700, text_black]}>Báo cáo:</Text>
                        <TextInput
                            style={[styles.input]}
                            onChangeText={setNote}
                            value={note}
                            multiline={true}
                        />
                    </View>
                    <PrimaryButton
                        onPress={handleSave}
                        text={'Gửi'}
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
        paddingVertical: 10 ,
        paddingHorizontal: 15,
    },
    button: {
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 30,

    },
    inputContainer: {
        gap: 6,
        marginTop: 20,
    },
    input: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        paddingHorizontal: 10,
        paddingVertical: 7,
    },
    bgGray: {
        backgroundColor: '#F0EEEE'
    }
});

CreateNewFactoryReport.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
};
