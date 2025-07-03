import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Record Component
 * 
 * Displays processed health data or document information in a formatted view.
 * This screen is typically navigated to after successful file uploads from the home screen.
 * 
 * @component
 * @example
 * // Used in navigation stack after successful upload
 * router.push('./record');
 * 
 * Key Features:
 * - Dynamic JSON data rendering
 * - Scrollable content for large datasets
 * - Gradient background matching app theme
 * - Responsive field display with key-value pairs
 * - Safe area handling for different device sizes
 */
export default function Record() {

    /**
     * JSON data state containing the processed information
     * Currently uses sample data - in production this would be populated
     * from the uploaded file processing results
     * 
     * @type {Object<string, any>} Key-value pairs of processed data
     */
    const [jsonData] = useState<{[key: string]: any}>({
        name: "John Doe",
        email: "john@example.com",
        age: 25,
        city: "New York"
    });

    return (
        <View style={styles.container}>
            {/* Main gradient background matching app theme */}
            <LinearGradient 
                colors={['#00bcd4', '#3949ab', '#1a237e']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}>

                <SafeAreaView style={styles.safe_area}>
                    {/* Scrollable container for data fields */}
                    <ScrollView style={styles.data_container}>
                        {/* Dynamic rendering of all JSON key-value pairs */}
                        {Object.keys(jsonData).map((key) => (
                            <View key={key} style={styles.field_container}>
                                {/* Field label - uppercase for visual consistency */}
                                <Text style={styles.key}> {key.toLocaleUpperCase()} </Text>
                                {/* Field value - safely handles null/undefined values */}
                                <Text style={styles.value}> {jsonData[key]?.toString() || ''} </Text>
                            </View>
                        ))}
                    </ScrollView>
                </SafeAreaView>

            </LinearGradient>
        </View>
    );
}

/**
 * Styles for the Record component
 * 
 * Layout Structure:
 * - Container: Full screen with gradient background
 * - Data Container: Scrollable area with padding for content
 * - Field Container: Individual data field with label and value
 * 
 * Visual Design:
 * - Gradient background consistent with app theme
 * - White text labels for contrast against gradient
 * - Light input-style background for values
 * - Proper spacing and typography hierarchy
 * 
 * Responsive Design:
 * - SafeAreaView handles device-specific safe areas
 * - ScrollView ensures content is accessible on all screen sizes
 * - Flexible styling adapts to different data field counts
 */
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