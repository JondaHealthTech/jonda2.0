import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Record() {

    const [jsonData] = useState<{[key: string]: any}>({
        name: "John Doe",
        email: "john@example.com",
        age: 25,
        city: "New York"
    });

    return (
        <View style={styles.container}>
            <LinearGradient 
                colors={['#00bcd4', '#3949ab', '#1a237e']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}>

                <SafeAreaView style={styles.safe_area}>
                    <ScrollView style={styles.data_container}>
                        {Object.keys(jsonData).map((key) => (
                            <View key={key} style={styles.field_container}>
                                <Text style={styles.key}> {key.toLocaleUpperCase()} </Text>
                                <Text style={styles.value}> {jsonData[key]?.toString() || ''} </Text>
                            </View>
                        ))}
                    </ScrollView>
                </SafeAreaView>

            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
    },
    gradient:{
        flex: 1
    },
    data_container: {
        padding: 20,
        backgroundColor: 'transparent'
    },
    field_container: {
        marginBottom: 15,
    },
    key: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
        color: 'white',
    },
    value: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    safe_area: {
        flex: 1
    }
});