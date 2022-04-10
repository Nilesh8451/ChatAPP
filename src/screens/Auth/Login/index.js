import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';

import {Container} from '../../../components/container';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-simple-toast';
import {loginDataFun} from '../../../redux/action';
import {useDispatch, useSelector} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AntIcon from 'react-native-vector-icons/AntDesign';
import ENIcon from 'react-native-vector-icons/Entypo';

const Login = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [showeye, setShoweye] = useState(false);
  const dispatch = useDispatch();

  const loginUser = () => {
    try {
      setLoading(true);
      auth()
        .signInWithEmailAndPassword(username, password)
        .then(user => {
          Toast.show('Successfully Signed In', Toast.SHORT, [
            'RCTModalHostViewController',
          ]);
          setUsername('');
          setPassword('');
          setUserInfo(user.user._user);
          dispatch(loginDataFun(user.user._user));
          setLoading(false);
        })
        .catch(error => {
          console.log(error);
          setLoading(false);

          if (error.code === 'auth/user-not-found') {
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
        backgroundColor: 'rgba(255,255,255,0.5)',
      }}
      withKeyboard={true}>
      <KeyboardAwareScrollView>
        <SafeAreaView>
          <Text style={styles.title}>ʟᴏɢɪɴ ᴛᴏ ᴍʏᴄʜᴀᴛ</Text>
          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>Enter Email</Text>

            <View style={styles.inputContainer}>
              <TextInput
                value={username}
                onChangeText={val => setUsername(val)}
                style={styles.inputTextStyle}
                placeholder="Your Email"
                placeholderTextColor={'rgba(0,0,0,0.3)'}
              />
              <View style={{position: 'absolute', right: 0}}>
                <AntIcon name="user" size={20} color="black" />
              </View>
            </View>
            <Text
              style={{
                ...styles.inputLabel,
                marginTop: 20,
              }}>
              Enter Password
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={password}
                onChangeText={val => setPassword(val)}
                style={styles.inputTextStyle}
                secureTextEntry={!showeye}
                placeholder="Password"
                placeholderTextColor={'rgba(0,0,0,0.3)'}
              />

              <TouchableOpacity
                style={{position: 'absolute', right: 0}}
                onPress={() => {
                  setShoweye(prevState => !prevState);
                }}>
                {showeye ? (
                  <ENIcon name="eye" size={20} color="black" />
                ) : (
                  <ENIcon name="eye-with-line" size={20} color="black" />
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate('Home');
                loginUser();
              }}
              style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Register');
              }}
              style={{
                marginVertical: 10,
              }}>
              <Text style={styles.loginText}>
                Not a member, Register here...
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 38,
    color: 'black',
    marginTop: 20,
    marginLeft: 20,
    fontFamily: 'Lora-Medium',
  },

  formContainer: {
    marginVertical: 10,
    marginTop: 150,
    marginHorizontal: 20,
  },
  inputLabel: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'Lora-Medium',
  },
  inputContainer: {
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.4)',
    marginVertical: 10,
    marginTop: 15,
    paddingBottom: 5,
  },
  button: {
    backgroundColor: '#6FB2D2',
    alignItems: 'center',
    borderRadius: 50,
    marginVertical: 30,
    paddingVertical: 10,
    width: '50%',
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Lora-Bold',
  },
  loginText: {
    color: 'blue',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Lora-Medium',
  },
  inputTextStyle: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'Lora-Medium',
  },
});

export default Login;
