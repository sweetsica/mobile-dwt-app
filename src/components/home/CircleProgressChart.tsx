import React from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {Circle, Text} from 'react-native-svg';

interface CircleProgressChartProps {
  total: number;
  progress: number;
  strokeWidth?: number;
  size?: number;
}

const CircleProgressChart: React.FC<CircleProgressChartProps> = ({
  progress,
  size = 60,
  strokeWidth = 5,
  total,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#FFF"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={`${circumference} ${circumference}`}
          fill="none"
        />
        {total !== 0 && (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#2563EB"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={
              circumference - (progress / total) * circumference
            }
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            strokeLinecap="round"
          />
        )}
        <Text
          x={size / 2}
          y={size / 2}
          fill="#000"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={9}>
          {`${progress.toFixed(0)}/${total.toFixed(0)}`}
        </Text>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 6,
    fontWeight: '500',
    lineHeight: 9,
    textAlign: 'center',
  },
});

export default CircleProgressChart;
