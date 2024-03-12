import PrimaryDropdown from "../common/dropdown/PrimaryDropdown.tsx";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {fs_15_400, fs_15_700, text_black} from "../../assets/style.ts";
import {GestureHandlerRootView, RectButton, Swipeable} from "react-native-gesture-handler";
import {useRef} from "react";
import TrashWhiteIcon from "../../assets/img/trash-white.svg";

export default function MechanicTargetItem(
    {
        item,
        index,
        listMechanicTargetData,
        listMechanicTarget,
        setListMechanicTarget
    }: any) {
    const swipeRef = useRef<Swipeable>(null);

    const onDelete = () => {
        const newList = [...listMechanicTarget];
        newList.splice(index, 1);
        setListMechanicTarget(newList);
    }
    const renderRightAction = () => {
        return (
            <RectButton
                style={styles.rightAction}
                onPress={() => {
                    onDelete();
                    swipeRef.current?.close();
                }}>
                <TouchableOpacity>
                    <TrashWhiteIcon />
                </TouchableOpacity>
            </RectButton>
        )
    }

    return (
        <GestureHandlerRootView>
            <Swipeable
                renderRightActions={renderRightAction}
                ref={swipeRef}>
                <View
                    style={{
                        borderTopWidth: 1,
                        borderTopColor: '#D9D9D9',
                        paddingVertical: 12,
                        paddingHorizontal: 15,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottomColor: '#D9D9D9',
                        borderBottomWidth: index === listMechanicTarget.length - 1 ? 1 : 0,
                    }}
                >
                    <PrimaryDropdown
                        data={
                            listMechanicTargetData.map((item: any) => {
                                return {
                                    label: item.name,
                                    value: item.id,
                                };
                            })
                        }
                        placeholder={'Kết quả HT'}
                        value={listMechanicTarget[index].targetId}
                        changeValue={(value) => {
                            const newList = [...listMechanicTarget];
                            const mechanicTargetFound = listMechanicTargetData.find((item: any) => item.id === value);
                            newList[index].targetId = value;
                            newList[index].unit = mechanicTargetFound?.unit_name;
                            newList[index].targetKpi = +mechanicTargetFound?.kpi;
                            setListMechanicTarget(newList);
                        }}
                        dropdownStyle={{
                            ...styles.dropdownStyle,
                            width: 170,
                        }}
                        isSearch={true}
                    />
                    <Text style={[fs_15_400, text_black]}>{listMechanicTarget[index]?.unit}</Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                width: 50,
                                color: '#000',
                            },
                        ]}
                        value={listMechanicTarget[index].targetAmount}
                        onChangeText={(value) => {
                            const newList = [...listMechanicTarget];
                            const kpi = listMechanicTargetData.find((item: any) => item.id === listMechanicTarget[index].targetId)?.kpi;
                            newList[index].targetAmount = value;
                            setListMechanicTarget(newList);
                        }}
                        keyboardType={'numeric'}
                        inputMode={'numeric'}
                        placeholder={'SL'}
                    />
                    <Text
                        style={[
                            fs_15_400,
                            text_black,
                            {
                                width: 80,
                            },
                        ]}
                    >
                        {
                            `= ${(+listMechanicTarget[index].targetAmount * +listMechanicTarget[index].targetKpi).toFixed(3)} kpi`
                        }
                    </Text>
                </View>
            </Swipeable>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    input: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        paddingHorizontal: 10,
        paddingVertical: 7,
        color: '#000',
    },
    bgGray: {
        backgroundColor: '#F0EEEE',
    },
    dropdownStyle: {
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 3,
    },
    rightAction: {
        backgroundColor: '#BC2426',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
});