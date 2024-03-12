import { ActivityIndicator, StyleSheet, View } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';
export default function LoadingActivity({ isLoading }: InferProps<typeof LoadingActivity.propTypes>) {
  return (
    isLoading ? (
      <View style={styles.wrapper}>
        <ActivityIndicator size="large" color="#DC3545" />
      </View>
    ) : null
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 999,
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    opacity: 0.5,
  },
});

LoadingActivity.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
