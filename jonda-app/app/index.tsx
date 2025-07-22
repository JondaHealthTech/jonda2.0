import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (username.trim() !== '' && password.trim() !== '') {
      setIsLoading(true);
      
      // 1 second loading delay
      setTimeout(() => {
        setIsLoading(false);
        // Navigate to index page
        router.push('./home');
      }, 1000);
    }
  };

  const isLoginDisabled = (): boolean => {
    return !username.trim() || !password.trim() || isLoading;
  };

  return (
    <LinearGradient
      colors={['#E879F9', '#EC4899', '#A855F7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    > 
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.heartContainer}>
              <Ionicons name="heart" size={64} color="white" />
              <View style={styles.heartDot} />
            </View>
            <Text style={styles.logoText}>jonda</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Password"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="rgba(255, 255, 255, 0.7)"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.loginButton,
                isLoginDisabled() ? styles.loginButtonDisabled : styles.loginButtonEnabled
              ]}
              onPress={handleLogin}
              disabled={isLoginDisabled()}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#EC4899" />
                  <Text style={styles.loadingText}>Logging in...</Text>
                </View>
              ) : (
                <Text style={[
                  styles.loginButtonText,
                  isLoginDisabled() ? styles.loginButtonTextDisabled : styles.loginButtonTextEnabled
                ]}>
                  Log In
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.optionsContainer}>
              <TouchableOpacity style={styles.forgotPassword} disabled={isLoading}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
              
              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <TouchableOpacity disabled={isLoading}>
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.waveContainer}>
          <View style={styles.wave} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 80,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  heartContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heartDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    backgroundColor: '#F8BBD9',
    borderRadius: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '300',
    color: 'white',
    letterSpacing: 1,
  },
  formContainer: {
    width: '100%',
    maxWidth: 320,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 16,
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  passwordInput: {
    paddingRight: 56,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
    padding: 4,
  },
  loginButton: {
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    minHeight: 56,
    justifyContent: 'center',
  },
  loginButtonEnabled: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  loginButtonTextEnabled: {
    color: '#EC4899',
  },
  loginButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#EC4899',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  optionsContainer: {
    alignItems: 'center',
    paddingTop: 16,
  },
  forgotPassword: {
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signUpText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  signUpLink: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    opacity: 0.3,
  },
  wave: {
    flex: 1,
    borderTopLeftRadius: width,
    borderTopRightRadius: width,
    transform: [{ scaleX: 2 }],
  },
});