import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import {Container} from '../../../components/container';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-simple-toast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import database from '@react-native-firebase/database';
import ENIcon from 'react-native-vector-icons/Entypo';

const Register = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showeye, setShoweye] = useState(false);

  const registerUser = () => {
    try {
      setLoading(true);

      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(user => {
          Toast.show('User Created Successfully', Toast.SHORT, [
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
      <KeyboardAwareScrollView>
        <SafeAreaView>
          <Text style={styles.title}>ʀᴇɢɪꜱᴛᴇʀ ᴛᴏ ᴍʏᴄʜᴀᴛ</Text>

          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>Enter Name</Text>

            <View style={styles.inputContainer}>
              <TextInput
                value={name}
                onChangeText={val => setName(val)}
                style={styles.inputTextStyle}
                placeholderTextColor={'rgba(0,0,0,0.3)'}
                placeholder="Your Name"
              />
            </View>

            <Text
              style={{
                ...styles.inputLabel,
                marginTop: 20,
              }}>
              Enter Email
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                value={email}
                onChangeText={val => setemail(val)}
                style={styles.inputTextStyle}
                placeholder="Email"
                placeholderTextColor={'rgba(0,0,0,0.3)'}
              />
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
                secureTextEntry={!showeye}
                style={styles.inputTextStyle}
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
                registerUser();
              }}
              style={styles.button}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Login');
              }}
              style={{
                marginVertical: 10,
              }}>
              <Text style={styles.loginText}>
                Have an account, login here...
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
    marginTop: 130,
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

export default Register;
