import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [items, setItems] = useState([]); // lista de itens
  const [text, setText] = useState('');   // texto do input
  const [editId, setEditId] = useState(null); // id em edição

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem('@items');
      if (stored) setItems(JSON.parse(stored));
    }
    catch (e) {
      console.error('Erro ao carregar dados', e);
    }
  };

  const saveData = async (newItems) => {
    try {
      await AsyncStorage.setItem('@items', JSON.stringify(newItems));
    } catch (e) {
      console.error('Erro ao salvar', e);
    }
  };


  const handleAdd = async () => {
    if (!text.trim()) return Alert.alert('Digite algo!');
    let newList = [];
    if (editId) {
      newList = items.map((i) =>
        i.id === editId ? { ...i, name: text } : 1
      );
      setEditId(null);
    }
    else {
      const newItem = { id: Date.now().toString(), name: text };
      newList = [...items, newItem];
    }

    setItems(newList);
    await saveData(newList);
    setText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRUD com AsyncStorage</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite algo..."
          value={text}
          onChangeText={setText}
        />
        <Button title={editId ? 'Salvar' : 'Adicionar'} onPress={handleAdd} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  inputContainer: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
  },
  itemText: { fontSize: 18 },
  buttons: { flexDirection: 'row', gap: 15 },
  edit: { fontSize: 18 },
  delete: { fontSize: 18 },
  clearBtn: {
    marginTop: 20,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#e53935',
    borderRadius: 8,
  },
  clearText: { color: '#fff', fontWeight: 'bold' },
});
