import dayjs from 'dayjs';
import ChevronLeftIcon from '../../assets/img/chevron-left-calendar.svg';
import ChevronRightIcon from '../../assets/img/chevron-right-calendar.svg';
import { Calendar } from 'react-native-calendars';
import { StyleSheet } from 'react-native';
import { useMemo } from 'react';

export default function AttendanceCalendar({
  currentMonth,
  setCurrentMonth,
  attendanceMonthData,
}: any) {
  const markedDates = useMemo(() => {
    const checkindate = attendanceMonthData.reduce((acc: any, cur: any) => {
      const date = dayjs()
        .month(cur.month - 1)
        .year(cur.year)
        .date(cur.day)
        .format('YYYY-MM-DD');
      return {
        ...acc,
        [date]: {
          selected: true,
          selectedColor: 'rgba(0, 112, 255, 0.20)',
          selectedTextColor: '#000',
        },
      };
    }, {});

    const month = dayjs(currentMonth).month();
    const year = dayjs(currentMonth).year();
    let date = dayjs().month(month).year(year).date(1).toDate();
    let days = [];
    while (date.getMonth() === month) {
      days.push(dayjs(date).format('YYYY-MM-DD'));
      date.setDate(date.getDate() + 1);
    }

    const marked = days.reduce((acc: any, cur: any) => {
      if (!checkindate[cur] && dayjs(cur).isBefore(dayjs())) {
        return {
          ...acc,
          [cur]: {
            selected: true,
            selectedColor: '#D9D9D9',
            selectedTextColor: '#000',
          },
        };
      }
      return acc;
    }, {});

    return {
      ...marked,
      ...checkindate,
    };
  }, [attendanceMonthData]);
  return (
    <Calendar
      style={styles.calendarContainer}
      initialDate={dayjs().format('YYYY-MM-DD')}
      firstDay={1}
      markedDates={markedDates}
      onMonthChange={(month) => {
        setCurrentMonth(dayjs(month.dateString).format('YYYY-MM'));
      }}
      theme={{
        dayTextColor: '#000',
        todayTextColor: '#DC3545',
        textDayFontSize: 13,
        textDayFontWeight: '700',
      }}
      renderArrow={(direction) => {
        return direction === 'left' ? (
          <ChevronLeftIcon width={20} height={20} />
        ) : (
          <ChevronRightIcon width={20} height={20} />
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderColor: '#787878',
    borderWidth: 0.5,
  },
});
