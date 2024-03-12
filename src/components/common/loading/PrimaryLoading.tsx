import {SafeAreaView} from 'react-native-safe-area-context';
import {ActivityIndicator, StyleSheet} from 'react-native';
export default function PrimaryLoading() {
  return (
    <SafeAreaView style={styles.wrapper}>
      <ActivityIndicator size="large" color="#DC3545" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
