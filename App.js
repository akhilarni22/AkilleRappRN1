import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import rudderClient from "@rudderstack/rudder-sdk-react-native";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');

  const rudderInitialise = async () => {
    await rudderClient.setup("2VEpTiaR0RbcTIEnvn1bNPqixgx", {
      dataPlaneUrl: "https://rudderstachcyf.dataplane.rudderstack.com",
      trackAppLifecycleEvents: true,
      recordScreenViews: true,
    });
  };
  rudderInitialise().catch(console.error);
  

  const addTask = () => {
    if (taskText.trim() === '') return;
    setTasks([...tasks, taskText]);
    setTaskText('');
    rudderClient.track("test_track_event", {
        test_key_1: taskText,
        test_key_2: {
          test_child_key_1: "test_child_value_1",
        },
      })

  };
  
  const pageCall = () => {
    rudderClient.screen("Main Activity", {
        foo: "This is the main screen",
      })
  };

  const identifyCall=() =>{
    rudderClient.identify(
        "test_userId",
        {
          email: "testuser@example.com",
          location: "UK",
        },
        null
      )
  };


  const removeTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>To-Do List</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 16, paddingLeft: 8 }}
        placeholder="Enter a task"
        value={taskText}
        onChangeText={(text) => setTaskText(text)}
      />
      <Button title="Add Task" onPress={addTask}/>
      <>
      <Button title="Page call" onPress={pageCall}/>
      </>
      <Button title="Identify call" onPress={identifyCall}/>

      <FlatList
        style={{ marginTop: 16 }}
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>{item}</Text>
            <Button title="Remove" onPress={() => removeTask(index)} />
          </View>
        )}
      />
    </View>
  );
}
