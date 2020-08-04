import jsforce from 'jsforce';

export const CONECCTED_KEY = 'icj-wst.coneccted';
export const ACCESS_TOKEN_KEY = 'icj-wst.accessToken';
export const INSTANCE_URL_KEY = 'icj-wst.instanceUrl';
export const API_VERSION_KEY = 'icj-wst.apiVersion';

export const PRODUCTION_LOGIN_URL = 'https://login.salesforce.com';
export const SANDBOX_LOGIN_URL = 'https://test.salesforce.com';

export const PACKAGE_NAMESPACE = 'tcrm';
export const ICJ_LINKAGE_WEB_SERVICE = 'ICropJLinkageWebService';

export let connection;

export function init(callback) {
    const isAuthCallback = window.location.hash;
    jsforce.browser.init(_getJsforceOptions());

    const isConeccted = localStorage.getItem(CONECCTED_KEY);

    if (isConeccted) {
        connection = new jsforce.Connection({
            accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
            instanceUrl: localStorage.getItem(INSTANCE_URL_KEY),
            // eslint-disable-next-line no-undef
            proxyUrl: process.env.PROXY_URL
        });

        doCallback(callback);
        return;
    }

    if (isAuthCallback) {
        jsforce.browser.on('connect', (conn) => {
            connection = conn;
            localStorage.setItem(CONECCTED_KEY, 'connected');
            localStorage.setItem(ACCESS_TOKEN_KEY, connection.accessToken);
            localStorage.setItem(INSTANCE_URL_KEY, connection.instanceUrl);

            doCallback(callback);
        });

        // リダイレクト時の初期化処理で connect イベントが emit される
        jsforce.browser.init(_getJsforceOptions());
    } else if (callback) {
        callback(null);
    }
}

export function login(loginUrl) {
    // ポップアップ表示を抑止
    window.open = () => null;
    const jsforceOptions = _getJsforceOptions();
    jsforceOptions.loginUrl = loginUrl;
    jsforce.browser.login(jsforceOptions);
}

export function logout() {
    jsforce.browser.logout();
    localStorage.removeItem(CONECCTED_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(INSTANCE_URL_KEY);
}

function _getJsforceOptions() {
    return {
        // eslint-disable-next-line no-undef
        clientId: process.env.CLIENT_ID,
        // eslint-disable-next-line no-undef
        redirectUri: process.env.REDIRECT_URI,
        // eslint-disable-next-line no-undef
        proxyUrl: process.env.PROXY_URL
    };
}

async function doCallback(callback) {
    try {
        const versions = await connection.request('/services/data/');
        connection.version = versions[versions.length - 1].version;
        console.log(`API Ver: ${connection.version}`);
        const user = await connection.request('/services/oauth2/userinfo');

        connection.metadata.read(
            'InstalledPackage',
            [PACKAGE_NAMESPACE],
            (err, metadata) => {
                if (err) {
                    console.error(err);
                } else {
                    const className =
                        metadata.fullName === PACKAGE_NAMESPACE
                            ? `${PACKAGE_NAMESPACE}/${ICJ_LINKAGE_WEB_SERVICE}`
                            : ICJ_LINKAGE_WEB_SERVICE;

                    const endpointUrl = `${user.urls.custom_domain}/services/Soap/class/${className}`;
                    const xmlns = `http://soap.sforce.com/schemas/class/${className}`;

                    callback(user, { endpointUrl, xmlns });
                }
            }
        );
    } catch (e) {
        console.log(e);
        localStorage.removeItem(CONECCTED_KEY);
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(INSTANCE_URL_KEY);
    }
}
