import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableHighlight,
  Button,
  Animated,
  Easing,
} from 'react-native';

import InstagramLogin from 'react-native-instagram-login';

import CookieManager from 'react-native-cookies';

import logo from './logo.png';

class App extends Component {
  state = {
    spinValue: new Animated.Value(0),
    token: null
  }

  onClick = () => {
    const wasRotated = this.state.spinValue._value === 1;
    Animated.timing(
      this.state.spinValue,
      {
        toValue: wasRotated ? 0 : 1,
        duration: 250,
        easing: Easing.linear
      }
    ).start()
  }

  logout() {
    CookieManager.clearAll()
      .then((res) => {
        console.log('CookieManager.clearAll =>', res);
        this.setState({ token: '' })
      });
  }

  render() {
    const spin = this.state.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });

    if (this.state.token) {
      //That would be Home component
      return (
        <View style={styles.container}>
          <Text>You're now logged in!!!</Text>
          <Button
            title="Logout"
            onPress={()=> this.logout()}>
         </Button>

        </View>  
      )
    }
 
    return (
      <View style={styles.container}>
        <Animated.Image source={logo} style={[styles.logo, { transform: [{rotate: spin}] }]}/>
        <Text style={styles.title}>Instagram authentication example</Text>

        <TouchableHighlight
          onPress={()=> this.instagramLogin.show()}
          style={styles.button}
          underlayColor={'#0A84D0'}
        >
          <Text style={styles.buttonText}>Sign in with Instagram</Text>
        
        </TouchableHighlight>

        <InstagramLogin
          ref= {ref => this.instagramLogin= ref}
          clientId='9bdcb91fd01843858a1e7078cb9a0c00'
          redirectUrl='https://google.com'
          scopes={['public_content+follower_list']}
          onLoginSuccess={(token) => this.setState({ token })}
          onLoginFailure={(data) => console.log(data)}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 300,
    height: 300,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    borderRadius: 3,
    padding: 20,
    marginVertical: 10,
    marginTop: 10,
    backgroundColor: '#1B95E0',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

let hotWrapper = () => () => App;
if (Platform.OS === 'web') {
  const { hot } = require('react-hot-loader');
  hotWrapper = hot;
}
export default hotWrapper(module)(App);
