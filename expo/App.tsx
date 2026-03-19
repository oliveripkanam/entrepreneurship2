import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';

// Change this to your Netlify URL once deployed, or use a local IP for dev
const APP_URL = 'https://pantryuk.netlify.app';
// For local dev: run `npm run dev -- --host` in the root project folder,
// then use your machine's local IP, e.g. 'http://192.168.1.42:5173'

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#4CAF50" />
      <WebView
        source={{ uri: APP_URL }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        allowsBackForwardNavigationGestures
        renderLoading={() => (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#4CAF50" />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  webview: {
    flex: 1,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
