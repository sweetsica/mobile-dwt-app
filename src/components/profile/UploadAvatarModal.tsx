import {
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import PropTypes, {InferProps} from 'prop-types';
import {PresentationStyle, ReactNativeModal} from 'react-native-modal';
import {
    fs_14_700,
    fs_15_400,
    text_black,
    text_center,
    text_red,
} from '../../assets/style.ts';
import CloseIcon from '../../assets/img/close-icon.svg';
import GaleryIcon from '../../assets/img/galery-icon.svg';
import CameraIcon from '../../assets/img/camera-icon.svg';
import {
    launchCamera,
    launchImageLibrary,
    MediaType,
} from 'react-native-image-picker';
import {Camera, useCameraDevice} from "react-native-vision-camera";
import {useRef, useState} from "react";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";

const {width: windowWidth} = Dimensions.get('window');

export default function UploadAvatarModal({
                                              visible,
                                              setVisible,
                                              handleUploadAvatar,
                                          }: InferProps<typeof UploadAvatarModal.propTypes>) {

    const device = useCameraDevice('back')

    const camera = useRef<Camera>(null)
    const [isActiveCamera, setIsActiveCamera] = useState(false)

    const handleSelectImage = async () => {
        const options = {
            mediaType: 'photo' as MediaType,
            includeBase64: false,
            presentationStyle: 'fullScreen' as PresentationStyle,
        };

        const result: any = await launchImageLibrary(options);
        if (!result?.didCancel) {
            handleUploadAvatar(
                result?.assets.map((image: any) => {
                    return {
                        ...image,
                        name: image.fileName,
                        size: image.fileSize,
                    };
                }),
            );
        }
    };

    const handleOpenCamera = async () => {
        const hasCameraPermission = await Camera.requestCameraPermission()
        if (!hasCameraPermission) {
            return
        }
        setIsActiveCamera(true)
    };

    const handleTakePhoto = async () => {
        const photo: any = await camera.current?.takePhoto({
            qualityPrioritization: 'balanced',
            flash: 'auto',
        })
        if (photo) {
            const now = new Date().getTime()
            handleUploadAvatar([{
                uri: 'file://' + photo?.path,
                name: 'avatar' + now + '.jpg',
                type: 'image/jpeg',
            }])
        }
        setIsActiveCamera(false)
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
                    <Text style={[fs_14_700, text_red, text_center]}>ĐÍNH KÈM</Text>
                    <Pressable
                        hitSlop={10}
                        onPress={() => {
                            setVisible(false);
                        }}>
                        <CloseIcon width={20} height={20} style={styles.closeIcon}/>
                    </Pressable>
                </View>
                <View style={styles.body}>
                    <TouchableOpacity style={styles.row} onPress={handleSelectImage}>
                        <GaleryIcon width={24} height={24}/>
                        <Text style={[fs_15_400, text_black]}>Chọn ảnh</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.row} onPress={handleOpenCamera}>
                        <CameraIcon width={24} height={24}/>
                        <Text style={[fs_15_400, text_black]}>Sử dụng máy ảnh</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {
                isActiveCamera && (
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'black',
                            ...StyleSheet.absoluteFillObject,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Camera
                            ref={camera}
                            photo={true}
                            // @ts-ignore
                            device={
                                device
                            }
                            isActive={true}
                            style={{
                                width: windowWidth - 50,
                                height: windowWidth - 50,
                                borderRadius: 999,
                            }}
                        />
                        <Pressable
                            hitSlop={10}
                            style={styles.closeCameraIcon}
                            onPress={() => {
                                setIsActiveCamera(false);
                            }}>
                            <FontAwesome6Icon name={'xmark'} color={'#FFF'} size={20}/>
                        </Pressable>
                        <TouchableOpacity style={styles.buttonCamera} onPress={handleTakePhoto}>
                            <FontAwesome6Icon name={'camera'} size={24} color={'white'}/>
                        </TouchableOpacity>
                    </View>
                )
            }
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
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
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
    body: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        gap: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    buttonCamera: {
        borderRadius: 999,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#fff',
        padding: 10,
        width: 50,
        height: 50,
        position: 'absolute',
        bottom: 30,
        left: windowWidth / 2 - 25,
    },
    closeCameraIcon: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
});

UploadAvatarModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
    handleUploadAvatar: PropTypes.func.isRequired,
};
