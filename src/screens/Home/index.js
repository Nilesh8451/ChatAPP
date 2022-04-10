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
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-simple-toast';
import {useDispatch, useSelector} from 'react-redux';
import database from '@react-native-firebase/database';
import {removeUserFun} from '../../redux/action';

const Home = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState('');
  const infoOfUser = useSelector(state => state.userInfo.loginData);
  const dispatch = useDispatch();

  const getUsersList = async () => {
    try {
      database()
        .ref('/Users')
        .on('value', snapshot => {
          let res = snapshot?.val?.();

          if (res !== null) {
            let arr = [];

            for (let i in res) {
              arr.push({
                ...res[i],
                databaseId: i,
              });
            }

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
        <View style={styles.header}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={{width: 40, height: 40, borderRadius: 50, marginRight: 8}}
              source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlR3hMw_3daUL3Uhr5Y3uJh_kMaYzyqQhhPA&usqp=CAU',
              }}
            />
            <Text style={styles.username}>{userName}</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              logoutUser();
            }}>
            <Image
              resizeMode="contain"
              style={{width: 40, height: 40, borderRadius: 50, marginRight: 0}}
              source={require('../../assets/images/logout.webp')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.titleView}>
          <Text style={{...styles.titleColor, fontFamily: 'Lora-Bold'}}>
            List Of Contacts ({users.length})
          </Text>
        </View>
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
                      fontFamily: 'Lora-Medium',
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
                      fontFamily: 'Lora-Medium',
                    }}>
                    {item.name} {item.uid == infoOfUser?.uid ? '(YOU)' : null}
                  </Text>
                </View>
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
  },
  header: {
    flexDirection: 'row',
    marginVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  username: {
    fontSize: 19,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Lora-Medium',
  },
  titleView: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleColor: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  contactView: {
    backgroundColor: '#6FB2D2',
    marginHorizontal: 10,
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
