import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Bubble, GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat';
import ChatFaceData from '../Services/ChatFaceData';
import GlobalApi from '../Services/GlobalApi';

const CHAT_BOT_FACE_DEFAULT = 'https://res.cloudinary.com/dknvsbuyy/image/upload/v1685678135/chat_1_c7eda483e3.png';

export default function ChatScreen() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chatFaceColor, setChatFaceColor] = useState();
    const [chatBotFace, setChatBotFace] = useState(CHAT_BOT_FACE_DEFAULT);

    useEffect(() => {
        checkFaceId();
    }, []);

    const checkFaceId = async () => {
        const id = await AsyncStorage.getItem('chatFaceId');
        const faceData = id ? ChatFaceData[id] : ChatFaceData[0];

        if (faceData) {
            setChatBotFace(faceData.image);
            setChatFaceColor(faceData.primary);
            setMessages([
                {
                    _id: 1,
                    text: 'Hello, I am ' + faceData.name + ', How Can I help you?',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: faceData.image,
                    },
                },
            ]);
        } else {
            console.error('ChatFaceData[id] is undefined');
        }
    };

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        if (messages[0].text) {
            getBardResp(messages[0].text);
        }
    }, []);

    const getBardResp = (msg) => {
        setLoading(true);
        GlobalApi.getBardApi(msg).then(resp => {
            console.log('API Response:', resp); // Debugging API response
            
            if (resp && resp.data && resp.data.text) {
                // Correctly extracting the response from the `data.text` field
                setLoading(false);
                const chatAIResp = {
                    _id: Math.random() * (9999999 - 1),
                    text: resp.data.text,  // Use the correct field
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: chatBotFace,
                    },
                };
                setMessages(previousMessages => GiftedChat.append(previousMessages, chatAIResp));
            } else {
                console.warn('Unexpected API Response format:', resp);  // If response format changes unexpectedly
                handleNoResponse();
            }
        }).catch(error => {
            setLoading(false);
            console.error('Error fetching Bard response:', error);  // Error handling
            handleNoResponse();
        });
    };

    const handleNoResponse = () => {
        const chatAIResp = {
            _id: Math.random() * (9999999 - 1),
            text: "Sorry, I can not help with it",
            createdAt: new Date(),
            user: {
                _id: 2,
                name: 'React Native',
                avatar: chatBotFace,
            },
        };
        setMessages(previousMessages => GiftedChat.append(previousMessages, chatAIResp));
    };

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#671ddf',
                    },
                    left: {},
                }}
                textStyle={{
                    right: {
                        padding: 2,
                    },
                    left: {
                        color: '#671ddf',
                        padding: 2,
                    },
                }}
            />
        );
    };

    const renderInputToolbar = (props) => {
        return (
            <InputToolbar
                {...props}
                containerStyle={{
                    padding: 3,
                    backgroundColor: '#671ddf',
                    color: '#fff',
                }}
                textInputStyle={{ color: "#fff" }}
            />
        );
    };

    const renderSend = (props) => {
        return (
            <Send {...props}>
                <View style={{ marginRight: 10, marginBottom: 5 }}>
                    <FontAwesome name="send" size={24} color="white" resizeMode={'center'} />
                </View>
            </Send>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <GiftedChat
                messages={messages}
                isTyping={loading}
                multiline={true}
                onSend={messages => onSend(messages)}
                user={{ _id: 1 }}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                renderSend={renderSend}
            />
        </View>
    );
}
