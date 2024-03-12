import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  fs_14_400,
  text_black,
  text_center,
  text_red,
} from '../../assets/style.ts';
import PropTypes, {InferProps} from 'prop-types';

export default function TabBlock({
  currentTab,
  setCurrentTab,
}: InferProps<typeof TabBlock.propTypes>) {
  const listTab = ['Văn phòng', 'Kinh doanh', 'Sản xuất', 'Kho vận', 'HCNS'];
  return (
    <View>
      <ScrollView
        style={styles.wrapper}
        contentContainerStyle={{height: 40}}
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
        {listTab.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={[styles.item, currentTab === index && styles.item_active]}
              onPress={() => {
                setCurrentTab(index);
              }}>
              <Text
                style={[
                  fs_14_400,
                  text_center,
                  currentTab === index ? text_red : text_black,
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: '#FFF',
    flexDirection: 'row',
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
    borderTopColor: '#D9D9D9',
    borderTopWidth: 1,
  },
  item: {
    width: 100,
    justifyContent: 'center',
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
