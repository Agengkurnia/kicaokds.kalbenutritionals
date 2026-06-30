class Layout {
    constructor() {
        const scripts = document.getElementsByTagName('script');
        let appRootPath = '';
        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].src && scripts[i].src.includes('/Scripts/layout.js')) {
                appRootPath = scripts[i].src.substring(0, scripts[i].src.indexOf('/Scripts/layout.js'));
                break;
            }
        }
        this.basePath = appRootPath ? appRootPath + '/' : '';
    }

    async init() {
        if (window.layoutInitialized) return;
        window.layoutInitialized = true;

        const path = window.location.pathname || '';
        const isLoginPage = document.getElementById('FormLogin') || path.endsWith('Login.html');
        const isChooseRolePage = document.getElementById('FormChooseRole') || path.includes('ChooseRole.html');
        const isAuthPage = isLoginPage || isChooseRolePage;

        this.loadCSS(isAuthPage);
        await this.loadScript('Scripts/customs/prototype/proto-store.js');
        await this.loadScript('Scripts/customs/prototype/rbac-prototype.js');
        if (typeof protoEnsureSeeded === 'function') {
            protoEnsureSeeded();
        }
        await this.loadScripts(isAuthPage);

        if (isAuthPage) {
            this.renderLoginStructure();
        } else {
            if (!localStorage.getItem('kds_logged_in')) {
                window.location.href = this.basePath + 'Views/Account/Login.html';
                return;
            }
            if (typeof rbacGetRoleId === 'function' && !rbacGetRoleId()) {
                sessionStorage.setItem('kds_role_return_url', window.location.href);
                window.location.href = this.basePath + 'Views/Account/ChooseRole.html';
                return;
            }
            this.renderMainStructure();
            this.setActiveMenu();
            this.initMainHandlers();
            if (typeof rbacApplyCurrentPage === 'function') {
                rbacApplyCurrentPage();
            }
        }

        document.dispatchEvent(new Event('layoutReady'));
    }

    loadCSS(isLogin) {
        const styles = [
            'fonts/KalbeFont/font.css',
            'Content/bootstrap/css/bootstrap.css',
            'Content/font-awesome.min.css',
            'Content/ionicons.min.css',
            'Content/dist/css/AdminLTE.min.css'
        ];

        if (isLogin) {
            styles.push('Content/plugins/iCheck/square/blue.css');
        } else {
            styles.push(
                'Content/dist/css/skins/_all-skins.min.css',
                'Content/plugins/datepicker/datepicker3.css',
                'Content/plugins/select2/select2.css',
                'Content/bootstrap-multiselect.css',
                'Content/DataTables/css/jquery.dataTables.min.css',
                'Content/DataTables/css/dataTables.bootstrap.css',
                'Content/fancybox/jquery.fancybox.css',
                'Scripts/daterangepicker/daterangepicker.css',
                'Content/styles.css'
            );
        }

        styles.forEach(href => {
            const fullHref = this.basePath + href;
            if (!document.querySelector(`link[href="${fullHref}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = fullHref;
                document.head.appendChild(link);
            }
        });

        // Add small fixes
        const style = document.createElement('style');
        style.innerHTML = `
            .sidebar-menu > li > a {
                display: flex !important;
                align-items: center;
                gap: 8px;
            }
            .sidebar-menu .treeview-menu > li > a {
                display: flex !important;
                align-items: center;
                gap: 8px;
            }
            .main-header .logo .logo-lg b {
                font-family: 'Kalbe Font', sans-serif;
            }
            .content-wrapper {
                min-height: calc(100vh - 101px) !important;
            }
            .row-form {
                margin-bottom: 12px;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
            }
            .row-form .col-md-2, .row-form .col-md-4, .row-form .col-md-1 {
                display: flex;
                align-items: center;
            }
            .row-form label {
                margin-bottom: 0;
            }
            .box-header.with-border {
                display: flex;
                justify-content: flex-end;
                gap: 8px;
                flex-wrap: wrap;
            }
            .box-header.with-border .btn {
                margin: 2px 0;
            }
            .table-condensed th, .table-condensed td {
                font-size: 11px;
            }
            /* Bootbox — pastikan dialog di atas backdrop-nya sendiri */
            .bootbox.modal {
                z-index: 1060 !important;
            }
            .bootbox + .modal-backdrop {
                z-index: 1050 !important;
            }
            .bootbox .modal-dialog {
                opacity: 1 !important;
                transform: none !important;
            }
            .bootbox.modal.in,
            .bootbox.modal.show {
                display: block !important;
                opacity: 1 !important;
            }
            /* LOV / app modals — backdrop harus DI BAWAH dialog (jangan set z-index global pada .modal-backdrop) */
            body > .modal:not(.bootbox) {
                z-index: 1070 !important;
            }
            body > .modal:not(.bootbox) + .modal-backdrop {
                z-index: 1065 !important;
            }
        `;
        document.head.appendChild(style);
    }

    async loadScript(src) {
        if (src.includes('jquery-3.2.1.js') && window.jQuery) {
            console.log('Skipping jQuery load, already exists');
            return;
        }
        if (src.includes('bootstrap.js') && window.jQuery && window.jQuery.fn && window.jQuery.fn.modal) {
            console.log('Skipping Bootstrap load, already exists');
            return;
        }
        if (src.includes('bootstrap-datepicker.js') && window.jQuery && window.jQuery.fn && window.jQuery.fn.datepicker) {
            console.log('Skipping Datepicker load, already exists');
            return;
        }
        if (src.includes('moment.min.js') && window.moment) {
            console.log('Skipping Moment load, already exists');
            return;
        }
        if (src.includes('bootbox.min.js') && window.bootbox) {
            console.log('Skipping Bootbox load, already exists');
            return;
        }
        if (src.includes('autoNumeric.js') && window.jQuery && window.jQuery.fn && window.jQuery.fn.autoNumeric) {
            console.log('Skipping AutoNumeric load, already exists');
            return;
        }

        return new Promise((resolve, reject) => {
            const fullSrc = this.basePath + src;
            if (document.querySelector(`script[src="${fullSrc}"]`)) {
                console.log('Script tag already in DOM:', fullSrc);
                resolve();
                return;
            }

            const prevJQuery = window.jQuery;
            const prevS = window.$;

            const script = document.createElement('script');
            script.src = fullSrc;
            script.onload = () => {
                console.log('Loaded script:', fullSrc, 
                    '| jQuery:', !!window.jQuery, 
                    '| datepicker:', !!(window.jQuery && window.jQuery.fn && window.jQuery.fn.datepicker),
                    '| modal:', !!(window.jQuery && window.jQuery.fn && window.jQuery.fn.modal)
                );

                if (prevJQuery && window.jQuery && window.jQuery !== prevJQuery) {
                    console.warn('jQuery was overwritten by script:', fullSrc, '. Restoring and merging plugins.');
                    // Jangan timpa plugin Bootstrap 3 — complete.min.js bundling jQuery lama akan merusak bootbox/modal
                    const protectedPlugins = new Set([
                        'modal', 'dropdown', 'tab', 'collapse', 'tooltip', 'popover',
                        'button', 'carousel', 'affix', 'scrollspy', 'transition', 'alert'
                    ]);
                    try {
                        for (const key in window.jQuery.fn) {
                            if (window.jQuery.fn.hasOwnProperty(key) && 
                                key !== 'constructor' && 
                                key !== 'init' && 
                                key !== 'jquery' && 
                                key !== 'selector' &&
                                !protectedPlugins.has(key)) {
                                prevJQuery.fn[key] = window.jQuery.fn[key];
                            }
                        }
                    } catch (err) {
                        console.error('Failed to merge jQuery plugins:', err);
                    }
                    window.jQuery = prevJQuery;
                    window.$ = prevS;
                }

                resolve();
            };
            script.onerror = (e) => {
                console.error('Failed to load script:', fullSrc);
                resolve(); // resolve anyway to avoid breaking chain
            };
            document.head.appendChild(script);
        });
    }

    async loadScripts(isLogin) {
        // Load jQuery first
        await this.loadScript('Scripts/jquery-3.2.1.js');
        await this.loadScript('Scripts/jquery.blockUI.js');
        
        // Load bootstrap
        await this.loadScript('Scripts/bootstrap.js');

        if (isLogin) {
            await this.loadScript('Content/plugins/iCheck/icheck.min.js');
        } else {
            const scriptsList = [
                'Content/plugins/select2/select2.full.min.js',
                'Content/plugins/input-mask/jquery.inputmask.js',
                'Content/plugins/input-mask/jquery.inputmask.date.extensions.js',
                'Content/plugins/input-mask/jquery.inputmask.extensions.js',
                'Scripts/moment.min.js',
                'Scripts/daterangepicker/daterangepicker.js',
                'Content/plugins/datepicker/bootstrap-datepicker.js',
                'Content/plugins/slimScroll/jquery.slimscroll.min.js',
                'Content/plugins/fastclick/fastclick.js',
                'Content/dist/js/app.min.js',
                'Scripts/autonumeric/autoNumeric.js',
                'Scripts/datatable/complete.min.js',
                'Scripts/datatable/FixedColumns.js',
                'Scripts/datatable/jquery.dataTables.js',
                'Scripts/DataTables/dataTables.bootstrap.js',
                'Scripts/fancybox/jquery.fancybox.pack.js',
                'Scripts/bootboxs/bootbox.min.js',
                'Scripts/custom.js'
            ];

            for (const src of scriptsList) {
                await this.loadScript(src);
            }
        }
    }

    renderLoginStructure() {
        document.body.className = 'hold-transition login-page';
        
        const loginContent = document.getElementById('app-content') 
            ? document.getElementById('app-content').innerHTML 
            : document.body.innerHTML;

        const loginBoxHtml = `
            <div class="login-box">
                <div class="login-logo">
                    <a href=""><b>KICAO KDS</b></a>
                </div>
                <!-- /.login-logo -->
                <div class="login-box-body">            
                    ${loginContent}
                    <hr />
                    <p class="login-box-msg">© Kalbenutritionals - KICAO KDS</p>
                </div>
            </div>
        `;
        document.body.innerHTML = loginBoxHtml;

        // Initialize iCheck if present
        if (typeof $.fn.iCheck === 'function') {
            $('input').iCheck({
                checkboxClass: 'icheckbox_square-blue',
                radioClass: 'iradio_square-blue',
                increaseArea: '20%' /* optional */
            });
        }
    }

    renderMainStructure() {
        document.body.className = 'hold-transition skin-green sidebar-mini';

        const mainContent = document.getElementById('app-content') 
            ? document.getElementById('app-content').innerHTML 
            : document.body.innerHTML;

        const wrapperHtml = `
            <div class="wrapper">
                <header class="main-header">
                    <!-- Logo -->
                    <a href="${this.basePath}index.html" class="logo">
                        <!-- mini logo for sidebar mini 50x50 pixels -->
                        <span class="logo-mini"><img src="${this.basePath}Content/img/favicon.ico" style="height:24px;width:24px;" /></span>
                        <!-- logo for regular state and mobile devices -->
                        <span class="logo-lg"><b>KICAO KDS</b></span>
                    </a>
                    <!-- Header Navbar -->
                    <nav class="navbar navbar-static-top">
                        <!-- Sidebar toggle button-->
                        <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
                            <span class="sr-only">Toggle navigation</span>
                        </a>
                        <div class="navbar-custom-menu">
                            <ul class="nav navbar-nav"> 
                                <!-- User Account -->
                                <li class="dropdown user user-menu">
                                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                        <span class="hidden-xs" id="headerWelcomeText">Welcome, User</span>
                                        <span class="label" id="headerRoleBadge" style="margin-left:6px;font-size:10px;">Role</span>
                                    </a>
                                    <ul class="dropdown-menu">
                                        <li class="user-header bg-green" style="padding:15px;text-align:center;">
                                            <p id="headerUserName" style="margin:0;color:#fff;font-size:16px;">User</p>
                                            <small id="headerRoleName" style="color:#eee;">—</small>
                                        </li>
                                        <li class="user-footer" style="padding:10px;">
                                            <div class="pull-left">
                                                <a href="#" id="btnSwitchRole" class="btn btn-default btn-flat btn-sm"><i class="fa fa-users"></i> Ganti Role</a>
                                            </div>
                                            <div class="pull-right">
                                                <a href="#" id="btnLogout" class="btn btn-default btn-flat btn-sm">Logout</a>
                                            </div>
                                        </li>
                                    </ul>
                                </li> 
                            </ul>
                        </div>
                    </nav>
                </header>

                <!-- Left side column. contains the sidebar -->
                <aside class="main-sidebar">
                    <section class="sidebar">
                        <ul class="sidebar-menu" data-widget="tree">
                            <li class="header">MAIN NAVIGATION</li>
                            
                            <li id="menu-beranda">
                                <a href="${this.basePath}index.html">
                                    <i class="fa fa-home text-green"></i> <span>Beranda</span>
                                </a>
                            </li>
                            
                            <li class="treeview" id="menu-master">
                                <a href="#">
                                    <i class="fa fa-folder text-aqua"></i> <span>Master Data</span>
                                    <span class="pull-right-container">
                                        <i class="fa fa-angle-left pull-right"></i>
                                    </span>
                                </a>
                                <ul class="treeview-menu">
                                    <li id="menu-master-ass-owner"><a href="${this.basePath}Views/Master/AssOwnerKMMD/Index.html"><i class="fa fa-circle-o"></i> Form ASS/Owner KMMD</a></li>
                                </ul>
                            </li>
                            
                            <li class="treeview" id="menu-transaksi">
                                <a href="#">
                                    <i class="fa fa-exchange text-yellow"></i> <span>Transaksi</span>
                                    <span class="pull-right-container">
                                        <i class="fa fa-angle-left pull-right"></i>
                                    </span>
                                </a>
                                <ul class="treeview-menu">
                                    <li id="menu-tr-klaim"><a href="${this.basePath}Views/Klaim/Index.html"><i class="fa fa-circle-o"></i> Form Klaim</a></li>
                                </ul>
                            </li>
                        </ul>
                    </section>
                </aside>

                <!-- Content Wrapper. Contains page content -->
                <div class="content-wrapper">
                    <div id="divWarningSystem" class="alert alert-warning alert-dismissible" style="display:none;">
                        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                        <h4><i class="icon fa fa-ban"></i> <span id="txtWarningSystem">!</span></h4>                
                    </div>
                    <div id="divInformationSystem" class="alert alert-info alert-dismissible" style="display:none;">
                        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                        <h4><i class="icon fa fa-info-circle"></i> <span id="txtInformationSystem">.</span></h4>
                    </div>

                    ${mainContent}
                </div>

                <!-- Footer -->
                <footer class="main-footer">
                    <div class="pull-right hidden-xs">
                        <b>Version</b> 1.1.1 Build 1.0
                    </div>
                    <strong>Copyright &copy; 2017-2026 <a href="http://www.kalbenutritionals.com"> PT Kalbe Nutritionals </a>.</strong> All rights reserved.
                </footer> 
            </div>
        `;
        document.body.innerHTML = wrapperHtml;
    }

    setActiveMenu() {
        const path = window.location.pathname;
        // Reset active
        $('.sidebar-menu li').removeClass('active');
        
        if (path.includes('Budget/Index.html')) {
            $('#menu-master-budget').addClass('active').closest('.treeview').addClass('active menu-open');
        } else if (path.includes('AssOwnerKMMD')) {
            $('#menu-master-ass-owner').addClass('active').closest('.treeview').addClass('active menu-open');
        } else if (path.includes('RFA/Index.html')) {
            $('#menu-tr-rfa').addClass('active').closest('.treeview').addClass('active menu-open');
        } else if (path.includes('Klaim/')) {
            $('#menu-tr-klaim').addClass('active').closest('.treeview').addClass('active menu-open');
        } else {
            $('#menu-beranda').addClass('active');
        }
    }

    initMainHandlers() {
        document.getElementById('btnLogout').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('kds_logged_in');
            localStorage.removeItem('kds_active_role');
            window.location.href = this.basePath + 'Views/Account/Login.html';
        });

        const btnSwitchRole = document.getElementById('btnSwitchRole');
        if (btnSwitchRole) {
            btnSwitchRole.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof rbacGoChooseRole === 'function') {
                    rbacGoChooseRole(this.basePath);
                } else {
                    window.location.href = this.basePath + 'Views/Account/ChooseRole.html';
                }
            });
        }

        document.addEventListener('rbacRoleChanged', () => {
            if (typeof rbacApplyCurrentPage === 'function') rbacApplyCurrentPage();
        });

        // Toggle warnings/info system functions if needed
        window.showWarning = (msg) => {
            $('#txtWarningSystem').text(msg);
            $('#divWarningSystem').show();
        };
        window.showInfo = (msg) => {
            $('#txtInformationSystem').text(msg);
            $('#divInformationSystem').show();
        };

        // Bootbox: nonaktifkan animasi fade (hindari dialog transparan/stuck)
        if (window.bootbox && typeof bootbox.setDefaults === 'function') {
            bootbox.setDefaults({
                animate: false,
                backdrop: true
            });
        }

        // Bersihkan backdrop nyangkut setelah modal ditutup
        const hasOpenModal = () => $('.modal').filter(function () {
            return $(this).hasClass('in') || $(this).css('display') === 'block';
        }).length > 0;

        const cleanupModalBackdrops = () => {
            if (!hasOpenModal()) {
                $('.modal-backdrop').remove();
                $('body').removeClass('modal-open').css('padding-right', '');
            }
        };
        window.cleanupModalBackdrops = cleanupModalBackdrops;

        window.showKlaimModal = function (selector) {
            cleanupModalBackdrops();
            const $m = $(selector);
            if ($m.length && $m.parent()[0] !== document.body) {
                $m.appendTo('body');
            }
            $m.modal({ backdrop: true, keyboard: true, show: true });
        };

        window.hideKlaimModal = function (selector) {
            const $m = $(selector);
            $m.one('hidden.bs.modal', cleanupModalBackdrops);
            $m.modal('hide');
            setTimeout(cleanupModalBackdrops, 400);
        };

        $(document).on('hidden.bs.modal', '.modal', cleanupModalBackdrops);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!window.layoutInitialized) {
        new Layout().init();
    }
});
