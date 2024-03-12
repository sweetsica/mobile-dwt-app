import {fs_15_700, text_black} from '../../../assets/style.ts';
import {StyleSheet, Text} from 'react-native';
import PropTypes, {InferProps} from 'prop-types';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function NoDataScreen({
  text,
}: InferProps<typeof NoDataScreen.propTypes>) {
  return (
    <SafeAreaView style={styles.wrapper}>
      <Text style={[fs_15_700, text_black]}>{text}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

NoDataScreen.propTypes = {
  text: PropTypes.any.isRequired,
};
