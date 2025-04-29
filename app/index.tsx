import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Button, BackHandler, ToastAndroid } from 'react-native';
import { WebView } from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';

export default function HomeScreen() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const webViewRef = useRef<WebView>(null); // Referência para o WebView
  const [canGoBack, setCanGoBack] = useState(false); // Estado para controlar se é possível voltar

  useEffect(() => {
    // Monitora o status da rede
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (!state.isConnected) {
        ToastAndroid.show('Você está sem internet', ToastAndroid.SHORT);
      }
    });

    // Gerencia o botão "Voltar" do Android
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true; // Intercepta o evento
      }
      return true; // Permite o fechamento do app
    });

    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, [canGoBack]);

  return (
    <View style={styles.container}>
          <WebView
            ref={webViewRef} // Define a referência
            source={{ uri: 'https://dy-fy.vercel.app' }}
            style={styles.webview}
            cacheEnabled={false} // Habilita o cache
            cacheMode={
              isConnected ? 'LOAD_DEFAULT' : 'LOAD_CACHE_ELSE_NETWORK'
            } // Configura o uso de cache quando offline
            onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)} // Atualiza o estado de voltar
            onError={() => {
              if (!isConnected) {
                ToastAndroid.show('Conteúdo não está disponível offline.', ToastAndroid.SHORT);
                if (canGoBack && webViewRef.current) {
                  webViewRef.current.goBack();
                }
              }
            }}
          />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  noConnection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noConnectionText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#fff',
    textAlign: 'center',
  },
});