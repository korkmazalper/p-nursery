import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { saveData, getData } from '../utils/storage';

export default function DetailScreen({ route, navigation }) {
  const { item } = route.params || { item: { id: 1, title: 'Make time for a little more focus', body: 'Simple ways to clear distractions and make space for what matters.' } };
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getData('favorites').then((favs) => {
      if (favs && favs.some((f) => f.id === item.id)) {
        setSaved(true);
      }
    });
  }, []);

  const handleSave = async () => {
    let favs = (await getData('favorites')) || [];
    if (!saved) {
      favs.push(item);
      await saveData('favorites', favs);
      setSaved(true);
      Alert.alert('Saved!', 'Item saved to your profile favorites.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.logoText}>APP LOGO</Text>
      </View>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>‹ Back to Home</Text>
      </TouchableOpacity>

      <Text style={styles.categoryTag}>WELLBEING • 4 min read</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.body || 'You don\'t need a perfect routine to find your focus. Start with one small change and give yourself a little room to slow down.'}</Text>

      <TouchableOpacity style={[styles.button, saved && styles.buttonSaved]} onPress={handleSave} disabled={saved}>
        <Text style={styles.buttonText}>{saved ? "Saved in Local Storage" : "Save to Favorites"}</Text>
      </TouchableOpacity>
      <Text style={styles.note}>Keep this item in your profile for later.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', paddingHorizontal: 16 },
  headerBar: { backgroundColor: '#E9ECEF', paddingVertical: 12, alignItems: 'center', marginBottom: 12, marginHorizontal: -16 },
  logoText: { fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
  backButton: { marginBottom: 12 },
  backText: { color: '#5C7CFA', fontSize: 13 },
  categoryTag: { fontSize: 10, color: '#888', fontWeight: 'bold', marginBottom: 6 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111', marginBottom: 12 },
  body: { fontSize: 14, color: '#444', lineHeight: 20, marginBottom: 24 },
  button: { backgroundColor: '#5C7CFA', paddingVertical: 14, borderRadius: 6, alignItems: 'center' },
  buttonSaved: { backgroundColor: '#40C057' },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  note: { fontSize: 11, color: '#888', textAlign: 'center', marginTop: 8 }
});
