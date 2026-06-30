/**
 * RBAC prototype — mapping alur klaim (User / Action / Status Klaim)
 * Referensi: Docs/170914 Kwitansi Standard SHP Sep 17.xlsx (sheet RBAC) & BRD enhancement
 */
const KDS_ROLE_KEY = 'kds_active_role';
const KDS_ROLE_RETURN_KEY = 'kds_role_return_url';

const RBAC_ROLES = [
    { id: 'IT_ADMIN', label: 'IT Admin', shortLabel: 'IT', description: 'Akses penuh (demo / testing)', icon: 'fa-cogs', color: '#605ca8' },
    { id: 'ADMIN_KMMD', label: 'Admin KMMD', shortLabel: 'Admin', description: 'Save klaim → status Draft', icon: 'fa-pencil-square-o', color: '#00a65a' },
    { id: 'OWNER_KMMD', label: 'Owner KMMD', shortLabel: 'Owner', description: 'Email / Approve (+ ASS auto) → Draft With 2 Approve', icon: 'fa-envelope', color: '#3c8dbc' },
    { id: 'ASS', label: 'ASS', shortLabel: 'ASS', description: 'Auto approve → Draft With 2 Approve (tanpa aksi manual)', icon: 'fa-user-circle', color: '#00c0ef' },
    { id: 'RSM', label: 'RSM', shortLabel: 'RSM', description: 'Ready To Submit → Draft With 3 Approve', icon: 'fa-flag', color: '#f39c12' },
    { id: 'CF', label: 'CF (Finance)', shortLabel: 'CF', description: 'Submit → Approve + payment', icon: 'fa-money', color: '#dd4b39' }
];

/** Matrix User → Action → Status Klaim */
const RBAC_KLAIM_WORKFLOW = [
    { roleId: 'ADMIN_KMMD', action: 'Save', resultStatus: 'DRAFT' },
    { roleId: 'OWNER_KMMD', action: 'Email', resultStatus: 'DRAFT WITH 2 APPROVE' },
    { roleId: 'ASS', action: '(Auto)', resultStatus: 'DRAFT WITH 2 APPROVE' },
    { roleId: 'RSM', action: 'Ready To Submit', resultStatus: 'DRAFT WITH 3 APPROVE' },
    { roleId: 'CF', action: 'Submit', resultStatus: 'APPROVED' }
];

const RBAC_PERMISSIONS = {
    'menu.beranda': ['IT_ADMIN', 'ADMIN_KMMD', 'OWNER_KMMD', 'ASS', 'RSM', 'CF'],
    'menu.master': ['IT_ADMIN', 'ADMIN_KMMD'],
    'menu.master.assOwner': ['IT_ADMIN', 'ADMIN_KMMD'],
    'menu.transaksi': ['IT_ADMIN', 'ADMIN_KMMD', 'OWNER_KMMD', 'ASS', 'RSM', 'CF'],
    'menu.transaksi.klaim': ['IT_ADMIN', 'ADMIN_KMMD', 'OWNER_KMMD', 'ASS', 'RSM', 'CF'],
    'klaim.find': ['IT_ADMIN', 'ADMIN_KMMD', 'OWNER_KMMD', 'ASS', 'RSM', 'CF'],
    'klaim.view': ['IT_ADMIN', 'ADMIN_KMMD', 'OWNER_KMMD', 'ASS', 'RSM', 'CF'],
    'klaim.save': ['IT_ADMIN', 'ADMIN_KMMD'],
    'klaim.new': ['IT_ADMIN', 'ADMIN_KMMD'],
    'klaim.addDetail': ['IT_ADMIN', 'ADMIN_KMMD'],
    'klaim.editHeader': ['IT_ADMIN', 'ADMIN_KMMD'],
    'klaim.ownerApprove': ['IT_ADMIN', 'OWNER_KMMD'],
    'klaim.rsmReadySubmit': ['IT_ADMIN', 'RSM'],
    'klaim.readySubmit.edit': ['IT_ADMIN', 'RSM'],
    'klaim.cfSubmit': ['IT_ADMIN', 'CF'],
    'klaim.ematerai': ['IT_ADMIN', 'ADMIN_KMMD', 'CF'],
    'klaim.payment.edit': ['IT_ADMIN', 'CF'],
    'klaim.print': ['IT_ADMIN', 'ADMIN_KMMD', 'OWNER_KMMD', 'ASS', 'RSM', 'CF'],
    'klaim.approvalHistory': ['IT_ADMIN', 'ADMIN_KMMD', 'OWNER_KMMD', 'ASS', 'RSM', 'CF'],
    'master.assOwner.find': ['IT_ADMIN', 'ADMIN_KMMD'],
    'master.assOwner.save': ['IT_ADMIN', 'ADMIN_KMMD'],
    'master.assOwner.new': ['IT_ADMIN', 'ADMIN_KMMD']
};

function rbacGetRoleId() {
    return localStorage.getItem(KDS_ROLE_KEY) || '';
}

function rbacSetRoleId(roleId) {
    localStorage.setItem(KDS_ROLE_KEY, roleId);
    document.dispatchEvent(new CustomEvent('rbacRoleChanged', { detail: { roleId: roleId } }));
}

function rbacGetRoleMeta(roleId) {
    const id = roleId || rbacGetRoleId();
    return RBAC_ROLES.find(r => r.id === id) || null;
}

function rbacHasPermission(permission) {
    const roleId = rbacGetRoleId();
    if (!roleId) return false;
    const allowed = RBAC_PERMISSIONS[permission];
    if (!allowed) return false;
    return allowed.indexOf(roleId) >= 0;
}

