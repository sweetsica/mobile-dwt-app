import {
  Pressable,
  StyleSheet,
  Animated,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useState} from 'react';
import {fs_14_700, text_red, text_white} from '../../../assets/style.ts';
import {useConnection} from "../../../redux/connection";

export default function AdminTabBlock({
  firstLabel,
  secondLabel,
}: any) {
  const {
    connection: {userInfo, currentTabManager},
    onSetCurrentTabManager,
  } = useConnection();
  return (userInfo?.role === 'admin' || userInfo?.role === 'manager') ? (
    <View style={styles.wrapper}>
      <View style={[styles.toggleContainer]}>
        <TouchableOpacity
          onPress={() => {
            onSetCurrentTabManager(0);
          }}
          style={[styles.toggleCircle, currentTabManager === 0 && styles.selected]}>
          <Text
            style={[
              fs_14_700,
              currentTabManager === 0 ? text_red : text_white,
              {textTransform: 'uppercase'},
            ]}>
            {firstLabel || 'CÁ NHÂN'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            onSetCurrentTabManager(1);
          }}
          style={[styles.toggleCircle, currentTabManager === 1 && styles.selected]}>
          <Text
            style={[
              fs_14_700,
              currentTabManager === 1 ? text_red : text_white,
              {textTransform: 'uppercase'},
            ]}>
            {secondLabel || 'QUẢN LÝ'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  ) : null
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#DD0013',
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    height: 60,
  },
  toggleContainer: {
    width: '50%',
    borderRadius: 50,
    backgroundColor: 'rgba(175, 42, 53, 0.68)',
    padding: 3,
    flexDirection: 'row',
    overflow: 'hidden',
    height: 'auto',
    flex: 1,
  },
  toggleCircle: {
    borderRadius: 50,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.5,
  },
  selected: {
    backgroundColor: '#fff',
  },
});
