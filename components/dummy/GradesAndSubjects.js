import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableHighlight, TouchableOpacity, Button } from 'react-native';
import {Card} from 'react-native-shadow-cards';
import  Icon  from 'react-native-vector-icons/FontAwesome';
import grades,{subjects} from '../../src/res/data.js'



const GradesAndSubjects = ({GradeManagement,SubjectManagement,IsGradeSelected,IsSubjectSelected}) => {
    return <View>
        {
            grades.map((grade,gradeIndex)=>
                <View>
                <TouchableOpacity onPress={()=>GradeManagement(gradeIndex)}>
                <Text style={ IsGradeSelected(gradeIndex)?styles.selectedGrade:styles.normalGrade}>{grade}</Text>
                </TouchableOpacity>
                {
                        IsGradeSelected(gradeIndex)?
                        <Card style={styles.cardStyle} elevation={10} cornerRadius={20}>
                            <View style={{flexDirection:'row',justifyContent:'space-around',flexWrap:'wrap'}}>
                                {
                                    subjects[gradeIndex].map((subject,subjectIndex)=>
                                        <TouchableOpacity onPress={()=>SubjectManagement(gradeIndex,subjectIndex)}>
                                            <Text style={ IsSubjectSelected(gradeIndex,subjectIndex)?styles.selectedSubject:styles.normalSubject}>{subject}</Text>
                                        </TouchableOpacity>
                                    )
                                }
                            </View>
                        </Card>:null
                }
                </View>
            )
        }
    </View>    
}

const styles=StyleSheet.create({
    normalSubject:{
        borderRadius:20,borderWidth:3,borderColor:'black',textAlign:'center',textAlignVertical:'center',padding:10,color:'black',backgroundColor:'white',
        marginBottom:5,
    },
    selectedSubject:{
        borderRadius:20,borderWidth:3,borderColor:'white',fontWeight:'bold',textAlign:'center',textAlignVertical:'center',padding:10,color:'white',backgroundColor:'black',
        marginBottom:5

    },
    normalGrade:{
        borderWidth:3,borderColor:'goldenrod',textAlign:'center',textAlignVertical:'center',padding:10,color:'goldenrod',
        marginBottom:5, marginHorizontal:10,borderBottomRightRadius:30,borderBottomLeftRadius:30
    },
    selectedGrade:{
        borderWidth:3,borderColor:'black',fontWeight:'bold',textAlign:'center',textAlignVertical:'center',padding:10,color:'white',backgroundColor:'black',
        marginBottom:5, marginHorizontal:5,borderTopRightRadius:40,borderTopLeftRadius:40

    },
    cardStyle:{
        padding:25,
        alignSelf:'center',
        marginBottom:15,
        backgroundColor:'white'
    }

})



export default GradesAndSubjects;