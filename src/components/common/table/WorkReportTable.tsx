import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {
  fs_12_400,
  fs_12_700,
  text_black,
  text_center,
} from '../../../assets/style.ts';
import PropTypes, {InferProps} from 'prop-types';

export default function WorkReportTable({
  columns,
  data,
    onCellPress,
}: InferProps<typeof WorkReportTable.propTypes>) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {columns.map((column: any, index: any) => {
          return (
            <View
              key={index}
              style={[
                {
                  flex: column.width,
                  backgroundColor: '#FFF',
                  height: 'auto',
                },
                styles.cell,
              ]}>
              <Text style={[fs_12_700, text_black, text_center]}>
                {column.title}
              </Text>
            </View>
          );
        })}
      </View>
      <FlatList
        scrollEnabled={false}
        data={data}
        renderItem={({item}) => {
          return (
            <View style={[styles.row]}>
              {columns.map((column: any, index: any) => {
                return (
                  <Pressable
                    key={index}
                    onPress={() => {
                        if (onCellPress) {
                            onCellPress(item);
                        }
                    }}
                    style={[
                      {
                        flex: column.width,
                        backgroundColor: '#FFF',
                        height: 'auto',
                      },
                      styles.cell,
                    ]}>
                    <Text style={[fs_12_400, text_black, text_center]}>
                      {item[column.key]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    paddingVertical: 7,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    paddingHorizontal: 3,
  },
});

WorkReportTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  canShowMore: PropTypes.bool,
    onCellPress: PropTypes.func,
};
