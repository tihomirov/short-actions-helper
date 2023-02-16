import { observable, computed, action, makeObservable, runInAction } from 'mobx';
import { BrowserTab, tabsService } from '../services';
import { assertExists } from '../../../common';

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
  get hostname(): string {
    const { url } = this.currentTab;
    assertExists(url, 'Can not get ta URL. The permissions are probably missing "tabs"');

    const { hostname } = new URL(url);
    return hostname;
  }

  @action
  private async loadCurrentTab(): Promise<void> {
    runInAction(() => (this._currentTabLoading = true));

    const tab = await tabsService.gueryCurrentTab();

    runInAction(() => {
      this._currentTab = tab;
      this._currentTabLoading = false;
    });
  }

  @computed
  private get currentTab(): BrowserTab {
    assertExists(this._currentTab, 'Can not get current Tab');
    return this._currentTab;
  }
}
