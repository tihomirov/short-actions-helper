import { observable, computed, action, makeObservable, runInAction } from 'mobx';
import { BrowserTab, TabsService } from '../services';

export class TabStore {
  @observable
  private _currentTab: BrowserTab | undefined = undefined;
  @observable
  private _currentTabLoading = true;

  constructor() {
    makeObservable(this);
    void this.loadCurrentTab();
  }

  @computed
  get currentTabLoading(): boolean {
    return this._currentTabLoading;
  }

  @computed
  get currentTabMissing(): boolean {
    return !this._currentTab;
  }

  @computed
  get hostname(): string | undefined {
    const url = this._currentTab?.url;

    if (!url) {
      return undefined;
    }

    const { hostname } = new URL(url);
    return hostname;
  }

  @action
  private async loadCurrentTab(): Promise<void> {
    runInAction(() => (this._currentTabLoading = true));

    const tab = await TabsService.getCurrentTab();

    runInAction(() => {
      this._currentTab = tab;
      this._currentTabLoading = false;
    });
  }
}
