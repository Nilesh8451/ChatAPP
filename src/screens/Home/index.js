import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Container} from '../../components/container';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-simple-toast';
import {useDispatch, useSelector} from 'react-redux';
import database from '@react-native-firebase/database';
import {useFocusEffect} from '@react-navigation/native';
import {removeUserFun} from '../../redux/action';

let listner = '';

const Home = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState('');
  const infoOfUser = useSelector(state => state.userInfo.loginData);
  const dispatch = useDispatch();

  const getUsersList = async () => {
    try {
      listner = database()
        .ref('/Users')
        .on('value', snapshot => {
          console.log('Snapshot', snapshot);
          let res = snapshot?.val?.();
          console.log('res', res);

          if (res !== null) {
            console.log(res);
            console.log(Object.values(res));

            let arr = [];

            for (let i in res) {
              console.log(res[i]);

              arr.push({
                ...res[i],
                databaseId: i,
              });
            }

            console.log('______', arr);

            arr = arr.sort((a, b) => a?.name?.localeCompare(b.name));

            setUsers(arr);

            setLoading(false);
          }

          setLoading(false);
        });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     getUsersList();
  //   }, []),
  // );

  useEffect(() => {
    getUsersList();
  }, []);

  const logoutUser = () => {
    dispatch(removeUserFun());

    auth()
      .signOut()
      .then(() => {
        Toast.show('Successfully logged out!', Toast.SHORT, [
          'RCTModalHostViewController',
        ]);
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <Container style={styles.container} loading={loading}>
      <SafeAreaView>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 10,
            paddingHorizontal: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={{width: 50, height: 50, borderRadius: 50, marginRight: 8}}
              source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdeISxwuZFqn8vs5k6d000EhssO8_edPRKf8W3NUwevXrh-s5FPwLQk2GPZywaYjRhZJ8&usqp=CAU',
              }}
            />
            <Text
              style={{
                fontSize: 19,
                color: 'black',
                fontWeight: 'bold',
                fontFamily: 'ZillaSlab-Medium',
              }}>
              {userName}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              logoutUser();
            }}>
            <Text
              style={{
                fontSize: 18,
                color: '#EF6D6D',
                fontWeight: 'bold',
                fontFamily: 'ZillaSlab-Medium',
              }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.titleView}>
          <Text style={{...styles.titleColor, fontFamily: 'ZillaSlab-Bold'}}>
            Contact List
          </Text>
          {/* <TouchableOpacity
            onPress={() => {
              getUsersList();
            }}>
            <Image
              source={require('../../assets/images/refresh.png')}
              style={{width: 35, height: 35}}
            />
          </TouchableOpacity> */}
        </View>
        {console.log('users___', users)}
        <FlatList
          showsVerticalScrollIndicator={false}
          bounces={false}
          data={users}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => {
            if (item.uid == infoOfUser?.uid) {
              setUserName(item.name);
            }

            return (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('Chat', {
                    name: item.name,
                    data: item,
                    loginUserInfo: infoOfUser,
                  })
                }
                style={styles.contactView}>
                <View style={styles.leftView}>
                  <Text
                    style={{
                      ...styles.leftText,
                      textTransform: 'uppercase',
                      color: 'black',
                      fontFamily: 'ZillaSlab-Medium',
                    }}>
                    {item?.name?.slice(0, 1)}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      ...styles.nameText,
                      textTransform: 'capitalize',
                      color: 'black',
                      fontFamily: 'ZillaSlab-Medium',
                    }}>
                    {item.name}
                  </Text>
                </View>

                {item.uid == infoOfUser?.uid ? (
                  <View
                    style={{
                      position: 'absolute',
                      right: 10,
                      width: 35,
                      height: 30,
                      borderRadius: 25,
                      borderWidth: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'white',
                      fontFamily: 'ZillaSlab-Medium',
                    }}>
                    <Text
                      style={{
                        color: 'black',
                      }}>
                      Me
                    </Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    </Container>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',

    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  titleView: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleColor: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  contactView: {
    backgroundColor: '#A2D2FF',
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 5,
    paddingLeft: 10,
  },
  leftView: {
    width: 30,
    height: 30,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5E3C9',
    marginVertical: 5,
    marginRight: 10,
  },
  leftText: {
    fontWeight: '900',
    fontSize: 16,
  },
  nameText: {
    fontSize: 16,
    color: 'black',
  },
});
export default Home;
