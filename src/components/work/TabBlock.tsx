import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  fs_14_400,
  text_black,
  text_center,
  text_red,
} from '../../assets/style.ts';
import PropTypes, { InferProps } from 'prop-types';

export default function TabBlock({
  currentTab,
  setCurrentTab,
}: InferProps<typeof TabBlock.propTypes>) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[styles.item, currentTab === 0 && styles.item_active]}
        onPress={() => {
          setCurrentTab(0);
        }}
      >
        <Text
          style={[
            fs_14_400,
            text_center,
            currentTab === 0 ? text_red : text_black,
          ]}
        >
          {'Key'}
        </Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity
        style={[styles.item, currentTab === 1 && styles.item_active]}
        onPress={() => {
          setCurrentTab(1);
        }}
      >
        <Text
          style={[
            fs_14_400,
            text_center,
            currentTab === 1 ? text_red : text_black,
          ]}
        >
          {'NonKey'}
        </Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity
        style={[styles.item, currentTab === 2 && styles.item_active]}
        onPress={() => {
          setCurrentTab(2);
        }}
      >
        <Text
          style={[
            fs_14_400,
            text_center,
            currentTab === 2 ? text_red : text_black,
          ]}
        >
          {'Phát sinh'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: '#FFF',
    flexDirection: 'row',
  },
  item: {
    flex: 1 / 3,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
  },
  divider: {
    width: 1,
    height: '70%',
    alignSelf: 'center',
    backgroundColor: '#D9D9D9',
  },
  item_active: {
    borderBottomWidth: 3,
    borderBottomColor: '#D20019',
  },
});

TabBlock.propTypes = {
  currentTab: PropTypes.number.isRequired,
  setCurrentTab: PropTypes.func.isRequired,
};
