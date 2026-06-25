/* Shared helpers for Klaim HTML prototype (parent + popup pages) */
const KLAIM_STORAGE_KEY = 'klaimPrototypeData';

function klaimGetData() {
    try {
        return JSON.parse(sessionStorage.getItem(KLAIM_STORAGE_KEY) || 'null');
    } catch (e) {
        return null;
    }
}

function klaimSetData(data) {
    sessionStorage.setItem(KLAIM_STORAGE_KEY, JSON.stringify(data));
}

function klaimGetQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}

function klaimFormatCurrency(val) {
    return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(val || 0);
}

function klaimCleanNumber(str) {
    return parseFloat(String(str).replace(/[^0-9,-]/g, '').replace(',', '.')) || 0;
}

function klaimNotifyParent() {
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'klaimUpdated' }, '*');
    }
}

function klaimLoadBlankAssets(basePath) {
    const styles = [
        'Content/bootstrap/css/bootstrap.css',
        'Content/font-awesome.min.css',
        'Content/dist/css/AdminLTE.min.css',
        'Content/styles.css'
    ];
    styles.forEach(href => {
        if (!document.querySelector(`link[href="${basePath}${href}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = basePath + href;
            document.head.appendChild(link);
        }
    });
}

function klaimLoadBlankScripts(basePath) {
    return new Promise(async (resolve) => {
        const load = (src) => new Promise((res) => {
            const full = basePath + src;
            if (document.querySelector(`script[src="${full}"]`)) { res(); return; }
            const s = document.createElement('script');
            s.src = full;
            s.onload = res;
            s.onerror = res;
            document.body.appendChild(s);
        });
        await load('Scripts/jquery-3.2.1.js');
        await load('Scripts/bootstrap.js');
        await load('Scripts/bootboxs/bootbox.min.js');
        await load('Scripts/autonumeric/autoNumeric.js');
        resolve();
    });
}

function klaimDetectBasePath() {
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
        const src = scripts[i].src || '';
        if (src.includes('/Scripts/customs/prototype/klaim-prototype.js')) {
            return src.substring(0, src.indexOf('/Scripts/customs/prototype/klaim-prototype.js')) + '/';
        }
        if (src.includes('/Views/Klaim/')) {
            return src.substring(0, src.indexOf('/Views/Klaim/')) + '/';
        }
    }
    return '../../';
}

function klaimDefaultClaimData() {
    return {
        INT_KLAIM_HDR_ID: 0,
        TXT_DOC_NO: '',
        TXT_GROUP_ACCOUNT: '',
        TXT_PARTNER: '',
        TXT_BRANCH: '',
        TXT_STATUSFLOW: 'NEW',
        BIT_APPLY: 'N',
        XXSHP_KDS_T_KLAIM_DTL: []
    };
}

function klaimEnsureDetail(data, detailIndex) {
    if (!data.XXSHP_KDS_T_KLAIM_DTL) data.XXSHP_KDS_T_KLAIM_DTL = [];
    while (data.XXSHP_KDS_T_KLAIM_DTL.length <= detailIndex) {
        data.XXSHP_KDS_T_KLAIM_DTL.push({
            TXT_ACTIVITY: '',
            TXT_PROGRAM_DESC: '',
            DEC_INVOICE_AMT: 0,
            BIT_ALLBRAND: 'N',
            XXSHP_KDS_T_KLAIM_UMB: []
        });
    }
    const dtl = data.XXSHP_KDS_T_KLAIM_DTL[detailIndex];
    if (!dtl.XXSHP_KDS_T_KLAIM_UMB) dtl.XXSHP_KDS_T_KLAIM_UMB = [];
    return dtl;
}
