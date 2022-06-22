// const grades=["Grade 01","Grade 02","Grade 03","Grade 04","Grade 05","Grade 06","Grade 07","Grade 08","Grade 09","Grade 10","Grade 11","Grade 12","Higher"]
let grades = [];

export let subjects = [
  // ["Urdu","English","Math","Arts","All"],
  // ["Urdu","English","Math","Arts","All"],
  // ["Urdu","English","Math","Science","Arts","All"],
  // ["Urdu","English","Math","Science","Arts","All"],
  // ["Urdu","English","Math","Science","Computer","Arts","All"],
  // ["Urdu","English","Math","Science","Computer","Arts","All"],
  // ["Urdu","English","Math","Physics","Chemistry","Biology","Computer","Arts","All"],
  // ["Urdu","English","Math","Physics","Chemistry","Biology","Computer","Arts","All"],
  // ["Urdu","English","Math","Physics","Chemistry","Biology","Computer","Arts","All"],
  // ["Urdu","English","Math","Physics","Chemistry","Biology","Computer","Arts","All"],
  // ["Urdu","English","Math","Physics","Chemistry","Biology","Computer","Arts","All"],
  // ["Urdu","English","Math","Physics","Chemistry","Biology","Computer","Arts","All"],
  // ["English","Math","Physics","Chemistry","Biology","Computer","Arts","All"],
];

export const setGradesInsideModule = val => {
  grades = val;
  //console.log('setter called: ', val, grades);
};
export const getGradesFromModule = () => {
  //console.log('getter called: ', grades);
  return grades;
};
export const setSubjectsInsideModule = val => {
  subjects.push(val);
  //console.log('setter called: ', val, subjects);
};
export const getSubjectsFromModule = () => {
  //console.log('getter called: ', subjects);
  return subjects;
};

export default grades;

export let temp = 100;
export let setValue = val => {
  temp = val;
};

// const data={
//     "Grade1":["Urdu","English","Math","Arts","All"],
//     "Grade2":["Urdu","English","Math","Arts","All"],
// }

//     Grade3:["Urdu","English","Math","Science","Arts","All"],
//     Grade4:["Urdu","English","Math","Science","Arts","All"],
//     Grade5:["Urdu","English","Math","Science","Computer","Arts","All"],
//     Grade6:["Urdu","English","Math","Science","Computer","Arts","All"],
//     Grade7:["Urdu","English","Math","Physics","Chemistry","Biology","Computer","Arts","All"],
//     Grade8:["Urdu","English","Math","Physics","Chemistry","Biology","Computer","Arts","All"],
//     Grade9:["Urdu","English","Math","Physics","Chemistry","Biology","Computer","Arts","All"],
//     Grade10:["Urdu","English","Math","Physics","Chemistry","Biology","Computer","Arts","All"],
//     Grade11:["Urdu","English","Math","Physics","Chemistry","Biology","Computer","Arts","All"],
//     Grade12:["Urdu","English","Math","Physics","Chemistry","Biology","Computer","Arts","All"],
//     Higher:["English","Math","Physics","Chemistry","Biology","Computer","Arts","All"],
