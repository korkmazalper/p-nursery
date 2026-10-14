# 1. HomeScreen.js
cat << 'EOF' > src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.logoText}>APP LOGO</Text>
      </View>
      
      <Text style={styles.screenTitle}>Home</Text>
      <Text style={styles.subTitle}>A few good ideas for your everyday.</Text>
      <Text style={styles.sectionHeader}>Latest items</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#5C7CFA" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.categoryTag}>WELLBEING • 4 min read</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Detail', { item })}>
                <Text style={styles.viewDetailsText}>View details</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', paddingHorizontal: 16 },
  headerBar: { backgroundColor: '#E9ECEF', paddingVertical: 12, alignItems: 'center', marginBottom: 16, marginHorizontal: -16 },
  logoText: { fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
  screenTitle: { fontSize: 22, fontWeight: 'bold', color: '#111' },
  subTitle: { fontSize: 13, color: '#666', marginBottom: 16 },
  sectionHeader: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 12 },
  card: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E9ECEF', borderRadius: 8, padding: 16, marginBottom: 12 },
  categoryTag: { fontSize: 10, color: '#888', fontWeight: 'bold', marginBottom: 4 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#222', marginBottom: 12 },
  viewDetailsText: { fontSize: 12, color: '#5C7CFA', fontWeight: '600', textAlign: 'right' }
});
EOF

# 2. DetailScreen.js
cat << 'EOF' > src/screens/DetailScreen.js
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
EOF