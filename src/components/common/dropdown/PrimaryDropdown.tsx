import { Dropdown } from 'react-native-element-dropdown';
import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';
import { fs_15_400, text_black } from '../../../assets/style.ts';

export default function PrimaryDropdown({
  data,
  value,
  changeValue,
  dropdownStyle,
  placeholder,
  isSearch,
  textStyle,
}: InferProps<typeof PrimaryDropdown.propTypes>) {
  return (
    <Dropdown
      style={[dropdownStyle]}
      itemTextStyle={[text_black, fs_15_400]}
      selectedTextStyle={[text_black, fs_15_400, styles.pl3, { ...textStyle }]}
      data={data}
      labelField="label"
      valueField="value"
      value={value}
      maxHeight={200}
      onChange={(item) => {
        changeValue(item.value);
      }}
      search={isSearch || false}
      inputSearchStyle={[text_black, fs_15_400]}
      searchPlaceholder={'Tìm kiếm'}
      placeholder={placeholder || 'Chọn'}
      placeholderStyle={[text_black, fs_15_400]}
    />
  );
}

const styles = StyleSheet.create({
  pl3: {
    paddingLeft: 3,
  },
});

PrimaryDropdown.propTypes = {
  data: PropTypes.array.isRequired,
  value: PropTypes.any.isRequired,
  changeValue: PropTypes.func.isRequired,
  dropdownStyle: PropTypes.any,
  placeholder: PropTypes.string,
  isSearch: PropTypes.bool,
  textStyle: PropTypes.any,
};

PrimaryDropdown.defaultProps = {
  isSearch: true,
};
