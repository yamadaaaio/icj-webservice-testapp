/* eslint-disable @lwc/lwc/no-unknown-wire-adapters */
import { LightningElement, wire, track } from 'lwc';
import { store, connectStore } from '../../store/store';
import actions from '../../store/actions';
import * as tabs from '../../app/container/tabs';

const FETCH_SIZE = 100;
const MAX_FETCH_SIZE = 2000;

export default class ApexLogPanel extends LightningElement {

    @track apexLogs;
    isLoadMore;
    isLoading;
    isEndFetch;
    
    constructor() {
        super();
        this.offset = 0;
    }

    get isEmpty() {
        return !this.isLoading && (!this.apexLogs || this.apexLogs.length === 0);
    }

    @wire(connectStore, { store })
    storeUpdated({ ui, apexLog }) {

        if (ui.selectedTabName === tabs.APEX_LOG) {
            if (!this.apexLogs) {
                this.apexLogs = [];
                store.dispatch(actions.apexLog.fetchApexLog(FETCH_SIZE, this.offset, {}));
                return;
            }

            if (!this.isLoadMore) {
                this.isLoading = apexLog.isFetching;
            }
            if (apexLog.records) {

                if (this.isLoadMore) {
                    this.isLoadMore = false;
                }

                // 取得結果0件の場合は読み込み終了
                if (apexLog.records.length === 0) {
                    this.isEndFetch = true;
                    return;
                }

                const customDomain = ui.user.urls.custom_domain;
                const records = [...apexLog.records];
                let recordNo = this.offset + 1;
                for (let record of records) {
                    // レコードNoを設定
                    record.No = recordNo++;
                    // ダウンロードリンク設定
                    record.DownloadLink = `${customDomain}/servlet/servlet.FileDownload?file=${record.Id}`;
                    // 開始時刻を日本時間に変換
                    record.StartTime = new Date(record.StartTime).toLocaleString();
                }

                this.apexLogs = [...this.apexLogs, ...records];

                store.dispatch(actions.apexLog.clearResult());
            } else if (apexLog.error) {
                console.error(apexLog.error);
            }
        }
    }

    refresh() {
        this.template.querySelector('.icj-log-table-scroller').scrollTop = 0;
        this.apexLogs = [];
        this.offset = 0;
        this.isEndFetch = false;
        store.dispatch(actions.apexLog.fetchApexLog(FETCH_SIZE, this.offset, {}));
    }

    fetchMore(event) {
        if (this.isLoading || this.isLoadMore || this.isEndFetch || (MAX_FETCH_SIZE <= this.offset)) {
            return;
        }
        const scroller = this.template.querySelector('.icj-log-table-scroller');
        const fetchMoreScrollPos = (event.target.scrollHeight - scroller.getBoundingClientRect().height) * 0.98;
        if (fetchMoreScrollPos < event.target.scrollTop) {
            this.isLoadMore = true;
            this.offset += FETCH_SIZE;
            store.dispatch(actions.apexLog.fetchApexLog(FETCH_SIZE, this.offset, {}));
        }
    }
}
