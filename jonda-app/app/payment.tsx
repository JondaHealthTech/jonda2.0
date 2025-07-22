import { useStripe } from '@stripe/stripe-react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    View,
} from 'react-native';

export default function PaymentScreen() {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        initializePaymentSheet();
    }, []);

    const fetchPaymentSheetParams = async () => {
        try {
            const response = await fetch('https://morrison-cu-fu-ruling.trycloudflare.com/create-payment-intent', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                amount: 999, // $9.99
                currency: 'sgd',
                }),
            });

            const data = await response.json();
            return data.clientSecret;
        } catch (error) {
            console.error('Error fetching payment sheet params:', error);
            throw error;
        }
    };

    const initializePaymentSheet = async () => {
        try {
            const clientSecret = await fetchPaymentSheetParams();
            
            const { error } = await initPaymentSheet({
                merchantDisplayName: "Jonda Health",
                paymentIntentClientSecret: clientSecret,
                allowsDelayedPaymentMethods: true,
                returnURL: 'jondaapp://payment',
                defaultBillingDetails: {
                    name: 'Guest Customer',
                },
                style: 'alwaysDark',
                googlePay: {
                    merchantCountryCode: 'SG',
                    testEnv: true,
                },
            });

            if (error) {
                Alert.alert('Setup Error', error.message);
            } else {
                setLoading(true);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to initialize payment');
            console.error('Payment initialization error:', error);
        }
    };

    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'Your order is confirmed!');
        }
        router.push('./')
    };

    return (
        <View>
        <Button
            disabled={!loading}
            title="Checkout"
            onPress={openPaymentSheet}
        />
        
        <Button
            disabled={!loading}
            title="Checkout"
            onPress={openPaymentSheet}
        />

        <Button
            disabled={!loading}
            title="Checkout"
            onPress={openPaymentSheet}
        />
        
        <Button
            disabled={!loading}
            title="Checkout"
            onPress={openPaymentSheet}
        />
        </View>
    );
}
