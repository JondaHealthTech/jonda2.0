import { Ionicons, Octicons } from '@expo/vector-icons';
import * as DocumentPicker from "expo-document-picker";
import { Image } from 'expo-image';
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { uploadDocument, uploadImage } from "../rest/requester"; // Adjust the import path as necessary

export default function Index() {
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
          }
        }
      }

    } catch (error) {
      console.error("Error picking image:", error);
    }
  }

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
        }
      }

    } catch (error) {
      console.error("Error picking document:", error);
    }
  }

  const routeToChatBot = () => {
    router.push('./chatbot')
  }

  const routeToPayment = () => {
    router.push('./payment')
  }

  return (
  <View style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor="#1a237e" />
    <LinearGradient
      colors={['#00bcd4', '#3949ab', '#1a237e']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <Image style={styles.logo}
          source={require('../assets/images/jondaxicon.png')}
        />
        <View style={styles.header}>
          <Text style={styles.tagline}>
            Unlock the full potential of your health data
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.buttonContainer}>
            {/*upload form gallery button*/}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => userUploadImage(true)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#e91e63', '#ad1457']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <View style={styles.buttonContent}>
                  <Ionicons name="image" size={24} color="white" />
                  <Text style={styles.buttonText}>
                    Upload from Gallery
                  </Text>
                  <Text style={styles.buttonSubtext}>
                    Select health images from your device
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => userUploadImage(false)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#e91e63', '#ad1457']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <View style={styles.buttonContent}>
                  <Ionicons name="camera" size={24} color="white" />
                  <Text style={styles.buttonText}>
                    Capture & Upload
                  </Text>
                  <Text style={styles.buttonSubtext}>
                    Take a photo of your health data
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={pickAndUploadDocument}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#e91e63', '#ad1457']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <View style={styles.buttonContent}>
                  <Ionicons name="document-text" size={24} color="white" />
                  <Text style={styles.buttonText}>
                    Upload Document
                  </Text>
                  <Text style={styles.buttonSubtext}>
                    Import medical records & reports
                  </Text>
                </View>

              </LinearGradient>

            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={routeToChatBot}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#e91e63', '#ad1457']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <View style={styles.buttonContent}>
                  <Octicons name="dependabot" size={24} color="white" />
                  <Text style={styles.buttonText}>
                    Chat with us
                  </Text>
                  <Text style={styles.buttonSubtext}>
                    Get more out of JondaX with our AI agent
                  </Text>
                </View>

              </LinearGradient>

            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={routeToPayment}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#e91e63', '#ad1457']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <View style={styles.buttonContent}>
                  <Octicons name="dependabot" size={24} color="white" />
                  <Text style={styles.buttonText}>
                    Make Payment
                  </Text>
                  <Text style={styles.buttonSubtext}>
                    Use the Stripe payment method
                  </Text>
                </View>

              </LinearGradient>

            </TouchableOpacity>

          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  </View>
  );
}
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    marginTop: 40,
    marginBottom: 10,
    width: 300,
    height: 91,
    alignSelf: 'center',
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '300',
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    gap:20,
  },
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 24,
  },
  buttonContent: {
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '300',
  },
  footer: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  pilotButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  pilotButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});