import {QueryClientProvider, QueryClient} from '@tanstack/react-query';
import Router from './src/router/Router';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import React from 'react';

const queryClient = new QueryClient();

export default function App(): JSX.Element {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </Provider>
  );
}
