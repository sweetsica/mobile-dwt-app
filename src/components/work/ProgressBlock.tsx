import {StyleSheet, Text, View} from 'react-native';
import {fs_14_400, row_between, text_black} from '../../assets/style.ts';
import Svg, {Rect} from 'react-native-svg';
import PropTypes, {InferProps} from 'prop-types';

export default function ProgressBlock({
  totalKeyWork,
  totalNonKeyWork,
  totalAriseWork,
  totalKeyWorkCompleted,
  totalNonKeyWorkCompleted,
  totalAriseWorkCompleted,
}: InferProps<typeof ProgressBlock.propTypes>) {
  return (
    <View style={styles.wrapper}>
      <View style={[row_between]}>
        <View style={styles.row_left}>
          <Text style={[fs_14_400, text_black]}>Key</Text>
          <View style={[styles.chart, {height: 6}]}>
            <Svg width={'100%'} height={6}>
              <Rect x="0" y="0" width={'100%'} height={6} fill={'#F1F1F1'} />
              <Rect
                x="0"
                y="0"
                width={(totalKeyWorkCompleted / totalKeyWork) * 100 + '%'}
                height={6}
                fill={'#FF8926'}
              />
            </Svg>
          </View>
        </View>
        <Text style={styles.text}>{totalKeyWork}</Text>
      </View>

      <View style={[row_between]}>
        <View style={styles.row_left}>
          <Text style={[fs_14_400, text_black]}>NonKey</Text>
          <View style={[styles.chart, {height: 6}]}>
            <Svg width={'100%'} height={6}>
              <Rect x="0" y="0" width={'100%'} height={6} fill={'#F1F1F1'} />
              <Rect
                x="0"
                y="0"
                width={(totalNonKeyWorkCompleted / totalNonKeyWork) * 100 + '%'}
                height={6}
                fill={'#00C644'}
              />
            </Svg>
          </View>
        </View>
        <Text style={styles.text}>{totalNonKeyWork}</Text>
      </View>

      <View style={[row_between]}>
        <View style={styles.row_left}>
          <Text style={[fs_14_400, text_black]}>Phát sinh</Text>
          <View style={[styles.chart, {height: 6}]}>
            <Svg width={'100%'} height={6}>
              <Rect x="0" y="0" width={'100%'} height={6} fill={'#F1F1F1'} />
              <Rect
                x="0"
                y="0"
                width={(totalAriseWorkCompleted / totalAriseWork) * 100 + '%'}
                height={6}
                fill={'#5EA8EE'}
              />
            </Svg>
          </View>
        </View>
        <Text style={styles.text}>{totalAriseWork}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: '#FFF',
    paddingTop: 7,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 7,
    gap: 10,
  },
  row_left: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    width: '90%',
  },
  chart: {
    width: '70%',
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: '#696969',
  },
});

ProgressBlock.propTypes = {
  totalKeyWork: PropTypes.number.isRequired,
  totalNonKeyWork: PropTypes.number.isRequired,
  totalAriseWork: PropTypes.number.isRequired,
  totalKeyWorkCompleted: PropTypes.number.isRequired,
  totalNonKeyWorkCompleted: PropTypes.number.isRequired,
  totalAriseWorkCompleted: PropTypes.number.isRequired,
};
