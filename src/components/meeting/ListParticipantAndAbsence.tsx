import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import PrimaryTable from "../common/table/PrimaryTable.tsx";
import {fs_15_700, row_between, text_red} from "../../assets/style.ts";
import ChevronUpIcon from "../../assets/img/chevron-up.svg";
import ChevronDownIcon from "../../assets/img/chevron-down.svg";
import {useState} from "react";

export default function ListParticipantAndAbsence({listParticipant, listAbsence, headerTitle}: any) {
    const [isMore, setIsMore] = useState<boolean>(true);
    return (
        <View style={styles.wrapper}>
            <View style={row_between}>
                <Text style={[fs_15_700, text_red]}>{headerTitle}</Text>
                <TouchableOpacity
                    onPress={() => {
                        setIsMore(!isMore);
                    }}
                    hitSlop={10}
                >
                    {isMore ? <ChevronUpIcon/> : <ChevronDownIcon/>}
                </TouchableOpacity>
            </View>
            {
                isMore && (
                    <PrimaryTable
                        data={[
                            {
                                participant: listParticipant.join(', '),
                                late: listAbsence.join(', '),
                            }
                        ]}
                        columns={[
                            {
                                key: 'participant',
                                title: 'Tham gia',
                                width: 0.5,
                            },
                            {
                                key: 'late',
                                title: 'Vắng',
                                width: 0.5,
                            },
                        ]}
                        headerColor={'#FFF'}
                    />
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#F3F4F4',
        gap: 10,
    },
});