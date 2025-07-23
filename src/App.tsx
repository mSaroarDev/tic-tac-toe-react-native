import { StatusBar, StyleSheet, View } from 'react-native';
import MainBox from './components/MainBox';

function App() {

  return (
    <View style={styles.container}>
      <StatusBar />
      <MainBox />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});

export default App;
