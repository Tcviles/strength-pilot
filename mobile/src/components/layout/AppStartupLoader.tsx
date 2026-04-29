import React from 'react';
import { ActivityIndicator, Image, ImageBackground, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../hooks/useTheme';

export function AppStartupLoader() {
  const { palette } = useTheme();

  return (
    <SafeAreaView
      edges={['top']}
      style={[appStartupLoaderStyles.safeArea, { backgroundColor: palette.page }]}
    >
      <StatusBar barStyle="light-content" />
      <View pointerEvents="none" style={appStartupLoaderStyles.backgroundWrap}>
        <ImageBackground
          source={require('../../media/AppBackground.png')}
          style={appStartupLoaderStyles.backgroundImageFill}
          imageStyle={[appStartupLoaderStyles.backgroundImageCover, appStartupLoaderStyles.authBackgroundImage]}
          resizeMode="cover"
        >
          <View
            style={[
              appStartupLoaderStyles.authBackgroundOverlay,
              { backgroundColor: palette.page },
            ]}
          />
        </ImageBackground>
      </View>
      <View style={appStartupLoaderStyles.startupLoaderWrap}>
        <View style={[appStartupLoaderStyles.startupLoaderCard, { backgroundColor: palette.card, borderColor: palette.line }]}>
          <Image
            source={require('../../media/LoginLogo.png')}
            style={appStartupLoaderStyles.startupLoaderLogo}
            resizeMode="contain"
          />
          <ActivityIndicator color={palette.accent} size="large" />
          <Text style={[appStartupLoaderStyles.startupLoaderText, { color: palette.text }]}>
            Restoring your session...
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const appStartupLoaderStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
  },
  backgroundWrap: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  backgroundImageFill: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  backgroundImageCover: {
    width: '100%',
    height: '100%',
  },
  authBackgroundImage: {
    opacity: 0.88,
    transform: [{ scale: 1.18 }],
  },
  authBackgroundOverlay: {
    ...StyleSheet.absoluteFill,
    opacity: 0.38,
  },
  startupLoaderWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  startupLoaderCard: {
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  startupLoaderLogo: {
    width: 180,
    height: 120,
    marginBottom: 6,
  },
  startupLoaderText: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});
