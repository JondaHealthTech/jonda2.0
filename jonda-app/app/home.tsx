import { Ionicons } from '@expo/vector-icons';
import { useStripe } from '@stripe/stripe-react-native';
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { uploadDocument, uploadImage } from "../rest/requester";

/**
 * Home Component
 * 
 * @description Main app screen that provides document/image upload functionality,
 * Stripe payment integration, and navigation to other app features like chatbot.
 * Features upload progress indicators and full-screen loading overlays.
 */
export default function Home() {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingDocument, setUploadingDocument] = useState(false);
    
    /**
     * @description Initialize payment sheet when component mounts
     */
    useEffect(() => {
        initializePaymentSheet();
    }, []);

    /**
     * @description Fetches payment intent parameters from backend API for Stripe payment sheet
     */
    const fetchPaymentSheetParams = async () => {
        try {
            const response = await fetch('https://tested-expenses-compliance-september.trycloudflare.com/create-payment-intent', {
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
    
    /**
     * @description Initializes Stripe payment sheet with client secret and configuration
     */
    const initializePaymentSheet = async () => {
        try {
            const clientSecret = await fetchPaymentSheetParams();
            
            const { error } = await initPaymentSheet({
                merchantDisplayName: "Jonda Health",
                paymentIntentClientSecret: clientSecret,
                allowsDelayedPaymentMethods: true,
                returnURL: 'jondaapp://home',
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
    
    /**
     * @description Opens Stripe payment sheet for user to complete payment
     */
    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'Your order is confirmed!');
        }
        initializePaymentSheet();
    };

    /**
     * @description Handles image selection from library or camera, uploads to server, and navigates to record page
     * @param {boolean} fromLibrary - True for library selection, false for camera capture
     */
    const userUploadImage = async (fromLibrary = true) => {
        try {
            let result = null
            if (fromLibrary) {
                await ImagePicker.requestMediaLibraryPermissionsAsync();
                result = await ImagePicker.launchImageLibraryAsync({
                    allowsEditing: true,
                });
            } else {
                await ImagePicker.requestCameraPermissionsAsync();
                    result = await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                });
            }

            if (!result.canceled) {
                console.log("Image selected:", result.assets[0].uri);
                if (result.assets.length > 0) {
                    const asset = result.assets[0];

                    setUploadingImage(true);
                    try {
                        const response = await uploadImage(
                            asset.uri, 
                            asset.type ?? 'image/jpeg', 
                            asset.fileName ?? 'upload.jpg'
                        );
                        console.log("Upload successful:", response);

                        //routing done here upon succesful upload
                        router.push('./record');
                    } catch (uploadError) {
                        console.error("Upload failed:", uploadError);
                        Alert.alert('Upload Error', 'Failed to upload image. Please try again.');
                    } finally {
                        setUploadingImage(false);
                    }
                }
            }

        } catch (error) {
            console.error("Error picking image:", error);
            setUploadingImage(false);
        }
    }

    /**
     * @description Handles document selection from device, uploads to server, and navigates to record page
     */
    const pickAndUploadDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf', // Allows all document types
            });

            if (result.canceled) {
                console.log('Document picker was canceled');
                return;
            }

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                
                setUploadingDocument(true);
                try {
                    const response = await uploadDocument(
                        asset.uri,
                        asset.mimeType ?? 'application/octet-stream',
                        asset.name ?? 'upload.pdf'
                    );

                    //routing done here upon succesful upload
                    router.push('./record');
                } catch (uploadError) {
                    console.error("Upload failed:", uploadError);
                    Alert.alert('Upload Error', 'Failed to upload document. Please try again.');
                } finally {
                    setUploadingDocument(false);
                }
            }

        } catch (error) {
            console.error("Error picking document:", error);
            setUploadingDocument(false);
        }
    }

    /**
     * @description Navigates to chatbot screen
     */
    const routeToChatBot = () => {
        router.push('./chatbot')
    }

    const isAnyUploading = uploadingImage || uploadingDocument;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E91E63" />
      
      <LinearGradient
        colors={['#E879F9', '#EC4899', '#A855F7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerSection}
      >
        <TouchableOpacity 
            style={styles.exitButton}
            onPress={() => {router.push('./')}}
            disabled={isAnyUploading}
        >
            <Ionicons name="exit-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.phoneFrame}>
          <View style={styles.documentContainer}>
            <View style={styles.documentIcon}>
              <View style={styles.documentCorner} />
              <Ionicons name="add" size={24} color="#E91E63" style={styles.plusIcon} />
              <View style={styles.documentLines}>
                <View style={[styles.line, styles.longLine]} />
                <View style={[styles.line, styles.mediumLine]} />
                <View style={[styles.line, styles.shortLine]} />
              </View>
            </View>
          </View>
          
          <Text style={styles.addRecordText}>Add Record</Text>
        </View>
      </LinearGradient>
      
      <View style={styles.bottomSection}>
        <View style={styles.uploadButtonsRow}>
          <TouchableOpacity 
            style={[styles.halfActionButton, isAnyUploading && styles.buttonDisabled]}
            onPress={() => userUploadImage(true)}
            disabled={isAnyUploading}
          >
            <View style={styles.buttonIcon}>
              {uploadingImage ? (
                <ActivityIndicator size="small" color="#4FC3F7" />
              ) : (
                <Ionicons name="images-outline" size={24} color="#4FC3F7" />
              )}
            </View>
            <Text style={[styles.buttonText, isAnyUploading && styles.buttonTextDisabled]}>
              {uploadingImage ? 'Uploading...' : 'Select an image'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.halfActionButton, isAnyUploading && styles.buttonDisabled]}
            onPress={() => userUploadImage(false)}
            disabled={isAnyUploading}
          >
            <View style={styles.buttonIcon}>
              {uploadingImage ? (
                <ActivityIndicator size="small" color="#4FC3F7" />
              ) : (
                <Ionicons name="camera-outline" size={24} color="#4FC3F7" />
              )}
            </View>
            <Text style={[styles.buttonText, isAnyUploading && styles.buttonTextDisabled]}>
              {uploadingImage ? 'Uploading...' : 'Take a picture'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>
        
        <TouchableOpacity 
            style={[styles.actionButton, isAnyUploading && styles.buttonDisabled]}
            onPress={pickAndUploadDocument}
            disabled={isAnyUploading}
        >
          <View style={styles.buttonIcon}>
            {uploadingDocument ? (
              <ActivityIndicator size="small" color="#E91E63" />
            ) : (
              <Ionicons name="folder-outline" size={24} color="#E91E63" />
            )}
          </View>
          <Text style={[styles.buttonText, isAnyUploading && styles.buttonTextDisabled]}>
            {uploadingDocument ? 'Uploading document...' : 'Upload from your device'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={[styles.floatingButton, isAnyUploading && styles.floatingButtonDisabled]}
            onPress={routeToChatBot}
            disabled={isAnyUploading}
        >
          <View style={styles.floatingButtonInner}>
            <Ionicons name="chatbubble" size={20} color="#E879F9" />
          </View>
        </TouchableOpacity>
        
        <LinearGradient style={[styles.subscriptionButton, (!loading || isAnyUploading) && styles.subscriptionButtonDisabled]}
          colors={['#E879F9', '#EC4899', '#A855F7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity
            disabled={!loading || isAnyUploading}
            onPress={openPaymentSheet}
          >
            <View style={styles.subscriptionContent}>
              <Text style={styles.subscriptionText}>Try JondaX for just $9.99</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </LinearGradient>

      </View>

      {/* Global Upload Loading Overlay - Full Screen */}
      {isAnyUploading && (
        <View style={styles.uploadingOverlay}>
          <View style={styles.uploadingCard}>
            <ActivityIndicator size="large" color="#E91E63" />
            <Text style={styles.uploadingText}>
              {uploadingImage ? 'Uploading image...' : 'Uploading document...'}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

/**
 * Styles for the Home component
 * 
 * @description Defines the visual styling and layout for the home screen including:
 * - Gradient header with document icon and exit button
 * - Upload buttons with disabled states and loading indicators
 * - Floating chatbot button and subscription payment section
 * - Full-screen loading overlay for upload operations
 * - Responsive button layouts and visual feedback states
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    flex: 0.65,
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  documentContainer: {
    marginBottom: 40,
  },
  documentIcon: {
    width: 80,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  documentCorner: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: 8,
  },
  plusIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  documentLines: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'flex-start',
  },
  line: {
    backgroundColor: '#4A5568',
    marginBottom: 4,
    borderRadius: 1,
  },
  longLine: {
    width: 40,
    height: 3,
  },
  mediumLine: {
    width: 30,
    height: 3,
  },
  shortLine: {
    width: 20,
    height: 3,
  },
  addRecordText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    justifyContent: 'flex-start',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
    flex: 1,
  },
  buttonDisabled: {
    backgroundColor: '#F5F5F5',
    opacity: 0.6,
  },
  buttonTextDisabled: {
    color: '#A0A0A0',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E91E63',
  },
  orText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
    color: '#E91E63',
  },
  subscriptionButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  subscriptionButtonDisabled: {
    opacity: 0.6,
  },
  subscriptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscriptionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },  
  uploadButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 0.48,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  floatingButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E879F9',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 'auto',
    marginBottom: 20,
  },
  floatingButtonDisabled: {
    opacity: 0.6,
  },
  floatingButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 11,
  },
  exitButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignSelf: 'flex-end'
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  uploadingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  uploadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
  },
});