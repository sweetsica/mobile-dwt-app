import {ActivityIndicator, Pressable, StyleSheet, Text, View} from "react-native";
import {fs_14_700, text_center, text_red} from "../../../assets/style.ts";
import CloseIcon from "../../../assets/img/close-icon.svg";
import {ReactNativeModal} from "react-native-modal";
import WebView from "react-native-webview";
import PropTypes, {InferProps} from "prop-types";
import {useState} from "react";

export default function FileWebviewModal(
    {
        visible,
        setVisible,
        listFileUrl
    }: InferProps<typeof FileWebviewModal.propTypes>) {
    const [onLoad, setOnLoad] = useState(false)
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
                    <Text style={[fs_14_700, text_red, text_center]}>ĐÍNH KÈM</Text>
                    <Pressable
                        hitSlop={10}
                        onPress={() => {
                            setVisible(false);
                        }}>
                        <CloseIcon width={20} height={20} style={styles.closeIcon}/>
                    </Pressable>
                </View>
                {
                    onLoad && (
                        <View style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1,
                            backgroundColor: 'rgba(0,0,0,0.5)'
                        }}>
                            <ActivityIndicator size={'large'} color={'#CA1F24'}/>
                        </View>
                    )
                }
                <WebView
                    source={{uri: listFileUrl[0]}}
                    style={{flex: 1}}
                    onLoadStart={() => setOnLoad(true)}
                    onLoadEnd={() => setOnLoad(false)}
                />
            </View>
        </ReactNativeModal>
    )
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
        flex: 1,
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
})

FileWebviewModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
    listFileUrl: PropTypes.array.isRequired,
}