import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableHighlight, AsyncStorage } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  
  useEffect(() => {
    // Load notes from local storage on mount
    AsyncStorage.getItem('notes').then(data => {
      if (data) {
        setNotes(JSON.parse(data));
      }
    });
  }, []);

  const handleSaveNote = () => {
    if (newNote.trim() !== '') {
      const updatedNotes = [...notes, { title: newNote, content: '' }];
      setNotes(updatedNotes);
      setNewNote('');
      AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    }
  };

  const handlePressNote = note => {
    // Navigate to note details screen
    navigation.navigate('NoteDetails', { note });
  };

  const renderNoteItem = ({ item }) => {
    return (
      <TouchableHighlight onPress={() => handlePressNote(item)}>
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 18 }}>{item.title}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 10 }}>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
          placeholder="New note title"
          value={newNote}
          onChangeText={setNewNote}
        />
        <Button title="Save" onPress={handleSaveNote} />
      </View>
      <FlatList data={notes} renderItem={renderNoteItem} keyExtractor={(item, index) => index.toString()} />
    </View>
  );
};

const NoteDetailsScreen = ({ route }) => {
  const { note } = route.params;

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>{note.title}</Text>
      <Text>{note.content}</Text>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Notes' }} />
        <Stack.Screen name="NoteDetails" component={NoteDetailsScreen} options={({ route }) => ({ title: route.params.note.title })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;