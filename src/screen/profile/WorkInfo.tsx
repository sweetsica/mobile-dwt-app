import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/header/Header.tsx';

export default function WorkInfo({navigation}: any) {
  return (
    <SafeAreaView style={styles.wrapper}>
      <Header
        title={'Quá trình công tác'}
        handleGoBack={() => navigation.goBack()}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
