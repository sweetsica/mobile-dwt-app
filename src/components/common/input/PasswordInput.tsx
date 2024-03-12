import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {
  fs_12_400,
  fs_14_400,
  text_black,
  text_gray,
} from '../../../assets/style.ts';
import PropTypes, {InferProps} from 'prop-types';
import {useState} from 'react';
import FontawesomeIcon from 'react-native-vector-icons/FontAwesome6';

export default function PasswordInput({
  password,
  setPassword,
  errorMsg,
  label,
  placeholder,
    ref
}: InferProps<typeof PasswordInput.propTypes>) {
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={[fs_14_400, text_black]}>{label}</Text>
        <View style={styles.row_center}>
          <TextInput
            placeholder={placeholder || 'Mật khẩu đăng nhập'}
            placeholderTextColor="rgba(0, 0, 0, 0.25)"
            style={[fs_14_400, text_black, styles.input]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={hidePassword}
            ref={ref}
          />
          <Pressable
            onPress={() => setHidePassword(!hidePassword)}
            hitSlop={8}
            style={styles.icon}>
            <FontawesomeIcon
              name={hidePassword ? 'eye-slash' : 'eye'}
              size={16}
              color="#000"
            />
          </Pressable>
        </View>
      </View>
      {errorMsg && (
        <Text style={[text_gray, fs_12_400, styles.error]}>{errorMsg}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    backgroundColor: '#F2F6FF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingTop: 12,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    width: '100%',
  },
  row_center: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    width: '10%',
    alignItems: 'flex-end',
  },
  input: {
    height: 40,
    width: '90%',
  },
  error: {
    marginLeft: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
});

PasswordInput.propTypes = {
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  errorMsg: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  ref: PropTypes.any.isRequired,
};

PasswordInput.defaultProps = {
  label: 'Mật khẩu',
  placeholder: 'Mật khẩu đăng nhập',
};
