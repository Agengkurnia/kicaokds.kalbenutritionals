/**
 * Prototype persistent store — localStorage registry for Klaim & ASS/Owner KMMD.
 * Task 1: foundation CRUD + seed data (Docs/Klaim/06-data-integration-plan.md)
 */
(function (global) {
    'use strict';

    const SCHEMA_VERSION = 3;
    /** Naikkan jika isi KDS_PROTO_SEED_KLAIM berubah — paksa refresh registry Find */
    const KLAIM_SEED_REVISION = 3;

    const KDS_PROTO_KEYS = {
        KLAIM_REGISTRY: 'kds_proto_klaim_registry',
        ASS_OWNER_REGISTRY: 'kds_proto_ass_owner_registry',
        META: 'kds_proto_meta',
        ACTIVE_CLAIM_ID: 'kds_proto_active_claim_id'
    };

    /** Seed klaim — migrated from Views/Klaim/Index.html findData */
    const KDS_PROTO_SEED_KLAIM = [
        { id: '5195', dokNo: '26.03/KLAIM-MIM/006', site: 'ENSEVAL PUTERA MEGATRADING, TBK PT BEKASI', groupAccount: 'ENSEVAL', partner: 'ENSEVAL PUTERA MEGATRADING, TBK PT BEKASI', supplierId: '1709', supplierName: 'ENSEVAL PUTERA MEGATRADING, TBK PT', branch: 'BEKASI', supplierSiteId: '4698', supplierSiteName: 'NAN-KDS-EPM1A', description: 'BONUS SUBDIST', period: '01-MAR-26 - 31-MAR-26', invoiceNo: 'INV-RBAC-CF-001', invoiceAmount: 150000, status: 'DRAFT', attachment: 'Yes', readyToSubmit: 'No', source: 'PORTAL KDS' },
        { id: '5194', dokNo: '26.03/KLAIM-MIM/005', site: 'ENSEVAL PUTERA MEGATRADING, TBK PT BEKASI', groupAccount: 'ENSEVAL', partner: 'ENSEVAL PUTERA MEGATRADING, TBK PT BEKASI', supplierId: '1709', supplierName: 'ENSEVAL PUTERA MEGATRADING, TBK PT', branch: 'BEKASI', supplierSiteId: '4698', supplierSiteName: 'NAN-KDS-EPM1A', description: 'PROGRAM GOAL (GO JUALAN CHILGO LIQUID)', period: '01-MAR-26 - 31-MAR-26', invoiceNo: 'INV-RBAC-RSM-001', invoiceAmount: 100000, status: 'DRAFT', attachment: 'Yes', readyToSubmit: 'No', source: 'PORTAL KDS' },
        { id: '5193', dokNo: '26.03/KLAIM-MIM/004B', site: 'ENSEVAL PUTERA MEGATRADING, TBK PT BEKASI', groupAccount: 'ENSEVAL', partner: 'ENSEVAL PUTERA MEGATRADING, TBK PT BEKASI', supplierId: '1709', supplierName: 'ENSEVAL PUTERA MEGATRADING, TBK PT', branch: 'BEKASI', supplierSiteId: '4698', supplierSiteName: 'NAN-KDS-EPM1A', description: 'BONUS SUBDIST', period: '01-MAR-26 - 15-MAR-26', invoiceNo: 'INV-RBAC-OWNER-001', invoiceAmount: 80000, status: 'DRAFT', attachment: 'Yes', readyToSubmit: 'No', source: 'PORTAL KDS' },
        { id: '5192', dokNo: '26.03/KLAIM-BOS/001', site: 'PT. SUMBER REZEKI BERSAMA - TEBING TINGGI', groupAccount: 'KMMD', partner: '', supplierId: '3201', supplierName: 'PT. SUMBER REZEKI BERSAMA', branch: 'TEBING TINGGI', supplierSiteId: '5201', supplierSiteName: 'NAN-KDS-SRB-TTG', description: 'MEMO PENETRATION NPD CGP 120 GR PERIODE FEB-DES 2026', period: '01-Jan-2026 - 31-Mar-2026', invoiceNo: '350203-SI-26-030118', invoiceAmount: 6500000, status: 'DRAFT', attachment: 'Yes', readyToSubmit: 'No', source: 'BOSNET', bosnetQuarter: 'Q1', bosnetYear: 2026 },
        { id: '5191', dokNo: '26.03/KLAIM-MIM/004', site: 'ENSEVAL PUTERA MEGATRADING, TBK PT BEKASI', groupAccount: 'ENSEVAL', partner: 'ENSEVAL PUTERA MEGATRADING, TBK PT BEKASI', supplierId: '1709', supplierName: 'ENSEVAL PUTERA MEGATRADING, TBK PT', branch: 'BEKASI', supplierSiteId: '4698', supplierSiteName: 'NAN-KDS-EPM1A', description: 'BONUS SUBDIST', period: '22-JAN-26 - 24-JAN-26', invoiceNo: 'KLAIMKDS2.TFM', invoiceAmount: 80000, status: 'DRAFT', attachment: 'Yes', readyToSubmit: 'No', source: 'PORTAL KDS' },
        { id: '5190', dokNo: '26.03/KLAIM-MIM/003', site: 'ENSEVAL PUTERA MEGATRADING, TBK PT BEKASI', groupAccount: 'ENSEVAL', partner: 'ENSEVAL PUTERA MEGATRADING, TBK PT BEKASI', supplierId: '1709', supplierName: 'ENSEVAL PUTERA MEGATRADING, TBK PT', branch: 'BEKASI', supplierSiteId: '4698', supplierSiteName: 'NAN-KDS-EPM1A', description: 'BONUS SUBDIST ABC', period: '13-MAR-26 - 31-MAR-26', invoiceNo: 'INV.13.03.36.TFM1', invoiceAmount: 20000, status: 'DRAFT', attachment: 'Yes', readyToSubmit: 'No', source: 'PORTAL KDS' },
        { id: '5189', dokNo: '26.03/KLAIM-MIM/002', site: 'ENSEVAL PUTERA MEGATRADING, TBK PT ACEH', groupAccount: 'ENSEVAL', partner: 'ENSEVAL PUTERA MEGATRADING, TBK PT ACEH', supplierId: '1709', supplierName: 'ENSEVAL PUTERA MEGATRADING, TBK PT', branch: 'ACEH', supplierSiteId: '4698', supplierSiteName: 'NAN-KDS-EPM1A', description: 'PROGRAM GOAL (GO JUALAN CHILGO LIQUID)', period: '11-MAR-26 - 11-MAR-26', invoiceNo: 'KLAIMKDS1', invoiceAmount: 100000, status: 'DRAFT', attachment: 'Yes', readyToSubmit: 'No', source: 'PORTAL KDS' },
        { id: '5188', dokNo: '26.03/KLAIM-MIM/001', site: 'ENSEVAL PUTERA MEGATRADING, TBK PT', groupAccount: 'ENSEVAL', partner: 'ENSEVAL PUTERA MEGATRADING, TBK PT', supplierId: '1709', supplierName: 'ENSEVAL PUTERA MEGATRADING, TBK PT', branch: 'JAKARTA 1', supplierSiteId: '4698', supplierSiteName: 'NAN-KDS-EPM1A', description: 'KLAIM KDS', period: '11-MAR-26 - 26-MAR-26', invoiceNo: 'KLAIM KDS', invoiceAmount: 100000, status: 'DRAFT', attachment: 'Yes', readyToSubmit: 'No', source: 'PORTAL KDS' },
        { id: '5187', dokNo: '25.12/KLAIM-HAI/001', site: 'ENSEVAL PUTERA MEGATRADING, TBK PT ACEH', groupAccount: 'ENSEVAL', partner: 'ENSEVAL PUTERA MEGATRADING, TBK PT ACEH', supplierId: '1709', supplierName: 'ENSEVAL PUTERA MEGATRADING, TBK PT', branch: 'ACEH', supplierSiteId: '4698', supplierSiteName: 'NAN-KDS-EPM1A', description: 'TEST KLAIM UNTUK MKPP SESUDAH CUTOFF', period: '22-DEC-25 - 24-DEC-25', invoiceNo: 'TEST KLAIM UNTUK MKPP SESUDAH CUTOFF', invoiceAmount: 2500002, status: 'DRAFT', attachment: 'Yes', readyToSubmit: 'No', source: 'PORTAL KDS' },
        { id: '5186', dokNo: '25.12/KLAIM-MIM/004', site: 'ENSEVAL PUTERA MEGATRADING, TBK PT', groupAccount: 'ENSEVAL', partner: 'ENSEVAL PUTERA MEGATRADING, TBK PT', supplierId: '1709', supplierName: 'ENSEVAL PUTERA MEGATRADING, TBK PT', branch: 'JAKARTA 1', supplierSiteId: '4698', supplierSiteName: 'NAN-KDS-EPM1A', description: 'BONUS SUBDIST', period: '08-DEC-25 - 31-DEC-25', invoiceNo: 'INV-ONO-SAR/00003.000', invoiceAmount: 6000000, status: 'DRAFT', attachment: 'Yes', readyToSubmit: 'No', source: 'PORTAL KDS' }
    ];

    /** Seed ASS/Owner — migrated from Views/Master/AssOwnerKMMD/Index.html findData */
    const KDS_PROTO_SEED_ASS_OWNER = [
        {
            id: '1001', groupAccount: 'KMMD', supplierId: '3102',
            supplierName: 'AGUS JUSAK KURNIAWAN (UD AJEKA ADITAMA DISTRIBUSINDO)',
            ownerId: '2001', ownerName: 'BUDI SANTOSO', ownerEmail: 'budi.santoso@kalbenutritionals.com', status: 'ACTIVE',
            detailRows: [
                { ownerId: '2001', ownerName: 'BUDI SANTOSO', ownerEmail: 'budi.santoso@kalbenutritionals.com', assId: '3001', assName: 'ANDI WIJAYA', assEmail: 'andi.wijaya@kalbenutritionals.com' }
            ]
        },
        {
            id: '1002', groupAccount: 'KMMD', supplierId: '3105',
            supplierName: 'BINTANG LIMA IMADA, PT',
            ownerId: '2002', ownerName: 'SITI AMINAH', ownerEmail: 'siti.aminah@kalbenutritionals.com', status: 'ACTIVE',
            detailRows: [
                { ownerId: '2002', ownerName: 'SITI AMINAH', ownerEmail: 'siti.aminah@kalbenutritionals.com', assId: '3002', assName: 'DEWI LESTARI', assEmail: 'dewi.lestari@kalbenutritionals.com' }
            ]
        },
        {
            id: '1003', groupAccount: 'ENSEVAL', supplierId: '1709',
            supplierName: 'ENSEVAL PUTERA MEGATRADING, TBK PT',
            ownerId: '2003', ownerName: 'HAFID', ownerEmail: 'hafid@kalbenutritionals.com', status: 'ACTIVE',
            detailRows: [
                { ownerId: '2003', ownerName: 'HAFID', ownerEmail: 'hafid@kalbenutritionals.com', assId: '3007', assName: 'BAMBANG SUTRISNO', assEmail: 'bambang.sutrisno@kalbenutritionals.com' },
                { ownerId: '2003', ownerName: 'HAFID', ownerEmail: 'hafid@kalbenutritionals.com', assId: '3001', assName: 'ANDI WIJAYA', assEmail: 'andi.wijaya@kalbenutritionals.com' }
            ],
            assRows: [
                { assId: '3007', assName: 'BAMBANG SUTRISNO', assEmail: 'bambang.sutrisno@kalbenutritionals.com', active: true },
                { assId: '3001', assName: 'ANDI WIJAYA', assEmail: 'andi.wijaya@kalbenutritionals.com', active: false }
            ]
        },
        {
            id: '1004', groupAccount: 'KMMD', supplierId: '3108',
            supplierName: 'KOMPAS SEJAHTERA, CV',
            ownerId: '2004', ownerName: 'MUHAMMAD PRASETYO', ownerEmail: 'muhammad.prasetyo@kalbenutritionals.com', status: 'ACTIVE',
            detailRows: [
                { ownerId: '2004', ownerName: 'MUHAMMAD PRASETYO', ownerEmail: 'muhammad.prasetyo@kalbenutritionals.com', assId: '3003', assName: 'RIZKY PRATAMA', assEmail: 'rizky.pratama@kalbenutritionals.com' }
            ]
        },
        {
            id: '1005', groupAccount: 'KMMD', supplierId: '3106',
            supplierName: 'ANDARIA NIAGA, CV',
            ownerId: '2005', ownerName: 'RINA WULANDARI', ownerEmail: 'rina.wulandari@kalbenutritionals.com', status: 'ACTIVE',
            detailRows: [
                { ownerId: '2005', ownerName: 'RINA WULANDARI', ownerEmail: 'rina.wulandari@kalbenutritionals.com', assId: '3005', assName: 'FITRI HANDAYANI', assEmail: 'fitri.handayani@kalbenutritionals.com' }
            ]
        },
        {
            id: '1006', groupAccount: 'BRAVO', supplierId: '2201',
            supplierName: 'PT BRAVO HUSADA',
            ownerId: '2006', ownerName: 'DEDY KURNIAWAN', ownerEmail: 'dedy.kurniawan@kalbenutritionals.com', status: 'ACTIVE',
            detailRows: [
                { ownerId: '2006', ownerName: 'DEDY KURNIAWAN', ownerEmail: 'dedy.kurniawan@kalbenutritionals.com', assId: '3004', assName: 'AGUS SALIM', assEmail: 'agus.salim@kalbenutritionals.com' }
            ]
        }
    ];

    function readJson(storage, key, fallback) {
        try {
            const raw = storage.getItem(key);
            if (!raw) return fallback;
            return JSON.parse(raw);
        } catch (e) {
            return fallback;
        }
    }

    function writeJson(storage, key, value) {
        storage.setItem(key, JSON.stringify(value));
    }

    function readLocal(key, fallback) {
        return readJson(localStorage, key, fallback);
    }

    function writeLocal(key, value) {
        writeJson(localStorage, key, value);
    }

    function norm(s) {
        return (s || '').toString().trim().toUpperCase();
    }

    function splitPeriod(period) {
        const parts = (period || '').split(' - ').map(p => p.trim());
        return { from: parts[0] || '', to: parts[1] || parts[0] || '' };
    }

    function statusFlags(status) {
        const s = norm(status);
        const approved = s === 'APPROVED' || s === 'CLOSED';
        const closed = s === 'CLOSED';
        const inApproval = s.indexOf('DRAFT WITH') >= 0 || s === 'SUBMITTED';
        return {
            BIT_APPLY: (approved || inApproval) ? 'Y' : 'N',
            BIT_APPROVED: approved ? 'Y' : 'N',
            BIT_REJECTED: 'N',
            BIT_CLOSED: closed ? 'Y' : 'N'
        };
    }

    function protoBuildFindSummary(header, detailRows) {
        const h = header || {};
        const dtl = detailRows || h.XXSHP_KDS_T_KLAIM_DTL || [];
        const first = dtl[0] || {};
        const periodFrom = first.DTM_PERIOD_FROM || first.periodFrom || '';
        const periodTo = first.DTM_PERIOD_TO || first.periodTo || '';
        const hasAtt = dtl.some(d => {
            if (d.XXSHP_KDS_T_KLAIM_DTL_ATT && d.XXSHP_KDS_T_KLAIM_DTL_ATT.length) return true;
            if (d.attachmentName) return true;
            return false;
        });
        return {
            site: h.TXT_SITE || h.TXT_OUTLET || '',
            description: h.TXT_REMARK || first.TXT_ACTIVITY || first.activity || '',
            period: periodFrom && periodTo ? (periodFrom + ' - ' + periodTo) : (periodFrom || ''),
            invoiceNo: first.TXT_INVOICE_NO || first.invoiceNo || '',
            invoiceAmount: first.DEC_INVOICE_AMT != null ? first.DEC_INVOICE_AMT : (first.invoiceAmount || 0),
            status: h.TXT_STATUSFLOW || 'NEW',
            attachment: hasAtt ? 'Yes' : 'No',
            readyToSubmit: h.BIT_READY_SUBMIT === 'Y' ? 'Yes' : 'No',
            source: h.TXT_SOURCE_DOC || 'PORTAL KDS',
            bosnetQuarter: h._bosnetQuarter || null,
            bosnetYear: h._bosnetYear || null,
            paymentStatus: first.TXT_PAYMENT_STATUS || first.paymentStatus || '',
            paidDate: first.DTM_PAID_DATE || first.paidDate || '',
            bank: first.TXT_BANK_NAME || first.bank || ''
        };
    }

    function protoBuildHeaderFromSeedItem(item) {
        const period = splitPeriod(item.period);
        const flags = statusFlags(item.status);
        const header = {
            INT_KLAIM_HDR_ID: item.id,
            TXT_DOC_NO: item.dokNo,
            TXT_SITE: item.site,
            TXT_OUTLET: item.site,
            TXT_GROUP_ACCOUNT: item.groupAccount || '',
            TXT_PARTNER: item.partner || '',
            TXT_BRANCH: item.branch || '',
            TXT_SUPPLIER_CODE: item.supplierId || '',
            TXT_SUPPLIER_ID: item.supplierId || '',
            TXT_SUPPLIER_NAME: item.supplierName || '',
            TXT_SUPPLIER_SITE_ID: item.supplierSiteId || '',
            TXT_SUPPLIER_SITE_NAME: item.supplierSiteName || '',
            TXT_REMARK: item.description || '',
            TXT_SOURCE_DOC: item.source || 'PORTAL KDS',
            TXT_STATUSFLOW: item.status || 'DRAFT',
            BIT_READY_SUBMIT: item.readyToSubmit === 'Yes' ? 'Y' : 'N',
            TXT_REASON_READY_SUBMIT: item.readyToSubmit === 'Yes' ? '' : 'New Document',
            _bosnetQuarter: item.bosnetQuarter || null,
            _bosnetYear: item.bosnetYear || null,
            XXSHP_KDS_T_KLAIM_DTL: [{
                TXT_ACTIVITY: item.description || '',
                TXT_PROGRAM_DESC: item.description || '',
                DTM_PERIOD_FROM: period.from,
                DTM_PERIOD_TO: period.to,
                TXT_INVOICE_NO: item.invoiceNo || '',
                DEC_INVOICE_AMT: item.invoiceAmount || 0,
                BIT_INCLUDE: 'Y',
                BIT_ALLBRAND: 'Y',
                TXT_PAYMENT_STATUS: item.paymentStatus || '',
                DTM_PAID_DATE: item.paidDate || '',
                TXT_BANK_NAME: item.bank || '',
                XXSHP_KDS_T_KLAIM_DTL_ATT: item.attachment === 'Yes'
                    ? [{ TXT_FILE_NAME: 'attachment-' + item.id + '.pdf', BIT_ACTIVE: 'Y' }]
                    : []
            }]
        };
        Object.assign(header, flags);
        return header;
    }

    function protoSeedItemToClaimRecord(item) {
        const header = protoBuildHeaderFromSeedItem(item);
        const now = new Date().toISOString();
        return {
            id: String(item.id),
            dokNo: item.dokNo,
            updatedAt: now,
            seed: true,
            findSummary: {
                site: item.site,
                description: item.description,
                period: item.period,
                invoiceNo: item.invoiceNo,
                invoiceAmount: item.invoiceAmount,
                status: item.status,
                attachment: item.attachment,
                readyToSubmit: item.readyToSubmit,
                source: item.source || 'PORTAL KDS',
                bosnetQuarter: item.bosnetQuarter || null,
                bosnetYear: item.bosnetYear || null,
                paymentStatus: item.paymentStatus || '',
                paidDate: item.paidDate || '',
                bank: item.bank || ''
            },
            header: header,
            approvalHistory: []
        };
    }

    function protoNormalizeAssOwnerHistoryItem(i) {
        const action = i.action || (
            (i.field === 'Aktif' || i.field === 'Aktif (pindah)') ? 'aktif' :
            (i.field === 'Baris baru' || (i.field === 'Baris' && i.newValue && !i.oldValue)) ? 'add' :
            (i.field === 'Baris' && i.oldValue && !i.newValue) ? 'delete' : 'edit'
        );
        return {
            action: action,
            role: i.role || '',
            field: i.field || '',
            oldValue: i.oldValue || '',
            newValue: i.newValue || ''
        };
    }

    function protoNormalizeAssOwnerChangeHistory(raw) {
        const list = raw || [];
        if (!list.length) return [];
        if (list[0].items) {
            return list.map(b => ({
                changedAt: b.changedAt || '',
                changedBy: b.changedBy || '',
                items: (b.items || []).map(protoNormalizeAssOwnerHistoryItem)
            }));
        }
        const batches = [];
        const seen = {};
        list.forEach(h => {
            const key = (h.changedAt || '') + '\0' + (h.changedBy || '');
            if (!seen[key]) {
                seen[key] = {
                    changedAt: h.changedAt || '',
                    changedBy: h.changedBy || '',
                    items: []
                };
                batches.push(seen[key]);
            }
            seen[key].items.push(protoNormalizeAssOwnerHistoryItem(h));
        });
        return batches;
    }

    function protoNormalizeAssOwnerRecord(raw) {
        const ownerRowsIn = raw.ownerRows || (raw.ownerName || raw.ownerEmail ? [{
            name: raw.ownerName,
            email: raw.ownerEmail,
            active: true
        }] : []);

        const detailRowsIn = raw.detailRows || raw.details || [];
        const assRowsIn = raw.assRows || detailRowsIn.map((d, i) => ({
            assId: d.assId || '',
            assName: d.assName || '',
            assEmail: d.assEmail || '',
            name: d.assName || '',
            email: d.assEmail || '',
            active: d.active === true || (d.active !== false && i === 0)
        })).filter(a => a.assName || a.assEmail || a.name);

        const ownerRows = ownerRowsIn.map(r => ({
            name: (r.name || r.ownerName || '').trim(),
            email: (r.email || r.ownerEmail || '').trim(),
            active: r.active === true
        }));
        if (ownerRows.length && !ownerRows.some(r => r.active)) ownerRows[0].active = true;

        const assRows = assRowsIn.map(a => ({
            assId: a.assId || '',
            assName: (a.assName || a.name || '').trim(),
            assEmail: (a.assEmail || a.email || '').trim(),
            name: (a.assName || a.name || '').trim(),
            email: (a.assEmail || a.email || '').trim(),
            active: a.active === true
        }));
        if (assRows.length && !assRows.some(r => r.active)) assRows[0].active = true;

        const activeOwner = ownerRows.find(r => r.active) || ownerRows[0] || { name: '', email: '' };
        const activeAss = assRows.find(r => r.active) || assRows[0] || null;

        const detailRows = assRows.map(a => ({
            ownerId: raw.ownerId || '',
            ownerName: activeOwner.name,
            ownerEmail: activeOwner.email,
            assId: a.assId,
            assName: a.assName,
            assEmail: a.assEmail,
            active: a.active
        }));

        const changeHistory = protoNormalizeAssOwnerChangeHistory(raw.changeHistory);

        return {
            id: String(raw.id),
            groupAccount: raw.groupAccount || '',
            supplierId: String(raw.supplierId || ''),
            supplierName: raw.supplierName || '',
            ownerId: raw.ownerId || '',
            ownerName: activeOwner.name,
            ownerEmail: activeOwner.email,
            status: raw.status || 'ACTIVE',
            ownerRows: ownerRows,
            assRows: assRows,
            detailRows: detailRows,
            changeHistory: changeHistory,
            updatedAt: raw.updatedAt || new Date().toISOString(),
            seed: raw.seed === true
        };
    }

    // --- Meta / seed ---

    function protoGetMeta() {
        return readLocal(KDS_PROTO_KEYS.META, { seeded: false, schemaVersion: 0 });
    }

    function protoSetMeta(meta) {
        writeLocal(KDS_PROTO_KEYS.META, meta);
    }

    function protoEnsureSeeded() {
        const meta = protoGetMeta();
        const needsKlaimReseed = !meta.seeded
            || meta.schemaVersion !== SCHEMA_VERSION
            || meta.klaimSeedRevision !== KLAIM_SEED_REVISION;

        if (needsKlaimReseed) {
            const klaimRecords = KDS_PROTO_SEED_KLAIM.map(protoSeedItemToClaimRecord);
            writeLocal(KDS_PROTO_KEYS.KLAIM_REGISTRY, klaimRecords);
        }

        if (!meta.seeded || meta.schemaVersion !== SCHEMA_VERSION) {
            const assRecords = KDS_PROTO_SEED_ASS_OWNER.map(item => protoNormalizeAssOwnerRecord(Object.assign({ seed: true }, item)));
            writeLocal(KDS_PROTO_KEYS.ASS_OWNER_REGISTRY, assRecords);
        }

        protoSetMeta({
            seeded: true,
            schemaVersion: SCHEMA_VERSION,
            klaimSeedRevision: KLAIM_SEED_REVISION,
            seededAt: needsKlaimReseed ? new Date().toISOString() : (meta.seededAt || new Date().toISOString())
        });
    }

    function protoResetDemoData() {
        localStorage.removeItem(KDS_PROTO_KEYS.KLAIM_REGISTRY);
        localStorage.removeItem(KDS_PROTO_KEYS.ASS_OWNER_REGISTRY);
        protoSetMeta({ seeded: false, schemaVersion: 0 });
        sessionStorage.removeItem(KDS_PROTO_KEYS.ACTIVE_CLAIM_ID);
        protoEnsureSeeded();
    }

    // --- Klaim registry ---

    function protoGetKlaimRegistry() {
        protoEnsureSeeded();
        return readLocal(KDS_PROTO_KEYS.KLAIM_REGISTRY, []);
    }

    function protoGetKlaimById(id) {
        if (!id) return null;
        const sid = String(id);
        return protoGetKlaimRegistry().find(r => String(r.id) === sid) || null;
    }

    function protoUpsertKlaim(record) {
        if (!record || !record.id) return null;
        const list = protoGetKlaimRegistry().filter(r => String(r.id) !== String(record.id));
        const normalized = Object.assign({}, record, {
            id: String(record.id),
            updatedAt: record.updatedAt || new Date().toISOString(),
            approvalHistory: record.approvalHistory || []
        });
        if (normalized.header && !normalized.findSummary) {
            normalized.findSummary = protoBuildFindSummary(normalized.header);
        }
        list.push(normalized);
        writeLocal(KDS_PROTO_KEYS.KLAIM_REGISTRY, list);
        return normalized;
    }

    function protoDeleteKlaim(id) {
        const sid = String(id);
        const before = protoGetKlaimRegistry();
        const list = before.filter(r => String(r.id) !== sid);
        writeLocal(KDS_PROTO_KEYS.KLAIM_REGISTRY, list);
        return list.length < before.length;
    }

    function protoAppendApprovalHistory(claimId, entry) {
        const rec = protoGetKlaimById(claimId);
        if (!rec) return;
        const history = rec.approvalHistory || [];
        history.push(Object.assign({
            at: new Date().toISOString(),
            username: localStorage.getItem('kds_username') || 'User'
        }, entry));
        rec.approvalHistory = history;
        protoUpsertKlaim(rec);
    }

    const KLAIM_SESSION_KEY = 'klaimPrototypeData';

    function protoGenerateOtp() {
        return String(Math.floor(100000 + Math.random() * 900000));
    }

    function protoEnsureKlaimOtp(claimId, step) {
        const rec = protoGetKlaimById(claimId);
        if (!rec) return null;
        const key = step === 'ass' ? 'assOtp' : 'ownerOtp';
        const ext = rec.externalApproval || {};
        if (ext[key]) return ext[key];
        ext[key] = protoGenerateOtp();
        ext[key + 'At'] = new Date().toISOString();
        rec.externalApproval = ext;
        protoUpsertKlaim(rec);
        return ext[key];
    }

    function protoGetKlaimOtp(claimId, step) {
        const rec = protoGetKlaimById(claimId);
        if (!rec || !rec.externalApproval) return null;
        return step === 'ass' ? rec.externalApproval.assOtp : rec.externalApproval.ownerOtp;
    }

    function protoSyncSessionIfActiveClaim(claimId, header) {
        const activeId = protoGetActiveClaimId();
        if (String(activeId) !== String(claimId)) return;
        try {
            const raw = sessionStorage.getItem(KLAIM_SESSION_KEY);
            const session = raw ? JSON.parse(raw) : {};
            Object.assign(session, header);
            session.INT_KLAIM_HDR_ID = claimId;
            sessionStorage.setItem(KLAIM_SESSION_KEY, JSON.stringify(session));
        } catch (e) { /* ignore */ }
    }

    /** Update status klaim di registry + sessionStorage jika dokumen sedang aktif */
    function protoApplyKlaimStatus(claimId, newStatus, extraHeader) {
        const rec = protoGetKlaimById(claimId);
        if (!rec) return null;
        const header = Object.assign({}, rec.header || {}, statusFlags(newStatus), extraHeader || {}, {
            TXT_STATUSFLOW: newStatus,
            INT_KLAIM_HDR_ID: String(claimId)
        });
        rec.header = header;
        rec.findSummary = Object.assign({}, rec.findSummary || {}, protoBuildFindSummary(header), {
            status: newStatus
        });
        rec.updatedAt = new Date().toISOString();
        protoUpsertKlaim(rec);
        protoSyncSessionIfActiveClaim(claimId, header);
        return rec;
    }

    // --- ASS/Owner registry ---

    function protoGetAssOwnerRegistry() {
        protoEnsureSeeded();
        return readLocal(KDS_PROTO_KEYS.ASS_OWNER_REGISTRY, []);
    }

    function protoGetAssOwnerById(id) {
        if (!id) return null;
        return protoGetAssOwnerRegistry().find(r => String(r.id) === String(id)) || null;
    }

    function protoUpsertAssOwner(record) {
        if (!record || !record.id) return null;
        const normalized = protoNormalizeAssOwnerRecord(record);
        normalized.updatedAt = new Date().toISOString();
        const list = protoGetAssOwnerRegistry().filter(r => String(r.id) !== String(normalized.id));
        list.push(normalized);
        writeLocal(KDS_PROTO_KEYS.ASS_OWNER_REGISTRY, list);
        return normalized;
    }

    function protoDeleteAssOwner(id) {
        const sid = String(id);
        const before = protoGetAssOwnerRegistry();
        const list = before.filter(r => String(r.id) !== sid);
        writeLocal(KDS_PROTO_KEYS.ASS_OWNER_REGISTRY, list);
        return list.length < before.length;
    }

    function protoFindOwnerBySupplier(groupAccount, supplierId) {
        const ga = norm(groupAccount);
        const sid = String(supplierId || '').trim();
        if (!ga || !sid) return null;
        const rec = protoGetAssOwnerRegistry().find(r =>
            norm(r.groupAccount) === ga &&
            String(r.supplierId).trim() === sid &&
            norm(r.status) === 'ACTIVE'
        );
        if (!rec) return null;
        return {
            ownerId: rec.ownerId,
            ownerName: rec.ownerName,
            ownerEmail: rec.ownerEmail || '',
            mappingId: rec.id
        };
    }

    function protoFindAssBySite(groupAccount, siteOrOutlet, supplierId) {
        const ga = norm(groupAccount);
        const needle = norm(siteOrOutlet);
        const sid = String(supplierId || '').trim();
        if (!ga) return null;

        const records = protoGetAssOwnerRegistry().filter(r =>
            norm(r.groupAccount) === ga && norm(r.status) === 'ACTIVE'
        );

        function assFromDetail(d, mappingId) {
            if (!d) return null;
            const assName = (d.assName || d.name || '').trim();
            if (!assName) return null;
            return {
                assId: d.assId || '',
                assName: assName,
                assEmail: (d.assEmail || d.email || '').trim(),
                mappingId: mappingId
            };
        }

        if (needle) {
            for (let i = 0; i < records.length; i++) {
                const rec = records[i];
                const rows = rec.detailRows || [];
                for (let j = 0; j < rows.length; j++) {
                    const d = rows[j];
                    const site = norm(d.site);
                    const branch = norm(d.branchName);
                    if (needle.indexOf(site) >= 0 || site.indexOf(needle) >= 0 ||
                        (branch && (needle.indexOf(branch) >= 0 || branch.indexOf(needle) >= 0))) {
                        return assFromDetail(d, rec.id);
                    }
                }
            }
        }

        if (sid) {
            const rec = records.find(r => String(r.supplierId).trim() === sid);
            if (rec) {
                const rows = rec.assRows || rec.detailRows || [];
                const active = rows.find(r => r.active) || rows[0];
                return assFromDetail(active, rec.id);
            }
        }

        return null;
    }

    // --- Active claim (session) ---

    function protoSetActiveClaimId(id) {
        if (id == null || id === '') {
            sessionStorage.removeItem(KDS_PROTO_KEYS.ACTIVE_CLAIM_ID);
        } else {
            sessionStorage.setItem(KDS_PROTO_KEYS.ACTIVE_CLAIM_ID, String(id));
        }
    }

    function protoGetActiveClaimId() {
        return sessionStorage.getItem(KDS_PROTO_KEYS.ACTIVE_CLAIM_ID);
    }

    // --- Export / import (Task 8 preview) ---

    function protoExportAll() {
        return JSON.stringify({
            meta: protoGetMeta(),
            klaim: protoGetKlaimRegistry(),
            assOwner: protoGetAssOwnerRegistry()
        }, null, 2);
    }

    function protoImportAll(jsonString) {
        const data = JSON.parse(jsonString);
        if (data.klaim) writeLocal(KDS_PROTO_KEYS.KLAIM_REGISTRY, data.klaim);
        if (data.assOwner) writeLocal(KDS_PROTO_KEYS.ASS_OWNER_REGISTRY, data.assOwner);
        protoSetMeta(Object.assign({ seeded: true, schemaVersion: SCHEMA_VERSION }, data.meta || {}));
    }

    // --- Public API ---

    global.KDS_PROTO_KEYS = KDS_PROTO_KEYS;
    global.KDS_PROTO_SEED_KLAIM = KDS_PROTO_SEED_KLAIM;
    global.KDS_PROTO_SEED_ASS_OWNER = KDS_PROTO_SEED_ASS_OWNER;
    global.protoEnsureSeeded = protoEnsureSeeded;
    global.protoResetDemoData = protoResetDemoData;
    global.protoGetMeta = protoGetMeta;
    global.protoGetKlaimRegistry = protoGetKlaimRegistry;
    global.protoGetKlaimById = protoGetKlaimById;
    global.protoUpsertKlaim = protoUpsertKlaim;
    global.protoDeleteKlaim = protoDeleteKlaim;
    global.protoBuildFindSummary = protoBuildFindSummary;
    global.protoBuildHeaderFromSeedItem = protoBuildHeaderFromSeedItem;
    global.protoAppendApprovalHistory = protoAppendApprovalHistory;
    global.protoGenerateOtp = protoGenerateOtp;
    global.protoEnsureKlaimOtp = protoEnsureKlaimOtp;
    global.protoGetKlaimOtp = protoGetKlaimOtp;
    global.protoApplyKlaimStatus = protoApplyKlaimStatus;
    global.protoSyncSessionIfActiveClaim = protoSyncSessionIfActiveClaim;
    global.protoGetAssOwnerRegistry = protoGetAssOwnerRegistry;
    global.protoGetAssOwnerById = protoGetAssOwnerById;
    global.protoUpsertAssOwner = protoUpsertAssOwner;
    global.protoDeleteAssOwner = protoDeleteAssOwner;
    global.protoFindOwnerBySupplier = protoFindOwnerBySupplier;
    global.protoFindAssBySite = protoFindAssBySite;
    global.protoSetActiveClaimId = protoSetActiveClaimId;
    global.protoGetActiveClaimId = protoGetActiveClaimId;
    global.protoExportAll = protoExportAll;
    global.protoImportAll = protoImportAll;

})(typeof window !== 'undefined' ? window : global);
