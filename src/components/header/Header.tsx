import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ChevronLeftIcon from '../../assets/img/chevron-left-dark.svg';
import PropTypes, { InferProps } from 'prop-types';
import { fs_15_700, text_black, text_center } from '../../assets/style.ts';

export default function Header({
  title,
  handleGoBack,
  rightView,
}: InferProps<typeof Header.propTypes>) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.backIcon}
        hitSlop={10}
        onPress={() => {
          if (handleGoBack) {
            handleGoBack();
          }
        }}
      >
        <ChevronLeftIcon width={16} height={16} />
      </TouchableOpacity>
      <Text
        style={[
          fs_15_700,
          text_black,
          text_center,
          { width: '60%', textTransform: 'uppercase' },
        ]}
      >
        {title}
      </Text>
      {rightView ? (
        <View style={styles.rightIcon}>{rightView}</View>
      ) : (
        <View style={styles.rightIcon} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  backIcon: {
    width: '20%',
    alignItems: 'flex-start',
    zIndex: 1,
  },
  rightIcon: {
    width: '20%',
    alignItems: 'flex-end',
  },
});

Header.propTypes = {
  title: PropTypes.string.isRequired,
  handleGoBack: PropTypes.func,
  rightView: PropTypes.element,
};
