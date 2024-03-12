import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {fs_12_500, text_black, text_center} from '../../../assets/style.ts';
import RowTable from './RowTable.tsx';
import PropTypes, {InferProps} from 'prop-types';
import {useCallback, useMemo, useState} from "react";
import {useFocusEffect} from "@react-navigation/native";

export default function PrimaryTable(
    {
        columns,
        data,
        canShowMore,
        headerColor,
        onRowPress,
        isFetchingData,
        getMoreData,
        rowDetailComponent,
    }: InferProps<typeof PrimaryTable.propTypes>) {

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
                                    backgroundColor: headerColor || '#DDE1E6',
                                    height: 'auto',
                                },
                                styles.cell,
                            ]}
                        >
                            <Text style={[fs_12_500, text_black, text_center]}>
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
                    let bgColor = item.bgColor || '#FFF';
                    return (
                        <RowTable
                            item={item}
                            columns={columns}
                            bgColor={bgColor}
                            canShowMore={canShowMore}
                            onRowPress={onRowPress}
                            rowDetailComponent={rowDetailComponent}
                        />
                    );
                }}
                onEndReachedThreshold={0.5}
                onEndReached={getMoreData ? getMoreData : null}
                refreshing={isFetchingData ? isFetchingData : false}
                ListFooterComponent={
                    isFetchingData ? (
                        <ActivityIndicator size={'large'} color={'#CA1F24'}/>
                    ) : null
                }
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
        borderWidth: 0.5,
        borderColor: '#D9D9D9',
    },
    cell: {
        paddingVertical: 8,
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#D9D9D9',
    },
});

PrimaryTable.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    canShowMore: PropTypes.bool,
    headerColor: PropTypes.string,
    onRowPress: PropTypes.func,
    isFetchingData: PropTypes.bool,
    getMoreData: PropTypes.func,
    rowDetailComponent: PropTypes.any,
};

PrimaryTable.defaultProps = {
    canShowMore: false,
    headerColor: '#DCE1E7',
};
