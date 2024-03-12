import {StyleSheet, Text, View} from 'react-native';
import {fs_10_400, text_black} from '../../../assets/style.ts';
import PropTypes, {InferProps} from 'prop-types';

export default function RowSummaryItem({
  text,
  value,
}: InferProps<typeof RowSummaryItem.propTypes>) {
  return (
    <View style={styles.row}>
      <Text style={[fs_10_400, text_black, styles.title]}>{text}</Text>
      <Text style={[fs_10_400, text_black, styles.text]}>
        {Number(value).toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    width: '80%',
  },
  text: {
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

RowSummaryItem.propTypes = {
  text: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
