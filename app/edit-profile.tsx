import { Alert as CustomAlert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { RView } from '@/components/ui/rview';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { useCMS } from '@/hooks/useCMS';
import { useTheme } from '@/hooks/useTheme';
import { authService } from '@/services/auth.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import { createEditProfileStyles } from '@/styles/screens/edit-profile.styles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditProfile() {
  const { t } = useCMS();
  const { theme, colors } = useTheme();
  const styles = useMemo(() => createEditProfileStyles(theme), [theme]);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // Form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const hasChanges = () => {
    // Check if name or password has changed
    return name !== user?.name || password.trim() !== '';
  };

  const validateForm = (): string | null => {
    if (!name.trim()) {
      return t('account.editProfile.validation.nameRequired');
    }
    if (name.trim().length < 2) {
      return t('account.editProfile.validation.nameMinLength');
    }

    // Validate password only if it's being changed
    if (password.trim() !== '') {
      if (password.length < 6) {
        return t('account.editProfile.validation.newPasswordMinLength');
      }
    }

    return null;
  };

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      setShowErrorAlert(true);
      return;
    }

    setIsLoading(true);

    try {
      // Update name and password (if provided)
      const updatedUser = await authService.updateProfile({
        id: user?.id || 0,
        name: name.trim(),
        email: user?.email || '',
        phone: user?.phone || '',
        ...(password.trim() !== '' && { password: password.trim() }),
      });

      dispatch(updateUser(updatedUser));
      setShowSuccessAlert(true);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      // Show specific error message if available
      const errorMsg = error?.message || t('account.editProfile.alerts.updateFailed');
      setErrorMessage(errorMsg);
      setShowErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title={t('account.editProfile.title')}
        onBack={() => router.back()}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile Avatar */}
          <RView style={styles.avatarContainer}>
            <RView style={styles.avatar}>
              <Text variant="title" style={styles.avatarText}>
                {getInitial(name)}
              </Text>
            </RView>
            <TouchableOpacity style={styles.editIconButton}>
              <Ionicons name="pencil" size={16} color={colors.text} />
            </TouchableOpacity>
          </RView>

          {/* Form Fields */}
          <RView style={styles.formContainer}>
            <Input
              label={t('account.editProfile.nameLabel')}
              placeholder={t('account.editProfile.namePlaceholder')}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              style={styles.input}
            />

            <Input
              label={t('account.editProfile.emailLabel')}
              placeholder={t('account.editProfile.emailPlaceholder')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              editable={false}
            />

            <PasswordInput
              label={t('account.editProfile.newPasswordLabel')}
              placeholder={t('account.editProfile.newPasswordPlaceholder')}
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />
          </RView>
        </ScrollView>

        {/* Update Button */}
        <RView style={styles.buttonContainer}>
          <Button
            title={t('account.editProfile.saveChanges')}
            onPress={handleSave}
            loading={isLoading}
            disabled={!hasChanges() || isLoading}
            style={styles.updateButton}
          />
        </RView>
      </KeyboardAvoidingView>

      {/* Success Alert */}
      <CustomAlert
        visible={showSuccessAlert}
        title={t('account.editProfile.alerts.successTitle')}
        message={t('account.editProfile.alerts.profileUpdated')}
        buttons={[
          {
            text: t('common.ok'),
            onPress: () => {
              setShowSuccessAlert(false);
              router.back();
            },
          },
        ]}
        onDismiss={() => {
          setShowSuccessAlert(false);
          router.back();
        }}
      />

      {/* Error Alert */}
      <CustomAlert
        visible={showErrorAlert}
        title={t('account.editProfile.alerts.errorTitle')}
        message={errorMessage}
        buttons={[
          {
            text: t('common.ok'),
            onPress: () => setShowErrorAlert(false),
          },
        ]}
        onDismiss={() => setShowErrorAlert(false)}
      />
    </SafeAreaView>
  );
}
