import React,{useState} from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableHighlight, TouchableOpacity, Button } from 'react-native';
import {Card} from 'react-native-shadow-cards';
import  Icon  from 'react-native-vector-icons/FontAwesome';
import ModalResult from './ModalResult.js';
import GradesAndSubjects from './GradesAndSubjects.js';
import grades,{subjects} from '../../src/res/data.js'

function ShowData(){
    let items=[];
    for (var key in Data)
    {
        items.push(Data.key)
    }
    return items;
}

const SearchScreen = () => {


    let values=[["Urdu","English","Math","Science","Arts","All"],["Urdu","English","Math","Science"]]

    function userSelected(user){
        if(user=="Teacher")
            setTeacher(true)
        else
            setTeacher(false)    
    }

    function genderSelected(gender){
        if(gender=="Male")
            setGender("Male")
        else if(gender=="Female")
            setGender("Female")
        else if(gender=="Nothing")
            setGender("Nothing")    
    }



    function ageSelected(age){
        if(age=="20+")
            setAge("20+")
        else if(age=="30+")
            setAge("30+")
        else if(age=="40+")
            setAge("40+")    
        else if(age=="50+")
            setAge("50+")    
        else if(age=="Nothing")
            setAge("Nothing")    
    }



    function gradeManagement(index){
        let tempGrade=[...Grades]
        tempGrade[index]=!tempGrade[index]
        setGrades(tempGrade)
    }

    function subjectManagement(gradeIndex,subjectIndex){
        let tempSubjects=[...Subjects]
        tempSubjects[gradeIndex][subjectIndex]=!tempSubjects[gradeIndex][subjectIndex]
        if(subjectIndex==subjects[gradeIndex].length-1)  //if user clicked on all button, then make other buttons also like it either checked or uncheked
            for(let i=0;i<tempSubjects[gradeIndex].length;i++)
                tempSubjects[gradeIndex][i]=tempSubjects[gradeIndex][subjectIndex]
        setSubjects(tempSubjects)
    }

    function isGradeSelected(index){
        return Grades[index]
    }
    function isSubjectSelected(gradeIndex,subjectIndex){
        return Subjects[gradeIndex][subjectIndex] 
    }

    function closeModal() {
        setIsModalVisible(false)
    }
    const [Teacher, setTeacher] = useState(true)
    // const [Student, setStudent] = useState(false)
    // states for gender selection
    const [Gender, setGender] = useState("Male")
    // const [Female, setFemale] = useState(false)
    // const [Nothing, setNothing] = useState(true)
    const [Age, setAge] = useState("Nothing")
    // const [Grade, setGrade] = useState("Grade1")

    const [Grades, setGrades] = useState(Array.from({length: grades.length},()=> false))
    const [Subjects, setSubjects] = useState(Array.from({length: subjects.length},()=> Array.from({length: 9}, () => false)))
    const [isModalVisible, setIsModalVisible] = useState(false)

    function toggleValue(row,col) {
        let temp=[...Subjects]
        temp[row][col]=!temp[row][col]
        setSubjects(temp)
    }
    return <View>
        <ScrollView>
            {/* <Text style={{fontSize:40}}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
            </Text>

            <Text style={{backgroundColor:'tomato'}}>{Subjects[2][3]?"True":"False"}</Text>
            <Button onPress={()=>toggleValue(2,3) } title='click Me'></Button> */}
            
            
            <View style={styles.section}>
                <Card style={styles.cardStyle} elevation={50} cornerRadius={20}>
                    <Text style={{alignSelf:'center',color:'sienna',fontSize:18,marginBottom:5}}>Looking for</Text>
                    <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                        <TouchableOpacity onPress={()=>userSelected("Teacher")}>
                            <Text style={ Teacher==true?styles.selectedUser:styles.normalUser}>Teacher</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>userSelected("Student")}>
                            <Text style={ Teacher==false?styles.selectedUser:styles.normalUser}>Student</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </View>

            <View style={styles.section}>
                <Card style={styles.cardStyle} elevation={40} cornerRadius={20}>
                    <Text style={{alignSelf:'center',color:'sienna',fontSize:18,marginBottom:5}}>Gender</Text>
                    <View style={{flexDirection:'row',justifyContent:'space-around',flexWrap:'wrap'}}>
                        <TouchableOpacity onPress={()=>genderSelected("Male")}>
                            <Text style={ Gender=="Male"?styles.selectedUser:styles.normalUser}>Male</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>genderSelected("Female")}>
                            <Text style={ Gender=="Female"?styles.selectedUser:styles.normalUser}>Female</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>genderSelected("Nothing")}>
                            <Text style={ Gender=="Nothing"?styles.selectedUser:styles.normalUser}>Doesn't Matter</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </View>

            <View style={styles.section}>
                <Card style={styles.cardStyle} elevation={10} cornerRadius={20}>
                    <Text style={{alignSelf:'center',color:'sienna',fontSize:18,marginBottom:5}}>Age</Text>
                    <View style={{flexDirection:'row',justifyContent:'space-around',flexWrap:'wrap'}}>
                        <TouchableOpacity onPress={()=>ageSelected("20+")}>
                            <Text style={ Age=="20+"?styles.selectedUser:styles.normalUser}>20+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>ageSelected("30+")}>
                            <Text style={ Age=="30+"?styles.selectedUser:styles.normalUser}>30+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>ageSelected("40+")}>
                            <Text style={ Age=="40+"?styles.selectedUser:styles.normalUser}>40+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>ageSelected("50+")}>
                            <Text style={ Age=="50+"?styles.selectedUser:styles.normalUser}>50+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>ageSelected("Nothing")}>
                            <Text style={ Age=="Nothing"?styles.selectedUser:styles.normalUser}>Doesn't Matter</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </View>
            <Text style={{alignSelf:'center',fontSize:18,marginBottom:5,borderWidth:5,borderColor:'white',color:'white',backgroundColor:'darkseagreen',textAlign:'center',textAlignVertical:'center',padding:10,marginTop:20,borderRadius:5,borderTopRightRadius:20,borderTopLeftRadius:20}}>Grades & Subjects</Text>
            {/* <Text style={{alignSelf:'center',fontSize:18,marginBottom:5,borderWidth:5,borderColor:'white',color:'white',backgroundColor:'darkkhaki',textAlign:'center',textAlignVertical:'center',padding:10,marginTop:20,borderRadius:5,borderTopRightRadius:20,borderTopLeftRadius:20}}>Grades & Subjects</Text> */}
  
            <GradesAndSubjects GradeManagement={gradeManagement} SubjectManagement={subjectManagement} IsGradeSelected={isGradeSelected} IsSubjectSelected={isSubjectSelected}></GradesAndSubjects>
  
            <TouchableOpacity onPress={()=>setIsModalVisible(true)}>
                <Text style={ [styles.selectedUser,{alignSelf:'center',padding:20,paddingHorizontal:30}]}>Search</Text>
            </TouchableOpacity>

            <ModalResult visibleOrNot={isModalVisible} closeModal={closeModal}></ModalResult>
            {/* <TouchableOpacity onPress={()=>gradeSelected("Grade1")}>
                <Text style={Grade=="Grade1"?styles.selectedUser:styles.normalUser}>Grade 1</Text>
            </TouchableOpacity> */}

            {/* {
                grades.map((item,gradeIndex)=><View>
                <Text style={styles.normalUser}>{item}</Text>
                <Card style={styles.cardStyle} elevation={30} cornerRadius={20}>
                    <View style={{flexDirection:'row',justifyContent:'space-around',flexWrap:'wrap'}}>

                        {
                            subjects[gradeIndex].map(subjectItem=>
                                <TouchableOpacity>
                                    <Text style={styles.selectedUser}>{subjectItem}</Text>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </Card>
                </View>)
            }
 */}

            {/* {
                Grade=="Grade1"?
                <View style={styles.section}>
                <Card style={styles.cardStyle} elevation={50} cornerRadius={20}>
                    <Text style={{alignSelf:'center',color:'sienna',fontSize:18,marginBottom:5}}>Looking for</Text>
                    <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                        <TouchableOpacity onPress={()=>userSelected("Teacher")}>
                            <Text style={ Teacher==true?styles.selectedUser:styles.normalUser}>Teacher</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>userSelected("Student")}>
                            <Text style={ Teacher==false?styles.selectedUser:styles.normalUser}>Student</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
                </View>:null
            }
            {
                values.map((item,index)=>   item.map(
                    subItem=><View>
                        <Text style={{backgroundColor:'tomato',margin:3}}>{subItem},{index}</Text>
                        {
                            subItem=="Urdu"?<Button title='Im button'></Button>:null
                        }
                        </View>
                    ))
            }
 */}
            {/* <Text>{ShowData()}</Text> */}
            {/* <TouchableOpacity onPress={()=>ageSelected("Nothing")}>
                <Text style={styles.normalUser}>Grade 2</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>ageSelected("Nothing")}>
                <Text style={styles.normalUser}>Grade 3</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>ageSelected("Nothing")}>
                <Text style={styles.normalUser}>Grade 4</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>ageSelected("Nothing")}>
                <Text style={styles.normalUser}>Grade 5</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>ageSelected("Nothing")}>
                <Text style={styles.normalUser}>Grade 6</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>ageSelected("Nothing")}>
                <Text style={styles.normalUser}>Grade 7</Text>
            </TouchableOpacity> */}
            {/* {true}
            {false}
            {null}
            {undefined}
                <Card style={[styles.cardStyle,{backgroundColor:'goldenrod',height:100}]} elevation={50}>
                <Card style={{backgroundColor:'aqua',height:50}} elevation={10}>

                </Card>
                </Card>



            
            <Card style={{padding: 10, margin: 10}}>
                <Text>Open up App.js to start working on your app!</Text>
                <Text>Changes you make will automatically reload.</Text>
                <Text>Shake your phone to open the developer menu.</Text>
            </Card>
            <Card style={{padding: 10, margin: 10}}>
                <Button
                    onPress={()=>{}}
                    title="Learn More"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                
                />
            </Card>
            <Card style={{padding: 10, width:'90%',margin:20, alignSelf:'center' , height: 50}} elevation={10}>
            </Card> */}

        </ScrollView>
    </View>;
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    ScrollView:{
        backgroundColor:'gray'
    },
    normalUser:{
        borderRadius:20,borderWidth:3,borderColor:'goldenrod',textAlign:'center',textAlignVertical:'center',padding:10,color:'black',
        marginBottom:5,
    },
    selectedUser:{
        borderRadius:20,borderWidth:3,borderColor:'goldenrod',fontWeight:'bold',textAlign:'center',textAlignVertical:'center',padding:10,color:'white',backgroundColor:'maroon',
        marginBottom:5

    },
    cardStyle:{
        padding:25,
        alignSelf:'center',
    },
    section:{
        marginBottom:10
    }
})

export default SearchScreen;