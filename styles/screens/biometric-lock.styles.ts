import { StyleSheet } from 'react-native';

export const biometricLockStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1d2e',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  top: {
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 4,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  greeting: {
    color: '#aaa',
    fontSize: 15,
    marginTop: 4,
  },
  middle: {
    alignItems: 'center',
    gap: 16,
  },
  iconRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFF1EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#FF634730',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
  },
  bottom: {
    alignItems: 'center',
    gap: 20,
    width: '100%',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FF6347',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    width: '100%',
  },
  scanText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  passwordButton: {
    paddingVertical: 8,
  },
  passwordText: {
    color: '#666',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
