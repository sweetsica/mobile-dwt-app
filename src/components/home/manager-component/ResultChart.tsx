import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Svg, {Rect} from 'react-native-svg';

const ProgressBar = ({
  progress,
  height = 60,
  backgroundColor = '#FFF',
  fillColor = '#0056d2',
}: any) => {
  return (
    <Svg width={15} height={height}>
      <Rect x="0" y={0} width={15} height={height} fill={backgroundColor} />
      <Rect
        x="0"
        y={height - height * progress}
        width={15}
        height={height * progress}
        fill={fillColor}
      />
    </Svg>
  );
};

export default function ResultChart({height = 60}) {
  return (
    <View style={[styles.container, {height: height}]}>
      <View style={styles.statistic}>
        <Text
          style={{
            fontSize: 8,
            fontWeight: '400',
            color: '#64748B',
          }}>
          100
        </Text>
        <Text
          style={{
            fontSize: 8,
            fontWeight: '400',
            color: '#64748B',
          }}>
          75
        </Text>
        <Text
          style={{
            fontSize: 8,
            fontWeight: '400',
            color: '#64748B',
          }}>
          50
        </Text>
        <Text
          style={{
            fontSize: 8,
            fontWeight: '400',
            color: '#64748B',
          }}>
          25
        </Text>
        <Text
          style={{
            fontSize: 8,
            fontWeight: '400',
            color: '#64748B',
          }}>
          0
        </Text>
      </View>
      <View style={[styles.listLine, {height}]}>
        <View style={styles.line} />
        <View style={styles.line} />
        <View style={styles.line} />
        <View style={styles.line} />
        <View style={styles.line} />
      </View>
      <View style={styles.gap4}>
        <ProgressBar progress={0.3} fillColor={'#2563EB'} height={height} />
        <ProgressBar progress={0.4} fillColor={'#38BDF8'} height={height}/>
        <ProgressBar progress={0.7} fillColor={'#DBEAFE'} height={height}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 15,
    position: 'relative',
  },
  statistic: {
    justifyContent: 'space-between',
    width: 15,
    alignItems: 'flex-end',
  },
  listLine: {
    position: 'absolute',
    width: 65,
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'flex-end',
    right: 0,
    bottom: 0,
  },
  line: {
    height: 1,
    backgroundColor: '#787878',
    width: '100%',
  },
  gap4: {
    flexDirection: 'row',
    gap: 4,
    marginRight: 6,
    height: '100%',
  },
});
