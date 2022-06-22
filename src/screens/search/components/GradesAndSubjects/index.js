import React, {useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Button,
} from 'react-native';
import {Card} from 'react-native-shadow-cards';
import Icon from 'react-native-vector-icons/FontAwesome';
import grades, {
  subjects,
  getGradesFromModule,
  getSubjectsFromModule,
} from '../../../../res/data.js';
import {GradesAndSubjectsContext} from '../../../../Context/index.js';
const GradesAndSubjects = ({
  GradeManagement,
  SubjectManagement,
  IsGradeSelected,
  IsSubjectSelected,
}) => {
  const context = useContext(GradesAndSubjectsContext);
  useEffect(() => {
    // console.log(
    //   'UseEffect of GradesSubjects called ',
    //   grades,
    //   getGradesFromModule(),
    // );
    //console.log('UseEffect of GradesAndSubjects: ', context);
    return () => {
      //console.log('GradeSubject Component Unmounted');
    };
  });
  return (
    <View>
      {context.grades.map((grade, gradeIndex) => (
        <View key={gradeIndex}>
          <TouchableOpacity onPress={() => GradeManagement(gradeIndex)}>
            <Text
              style={
                IsGradeSelected(gradeIndex)
                  ? styles.selectedGrade
                  : styles.normalGrade
              }>
              {grade}
            </Text>
          </TouchableOpacity>
          {IsGradeSelected(gradeIndex) ? (
            <Card style={styles.cardStyle} elevation={10} cornerRadius={20}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  flexWrap: 'wrap',
                }}>
                {context.subjects[gradeIndex].map((subject, subjectIndex) => (
                  <TouchableOpacity
                    onPress={() => SubjectManagement(gradeIndex, subjectIndex)}
                    key={subjectIndex}>
                    <Text
                      style={
                        IsSubjectSelected(gradeIndex, subjectIndex)
                          ? styles.selectedSubject
                          : styles.normalSubject
                      }>
                      {subject}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
          ) : null}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  normalSubject: {
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#F39C12',
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 10,
    color: '#F39C12',
    backgroundColor: 'white',
    marginBottom: 5,
  },
  selectedSubject: {
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#F39C12',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 10,
    color: 'white',
    backgroundColor: '#F39C12',
    marginBottom: 5,
  },
  normalGrade: {
    borderWidth: 3,
    borderColor: '#42EADDFF',
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 10,
    color: 'teal',
    marginBottom: 5,
    marginHorizontal: 10,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  selectedGrade: {
    borderWidth: 3,
    borderColor: '#F39C12',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 10,
    color: 'white',
    backgroundColor: '#F39C12',
    marginBottom: 5,
    marginHorizontal: 5,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  cardStyle: {
    padding: 25,
    alignSelf: 'center',
    marginBottom: 15,
    backgroundColor: 'white',
  },
});

export default GradesAndSubjects;
