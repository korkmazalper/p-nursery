import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function NotificationsScreen() {
  const triggerNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Alert Triggered! 🔔",
        body: 'Notification setup is working correctly.',
      },
      trigger: null,
    });
    Alert.alert('Notification Triggered', 'Check your device notification area.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Settings</Text>
      <Text style={styles.subtitle}>Configure local notifications setup below:</Text>
      <Button title="Trigger Test Notification" onPress={triggerNotification} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 }
});
