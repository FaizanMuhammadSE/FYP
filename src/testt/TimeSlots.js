// import React, {useState} from 'react';
// import {Button, Text, View, StyleSheet} from 'react-native';

// import DatePicker from 'react-native-date-picker';
// import Slots from './Slots';

// const TimeSlots = () => {
//   //const [slots, setSlots] = useState(['Hello', 'Milk', 'Bread']);
//   const [startTime, setStartTime] = useState(new Date());
//   const [endTime, setEndTime] = useState(new Date());
//   const [open, setOpen] = useState(false);
//   const [flag, setFlag] = useState(false);
//   const deleteSlot = deletingSlot => {
//     //alert(deletingSlot);
//     //alert(deletingSlot);
//     /*setSlots(prevState => {
//       let slotsClone = [...prevState.slots];
//       let indexOfDeletingSlot = slotsClone.indexOf(deletingSlot);
//       //alert(indexOfDeletingSlot);
//       slotsClone.splice(indexOfDeletingSlot, 1);
//       alert(slots);
//       return {
//         slots: slotsClone,
//       };
//     });*/
//     //setSlots(slots.filter(slot => slot != deletingSlot));
//     //setSlots([]);
//     //alert(deletingSlot);
//     const slotsClone = [...slots];
//     //alert(slotsClone);
//     let indexOfDeletingSlot = slotsClone.indexOf(deletingSlot);
//     //alert(indexOfDeletingSlot);
//     slotsClone.splice(indexOfDeletingSlot, 1);
//     //alert(slotsClone);
//     //alert(slots);
//     setSlots(slotsClone);
//   };
//   return (
//     <View style={styles.container}>
//       <Button title="Set slot" onPress={() => setOpen(true)} />

//       <View>
//         <DatePicker
//           modal
//           mode="time"
//           open={open}
//           minuteInterval={15}
//           title="Select Ending Time"
//           date={endTime}
//           onConfirm={time => {
//             setOpen(false);
//             setEndTime(time);
//             setFlag(true);
//           }}
//           onCancel={() => {
//             setOpen(false);
//           }}
//         />
//         <DatePicker
//           modal
//           mode="time"
//           open={open}
//           minuteInterval={15}
//           //textColor="red"
//           title="Select Starting Time"
//           // timeZoneOffsetInMinutes={true}
//           date={startTime}
//           //locale={'device'}
//           onConfirm={time => {
//             setOpen(false);
//             setStartTime(time);
//             //setSelectedHours(date.getHours());
//             //setSelectedMinutes(date.getMinutes());
//           }}
//           onCancel={() => {
//             setOpen(false);
//           }}
//         />
//       </View>
//       <View>{flag ? <Slots stime={startTime} etime={endTime} /> : null}</View>
//     </View>
//   );
// };
// export default TimeSlots;
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     backgroundColor: 'white',
//   },
// });

////////////////ABOVE CODE IS WRITTEN BY MUHAMMAD FARAZ ALI (APP DEVELOPER)/////////////////
// import React, {useState} from 'react';
// import {Button} from 'react-native';
// import DatePicker from 'react-native-date-picker';

// export default () => {
//   const [date, setDate] = useState(new Date());
//   const [open, setOpen] = useState(false);
//   return (
//     <>
//       <Button title="Open" onPress={() => setOpen(true)} />
//       <DatePicker
//         modal
//         open={open}
//         date={date}
//         onConfirm={date => {
//           setOpen(false);
//           setDate(date);
//         }}
//         onCancel={() => {
//           setOpen(flse);
//         }}
//       />
//     </>
//   );
// };

// import React, {useState, useRef} from 'react';
// import {View, TextInput} from 'react-native';
// import DatePicker from 'react-native-date-picker';

// export default () => {
//   const [date, setDate] = useState(new Date());
//   const [name, setName] = useState('FAizan');
//   return (
//     <>
//       <TextInput
//         value={name}
//         onChangeText={e => {
//           console.log(e);
//           setName(e);
//         }}></TextInput>
//     </>
//   );
// };
