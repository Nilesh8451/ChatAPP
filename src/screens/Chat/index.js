import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Container} from '../../components/container';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import IIcon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

const ChatScreen = ({route, navigation}) => {
  console.log('r........', route);
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      database()
        .ref('/Messages')
        .on('value', snapshot => {
          console.log('Snapshot', snapshot);
          let res = snapshot?.val?.();
          console.log('res', res);

          if (res !== null) {
            console.log(res);
            console.log(Object.values(res));

            let data = Object.values(res);

            data = data.sort(function (a, b) {
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(b.time) - new Date(a.time);
            });

            if (messageList.length != data.length) {
              console.log('Called in if.............');
              setMessageList(Object.values(data));
            }

            setLoading(false);
          }

          setLoading(false);
        });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }, []);

  const sendMessage = () => {
    if (message) {
      const newReference = database().ref('/Messages').push();

      newReference
        .set({
          fromUid: route.params?.loginUserInfo?.uid,
          toUid: route.params?.data?.uid,
          message: message,
          time: new Date().toUTCString(),
        })
        .then(() => setMessage(''));
    }
  };

  return (
    <Container style={{flex: 1}} loading={loading}>
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            overflow: 'hidden',
            paddingBottom: 5,
          }}>
          <View
            style={{
              paddingHorizontal: 10,
              backgroundColor: '#fff',
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              paddingVertical: 10,
              shadowOffset: {width: 1, height: 1},
              shadowOpacity: 0.4,
              shadowRadius: 3,
              elevation: 5,
            }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                style={{width: 30, height: 30, marginRight: 5}}
                source={require('../../assets/images/left-arrow-personal.png')}
              />
            </TouchableOpacity>
            <Image
              style={{width: 40, height: 40, borderRadius: 50, marginRight: 8}}
              source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlR3hMw_3daUL3Uhr5Y3uJh_kMaYzyqQhhPA&usqp=CAU',
              }}
            />
            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: 18,
                fontFamily: 'Lora-Bold',
              }}>
              {route.params.name}
            </Text>
          </View>
        </View>

        {isEmpty == true && loading == false ? (
          <View style={{flex: 1}}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Lora-Medium',
                textAlign: 'center',
                marginTop: 50,
                paddingHorizontal: 20,
                color: 'black',
              }}>
              No Chat history available
            </Text>

            <Image
              source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSZrWhxO9pH9c-SmYSlEkw6_pVB3nGsuol-A&usqp=CAU',
              }}
              style={{width: '100%', height: 200, marginTop: 20}}
              resizeMode="contain"
            />

            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Lora-Medium',
                textAlign: 'center',
                marginTop: 30,
                paddingHorizontal: 20,
                color: 'black',
              }}>
              Start Sending Messages.....
            </Text>
          </View>
        ) : null}

        <FlatList
          inverted
          style={{marginBottom: 70}}
          data={messageList}
          keyExtractor={(item, index) =>
            item?.time?.toString() + index.toString()
          }
          renderItem={({item, index}) => {
            if (
              route.params?.loginUserInfo?.uid == item.fromUid &&
              item.toUid == route.params?.data?.uid
            ) {
              if (isEmpty == true) {
                setIsEmpty(false);
              }

              return (
                <TouchableOpacity activeOpacity={0.9} style={{}}>
                  <View style={{paddingHorizontal: 10, marginVertical: 10}}>
                    <Text
                      style={{
                        alignSelf: 'flex-end',
                        fontSize: 10,
                        marginBottom: 5,
                        color: 'black',
                        fontFamily: 'Lora-Medium',
                      }}>
                      {moment(new Date(item.time)).format('h:mm a')}
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                      }}>
                      {/* <Image
                        style={{width: 30, height: 30, borderRadius: 50}}
                        source={{
                          uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBeJIaj90AxSdQ4kugN7RK9TPBhiMcFKiiuXZ6FNw4Sj5mZ8xvPfARHTlsOyerqs8tLS4&usqp=CAU',
                        }}
                      /> */}

                      <View
                        style={{
                          backgroundColor: '#C1F8CF',
                          width: 200,
                          borderRadius: 5,
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            color: 'black',
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            fontFamily: 'Lora-Medium',
                            fontSize: 15,
                          }}>
                          {item.message}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            } else if (
              route.params?.loginUserInfo?.uid == item.toUid &&
              item.fromUid == route.params?.data?.uid
            ) {
              if (isEmpty == true) {
                setIsEmpty(false);
              }

              return (
                <TouchableOpacity activeOpacity={0.9} style={{}}>
                  <View style={{paddingHorizontal: 10, marginVertical: 10}}>
                    <Text
                      style={{
                        // alignSelf: 'flex-start',
                        left: 165,
                        fontSize: 10,
                        marginBottom: 5,
                        color: 'black',
                        fontFamily: 'Lora-Medium',
                      }}>
                      {moment(new Date(item.time)).format('h:mm a')}
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      {/* <Image
                        style={{width: 30, height: 30, borderRadius: 50}}
                        source={{
                          uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2-lk-RYREmhV89n8yLwXTuOW2wkBMi_RLTg&usqp=CAU',
                        }}
                      /> */}

                      <View
                        style={{
                          backgroundColor: '#D8D2CB',
                          width: 200,
                          borderRadius: 5,
                        }}>
                        <Text
                          style={{
                            color: 'black',
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            fontFamily: 'Lora-Medium',

                            color: 'black',
                            fontSize: 15,
                          }}>
                          {item.message}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            } else {
              return <></>;
            }
          }}
        />

        <View style={{position: 'absolute', bottom: 10, width: '100%'}}>
          <View
            style={{
              marginHorizontal: 10,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <TextInput
              onSubmitEditing={() => sendMessage()}
              style={{
                borderWidth: 1,
                borderRadius: 17,
                flex: 1,
                height: 40,
                color: 'black',
                paddingHorizontal: 10,
                fontFamily: 'Lora-Medium',
              }}
              value={message}
              onChangeText={val => setMessage(val)}
              placeholder="Type Something..."
              placeholderTextColor={'black'}
            />
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                sendMessage();
              }}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#6FB2D2',
                // width: '28%',
                marginLeft: 5,
                borderRadius: 17,
                height: 40,
                width: 45,
              }}>
              <IIcon name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Container>
  );
};

export default ChatScreen;
