import React, { createContext, FC, ReactElement, ReactNode } from 'react';

import { RootStore } from './root-store';

export * from './command-store';
export * from './root-store';

export const StoreContext = createContext<RootStore>({} as RootStore);

export type StoreProviderProps = Readonly<{
  store: RootStore;
  children: ReactNode;
}>;

export const StoreProvider: FC<StoreProviderProps> = ({ children, store }): ReactElement => {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};
