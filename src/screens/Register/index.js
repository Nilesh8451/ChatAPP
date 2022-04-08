import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, {useState} from 'react';
import {Container} from '../../components/container';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-simple-toast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import database from '@react-native-firebase/database';

const Register = ({navigation}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const registerUser = () => {
    try {
      setLoading(true);

      auth()
        .createUserWithEmailAndPassword(username, password)
        .then(user => {
          console.log('User account created & signed in!', user);

          Toast.show('User is Created Successfully', Toast.SHORT, [
            'RCTModalHostViewController',
          ]);

          const newReference = database().ref('/Users').push();

          newReference
            .set({
              email: user.user._user.email,
              uid: user.user._user.uid,
              name: name,
            })
            .then(() => {
              setLoading(false);
              navigation.navigate('Login');
            })
            .catch(e => {
              setLoading(false);
            });
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');

            Toast.show('That email address is already in use!', Toast.SHORT, [
              'RCTModalHostViewController',
            ]);
          }

          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');

            Toast.show('That email address is invalid!', Toast.SHORT, [
              'RCTModalHostViewController',
            ]);
          }

          Toast.show('Please provide valid information', Toast.SHORT, [
            'RCTModalHostViewController',
          ]);

          console.log(error);
          setLoading(false);
        });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <Container
      loading={loading}
      style={{
        flex: 1,
      }}>
      <View
        style={{
          position: 'absolute',
          flex: 1,

          width: '100%',
          height: '100%',
        }}>
        <Image
          style={{width: '100%', height: '100%'}}
          source={require('../../assets/images/pexels-cottonbro-7120126.jpg')}
        />
        <View
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,0.6)',
          }}></View>
      </View>
      <KeyboardAwareScrollView>
        <SafeAreaView>
          <Text
            style={{
              fontSize: 40,
              color: 'white',
              marginTop: 20,
              marginLeft: 20,
              fontFamily: 'Lobster-Regular',
            }}>
            Register
          </Text>

          <View
            style={{
              marginVertical: 10,
              marginTop: 130,
              marginHorizontal: 20,
            }}>
            <Text
              style={{
                fontSize: 18,
                color: 'white',
                fontFamily: 'ZillaSlab-Medium',
              }}>
              Enter Name
            </Text>

            <View
              style={{
                borderBottomWidth: 2,
                borderBottomColor: '#E7E0C9',
                marginVertical: 10,
                marginTop: 15,
                paddingBottom: 5,
              }}>
              <TextInput
                value={name}
                onChangeText={val => setName(val)}
                style={{
                  color: 'white',
                  fontSize: 18,
                  fontFamily: 'ZillaSlab-Medium',
                }}
                placeholder="Your Name"
                placeholderTextColor={'rgba(255,255,255,0.6)'}
              />
            </View>

            <Text
              style={{
                fontSize: 18,
                color: 'white',
                marginTop: 20,
                fontFamily: 'ZillaSlab-Medium',
              }}>
              Enter Email
            </Text>

            <View
              style={{
                borderBottomWidth: 2,
                borderBottomColor: '#E7E0C9',
                marginVertical: 10,
                marginTop: 15,
                paddingBottom: 5,
              }}>
              <TextInput
                value={username}
                onChangeText={val => setUsername(val)}
                style={{
                  color: 'white',
                  fontSize: 18,
                  fontFamily: 'ZillaSlab-Medium',
                }}
                placeholder="Email"
                placeholderTextColor={'rgba(255,255,255,0.6)'}
              />
            </View>
            <Text
              style={{
                fontSize: 18,
                color: 'white',
                fontFamily: 'ZillaSlab-Medium',
                marginTop: 20,
              }}>
              Enter Password
            </Text>
            <View
              style={{
                borderBottomWidth: 2,
                marginVertical: 10,
                borderBottomColor: '#E7E0C9',
                paddingBottom: 5,
                marginTop: 15,
              }}>
              <TextInput
                value={password}
                onChangeText={val => setPassword(val)}
                style={{
                  color: 'white',
                  fontSize: 18,
                  fontFamily: 'ZillaSlab-Medium',
                }}
                placeholder="Password"
                placeholderTextColor={'rgba(255,255,255,0.6)'}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                // navigation.navigate('Login');
                registerUser();
              }}
              style={{
                backgroundColor: '#FDEFEF',
                alignItems: 'center',
                borderRadius: 50,
                marginVertical: 30,
                paddingVertical: 10,
                width: '50%',
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 18,
                  fontWeight: 'bold',
                  fontFamily: 'ZillaSlab-Bold',
                }}>
                Register
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Login');
              }}
              style={{
                marginVertical: 10,
              }}>
              <Text
                style={{
                  color: '#F4DFD0',
                  fontSize: 18,
                  fontWeight: 'bold',
                  fontFamily: 'ZillaSlab-Medium',
                }}>
                Already have an account, login
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default Register;
