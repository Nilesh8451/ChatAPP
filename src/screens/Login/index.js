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
import Toast from 'react-native-simple-toast';
import {loginDataFun} from '../../redux/action';
import {useDispatch, useSelector} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const Login = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const dispatch = useDispatch();
  // const infoOfUser = useSelector(state => state.userInfo.loginData);

  const loginUser = () => {
    try {
      setLoading(true);
      auth()
        .signInWithEmailAndPassword(username, password)
        .then(user => {
          console.log('User signed in!', user);
          // Toast.showWithGravity('Successfully Signed In', Toast.LONG, Toast.BOTTOM);
          Toast.show('Successfully Signed In', Toast.SHORT, [
            'RCTModalHostViewController',
          ]);
          setUsername('');
          setPassword('');
          setUserInfo(user.user._user);
          dispatch(loginDataFun(user.user._user));
          setLoading(false);
          // navigation.navigate('Home', {userInfo: user.user._user});
        })
        .catch(error => {
          console.log(error);
          setLoading(false);

          if (error.code === 'auth/user-not-found') {
            // Toast.showWithGravity('', Toast.LONG, Toast.BOTTOM);
            Toast.show('User not found!', Toast.SHORT, [
              'RCTModalHostViewController',
            ]);
          }

          Toast.show(error.toString(), Toast.SHORT, [
            'RCTModalHostViewController',
          ]);
        });
    } catch (e) {
      console.log(e);
      Toast.show(e.toString(), Toast.SHORT, ['RCTModalHostViewController']);
      setLoading(false);
    }
  };

  return (
    <Container
      loading={loading}
      style={{
        flex: 1,
      }}
      withKeyboard={true}>
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
            Login
          </Text>
          <View
            style={{
              marginVertical: 10,
              marginTop: 150,
              marginHorizontal: 20,
            }}>
            <Text
              style={{
                fontSize: 18,
                color: 'white',
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
                marginTop: 20,
                fontFamily: 'ZillaSlab-Medium',
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
                secureTextEntry
                placeholder="Password"
                placeholderTextColor={'rgba(255,255,255,0.6)'}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate('Home');
                loginUser();
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
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Register');
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
                Not a member register here
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default Login;
