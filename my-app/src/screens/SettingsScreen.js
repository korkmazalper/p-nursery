import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function SettingsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings Screen</Text>
      <View style={styles.menuItem}>
        <Button title="Configure Notifications" onPress={() => navigation.navigate('Notifications')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  menuItem: { marginVertical: 10 }
});
