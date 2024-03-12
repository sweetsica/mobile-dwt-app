import PropTypes, {InferProps} from 'prop-types';
import {
  Pressable,
  ActivityIndicator,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import {fs_14_700} from '../../../assets/style.ts';

export default function PrimaryButton({
  text,
  onPress,
  disabled,
  icon,
  loading,
  buttonStyle,
  bgColor,
  textColor,
  borderColor,
}: InferProps<typeof PrimaryButton.propTypes>) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({pressed}) => [
        {
          opacity: pressed ? 0.5 : 1,
          backgroundColor: bgColor || '#CD001E',
          borderColor: borderColor || '#D9D9D9',
          borderWidth: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
        },
        buttonStyle,
      ]}>
      {loading ? (
        <ActivityIndicator color={textColor || '#fff'} style={styles.icon} />
      ) : icon ? (
        <Pressable style={styles.icon}>{icon}</Pressable>
      ) : (
        <View style={styles.icon} />
      )}
      <Text style={[fs_14_700, {color: textColor || '#fff'}]}>{text}</Text>
      <View style={styles.icon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 16,
    height: 16,
  },
});

PrimaryButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  icon: PropTypes.element,
  loading: PropTypes.bool,
  buttonStyle: PropTypes.object,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  borderColor: PropTypes.string,
};

PrimaryButton.defaultProps = {
  disabled: false,
  loading: false,
  bgColor: '#CD001E',
  textColor: '#fff',
  borderColor: '#D9D9D9',
  buttonStyle: {
    paddingVertical: 12,
  },
};
