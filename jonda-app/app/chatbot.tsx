import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    KeyboardAvoidingView,
    ListRenderItem,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { getDadJoke } from "../rest/requester";

const { width } = Dimensions.get('window');

interface Message {
    id: number;
    type: string;
    text: string;
    sender: 'me' | 'other';
    timestamp: string;
}

export default function Chatbot() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            type: 'text',
            text: 'Hello! Welcome to the chat.',
            sender: 'other',
            timestamp: new Date().toISOString(),
        }
    ]);
    const messageIdCounter = useRef<number>(2);

    const [inputText, setInputText] = useState<string>('');
    const flatListRef = useRef<FlatList<Message>>(null);

    // Speech recognition state
    const [recognizing, setRecognizing] = useState(false);
    const speechCaptured = useRef<boolean>(false);
    const speechMessageId = useRef<number>(0);

    const getNextMessageId = (): number => {
        const id = messageIdCounter.current;
        messageIdCounter.current += 1;
        return id;
    };

    // Speech recognition event handlers
    useSpeechRecognitionEvent("start", () => {
        console.log('Speech recognition started');
        setRecognizing(true);
    });

    useSpeechRecognitionEvent("end", async () => {
        console.log('Speech recognition ended');
        setRecognizing(false);
        speechCaptured.current = false;
        await getBotResponse();
    });

    useSpeechRecognitionEvent("result", (event) => {
        console.log('Speech results:', event);

        if (event.results && event.results.length > 0) {
            const transcript = event.results[0]?.transcript;
            if (transcript) {
                if (!speechCaptured.current) {
                    const voiceTextId = sendVoiceMessage(transcript);
                    if (voiceTextId !== 0) {
                        speechMessageId.current = voiceTextId;
                        speechCaptured.current = true;
                        console.log('Speech captured:', speechCaptured.current);
                    } else {
                        console.error('Error: return message id of 0');
                    }
                } else {
                    editMessage(speechMessageId.current, transcript);
                }
            }
        }
    });

    useSpeechRecognitionEvent("error", (event) => {
        console.error('Speech recognition error:', event.error, event.message);
        setRecognizing(false);
        speechCaptured.current = false;
    });

    const editMessage = (messageId: number, newText: string) => {
        console.log('Editing message:', messageId, newText);
        setMessages(prevMessages => 
            prevMessages.map(message => 
                message.id === messageId 
                    ? { ...message, text: newText }
                    : message
            )
        );
    };

    const sendTextMessage = async () => {
        if (inputText.trim()) {
            const newMessage: Message = {
                id: getNextMessageId(),
                type: 'text',
                text: inputText.trim(),
                sender: 'me',
                timestamp: new Date().toISOString(),
            };
            setMessages(prev => [...prev, newMessage]);
            setInputText('');
            scrollToBottom();

            // Simulate a response from the chatbot
            await getBotResponse();
        }
    };

    const startListening = async () => {
        console.log('Starting voice recognition...');
        try {
            const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
            if (!result.granted) {
                console.warn("Permissions not granted", result);
                return;
            }
            
            // Start speech recognition
            ExpoSpeechRecognitionModule.start({
                lang: "en-US",
                interimResults: true,
                continuous: false,
            });
        } catch (error) {
            console.error('Error starting voice recognition:', error);
        }
    };

    const stopListening = async () => {
        try {
            ExpoSpeechRecognitionModule.stop();
        } catch (error) {
            console.error('Error stopping voice recognition:', error);
        }
    };

    const sendVoiceMessage = (transcript: string): number => {
        if (transcript.trim()) {
            const newId = getNextMessageId();
            const newMessage: Message = {
                id: newId,
                type: 'voice',
                text: transcript.trim(),
                sender: 'me',
                timestamp: new Date().toISOString(),
            };
            setMessages(prev => [...prev, newMessage]);
            scrollToBottom();
            console.log('Voice message created with ID:', newId);
            return newId;
        }
        return 0;
    };

    const getBotResponse = async () => {
        try {
            const response: string = await getDadJoke();
            const botMessage: Message = {
                id: getNextMessageId(),
                type: 'text',
                text: response,
                sender: 'other',
                timestamp: new Date().toISOString(),
            };
            setMessages(prev => [...prev, botMessage]);
            scrollToBottom();
            console.log("Received dad joke:", response);
        } catch (someError) {
            console.error("Failed to fetch dad joke:", someError);
        }
    };

    const scrollToBottom = (): void => {
        setTimeout(() => {
            flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, 100);
    };

    const formatTime = (timestamp: string): string => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderMessage: ListRenderItem<Message> = ({ item }) => {
        const isMe = item.sender === 'me';
        
        return (
            <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.otherMessage]}>
                <LinearGradient
                    colors={isMe ? ['#e91e63', '#ad1457'] : ['#9c27b0', '#6a1b9a']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.messageBubble}
                >
                    <View style={[isMe ? styles.myBubble : styles.otherBubble]}>
                        {item.type === 'text' ? (
                            <View style={styles.messageContent}>
                                <Text style={styles.messageText}>
                                    {item.text}
                                </Text>
                                <Text style={styles.timestamp}>
                                    {formatTime(item.timestamp)}
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.messageContent}>
                                <View style={styles.audioContainer}>
                                    <TouchableOpacity style={styles.playButton}>
                                        <Ionicons name={"mic"} size={18} color="#fff" />
                                    </TouchableOpacity>
                                    <Text style={styles.messageText}>
                                        {item.text}
                                    </Text>
                                </View>
                                <Text style={styles.timestamp}>
                                    {formatTime(item.timestamp)}
                                </Text>
                            </View>
                        )}
                    </View>
                </LinearGradient>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <LinearGradient
                colors={['#1a237e', '#3949ab', '#00bcd4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <FlatList
                    ref={flatListRef}
                    data={[...messages].reverse()}
                    renderItem={renderMessage}
                    style={styles.messagesList}
                    inverted={true}
                    onContentSizeChange={scrollToBottom}
                    showsVerticalScrollIndicator={false}
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Type a message..."
                        multiline
                        maxLength={1000}
                        onSubmitEditing={sendTextMessage}
                    />
                        
                    <TouchableOpacity 
                        style={[
                            styles.msgButton,
                            recognizing && styles.msgButtonRecording
                        ]} 
                        onPress={sendTextMessage}
                        onLongPress={startListening}
                        onPressOut={stopListening}
                        delayLongPress={200}
                    >
                        <Ionicons 
                            name={inputText.trim() ? "send" : (recognizing ? "mic" : "mic")} 
                            size={18} 
                            color="#fff" 
                        />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },  
    messageContainer: {
        marginVertical: 4,
        maxWidth: width * 0.8,
    },
    messageBubble: {
        padding: 12,
        borderRadius: 16,
    },
    myBubble: {
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        borderBottomLeftRadius: 4,
    },
    myMessage: {
        alignSelf: 'flex-end',
    },
    otherMessage: {
        alignSelf: 'flex-start',
    },
    messageContent: {
        flexDirection: 'column',
    },
    messageText: {
        fontSize: 16,
        lineHeight: 20,
        color: 'white',
        marginBottom: 4,
    },
    timestamp: {
        fontSize: 12,
        alignSelf: 'flex-end',
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 4,
    },
    messagesList: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#2C2C2E',
        padding: 10,
        paddingBottom: 30
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        backgroundColor: 'black',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 4,
        fontSize: 16,
        maxHeight: 300,
        marginRight: 12,
        color: 'white'
    },
    msgButton: {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    msgButtonRecording: {
        backgroundColor: '#FF3B30', // Red color when recording
    },
    playButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    audioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
});