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

/**
 * Interface defining the structure of a chat message
 * 
 * @description Defines the shape of message objects used throughout the chat interface
 */
interface Message {
    id: number;
    type: string;
    text: string;
    sender: 'me' | 'other';
    timestamp: string;
}

/**
 * Chatbot Component
 * 
 * @description A comprehensive chat interface that supports both text and voice messaging.
 * Features include speech recognition, message timestamps, and animated gradients.
 * 
 * @component
 * @example
 * // Used in navigation stack
 * <Stack.Screen name="chatbot" component={Chatbot} />
 * 
 * Key Features:
 * - Text messaging with real-time input
 * - Voice recognition with long-press activation
 * - Message history with timestamps
 * - Animated gradient backgrounds
 * - Bot responses via dad joke API
 * - Cross-platform keyboard handling
 */
export default function Chatbot() {
    // Message state and management
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

    // Text input state
    const [inputText, setInputText] = useState<string>('');
    const flatListRef = useRef<FlatList<Message>>(null);

    // Speech recognition state
    const [recognizing, setRecognizing] = useState(false);
    const speechCaptured = useRef<boolean>(false);
    const speechMessageId = useRef<number>(0);

    /**
     * @description Generates the next unique message ID
     * @returns {number} Next available message ID
     */
    const getNextMessageId = (): number => {
        const id = messageIdCounter.current;
        messageIdCounter.current += 1;
        return id;
    };

    // Speech recognition event handlers
    
    /**
     * @description Handles speech recognition start event. Sets recognizing state to true
     */
    useSpeechRecognitionEvent("start", () => {
        console.log('Speech recognition started');
        setRecognizing(true);
    });

    /**
     * @description Handles speech recognition end event. Resets states and triggers bot response
     */
    useSpeechRecognitionEvent("end", async () => {
        console.log('Speech recognition ended');
        setRecognizing(false);
        speechCaptured.current = false;
        await getBotResponse();
    });

    /**
     * @description Handles speech recognition results. Creates or updates voice messages based on transcription
     */
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

    /**
     * @description Handles speech recognition errors. Resets recognition state on error
     */
    useSpeechRecognitionEvent("error", (event) => {
        console.error('Speech recognition error:', event.error, event.message);
        setRecognizing(false);
        speechCaptured.current = false;
    });

    /**
     * @description Edits an existing message with new text
     * @param {number} messageId - ID of message to edit
     * @param {string} newText - New text content
     */
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

    /**
     * @description Sends a text message from user input. Clears input field and triggers bot response
     */
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

    /**
     * @description Initiates speech recognition. Requests permissions and starts listening
     */
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

    /**
     * @description Stops speech recognition
     */
    const stopListening = async () => {
        try {
            ExpoSpeechRecognitionModule.stop();
        } catch (error) {
            console.error('Error stopping voice recognition:', error);
        }
    };

    /**
     * @description Creates a voice message from speech transcript
     * @param {string} transcript - Speech-to-text result
     * @returns {number} Message ID or 0 if failed
     */
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

    /**
     * @description Fetches and displays bot response. Currently uses dad joke API as placeholder
     */
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

    /**
     * @description Scrolls chat to bottom (most recent messages)
     */
    const scrollToBottom = (): void => {
        setTimeout(() => {
            flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, 100);
    };

    /**
     * @description Formats timestamp for display
     * @param {string} timestamp - ISO timestamp string
     * @returns {string} Formatted time string (HH:MM)
     */
    const formatTime = (timestamp: string): string => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    /**
     * @description Renders individual message bubbles. Handles both text and voice message types
     */
    const renderMessage: ListRenderItem<Message> = ({ item }) => {
        const isMe = item.sender === 'me';
        
        return (
            <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.otherMessage]}>
                <LinearGradient
                    colors={isMe ? ['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.75)', 'rgba(255,255,255,1)'] : ['rgba(248,250,252,1)', 'rgba(241,245,249,0.75)', 'rgba(226,232,240,0.5)']}
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
                colors={['#E879F9', '#EC4899', '#A855F7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                {/* Messages List - Inverted to show latest at bottom */}
                <FlatList
                    ref={flatListRef}
                    data={[...messages].reverse()}
                    renderItem={renderMessage}
                    style={styles.messagesList}
                    inverted={true}
                    onContentSizeChange={scrollToBottom}
                    showsVerticalScrollIndicator={false}
                />

                {/* Input Container - Text input and send/voice button */}
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
                        
                    {/* Multi-function button: Send text or voice recording */}
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

/**
 * Styles for the Chatbot component
 * 
 * @description Layout Structure:
 * - Container: Full screen with gradient background
 * - Messages: Inverted FlatList for chat-like experience
 * - Input: Fixed bottom container with text input and action button
 * 
 * Message Styling:
 * - Gradient bubbles with rounded corners
 * - Different colors for user vs bot messages
 * - Timestamps aligned to message end
 * - Voice messages include microphone icon
 * 
 * Interactive Elements:
 * - Button changes color when recording
 * - Keyboard avoiding behavior for better UX
 * - Touch feedback on all interactive elements
 */
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
        color: 'black',
        marginBottom: 4,
    },
    timestamp: {
        fontSize: 12,
        alignSelf: 'flex-end',
        color: 'black',
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
        backgroundColor: '#000000',
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