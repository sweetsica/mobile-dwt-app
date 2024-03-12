import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  bg_blue,
  bg_green,
  bg_red,
  bg_yellow,
  fs_8_700,
  text_center,
  text_white,
} from '../../../assets/style.ts';
import PropTypes, { InferProps } from 'prop-types';
import { useMemo } from 'react';
import {useNavigation} from "@react-navigation/native";

export default function BehaviorBlock({
  rewardAndPunishData,
  workSummary,
  type,
}: InferProps<typeof BehaviorBlock.propTypes>) {
  const navigation = useNavigation();
  const totalRewardAndPunish = useMemo(() => {
    return (
      rewardAndPunishData.rewardsTotal +
      rewardAndPunishData.punishmentTotal +
      rewardAndPunishData.reminderTotal
    );
  }, [rewardAndPunishData]);
  return (
    <TouchableOpacity style={styles.wrapper} onPress={() => {
        // @ts-ignore
        navigation.navigate('RewardAndPunishInfo')
    }}>
      {workSummary &&
        type !== 'factory' &&
        (workSummary.total > 0 ? (
          <View style={styles.chart}>
            <View
              style={[
                type === 'business' ? bg_green : bg_blue,
                styles.chartItem,
                { flex: workSummary.done / workSummary.total },
              ]}
            >
              <Text style={[fs_8_700, text_white, text_center]}>
                {workSummary.done} HT
              </Text>
            </View>

            <View
              style={[
                bg_yellow,
                styles.chartItem,
                { flex: workSummary.working / workSummary.total },
              ]}
            >
              <Text style={[fs_8_700, text_white, text_center]}>
                {workSummary.working} DL
              </Text>
            </View>

            <View
              style={[
                bg_red,
                styles.chartItem,
                { flex: workSummary.late / workSummary.total },
              ]}
            >
              <Text style={[fs_8_700, text_white, text_center]}>
                {workSummary.late} T
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.chart}>
            <View
              style={[
                type === 'business' ? bg_green : bg_blue,
                styles.chartItem,
                { flex: 1 / 3 },
              ]}
            >
              <Text style={[fs_8_700, text_white, text_center]}>0 HT</Text>
            </View>

            <View style={[bg_yellow, styles.chartItem, { flex: 1 / 3 }]}>
              <Text style={[fs_8_700, text_white, text_center]}>0 DL</Text>
            </View>

            <View style={[bg_red, styles.chartItem, { flex: 1 / 3 }]}>
              <Text style={[fs_8_700, text_white, text_center]}>0 T</Text>
            </View>
          </View>
        ))}

      {totalRewardAndPunish > 0 ? (
        <View style={styles.chart}>
          <View
            style={[
              type === 'business' ? bg_green : bg_blue,
              styles.chartItem,
              {
                flex: rewardAndPunishData.rewardsTotal / totalRewardAndPunish,
              },
            ]}
          >
            <Text style={[fs_8_700, text_white, text_center]}>
              Khen: {rewardAndPunishData.rewardsTotal}
            </Text>
          </View>

          <View
            style={[
              bg_yellow,
              styles.chartItem,
              {
                flex: rewardAndPunishData.reminderTotal / totalRewardAndPunish,
              },
            ]}
          >
            <Text style={[fs_8_700, text_white, text_center]}>
              Sự cố: {rewardAndPunishData.reminderTotal}
            </Text>
          </View>

          <View
            style={[
              bg_red,
              styles.chartItem,
              {
                flex:
                  rewardAndPunishData.punishmentTotal / totalRewardAndPunish,
              },
            ]}
          >
            <Text style={[fs_8_700, text_white, text_center]}>
              Vi phạm: {rewardAndPunishData.punishmentTotal}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.chart}>
          <View
            style={[
              type === 'business' ? bg_green : bg_blue,
              styles.chartItem,
              {
                flex: 1 / 3,
              },
            ]}
          >
            <Text style={[fs_8_700, text_white, text_center]}>Khen: 0</Text>
          </View>

          <View
            style={[
              bg_yellow,
              styles.chartItem,
              {
                flex: 1 / 3,
              },
            ]}
          >
            <Text style={[fs_8_700, text_white, text_center]}>Sự cố: 0</Text>
          </View>

          <View
            style={[
              bg_red,
              styles.chartItem,
              {
                flex: 1 / 3,
              },
            ]}
          >
            <Text style={[fs_8_700, text_white, text_center]}>Vi phạm: 0</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    paddingHorizontal: 15,
    paddingBottom: 10,
    paddingTop: 7,
    gap: 10,
  },
  chart: {
    flex: 1,
    flexDirection: 'row',
  },
  chartItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
  },
});

BehaviorBlock.propTypes = {
  rewardAndPunishData: PropTypes.any,
  workSummary: PropTypes.any,
  type: PropTypes.oneOf(['business', 'factory', 'office']).isRequired,
};
