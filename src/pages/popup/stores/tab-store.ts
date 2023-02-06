import { observable, computed, action, makeObservable } from 'mobx';
import { BrowserTab, tabsService } from '../services';
import { assertExists } from '../../../utils';

export class TabStore {
  @observable
  private _currentTab: BrowserTab | undefined = undefined;
  @observable
  private _currentTabLoading = true;
  @observable
  private _currentTabMissing = true;

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
    return this._currentTabMissing;
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
    this._currentTabLoading = true;

    const tab = await tabsService.gueryCurrentTab();

    if (tab) {
      this._currentTab = tab;
      this._currentTabMissing = false;
    } else {
      this._currentTabMissing = true;
    }

    this._currentTabLoading = false;
  }

  @computed
  private get currentTab(): BrowserTab {
    assertExists(this._currentTab, 'Can not get current Tab');
    return this._currentTab;
  }
}