function rbacGetWorkflowForRole(roleId) {
    return RBAC_KLAIM_WORKFLOW.find(w => w.roleId === roleId) || null;
}

function rbacGoChooseRole(basePath) {
    sessionStorage.setItem(KDS_ROLE_RETURN_KEY, window.location.href);
    window.location.href = (basePath || '') + 'Views/Account/ChooseRole.html';
}

function rbacResolveReturnUrl(basePath) {
    const url = sessionStorage.getItem(KDS_ROLE_RETURN_KEY);
    sessionStorage.removeItem(KDS_ROLE_RETURN_KEY);
    return url || ((basePath || '') + 'index.html');
}

function rbacUpdateHeader() {
    const username = localStorage.getItem('kds_username') || 'User';
    const meta = rbacGetRoleMeta();
    const welcome = document.getElementById('headerWelcomeText');
    const badge = document.getElementById('headerRoleBadge');
    const userNameEl = document.getElementById('headerUserName');
    const roleNameEl = document.getElementById('headerRoleName');
    if (welcome) welcome.textContent = 'Welcome, ' + username;
    if (userNameEl) userNameEl.textContent = username;
    if (meta) {
        if (badge) {
            badge.textContent = meta.shortLabel;
            badge.style.backgroundColor = meta.color;
            badge.style.display = 'inline-block';
        }
        if (roleNameEl) {
            const wf = rbacGetWorkflowForRole(meta.id);
            roleNameEl.textContent = meta.label + (wf && wf.action ? ' — ' + wf.action : '');
        }
    } else if (badge) {
        badge.textContent = 'No Role';
        badge.style.backgroundColor = '#999';
    }
}

function rbacSetVisible(selector, visible) {
    document.querySelectorAll(selector).forEach(el => {
        el.style.display = visible ? '' : 'none';
    });
}

function rbacApplyMenuVisibility() {
    rbacSetVisible('#menu-beranda', rbacHasPermission('menu.beranda'));
    rbacSetVisible('#menu-master', rbacHasPermission('menu.master'));
    rbacSetVisible('#menu-master-ass-owner', rbacHasPermission('menu.master.assOwner'));
    rbacSetVisible('#menu-transaksi', rbacHasPermission('menu.transaksi'));
    rbacSetVisible('#menu-tr-klaim', rbacHasPermission('menu.transaksi.klaim'));
}

/** Dipanggil dari Index.html setelah applyKlaimWorkflowByRole() */
function rbacApplyKlaimPage() {
    const roleMeta = rbacGetRoleMeta();
    const wf = rbacGetWorkflowForRole(rbacGetRoleId());
    const info = document.getElementById('rbacKlaimBanner');
    if (info && roleMeta) {
        info.style.display = 'block';
        const state = (typeof window.getKlaimFormState === 'function') ? window.getKlaimFormState() : null;
        const status = state ? state.TXT_STATUSFLOW : '—';
        info.innerHTML = '<i class="fa fa-shield"></i> <strong>' + roleMeta.label + '</strong>' +
            (wf ? ' — Aksi: <strong>' + wf.action + '</strong> → ' + wf.resultStatus : '') +
            ' &nbsp;|&nbsp; Status dokumen: <strong>' + status + '</strong>';
    }
    if (typeof window.applyKlaimWorkflowByRole === 'function') {
        window.applyKlaimWorkflowByRole();
    }
}

function rbacApplyAssOwnerPage() {
    [
        ['#btnFind', 'master.assOwner.find'],
        ['#btnSave', 'master.assOwner.save'],
        ['#btnNew', 'master.assOwner.new']
    ].forEach(([sel, perm]) => {
        const el = document.querySelector(sel);
        if (!el) return;
        if (!rbacHasPermission(perm)) {
            el.style.display = 'none';
            el.disabled = true;
        }
    });
}

function rbacApplyCurrentPage() {
    const path = window.location.pathname || '';
    rbacApplyMenuVisibility();
    rbacUpdateHeader();
    if (path.includes('Klaim/Index')) rbacApplyKlaimPage();
    if (path.includes('AssOwnerKMMD')) rbacApplyAssOwnerPage();
    document.dispatchEvent(new CustomEvent('rbacReady'));
}

function rbacInitLayout(basePath) {
    const path = window.location.pathname || '';
    if (path.includes('ChooseRole.html') || path.includes('Login.html')) return;
    if (!localStorage.getItem('kds_logged_in')) return;
    if (!rbacGetRoleId()) {
        rbacGoChooseRole(basePath);
        return;
    }
    rbacApplyCurrentPage();
}

window.rbacGetRoleId = rbacGetRoleId;
window.rbacSetRoleId = rbacSetRoleId;
window.rbacGetRoleMeta = rbacGetRoleMeta;
window.rbacHasPermission = rbacHasPermission;
window.rbacGetWorkflowForRole = rbacGetWorkflowForRole;
window.rbacGoChooseRole = rbacGoChooseRole;
window.rbacResolveReturnUrl = rbacResolveReturnUrl;
window.rbacApplyKlaimPage = rbacApplyKlaimPage;
window.rbacApplyAssOwnerPage = rbacApplyAssOwnerPage;
window.rbacApplyCurrentPage = rbacApplyCurrentPage;
window.RBAC_ROLES = RBAC_ROLES;
window.RBAC_KLAIM_WORKFLOW = RBAC_KLAIM_WORKFLOW;
