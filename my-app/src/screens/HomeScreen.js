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
